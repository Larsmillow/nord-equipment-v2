import fs from "fs";
import path from "path";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./fallback-catalog";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductCharacteristic = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_name: string;
  description: string;
  category_slug: string;
  category_name?: string;
  manufacturer: string;
  model: string;
  images: ProductImage[];
  characteristics: ProductCharacteristic[];
  materials: string;
  purchase_price: number | null;
  rental_price_daily: number | null;
  rental_min_days: number;
  stock_quantity: number;
  purchase_enabled: boolean;
  rental_enabled: boolean;
  published: boolean;
  badge: string;
  source_url: string | null;
  flow_lpm: number | null;
  drive: string;
  features: string[];
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  product_count?: number;
};

const CATEGORY_ALIASES: Record<string, string> = {
  painting: "piston_paint",
  putty: "piston_putty",
  fire: "piston_putty",
  waterproof: "piston_putty",
  hydraulic: "piston_putty",
  texture: "screw_putty",
  accessories: "spares",
  spares_accessories: "spares",
};

const LEGACY_PRODUCT_ID_MAP: Record<string, string> = {
  "gutubao-gtb-595": "nord-2500",
  "gutubao-gtb-795s": "nord-3300",
  "gutubao-gtb-890s": "nord-4500",
  "gtb-1095": "nord-6000",
  "putter-pt-1895": "nord-8000-pro",
  "putter-9528x": "nord-9200",
  "putter-pt-9535": "nord-9900",
  "putter-pt-1033": "nord-9900",
  "putter-pt-9536": "nord-18x",
};

export function normalizeCategorySlug(slug?: string): string | undefined {
  if (!slug) return undefined;
  return CATEGORY_ALIASES[slug] || slug;
}

function getDynamicDb(): { products?: any[]; categories?: any[] } | null {
  try {
    const dbPath = path.join(process.cwd(), "data", "nord-db.json");
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // Safe fallback to default
  }
  return null;
}

function mapDbProduct(p: any): Product {
  const fb = FALLBACK_PRODUCTS.find((f) => f.id === p.id);
  const flowNum = parseFloat(String(p.flowLpm).replace(",", ".")) || fb?.flow_lpm || 2.5;
  const isPublished = p.inStock !== false;
  return {
    id: p.id,
    name: p.name,
    slug: p.id,
    short_name: p.name,
    description: p.description || fb?.description || p.subtitle || "",
    category_slug: p.categoryId || fb?.category_slug || "piston_paint",
    category_name: p.badge || fb?.category_name || "NORD PRO",
    manufacturer: "NORD",
    model: p.name,
    images: p.photoUrl
      ? [{ src: p.photoUrl, alt: p.name }, ...(fb?.images.filter((img) => img.src !== p.photoUrl) || [])]
      : fb?.images || [],
    characteristics: [
      { name: "Мощность двигателя", value: p.powerW || "—" },
      { name: "Производительность", value: p.flowLpm || "—" },
      { name: "Макс. давление", value: p.pressureBar || "—" },
      { name: "Макс. сопло", value: p.maxTip || "—" },
      { name: "Масса", value: p.weightKg || "—" },
      { name: "Тип привода", value: p.motorType || "Бесщёточный" },
    ],
    materials: fb?.materials || "Краски, грунты, эмали, шпаклёвки",
    purchase_price: Number(p.priceRub) || fb?.purchase_price || 0,
    rental_price_daily: Number(p.rentDayRub) || fb?.rental_price_daily || 0,
    rental_min_days: fb?.rental_min_days || 1,
    stock_quantity: isPublished ? (fb?.stock_quantity || 10) : 0,
    purchase_enabled: isPublished,
    rental_enabled: isPublished,
    published: isPublished,
    badge: p.badge || fb?.badge || "NORD PRO",
    source_url: null,
    flow_lpm: flowNum,
    drive: `${p.powerW || "220 В"} · ${p.motorType || "Brushless"}`,
    features: fb?.features || [p.subtitle || p.badge || "NORD PRO"],
  };
}

export async function getCategories(): Promise<Category[]> {
  const db = getDynamicDb();
  if (db?.categories && Array.isArray(db.categories) && db.categories.length > 0) {
    const products = await getProducts();
    return db.categories
      .filter((c: any) => c.active !== false)
      .map((c: any) => ({
        slug: c.id,
        name: c.name,
        description: c.badge || "",
        sort_order: c.order || 1,
        product_count: products.filter((p) => p.category_slug === c.id).length,
      }));
  }
  return FALLBACK_CATEGORIES.map((category) => ({
    ...category,
    product_count: FALLBACK_PRODUCTS.filter(
      (product) => product.published && product.category_slug === category.slug
    ).length,
  }));
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const normalized = normalizeCategorySlug(categorySlug);
  const db = getDynamicDb();
  let all: Product[];
  if (db?.products && Array.isArray(db.products) && db.products.length > 0) {
    all = db.products.filter((p: any) => p.inStock !== false).map(mapDbProduct);
  } else {
    all = FALLBACK_PRODUCTS.filter((p) => p.published);
  }
  if (!normalized || normalized === "all") {
    return all;
  }
  return all.filter((p) => p.category_slug === normalized);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts();
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const mappedId = LEGACY_PRODUCT_ID_MAP[idOrSlug] || idOrSlug;
  const db = getDynamicDb();
  if (db?.products && Array.isArray(db.products)) {
    const foundDb = db.products.find((p: any) => p.id === mappedId);
    if (foundDb) return mapDbProduct(foundDb);
  }
  return (
    FALLBACK_PRODUCTS.find(
      (item) => item.id === mappedId || item.slug === mappedId
    ) ?? null
  );
}
