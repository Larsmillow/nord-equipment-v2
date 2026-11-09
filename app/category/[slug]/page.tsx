import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CatalogBrowser } from "@/components/catalog-browser";
import { ContactRequestForm } from "@/components/contact-request-form";
import { getCategories, getProducts, normalizeCategorySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = normalizeCategorySlug(slug) || slug;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === normalized);
  if (!category) return { title: "Категория | NORD" };
  return {
    title: `${category.name} — купить и арендовать в Москве | NORD`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalized = normalizeCategorySlug(slug) || slug;
  const [categories, allProducts] = await Promise.all([getCategories(), getProducts("all")]);
  const category = categories.find((item) => item.slug === normalized);
  if (!category) notFound();

  return (
    <>
      <PageHero
        title={category.name}
        description={category.description}
        eyebrow={`КАТАЛОГ ОБОРУДОВАНИЯ · ${category.name.toUpperCase()}`}
        theme="spray"
      />
      <section className="section section-blueprint">
        <div className="container">
          <CatalogBrowser products={allProducts} categories={categories} categorySlug={normalized} />

          <div style={{ marginTop: 48 }}>
            <ContactRequestForm subject={`Запрос КП и подбора по разделу «${category.name}»`} />
          </div>
        </div>
      </section>
    </>
  );
}
