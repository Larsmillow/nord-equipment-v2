"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Category, Product } from "@/lib/catalog";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/fallback-catalog";
import { ProductCard } from "@/components/product-card";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { ContactRequestForm } from "@/components/contact-request-form";
import { HeroShowcase } from "@/components/hero-showcase";
import { PowerGradeLadder } from "@/components/power-grade-ladder";
import { SafeImage } from "@/components/safe-image";
import { MobileContactBlock } from "@/components/messenger-links";
import { SITE_CONFIG } from "@/lib/site-config";
import { CATEGORY_VISUALS } from "@/lib/category-visuals";
import { NordShowroom } from "@/app/tg/showroom";
import "@/app/tg/tg.css";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(() =>
    FALLBACK_PRODUCTS.filter((p) => p.published)
  );
  const [categories, setCategories] = useState<Category[]>(() => FALLBACK_CATEGORIES);

  useEffect(() => {
    fetch("/api/admin/db")
      .then((r) => r.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
          const active = data.products
            .filter((p: any) => p.inStock !== false)
            .map((p: any) => {
              const fb = FALLBACK_PRODUCTS.find((f) => f.id === p.id);
              const flowNum =
                parseFloat(String(p.flowLpm).replace(",", ".")) || fb?.flow_lpm || 2.5;
              return {
                ...(fb || {
                  id: p.id,
                  slug: p.id,
                  short_name: p.name,
                  category_slug: p.categoryId || "piston_paint",
                  category_name: p.badge || "NORD PRO",
                  manufacturer: "NORD",
                  model: p.name,
                  rental_min_days: 1,
                  published: true,
                  drive: `${p.powerW || "3000 W"} · ${p.motorType || "Бесщёточный"}`,
                  features: [],
                  materials: "Краски, грунты, эмали",
                }),
                name: p.name,
                badge: p.badge || fb?.badge || "NORD PRO",
                description: p.description || fb?.description || p.subtitle || "",
                purchase_price: Number(p.priceRub) || fb?.purchase_price || 0,
                rental_price_daily: Number(p.rentDayRub) || fb?.rental_price_daily || 0,
                published: true,
                flow_lpm: flowNum,
                images: p.photoUrl
                  ? [
                      { src: p.photoUrl, alt: p.name },
                      ...(fb?.images.filter((img) => img.src !== p.photoUrl) || []),
                    ]
                  : fb?.images || [],
                characteristics: [
                  { name: "Мощность двигателя", value: p.powerW || "—" },
                  { name: "Производительность", value: p.flowLpm || "—" },
                  { name: "Макс. давление", value: p.pressureBar || "—" },
                  { name: "Макс. сопло", value: p.maxTip || "—" },
                  { name: "Масса", value: p.weightKg || "—" },
                  { name: "Тип привода", value: p.motorType || "Бесщёточный" },
                ],
              };
            });
          if (active.length > 0) setProducts(active);
        }
        if (data?.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          const activeCats = data.categories
            .filter((c: any) => c.active !== false)
            .map((c: any) => ({
              slug: c.id,
              name: c.name,
              description: c.badge || "",
              sort_order: c.order || 1,
            }));
          if (activeCats.length > 0) setCategories(activeCats);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Флагманская мобильная версия сайта (<= 768px) — десктоп (>= 769px) не затрагивается */}
      <NordShowroom variant="web" />

      <div className="desktop-home-shell">
        {/* 1. Interactive Studio Hero Showcase with 5-Task Selector & Animated Blue Snake */}
        <HeroShowcase />

        {/* 2. Flagship Units Ordered by Ascending Power & Task (Light Blueprint Contrast) */}
        <section id="catalog" className="section section-blueprint">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">01 // ХИТЫ ПРОДАЖ И ПРОКАТА ПО ВОЗРАСТАНИЮ ПОДАЧИ (2,5 → 18 Л/МИН)</p>
                <h2>Станции NORD в наличии на складе в Москве</h2>
              </div>
              <Link className="button button-primary" href="/catalog">
                Открыть весь каталог ({products.length} станций) →
              </Link>
            </div>

            <div className="product-grid product-grid--rail">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Interactive Before / After 230 Bar Proof + Direct 3D-Lab Launch */}
        <BeforeAfterSlider />

        {/* 4. 5-Task & Material Selection Matrix (From Q4 Apartments to Fireproofing) */}
        <PowerGradeLadder />

        {/* 5. Dark-Cobalt Iron Guarantees Bento + Commercial Rental Offer (1 500 ₽/day) */}
        <section className="blue-ribbon-section">
          <div className="container">
            <div className="ribbon-section-header">
              <span className="ribbon-section-kicker">04 // СТАНДАРТ ПОСТАВКИ И СЕРВИСА NORD ENGINEERING</span>
              <h2>Почему подрядчики и бригады комплектуют объекты у нас</h2>
            </div>

            <div className="blue-engineering-ribbon">
              <div className="ribbon-cell ribbon-cell--1">
                <div className="ribbon-cell-top">
                  <span className="ribbon-num">01 // ПОДБОР ПОД ЗАДАЧУ</span>
                  <span className="ribbon-metric">От Q4 до ОГЗ</span>
                </div>
                <strong>5 решений под ваш состав</strong>
                <p>Квартиры Q4, фасады и металл, шпаклёвка в 2 поста, механизация ЖК и огнезащита</p>
              </div>
              <div className="ribbon-cell ribbon-cell--2">
                <div className="ribbon-cell-top">
                  <span className="ribbon-num">02 // ПРОДАЖА И ПРОКАТ</span>
                  <span className="ribbon-metric">от 1 500 ₽/сут</span>
                </div>
                <strong>Покупка с НДС 20% или аренда</strong>
                <p>Отгрузка в собственность по договору или быстрая выдача подменного агрегата на объект</p>
              </div>
              <div className="ribbon-cell ribbon-cell--3">
                <div className="ribbon-cell-top">
                  <span className="ribbon-num">03 // КОМПЛЕКТ ПОСТА</span>
                  <span className="ribbon-metric">100% В СБОРЕ</span>
                </div>
                <strong>Готов к запуску сразу из коробки</strong>
                <p>Шланг ВД 15 м, пистолет, соплодержатель, реверсивное сопло, удочка и масло в комплекте</p>
              </div>
              <div className="ribbon-cell ribbon-cell--4">
                <div className="ribbon-cell-top">
                  <span className="ribbon-num">04 // СТЕНД В МОСКВЕ</span>
                  <span className="ribbon-metric">230 БАР ТЕСТ</span>
                </div>
                <strong>Предпродажная опрессовка</strong>
                <p>{SITE_CONFIG.address} — проверка каждого насоса под рабочим давлением перед выдачей</p>
              </div>
            </div>

            <div className="promo-banner promo-banner--embedded">
              <div>
                <p className="eyebrow">ПРОМЫШЛЕННЫЙ ПРОКАТ И ТЕСТ-ДРАЙВ НА ОБЪЕКТЕ</p>
                <h2>Нужна станция на объект завтра утром без заморозки оборотных средств?</h2>
                <p>
                  Возьмите проверенный окрасочный или шпаклёвочный пост в посуточную аренду от 1 500 ₽/сут. Перед выдачей механик запускает аппарат на стенде 230 бар и комплектует шлангом нужной длины.
                </p>
              </div>
              <div className="promo-actions">
                <Link className="button button-white" href="/rent">
                  <span>Условия и тарифы аренды</span>
                  <span className="chevron-icon">&gt;&gt;</span>
                </Link>
                <a className="button button-outline-light" href={SITE_CONFIG.phoneHref}>
                  Инженер склада: {SITE_CONFIG.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Visual Bento Category Showroom */}
        <section className="section section-bento">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">05 // ПРОМЫШЛЕННЫЙ РУБРИКАТОР НАПРАВЛЕНИЙ</p>
                <h2>Оборудование по типу состава и задачи</h2>
              </div>
              <Link className="button button-blue-ghost" href="/catalog">
                Все разделы каталога →
              </Link>
            </div>

            <div className="bento-category-grid">
              {categories.map((category, index) => {
                const meta = CATEGORY_VISUALS[category.slug] ?? {
                  image: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
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
                        <SafeImage src={meta.image} alt={category.name} fallbackHint={category.slug} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Engineering Comparison Matrix */}
        <section className="section section-gray section-compare">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">06 // СРАВНИТЕЛЬНАЯ ИНЖЕНЕРНАЯ ВЕДОМОСТЬ</p>
                <h2>Сводная таблица станций от младших к старшим</h2>
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
                  {products.slice(0, 8).map((item) => {
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
                            <span>{item.badge || item.manufacturer}</span>
                          </Link>
                        </td>
                        <td className="mono-cell">{flow}</td>
                        <td className="mono-cell">{pressure}</td>
                        <td className="mono-cell">{power}</td>
                        <td>{item.materials || "Краски, грунты, шпаклёвки"}</td>
                        <td className="mono-cell price-cell">
                          {item.purchase_price
                            ? `${new Intl.NumberFormat("ru-RU").format(item.purchase_price)} ₽`
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

        {/* 8. Direct B2B Specification & Quote Request */}
        <section id="lead-form" className="section section-blueprint section-request">
          <div className="container">
            <div className="desktop-only">
              <ContactRequestForm
                subject="Запрос коммерческого предложения и подбора станции (Главная)"
              />
            </div>
            <div className="mobile-only">
              <MobileContactBlock />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
