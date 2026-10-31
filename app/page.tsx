import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { ContactRequestForm } from "@/components/contact-request-form";
import { HeroShowcase } from "@/components/hero-showcase";
import { SITE_CONFIG } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const CATEGORY_VISUALS: Record<
  string,
  {
    image: string;
    specBadge: string;
    priceFrom: string;
    wide?: boolean;
  }
> = {
  painting: {
    image: "/assets/products/nord-line/nord-1095.jpg",
    specBadge: "200–230 БАР · 2.5–7.6 Л/МИН",
    priceFrom: "от 54 900 ₽",
    wide: true,
  },
  putty: {
    image: "/assets/products/nord-9536/nord-9536-side.jpg",
    specBadge: "10–18 Л/МИН · СОПЛО ДО 0.051″",
    priceFrom: "от 142 000 ₽",
    wide: true,
  },
  fire: {
    image: "/assets/products/nord-line/nord-340.jpg",
    specBadge: "ДО 50 Л/МИН · ОГНЕЗАЩИТА И АНТИКОР",
    priceFrom: "от 168 000 ₽",
  },
  hydraulic: {
    image: "/assets/products/nord-line/nord-1033.jpg",
    specBadge: "280 БАР · ГИДРОПРИВОД 18 Л/МИН",
    priceFrom: "от 265 000 ₽",
  },
  texture: {
    image: "/assets/products/nord-line/nord-pt10.jpg",
    specBadge: "БУНКЕР 30 Л · ПОДАЧА 15 Л/МИН",
    priceFrom: "от 118 000 ₽",
  },
  waterproof: {
    image: "/assets/products/nord-line/nord-9535.jpg",
    specBadge: "350 БАР · ИНЪЕКЦИОННЫЕ И ПУ СОСТАВЫ",
    priceFrom: "от 184 000 ₽",
  },
  marking: {
    image: "/assets/products/nord-line/nord-500hs.jpg",
    specBadge: "АВТОНОМНАЯ · ЛИНИЯ 100–450 ММ",
    priceFrom: "от 245 000 ₽",
  },
  accessories: {
    image: "/assets/products/nord-line/nord-970.jpg",
    specBadge: "РУКАВА ВД · ПИСТОЛЕТЫ · СОПЛА",
    priceFrom: "от 2 500 ₽",
  },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <>
      {/* 1. Interactive 3D Studio Hero Showcase */}
      <HeroShowcase />

      {/* 2. Priority-1 Cobalt Blue Engineering Ribbon */}
      <section className="blue-ribbon-section">
        <div className="container">
          <div className="blue-engineering-ribbon">
            <div className="ribbon-cell">
              <span className="ribbon-num">01 // ПОДБОР ПО ТЕХКАРТЕ</span>
              <strong>Инженерный расчёт под вязкость</strong>
              <p>Подбираем насос, сечение рукава ВД и калибр сопла строго под ваш состав и площадь объекта</p>
            </div>
            <div className="ribbon-cell">
              <span className="ribbon-num">02 // ПОКУПКА И ПРОКАТ</span>
              <strong>Продажа и аренда от 1 500 ₽/сут</strong>
              <p>Поставка в собственность с НДС или выдача подменного аппарата на время пиковых объёмов</p>
            </div>
            <div className="ribbon-cell">
              <span className="ribbon-num">03 // 100% ГОТОВЫЙ ПОСТ</span>
              <strong>Полная комплектация из коробки</strong>
              <p>В комплекте каждого агрегата: шланг высокого давления, пистолет, соплодержатель, сопло и масло</p>
            </div>
            <div className="ribbon-cell">
              <span className="ribbon-num">04 // СКЛАД И СТЕНД В МОСКВЕ</span>
              <strong>Проверка под давлением 230 бар</strong>
              <p>{SITE_CONFIG.address} — контрольная опрессовка перед каждой отгрузкой</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visual Bento Category Showroom */}
      <section className="section section-bento">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 // ПРОМЫШЛЕННЫЙ РУБРИКАТОР НАПРАВЛЕНИЙ</p>
              <h2>Оборудование по типу состава и задачи</h2>
            </div>
            <Link className="button button-blue-ghost" href="/catalog">
              Весь каталог ({products.length > 6 ? "12+" : products.length} станций) →
            </Link>
          </div>

          <div className="bento-category-grid">
            {categories.map((category, index) => {
              const meta = CATEGORY_VISUALS[category.slug] ?? {
                image: "/assets/products/nord-line/nord-9528x.png",
                specBadge: "ПРОМЫШЛЕННАЯ СЕРИЯ",
                priceFrom: "По запросу",
              };
              return (
                <Link
                  className={meta.wide ? "bento-cat-card bento-cat-card--wide" : "bento-cat-card"}
                  key={category.slug}
                  href={`/category/${category.slug}`}
                >
                  <div className="bento-cat-top">
                    <span className="bento-cat-index">
                      0{index + 1} // СКЛАД МОСКВА
                    </span>
                    <span className="bento-cat-spec">{meta.specBadge}</span>
                  </div>

                  <div className="bento-cat-body">
                    <div className="bento-cat-copy">
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                      <div className="bento-cat-footer">
                        <span className="bento-cat-price">{meta.priceFrom}</span>
                        <span className="bento-cat-cta">Перейти в раздел →</span>
                      </div>
                    </div>

                    <div className="bento-cat-visual">
                      <div className="bento-visual-halo" aria-hidden="true" />
                      <img src={meta.image} alt={category.name} loading="lazy" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Flagship Units on Blueprint Studio Canvas */}
      <section className="section section-blueprint">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 // ФЛАГМАНСКИЕ АГРЕГАТЫ НА СКЛАДЕ В МОСКВЕ</p>
              <h2>Ходовые станции для покупки и аренды</h2>
            </div>
            <Link className="button button-primary" href="/catalog">
              Открыть весь каталог
            </Link>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Pixel-Aligned Before / After Showcase */}
      <BeforeAfterSlider />

      {/* 6. Engineering Comparison Matrix */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 // СРАВНИТЕЛЬНАЯ ИНЖЕНЕРНАЯ ВЕДОМОСТЬ</p>
              <h2>Подбор станции по производительности и составам</h2>
            </div>
            <Link className="text-link" href="/catalog">
              Фильтр по давлению, потоку и мощности →
            </Link>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Модель станции</th>
                  <th>Подача</th>
                  <th>Давление</th>
                  <th>Двигатель</th>
                  <th>Рабочие материалы</th>
                  <th>Покупка с НДС</th>
                  <th>Аренда / сут</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 6).map((item) => {
                  const flow =
                    item.characteristics.find((c) => /производительность|подача/i.test(c.name))?.value ||
                    (item.flow_lpm ? `${item.flow_lpm} л/мин` : "—");
                  const pressure =
                    item.characteristics.find((c) => /давление/i.test(c.name))?.value || "230 бар";
                  const power =
                    item.characteristics.find((c) => /мощность|привод/i.test(c.name))?.value || "220 В";
                  return (
                    <tr key={item.id}>
                      <td>
                        <Link href={`/product/${item.id}`} className="table-model-link">
                          <strong>{item.short_name || item.model || item.name}</strong>
                          <span>{item.manufacturer}</span>
                        </Link>
                      </td>
                      <td className="mono-cell">{flow}</td>
                      <td className="mono-cell">{pressure}</td>
                      <td className="mono-cell">{power}</td>
                      <td>{item.materials || "Краски, грунты, шпаклёвки"}</td>
                      <td className="mono-cell price-cell">
                        {item.purchase_price
                          ? `${ new Intl.NumberFormat("ru-RU").format(item.purchase_price)} ₽`
                          : "По запросу"}
                      </td>
                      <td className="mono-cell">
                        {item.rental_price_daily
                          ? `${new Intl.NumberFormat("ru-RU").format(item.rental_price_daily)} ₽`
                          : "—"}
                      </td>
                      <td>
                        <Link href={`/product/${item.id}`} className="table-action-link">
                          Открыть →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Cobalt Blue Commercial Rental & Trade-In Stand */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div>
              <p className="eyebrow">05 // ПРОМЫШЛЕННЫЙ ПРОКАТ И ВЫКУП</p>
              <h2>Нужна станция на объект завтра утром без капитальных затрат?</h2>
              <p>
                Возьмите проверенный окрасочный или шпаклёвочный пост в посуточную аренду от 1 500 ₽/сут. Перед выдачей механик запускает аппарат на стенде и комплектует шлангом ВД нужной длины.
              </p>
            </div>
            <div className="promo-actions">
              <Link className="button button-white" href="/rent">
                Условия и тарифы аренды
              </Link>
              <a className="button button-outline-light" href={SITE_CONFIG.phoneHref}>
                Инженер: {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Direct B2B Specification & Quote Request */}
      <section className="section section-blueprint">
        <div className="container">
          <ContactRequestForm
            subject="Запрос коммерческого предложения и подбора станции (Главная)"
          />
        </div>
      </section>
    </>
  );
}
