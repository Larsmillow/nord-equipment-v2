"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/page-hero";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      let ids: string[];
      try {
        const stored = JSON.parse(localStorage.getItem("nord-v2-favorites") || "[]");
        ids = Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : [];
      } catch (error) {
        console.error("Unable to read saved favorites.", error);
        ids = [];
      }
      try {
        const response = await fetch("/api/products?ids=" + encodeURIComponent(ids.join(",")));
        if (!response.ok) throw new Error("Не удалось загрузить избранные товары.");
        const data = await response.json() as { products: Product[] };
        if (active) setProducts(data.products);
      } catch (error) {
        console.error("Unable to load favorites.", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    const onChange = () => { void load(); };
    void load();
    window.addEventListener("nord-favorites-change", onChange);
    return () => { active = false; window.removeEventListener("nord-favorites-change", onChange); };
  }, []);

  return <><PageHero title="Избранное" description="Сохранённые модели оборудования." eyebrow="Избранное" /><section className="section"><div className="container">{loading ? <p>Загружаем избранное…</p> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>Здесь появятся ваши модели</h2><p>Добавьте товары в избранное из каталога.</p><Link className="button button-primary" href="/catalog">Открыть каталог</Link></div>}</div></section></>;
}
