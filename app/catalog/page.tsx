import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CatalogBrowser } from "@/components/catalog-browser";
import { ContactRequestForm } from "@/components/contact-request-form";
import { getCategories, getProducts } from "@/lib/catalog";
import { CATEGORY_VISUALS } from "@/lib/category-visuals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог окрасочных и шпаклёвочных станций NORD и запчастей ЗИП | Москва",
  description:
    "Профессиональное оборудование NORD для безвоздушной окраски, механизированной шпаклёвки, огнезащиты и гидроизоляции (2,5–18,0 л/мин, до 350 бар) + склад запчастей и аксессуаров ЗИП в Москве.",
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
        title="Каталог станций NORD и оригинальных комплектующих (ЗИП)"
        description="Безвоздушные окрасочные аппараты (NORD-2500, 3300, 4500), промышленные шпаклёвочные станции HD (NORD-6000, 8000 PRO, 9200, 9900, 18X), шнековые аппараты и склад запчастей ЗИП в Москве."
        eyebrow="КАТАЛОГ ОБОРУДОВАНИЯ И ЗИП · НАЛИЧИЕ В МОСКВЕ"
        theme="spray"
      />
      <section className="section section-blueprint">
        <div className="container">
          <div className="section-heading" style={{ marginBottom: 16 }}>
            <div>
              <p className="eyebrow">ПОДБОР ПО ЗАДАЧЕ, ВЯЗКОСТИ СОСТАВА И ТТХ</p>
              <h2>Станции NORD (8 моделей) и запчасти ЗИП</h2>
            </div>
            <p>Переключайте разделы оборудования или откройте вкладку «Запчасти и аксессуары (ЗИП)» в один клик.</p>
          </div>

          <CatalogBrowser products={products} categories={categories} initialQuery={q || ""} />

          <div className="section-heading" style={{ marginTop: 48, marginBottom: 20 }}>
            <div>
              <p className="eyebrow">СПЕЦИАЛИЗИРОВАННЫЕ НАПРАВЛЕНИЯ</p>
              <h2>Разделы каталога по типу оборудования и оснастки</h2>
            </div>
            <p>4 основных направления со склада в Москве</p>
          </div>

          <div className="catalog-category-grid">
            {categories.map((category, idx) => {
              const meta = CATEGORY_VISUALS[category.slug] ?? {
                image: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
                specBadge: "ПРОМЫШЛЕННАЯ СЕРИЯ",
                priceFrom: "от 35 000 ₽",
              };
              return (
                <Link
                  className="catalog-cat-card"
                  key={category.slug}
                  href={`/category/${category.slug}`}
                >
                  <div className="catalog-cat-top">
                    <span className="catalog-cat-num">
                      НАПРАВЛЕНИЕ {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="catalog-cat-spec">{meta.specBadge}</span>
                  </div>

                  <div className="catalog-cat-body">
                    <div className="catalog-cat-copy">
                      <strong>{category.name}</strong>
                      <p>{category.description}</p>
                      <div className="catalog-cat-footer">
                        <span className="catalog-cat-price">{meta.priceFrom}</span>
                        <span className="catalog-cat-link">Открыть раздел →</span>
                      </div>
                    </div>

                    <div className="catalog-cat-thumb">
                      <img src={meta.image} alt={category.name} loading="lazy" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 48 }}>
            <ContactRequestForm subject="Запрос подбора станции и коммерческого предложения (Каталог)" />
          </div>
        </div>
      </section>
    </>
  );
}
