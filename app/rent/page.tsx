import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { ContactRequestForm } from "@/components/contact-request-form";
import { SafeImage } from "@/components/safe-image";
import { getProducts } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/site-config";
import { MESSENGERS } from "@/components/messenger-links";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Аренда окрасочных и шпаклёвочных станций в Москве от 1 500 ₽/сут | NORD",
  description:
    "Прокат профессионального безвоздушного окрасочного и шпаклёвочного оборудования в Москве. Выдача готового поста со шлангами и пистолетом, работа по договору с ИП и ООО.",
};

const RENT_CLASSES = [
  {
    code: "ЗАДАЧА 01 · ИНТЕРЬЕРЫ, ФАСАДЫ И МЕТАЛЛ",
    spec: "2,5–4,2 Л/МИН · 230 БАР",
    title: "Окрасочные посты под квартиры Q4, фасады и антикор",
    models: "NORD-2500 · NORD-3300 · NORD-4500",
    image: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
    shortLabel: "Краткосрочно (1–2 суток)",
    shortRate: "от 1 500 ₽ / сут",
    longLabel: "От 3 суток и более",
    longRate: "от 1 350 ₽ / сут",
    kit: "Станция на раме + рукав ВД 15 м + пистолет + удочка 50 см + сопло 517/521",
    href: "#rent-fleet",
  },
  {
    code: "ЗАДАЧА 02 · КРАСКА В 2 ПОСТА И ФИНИШНАЯ ШПАКЛЁВКА",
    spec: "6,5 Л/МИН · СОПЛО ДО 0.043″",
    title: "Универсальная станция: покраска в 2 поста и полимерные пасты",
    models: "NORD-6000 HD",
    image: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
    shortLabel: "Краткосрочно (1–3 суток)",
    shortRate: "2 300 ₽ / сут",
    longLabel: "От 3 суток и более",
    longRate: "2 000 ₽ / сут",
    kit: "Колёсная станция 3.5 кВт + шпаклёвочный рукав 3/8″ + пистолет HD + удочка 50 см",
    href: "#rent-fleet",
  },
  {
    code: "ЗАДАЧА 03 · СВЕРХВЫСОКОЕ ДАВЛЕНИЕ 350 БАР И ШПАКЛЁВКА 9 Л/МИН",
    spec: "7,5–9,0 Л/МИН · ДО 350 БАР",
    title: "Баровая станция 350 бар и скоростная механизация ЖК",
    models: "NORD-8000 PRO (350 бар) · NORD-9200 (9 л/мин)",
    image: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg",
    shortLabel: "Краткосрочно (2–3 суток)",
    shortRate: "2 700 ₽ / сут",
    longLabel: "От 4 суток и более",
    longRate: "2 400 ₽ / сут",
    kit: "Шпаклёвочный рукав 3/8″ (до 350 бар) + пистолет HD прямого потока + сопла 535/543",
    href: "#rent-fleet",
  },
  {
    code: "ЗАДАЧА 04 · ТЯЖЁЛЫЙ ПРОМЫШЛЕННЫЙ И ФЛАГМАН 18 Л/МИН",
    spec: "11,0–18,0 Л/МИН · СОПЛО ДО 0.065″",
    title: "Станции максимальной подачи на 2–3 поста, пасты и ОГЗ",
    models: "NORD-9900 (11 л/мин) · NORD-18X (18 л/мин)",
    image: "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg",
    shortLabel: "Смена от 2 суток",
    shortRate: "от 2 900 ₽ / сут",
    longLabel: "Комплектация 2–3 постов (30–60 м)",
    longRate: "По техкарте",
    kit: "Усиленная магистраль 3/8″ + разветвитель на 2 поста + пистолеты HD + сопла до 0.065″",
    href: "#rent-fleet",
  },
];

