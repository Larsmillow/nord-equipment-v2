import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CatalogBrowser } from "@/components/catalog-browser";
import { getCategories, getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Категория | NORD" };
  return {
    title: `${category.name} — купить и арендовать в Москве | NORD`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts(slug)]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <>
      <PageHero
        title={category.name}
        description={category.description}
        eyebrow={`КАТАЛОГ // ${category.name.toUpperCase()}`}
        theme="spray"
      />
      <section className="section">
        <div className="container">
          {products.length ? (
            <CatalogBrowser products={products} categories={categories} categorySlug={slug} />
          ) : (
            <div className="empty-state">
              <h2>Спецификации в разделе «{category.name}» комплектуются под запрос</h2>
              <p>Свяжитесь с инженерным отделом NORD для получения прайс-листа или подбора оборудования.</p>
              <Link className="button button-primary" href="/contacts">
                Запросить спецификацию
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
