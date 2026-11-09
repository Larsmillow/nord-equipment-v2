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
        const data = (await response.json()) as { products: Product[] };
        if (active) setProducts(data.products);
      } catch (error) {
        console.error("Unable to load favorites.", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    const onChange = () => {
      void load();
    };
    void load();
    window.addEventListener("nord-favorites-change", onChange);
    return () => {
      active = false;
      window.removeEventListener("nord-favorites-change", onChange);
    };
  }, []);

  return (
    <>
      <PageHero
        title="Сохранённые станции для сравнения"
        description="Отложенные окрасочные и шпаклёвочные аппараты для быстрого согласования со снабжением или сравнения ТТХ."
        eyebrow="ИЗБРАННОЕ ОБОРУДОВАНИЕ"
        theme="spray"
      />
      <section className="section section-blueprint">
        <div className="container">
          {loading ? (
            <p>Загружаем сохранённые станции…</p>
          ) : products.length ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>В списке сравнения пока нет сохранённых станций</h2>
              <p>Отмечайте подходящие по подаче и давлению аппараты в каталоге, чтобы быстро вернуться к ним.</p>
              <Link className="button button-primary" href="/catalog">
                Перейти в каталог станций →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
