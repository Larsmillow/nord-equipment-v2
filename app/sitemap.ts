import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nord-equip.ru";
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/rent",
    "/service",
    "/delivery",
    "/about",
    "/articles",
    "/contacts",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/catalog" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/catalog" ? 0.9 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
