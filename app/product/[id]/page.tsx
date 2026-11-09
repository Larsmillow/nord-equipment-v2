import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/product-card";
import { MobileCollapsible } from "@/components/mobile-collapsible";
import { ContactRequestForm } from "@/components/contact-request-form";
import { MobileContactBlock } from "@/components/messenger-links";
import { getProductById, getProducts } from "@/lib/catalog";
import { productImage } from "@/lib/product-utils";
import { SITE_CONFIG } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function resolveLabMachine(id: string, model: string): string {
  const s = `${id} ${model}`.toLowerCase();
  if (s.includes("2500")) return "nord-2500";
  if (s.includes("3300") || s.includes("3200")) return "nord-3300";
  if (s.includes("4500")) return "nord-4500";
  if (s.includes("6000")) return "nord-6000";
  if (s.includes("8000")) return "nord-8000-pro";
  if (s.includes("9200")) return "nord-9200";
  if (s.includes("9900")) return "nord-9900";
  if (s.includes("18x")) return "nord-18x";
  return "nord-6000";
}

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
  const labId = resolveLabMachine(product.id, product.model || product.short_name || "");

  return (
    <>
      <PageHero
        title={product.name}
        description={product.description}
        eyebrow={`${product.manufacturer || "NORD"} · МОДЕЛЬ ${product.model || product.short_name}`}
        theme="nozzle"
      />
      <section className="section section-blueprint">
        <div className="container">
          <div className="product-layout">
            <ProductGallery images={product.images} fallback={productImage(product)} name={product.name} />

            <div className="product-detail-copy">
              <div className="detail-meta-strip">
                {product.badge && <span className="badge">{product.badge}</span>}
                <span className="product-code">
                  РАЗДЕЛ:{" "}
                  <Link href={`/category/${encodeURIComponent(product.category_slug)}`}>
                    {product.category_name}
                  </Link>
                </span>
              </div>

              <h2 className="product-detail-title">{product.name}</h2>
              <p>{product.description}</p>

              <ProductPurchasePanel product={product} />

              {/* Direct 3D-Stand Launch Card */}
              <div className="detail-lab-banner">
                <div>
                  <span className="detail-lab-kicker">ИНТЕРАКТИВНЫЙ 3D-СТЕНД NORD LAB</span>
                  <strong>Протестируйте факел {product.short_name || product.model} на стене онлайн</strong>
                  <p>Проверьте ширину раскрытия сопла, скорость укрытия м² и работу под шпатель 60 см.</p>
                </div>
                <Link className="button button-white" href={`/lab?machine=${labId}`}>
                  Запустить 3D-тест →
                </Link>
              </div>

              {product.purchase_price && product.rental_price_daily && (
                <p className="break-even-note">
                  <strong>Инженерный расчёт окупаемости:</strong> покупка станции в собственность полностью окупается по сравнению с посуточной арендой за{" "}
                  <strong>{Math.ceil(product.purchase_price / product.rental_price_daily)} рабочих смен</strong>.
                </p>
              )}

              <MobileCollapsible title="Технические характеристики (ТТХ)">
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
              </MobileCollapsible>

              {product.materials && (
                <MobileCollapsible title="Рабочие составы и материалы">
                  <p>{product.materials}</p>
                </MobileCollapsible>
              )}

              <MobileCollapsible title="Базовая комплектация рабочего поста (100% в сборе)">
                <ul className="kit-list">
                  <li>Базовый агрегат {product.model || product.short_name} на раме с силовой частью и насосом ВД</li>
                  <li>Шланг высокого давления (15 м, резьба 1/4″ или 3/8″ по спецификации модели)</li>
                  <li>Безвоздушный пистолет-распылитель с соплодержателем и реверсивным соплом</li>
                  <li>Удлинитель («удочка») 50 см и всасывающий патрубок с заборным фильтром</li>
                  <li>Масло для смазки уплотнений поршня (пластификатор), комплект ключей и паспорт на русском языке</li>
                </ul>
              </MobileCollapsible>

              <MobileCollapsible title={`Проверка на стенде 230 бар и отгрузка (${SITE_CONFIG.address})`}>
                <p>
                  Перед выдачей или отправкой ТК каждый аппарат проходит контрольную опрессовку до рабочего давления. Самовывоз со склада в Москве или доставка на объект в день оплаты.
                </p>
              </MobileCollapsible>

              <div className="mobile-only" style={{ marginTop: 24 }}>
                <MobileContactBlock title={`Заказать или арендовать ${product.short_name || product.name}`} />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="section" style={{ paddingBottom: 0 }}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">СМЕЖНЫЕ МОДЕЛИ ПО МОЩНОСТИ И ЗАДАЧЕ</p>
                  <h2>Другие станции в разделе «{product.category_name}»</h2>
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

          <div style={{ marginTop: 48 }}>
            <ContactRequestForm
              subject={`Запрос счёта с НДС / бронирования станции: ${product.name} (${product.model || product.short_name})`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