export default async function RentPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const [{ product: selectedProduct }, allProducts] = await Promise.all([searchParams, getProducts()]);
  const rentable = allProducts.filter((product) => product.rental_enabled);
  return (
    <>
      <PageHero
        title="Прокат промышленных станций на объект"
        description="Окрасочные и шпаклёвочные станции в полной комплектации от 1 500 ₽/сут. Контрольная опрессовка 230 бар при вас на складе в Москве или доставка на стройплощадку за 3 часа."
        eyebrow="АРЕНДНЫЙ ПАРК NORD · МОСКВА И МО"
        theme="rent"
      />
      <section className="section section-blueprint">
        <div className="container">
          {selectedProduct && (
            <div className="info-card info-card--accent" style={{ marginBottom: 24 }}>
              <div className="info-card-topbar">
                <span className="info-card-index">ВЫБРАННАЯ СТАНЦИЯ ДЛЯ БРОНИРОВАНИЯ</span>
                <span className="info-card-badge">РЕЗЕРВ СО СКЛАДА МОСКВА</span>
              </div>
              <div className="info-card-body">
                <h2>{rentable.find((product) => product.id === selectedProduct)?.name || selectedProduct}</h2>
                <p>
                  Добавьте выбранный агрегат в корзину в режиме «Аренда» для расчёта стоимости по датам или свяжитесь с инженером проката напрямую.
                </p>
                <div className="hero-actions" style={{ marginTop: 14 }}>
                  <Link className="button button-primary" href={`/product/${encodeURIComponent(selectedProduct)}`}>
                    Перейти к карточке станции →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="section-heading">
            <div>
              <p className="eyebrow">ТАРИФНАЯ СЕТКА ПРОКАТА ПО ЗАДАЧАМ</p>
              <h2>Ставки посуточной аренды готовых малярных постов</h2>
            </div>
            <p>В стоимость включены: станция на раме, рукав ВД 15–30 м, пистолет, удочка 50 см и рабочее сопло под ваш состав.</p>
          </div>

          <div className="rent-grid">
            {RENT_CLASSES.map((tier) => (
              <article className="rent-card" key={tier.code}>
                <div className="rent-card-topbar">
                  <span className="rent-card-code">{tier.code}</span>
                  <span className="rent-card-spec">{tier.spec}</span>
                </div>

                <div className="rent-card-body">
                  <div className="rent-card-main">
                    <h3>{tier.title}</h3>
                    <p className="rent-card-models">Модели в парке: {tier.models}</p>

                    <div className="rent-rates-box">
                      <div className="rent-price-line">
                        <span>{tier.shortLabel}</span>
                        <strong>{tier.shortRate}</strong>
                      </div>
                      <div className="rent-price-line rent-price-line--highlight">
                        <span>{tier.longLabel}</span>
                        <strong>{tier.longRate}</strong>
                      </div>
                    </div>

                    <div className="rent-card-footer">
                      <span className="rent-kit-note">✓ {tier.kit}</span>
                      <a className="rent-card-cta" href={tier.href}>
                        Выбрать станцию ↓
                      </a>
                    </div>
                  </div>

                  <div className="rent-card-visual">
                    <div className="rent-visual-halo" aria-hidden="true" />
                    <SafeImage src={tier.image} alt={tier.title} fallbackHint={tier.models} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Dark-Cobalt 4-Step Rental Regulation Banner */}
          <div className="blue-engineering-ribbon" style={{ marginTop: 32 }}>
            <div className="ribbon-cell ribbon-cell--1">
              <div className="ribbon-cell-top">
                <span className="ribbon-num">ШАГ 01 · БРОНЬ И ДОГОВОР</span>
                <span className="ribbon-metric">10 МИНУТ</span>
              </div>
              <strong>Работаем с ООО, ИП и физлицами</strong>
              <p>Оформляем договор проката, счёт с НДС 20% и закрывающие документы УПД (ЭДО Диадок / СБИС)</p>
            </div>
            <div className="ribbon-cell ribbon-cell--2">
              <div className="ribbon-cell-top">
                <span className="ribbon-num">ШАГ 02 · КОНТРОЛЬНЫЙ ЗАПУСК</span>
                <span className="ribbon-metric">230 БАР ТЕСТ</span>
              </div>
              <strong>Опрессовка при вас перед выдачей</strong>
              <p>Механик проверяет набор давления на стенде и комплектует пост соплом под ваш материал ({SITE_CONFIG.address})</p>
            </div>
            <div className="ribbon-cell ribbon-cell--3">
              <div className="ribbon-cell-top">
                <span className="ribbon-num">ШАГ 03 · ВЫКУП ИЗ ПРОКАТА</span>
                <span className="ribbon-metric">ЗАЧЁТ АРЕНДЫ</span>
              </div>
              <strong>Тест-драйв перед покупкой</strong>
              <p>Испытайте станцию на своём объекте: при переходе в покупку засчитываем арендную плату в счёт стоимости</p>
            </div>
            <div className="ribbon-cell ribbon-cell--4">
              <div className="ribbon-cell-top">
                <span className="ribbon-num">ШАГ 04 · ПРЯМАЯ СВЯЗЬ</span>
                <span className="ribbon-metric">БЕЗ ПРОСТОЕВ</span>
              </div>
              <strong>Дежурный инженер проката</strong>
              <p>Прямой телефон механика на время работ: {SITE_CONFIG.phone} — оперативная консультация по запуску и промывке</p>
            </div>
          </div>

          <div id="rent-fleet" className="section-heading" style={{ marginTop: 52 }}>
            <div>
              <p className="eyebrow">ДЕЖУРНЫЙ АРЕНДНЫЙ ПАРК В МОСКВЕ</p>
              <h2>Станции, доступные для бронирования ({rentable.length})</h2>
            </div>
            <p>Переключите карточку в режим «Аренда» или оформите заявку на нужные даты в 1 клик.</p>
          </div>

          {rentable.length ? (
            <div className="product-grid catalog-products">
              {rentable.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Уточните свободный резерв парка</h3>
              <p>Свяжитесь с инженером проката по телефону {SITE_CONFIG.phone}.</p>
            </div>
          )}

          <div id="lead-form" style={{ marginTop: 48 }}>
            <ContactRequestForm subject="Запрос на аренду станции: укажите состав и планируемые даты работ." />
          </div>
        </div>
      </section>
    </>
  );
}
