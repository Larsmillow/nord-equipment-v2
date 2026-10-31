import { readFile } from "node:fs/promises";
import vm from "node:vm";
import pg from "pg";

const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const source = await readFile(new URL("../manufacturer-products.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "manufacturer-products.js", timeout: 2_000 });
const products = [
  ...sandbox.window.NORD_MANUFACTURER_PRODUCTS,
  {
    id: "gtb-1095",
    name: "Безвоздушный окрасочный аппарат NORD 1095 HD",
    shortName: "NORD 1095 HD",
    model: "NORD 1095 HD",
    manufacturer: "NORD",
    category: "painting",
    description: "Безвоздушный окрасочный аппарат на тележке для профессиональной работы с лакокрасочными материалами.",
    specs: [["Производительность", "6 л/мин"], ["Мощность", "3 500 Вт"], ["Напряжение", "220 В"], ["Максимальное давление", "230 бар"], ["Максимальное сопло", "0.043″"]],
    materials: "Краски и лакокрасочные материалы для безвоздушного распыления.",
    images: [
      ["assets/products/nord-line/nord-1095.jpg", "NORD 1095 HD — студийное фото аппарата"],
    ],
    price: 97375,
    flowLpm: 6,
    drive: "electric",
    features: [],
  },
  {
    id: "putter-9528x",
    name: "Окрасочно-шпаклёвочный аппарат NORD 9528-X QuickReel",
    shortName: "NORD 9528-X",
    model: "NORD 9528-X",
    manufacturer: "NORD",
    category: "painting",
    description: "Мощный окрасочный аппарат с системой QuickReel для удобного сматывания и хранения шланга.",
    specs: [["Мощность", "5 000 Вт"], ["Напряжение / частота", "220 В / 50–60 Гц"], ["Максимальная подача", "10,5 л/мин"], ["Система шланга", "QuickReel"], ["Гарантия", "2 года от магазина"]],
    materials: "Густые шпаклёвки, краски и огнезащитные материалы.",
    images: [
      ["assets/products/nord-line/nord-9528x.png", "NORD 9528-X QuickReel — главный вид"],
      ["assets/products/nord-line/nord-9528x-studio.jpg", "NORD 9528-X QuickReel — студийное фото"],
    ],
    price: 170000,
    flowLpm: 10.5,
    drive: "electric",
    features: ["QuickReel"],
  },
];
if (!Array.isArray(products) || products.length === 0) throw new Error("No products found in manufacturer-products.js.");

const categories = [
  ["painting", "Окрасочное оборудование", "Аппараты для безвоздушного нанесения красок и покрытий."],
  ["putty", "Шпаклёвочное оборудование", "Машины для подачи шпаклёвочных и строительных составов."],
  ["fire", "Огнезащитное оборудование", "Аппараты для нанесения огнезащитных покрытий."],
  ["hydraulic", "Гидравлические распылители", "Техника с гидравлическим приводом для строительных и отделочных работ."],
  ["texture", "Текстурные распылители", "Техника для текстурных и штукатурных составов."],
  ["waterproof", "Гидроизоляция", "Аппараты для нанесения гидроизоляционных покрытий."],
  ["marking", "Дорожная разметка", "Машины для нанесения дорожной разметки."],
  ["accessories", "Комплектующие и расходники", "Шланги, сопла и оснащение."],
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  const categoryIds = new Map();
  for (const [index, [slug, name, description]] of categories.entries()) {
    const result = await client.query(
      `INSERT INTO categories (slug, name, description, sort_order)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
       RETURNING id`,
      [slug, name, description, index],
    );
    categoryIds.set(slug, result.rows[0].id);
  }

  for (const product of products) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) throw new Error(`Unknown category "${product.category}" for product ${product.id}.`);
    const specs = (product.specs || []).map(([name, value]) => ({ name, value }));
    const images = (product.images || []).map(([src, alt]) => ({ src: `/${src.replace(/^\/+/, "")}`, alt }));
    const slug = product.id.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    await client.query(
      `INSERT INTO products
        (id, name, slug, shortName, description, category_id, manufacturer, model, images,
         characteristics, materials, purchase_price, rental_price_daily, rental_min_days,
         stock_quantity, purchase_enabled, rental_enabled, published, badge, source_url,
         flow_lpm, drive, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12,NULL,1,0,true,false,false,$13,$14,$15,$16,$17::jsonb)
       ON CONFLICT (id) DO NOTHING`.replace("shortName", "short_name"),
      [
        product.id, product.name, slug, product.shortName || product.model, product.description,
        categoryId, product.manufacturer || "", product.model || "", JSON.stringify(images),
        JSON.stringify(specs), product.materials || "", Number.isInteger(product.price) ? product.price : null,
        product.badge || "", product.sourceUrl || null, product.flowLpm ?? null, product.drive || "unknown",
        JSON.stringify(product.features || []),
      ],
    );
  }

  await client.query("COMMIT");
  console.log(`Imported ${products.length} catalog products and ${categories.length} categories. Items remain unpublished until stock and terms are confirmed.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
