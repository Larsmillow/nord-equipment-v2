import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/product-card";
import { getProductById, getProducts } from "@/lib/catalog";
import { productImage } from "@/lib/product-utils";
import { SITE_CONFIG } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Оборудование | NORD" };
  return {
    title: `${product.name} — купить или арендовать в Москве | NORD`,
    description: `${product.description} Поставка со склада в Москве, гарантия, ЗИП.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([getProductById(id), getProducts()]);
  if (!product) notFound();
  const related = allProducts
    .filter((item) => item.category_slug === product.category_slug && item.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <PageHero
        title={product.name}
        description={product.description}
        eyebrow={`${product.manufacturer || "NORD"} // МОДЕЛЬ ${product.model || product.short_name}`}
        theme="nozzle"
      />
      <section className="section">
        <div className="container">
          <div className="product-layout">
            <ProductGallery images={product.images} fallback={productImage(product)} name={product.name} />

            <div className="product-detail-copy">
              <div className="detail-meta-strip">
                {product.badge && <span className="badge">{product.badge}</span>}
                <span className="product-code">
                  КАТЕГОРИЯ:{" "}
                  <Link href={`/category/${encodeURIComponent(product.category_slug)}`}>
                    {product.category_name}
                  </Link>
                </span>
              </div>

              <h2 className="product-detail-title">{product.name}</h2>
              <p>{product.description}</p>

              <ProductPurchasePanel product={product} />

              {product.purchase_price && product.rental_price_daily && (
                <p className="break-even-note">
                  <strong>Инженерный расчёт рентабельности:</strong> покупка станции в собственность окупается по сравнению с арендой примерно за{" "}
                  <strong>{Math.ceil(product.purchase_price / product.rental_price_daily)} рабочих смен</strong>.
                </p>
              )}

              <div className="detail-section">
                <h3>Технические характеристики (ТТХ)</h3>
                <table className="spec-table">
                  <tbody>
                    {product.characteristics.map((spec) => (
                      <tr key={spec.name}>
                        <th scope="row">{spec.name}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {product.materials && (
                <div className="detail-section">
                  <h3>Рабочие составы и материалы</h3>
                  <p>{product.materials}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Базовая комплектация рабочего поста</h3>
                <ul className="kit-list">
                  <li>Базовый агрегат {product.model || product.short_name} на раме с силовой частью и насосом ВД</li>
                  <li>Шланг высокого давления (15 м, резьба 1/4″ или 3/8″ по спецификации модели)</li>
                  <li>Безвоздушный пистолет-распылитель с соплодержателем и реверсивным соплом</li>
                  <li>Удлинитель («удочка») 50 см и всасывающий патрубок с заборным фильтром</li>
                  <li>Масло для смазки уплотнений поршня (пластификатор), комплект ключей и паспорт на русском языке</li>
                </ul>
              </div>

              <div className="detail-section">
                <h3>Проверка на стенде и отгрузка ({SITE_CONFIG.address})</h3>
                <p>
                  Перед выдачей или отправкой ТК каждый аппарат проходит контрольную опрессовку до рабочего давления. Самовывоз со склада в Москве или доставка на объект в день оплаты.
                </p>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="section" style={{ paddingBottom: 0 }}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">АНАЛОГИ И СМЕЖНЫЕ МОДЕЛИ</p>
                  <h2>Другие станции в этой категории</h2>
                </div>
                <Link className="button button-outline" href={`/category/${encodeURIComponent(product.category_slug)}`}>
                  Весь раздел →
                </Link>
              </div>
              <div className="product-grid">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
