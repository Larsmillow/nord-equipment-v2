import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { ContactRequestForm } from "@/components/contact-request-form";
import { getProducts } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Аренда окрасочных и шпаклёвочных станций в Москве от 1 500 ₽/сут | NORD",
  description:
    "Прокат профессионального безвоздушного окрасочного и шпаклёвочного оборудования в Москве. Выдача готового поста со шлангами и пистолетом, работа по договору с ИП и ООО.",
};

export default async function RentPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const [{ product: selectedProduct }, allProducts] = await Promise.all([searchParams, getProducts()]);
  const rentable = allProducts.filter((product) => product.rental_enabled);
  return (
    <>
      <PageHero
        title="Прокат промышленного оборудования"
        description="Готовые к запуску окрасочные и шпаклёвочные станции в аренду от 1 суток. Выдача со склада в Москве и доставка на объект."
        eyebrow="АРЕНДА НА ОБЪЕКТ"
        theme="rent"
      />
      <section className="section">
        <div className="container">
          {selectedProduct && (
            <div className="info-card" style={{ marginBottom: 24 }}>
              <h2>Бронирование аренды модели</h2>
              <p>
                Вы выбрали станцию{" "}
                <strong>{rentable.find((product) => product.id === selectedProduct)?.name || selectedProduct}</strong>.
                Добавьте её в корзину в режиме «Аренда» для расчёта стоимости по датам.
              </p>
              <div className="hero-actions" style={{ marginTop: 14 }}>
                <Link className="button button-primary" href={`/product/${encodeURIComponent(selectedProduct)}`}>
                  Перейти к карточке станции
                </Link>
              </div>
            </div>
          )}

          <div className="section-heading">
            <div>
              <p className="eyebrow">01 // ТАРИФНАЯ СЕТКА ПРОКАТА</p>
              <h2>Базовые ставки аренды по классам мощности</h2>
            </div>
            <p>В стоимость включены: аппарат на раме, шланг ВД 15 м, пистолет, соплодержатель и рабочее сопло.</p>
          </div>

          <div className="rent-grid">
            <article className="rent-card">
              <p className="eyebrow">КЛАСС 01 // ИНТЕРЬЕРНАЯ И КОММЕРЧЕСКАЯ ОКРАСКА</p>
              <h3>Аппараты подачи 2,0–4,0 л/мин (220 В)</h3>
              <div className="rent-price-line">
                <span>Краткосрочно (1–2 суток)</span>
                <strong>1 700 ₽ / сутки</strong>
              </div>
              <div className="rent-price-line">
                <span>От 3 суток и более</span>
                <strong>1 500 ₽ / сутки</strong>
              </div>
            </article>
            <article className="rent-card">
              <p className="eyebrow">КЛАСС 02 // ФАСАДЫ, ПРОМЗДАНИЯ, ВЫСОКАЯ ВЫРАБОТКА</p>
              <h3>Станции подачи 6,0–10,5 л/мин (220 В)</h3>
              <div className="rent-price-line">
                <span>Краткосрочно (1–3 суток)</span>
                <strong>2 500 ₽ / сутки</strong>
              </div>
              <div className="rent-price-line">
                <span>От 3 суток и более</span>
                <strong>2 000 ₽ / сутки</strong>
              </div>
            </article>
            <article className="rent-card">
              <p className="eyebrow">КЛАСС 03 // МЕХАНИЗИРОВАННАЯ ШПАКЛЁВКА</p>
              <h3>Шпаклёвочные станции 10–18 л/мин</h3>
              <div className="rent-price-line">
                <span>Краткосрочно (2–3 суток)</span>
                <strong>2 500 ₽ / сутки</strong>
              </div>
              <div className="rent-price-line">
                <span>От 4 суток и более</span>
                <strong>2 000 ₽ / сутки</strong>
              </div>
            </article>
            <article className="rent-card">
              <p className="eyebrow">КЛАСС 04 // ОГНЕЗАЩИТА И ГИДРОИЗОЛЯЦИЯ 350 БАР</p>
              <h3>Тяжёлые станции и гидропривод</h3>
              <div className="rent-price-line">
                <span>От 3 суток</span>
                <strong>от 3 000 ₽ / сутки</strong>
              </div>
              <div className="rent-price-line">
                <span>Комплектация 2 постов / 30–60 м</span>
                <strong>По согласованию</strong>
              </div>
            </article>
          </div>

          <div className="info-grid" style={{ marginTop: 24 }}>
            <article className="info-card">
              <p className="eyebrow">01 // ДОГОВОР И ЗАКРЫВАЮЩИЕ</p>
              <h3>Работаем с ООО, ИП и физлицами</h3>
              <p>Оформляем официальный договор проката, акт приёма-передачи и закрывающие документы (УПД / ЭДО).</p>
            </article>
            <article className="info-card">
              <p className="eyebrow">02 // ПРОВЕРКА ПЕРЕД ВЫДАЧЕЙ</p>
              <h3>Опрессовка при вас на складе</h3>
              <p>Демонстрируем набор давления и проводим инструктаж оператора по промывке станции ({SITE_CONFIG.address}).</p>
            </article>
            <article className="info-card">
              <p className="eyebrow">03 // БРОНИРОВАНИЕ ПО ТЕЛЕФОНУ</p>
              <h3>{SITE_CONFIG.phone}</h3>
              <p>Позвоните инженеру проката, чтобы зафиксировать резерв свободной станции на нужные даты.</p>
            </article>
          </div>

          <div className="section-heading" style={{ marginTop: 48 }}>
            <div>
              <p className="eyebrow">02 // ПАРК ДОСТУПНОЙ ТЕХНИКИ</p>
              <h2>Станции, доступные для аренды ({rentable.length})</h2>
            </div>
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

          <div style={{ marginTop: 48 }}>
            <ContactRequestForm subject="Запрос на аренду станции: укажите состав и планируемые даты работ." />
          </div>
        </div>
      </section>
    </>
  );
}
