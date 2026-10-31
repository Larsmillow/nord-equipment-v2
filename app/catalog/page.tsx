import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CatalogBrowser } from "@/components/catalog-browser";
import { getCategories, getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог окрасочных и шпаклёвочных станций | NORD Москва",
  description:
    "Профессиональное оборудование для безвоздушной окраски, механизированной шпаклёвки, огнезащиты и гидроизоляции. Фильтр по подаче (л/мин), мощности (Вт) и давлению (бар).",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, categories, products] = await Promise.all([
    searchParams,
    getCategories(),
    getProducts(),
  ]);

  return (
    <>
      <PageHero
        title="Каталог промышленного оборудования"
        description="Безвоздушные окрасочные аппараты, шпаклёвочные станции, установки для огнезащиты, гидроизоляции и дорожной разметки."
        eyebrow="КАТАЛОГ NORD"
        theme="spray"
      />
      <section className="section">
        <div className="container">
          <div className="category-tiles">
            {categories.map((category, idx) => (
              <Link className="category-tile" key={category.slug} href={`/category/${category.slug}`}>
                <span className="tile-num">{String(idx + 1).padStart(2, "0")}</span>
                <strong>{category.name}</strong>
                <span>{category.description}</span>
              </Link>
            ))}
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">ТЕХНИЧЕСКАЯ СПЕЦИФИКАЦИЯ</p>
              <h2>Все станции и агрегаты ({products.length})</h2>
            </div>
            <p>Переключайте режим «Покупка / Аренда» в шапке или прямо в карточке модели.</p>
          </div>

          <CatalogBrowser products={products} categories={categories} initialQuery={q || ""} />
        </div>
      </section>
    </>
  );
}
