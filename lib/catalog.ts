import { query } from "@/lib/db";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/fallback-catalog";

export type ProductImage = { src: string; alt: string };
export type ProductSpec = { name: string; value: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_name: string;
  description: string;
  category_slug: string;
  category_name: string;
  manufacturer: string;
  model: string;
  images: ProductImage[];
  characteristics: ProductSpec[];
  materials: string;
  purchase_price: number | null;
  rental_price_daily: number | null;
  rental_min_days: number;
  stock_quantity: number;
  purchase_enabled: boolean;
  rental_enabled: boolean;
  badge: string;
  flow_lpm: number | null;
  drive: string;
  features: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

const productSelect = `
  SELECT p.id, p.name, p.slug, p.short_name, p.description,
    c.slug AS category_slug, c.name AS category_name,
    p.manufacturer, p.model, p.images, p.characteristics, p.materials,
    p.purchase_price, p.rental_price_daily, p.rental_min_days, p.stock_quantity,
    p.purchase_enabled, p.rental_enabled, p.badge, p.flow_lpm, p.drive, p.features
  FROM products p
  JOIN categories c ON c.id = p.category_id
  WHERE p.published = true
`;

const FALLBACK_BY_ID = new Map(FALLBACK_PRODUCTS.map((p) => [p.id, p]));

const LEGACY_IMAGE_MAP: Record<string, string> = {
  "/assets/products/putter-9528x-cutout.png": "/assets/products/nord-line/nord-9528x.png",
  "/manufacturer-materials/PUTTER/PT-9528-X-High-Power-Electric-Paint-Sprayer-for-Large-Projects-PUTIAN/image-01.jpg":
    "/assets/products/nord-line/nord-9528x-studio.jpg",
  "/manufacturer-materials/GUTUBAO/1174453/image-01.jpg": "/assets/products/nord-line/nord-1095.jpg",
  "/manufacturer-materials/GUTUBAO/1173446/image-01.jpg": "/assets/products/nord-line/nord-890s.jpg",
  "/manufacturer-materials/GUTUBAO/1167920/image-01.jpg": "/assets/products/nord-line/nord-595.jpg",
  "/manufacturer-materials/GUTUBAO/1173199/image-01.jpg": "/assets/products/nord-line/nord-795s.jpg",
  "/manufacturer-materials/PUTTER/PT-1033-Heavy-Hydraulic-Sprayer--PUTIAN/image-01.jpg":
    "/assets/products/nord-line/nord-1033.jpg",
  "/manufacturer-materials/GUTUBAO/1173510/image-01.jpg": "/assets/products/nord-line/nord-340.jpg",
  "/manufacturer-materials/PUTTER/PT-9535-Ultra-High-Pressure-Waterproof-Sprayer-PUTIAN/image-01.jpg":
    "/assets/products/nord-line/nord-9535.jpg",
  "/manufacturer-materials/PUTTER/PT-10-Texture-Sprayer-PUTIAN/image-03.jpg":
    "/assets/products/nord-line/nord-pt10.jpg",
  "/manufacturer-materials/PUTTER/PT-500HS-Road-Line-Marking-Machine-PUTIAN/image-02.jpg":
    "/assets/products/nord-line/nord-500hs.jpg",
  "/manufacturer-materials/PUTTER/PT-1895-High-Power-Electric-Paint-Sprayer-for-Large-Projects-PUTIAN/image-03.jpg":
    "/assets/products/nord-line/nord-1895-a.jpg",
  "/manufacturer-materials/PUTTER/PT-1895-High-Power-Electric-Paint-Sprayer-for-Large-Projects-HD-Pump--PUTIAN/image-03.jpg":
    "/assets/products/nord-line/nord-1895-b.jpg",
  "/manufacturer-materials/GUTUBAO/1176321/image-01.jpg": "/assets/products/nord-line/nord-970.jpg",
};

function sanitizeProductImages(product: Product): Product {
  const canonical = FALLBACK_BY_ID.get(product.id) ?? FALLBACK_BY_ID.get(product.slug);
  if (canonical) {
    return {
      ...product,
      name: canonical.name,
      short_name: canonical.short_name,
      manufacturer: "NORD",
      model: canonical.model,
      images: canonical.images,
    };
  }

  const cleanedImages = (product.images || []).map((img) => {
    if (img.src.includes("/assets/products/gtb-1095/")) {
      return {
        src: "/assets/products/nord-line/nord-1095.jpg",
        alt: img.alt || product.name,
      };
    }
    const mapped = LEGACY_IMAGE_MAP[img.src];
    if (mapped) {
      return {
        src: mapped,
        alt: img.alt.replace(/PUTTER|GUTUBAO/gi, "NORD"),
      };
    }
    return img;
  });

  return {
    ...product,
    name: product.name.replace(/PUTTER\s+PT-|PUTTER\s+|GUTUBAO\s+GTB-|GUTUBAO\s+/gi, "NORD "),
    short_name: (product.short_name || "").replace(/PUTTER\s+|PT-|GTB-/gi, "NORD "),
    manufacturer: "NORD",
    model: (product.model || "").replace(/^(PT-|GTB-)/i, "NORD "),
    images: cleanedImages,
  };
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    return categorySlug
      ? FALLBACK_PRODUCTS.filter((p) => p.category_slug === categorySlug)
      : FALLBACK_PRODUCTS;
  }
  try {
    const result = categorySlug
      ? await query<Product>(`${productSelect} AND c.slug = $1 ORDER BY p.name`, [categorySlug])
      : await query<Product>(`${productSelect} ORDER BY p.name`);
    if (result.rows.length === 0) {
      return categorySlug
        ? FALLBACK_PRODUCTS.filter((p) => p.category_slug === categorySlug)
        : FALLBACK_PRODUCTS;
    }
    return result.rows.map(sanitizeProductImages);
  } catch {
    return categorySlug
      ? FALLBACK_PRODUCTS.filter((p) => p.category_slug === categorySlug)
      : FALLBACK_PRODUCTS;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_PRODUCTS.slice(0, 6);
  }
  try {
    const result = await query<Product>(`${productSelect} ORDER BY p.created_at DESC LIMIT 6`);
    if (result.rows.length === 0) {
      return FALLBACK_PRODUCTS.slice(0, 6);
    }
    return result.rows.map(sanitizeProductImages);
  } catch {
    return FALLBACK_PRODUCTS.slice(0, 6);
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id) ?? null;
  }
  try {
    const result = await query<Product>(
      `${productSelect} AND (p.id = $1 OR p.slug = $1) LIMIT 1`,
      [id],
    );
    if (result.rows[0]) return sanitizeProductImages(result.rows[0]);
    return FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id) ?? null;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id) ?? null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_CATEGORIES;
  }
  try {
    const result = await query<Category>(
      "SELECT id, name, slug, description FROM categories ORDER BY sort_order, name",
    );
    return result.rows.length > 0 ? result.rows : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}
