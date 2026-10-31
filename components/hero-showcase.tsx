"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store-context";

interface HeroUnit {
  id: string;
  code: string;
  watermark: string;
  badge: string;
  taskLabel: string;
  name: string;
  subtitle: string;
  images: { src: string; label: string }[];
  power: string;
  flow: string;
  pressure: string;
  nozzle: string;
  buyPrice: string;
  rentPrice: string;
  highlights: string[];
}

const HERO_UNITS: HeroUnit[] = [
  {
    id: "putter-pt-9536",
    code: "NORD 9536",
    watermark: "NORD 9536",
    badge: "ФЛАГМАН NORD · СВЕРХВЫСОКАЯ ПОДАЧА 18 Л/МИН",
    taskLabel: "01 / Шпаклёвка и пром. объекты",
    name: "Окрасочно-шпаклёвочная станция NORD 9536",
    subtitle: "Флагманский агрегат 5 500 Вт с подачей до 18,0 л/мин для скоростного нанесения полимерных шпаклёвок, огнезащиты и фасадных красок.",
    images: [
      { src: "/assets/products/nord-9536/nord-9536-side.jpg", label: "Вид 3/4 сбоку" },
      { src: "/assets/products/nord-9536/nord-9536-front.jpg", label: "Вид спереди" },
      { src: "/assets/products/nord-9536/nord-9536-control.jpg", label: "Блок управления" },
    ],
    power: "5 500 Вт",
    flow: "18,0 л/мин",
    pressure: "230 бар",
    nozzle: "до 0.051″",
    buyPrice: "198 000 ₽",
    rentPrice: "3 000 ₽/сут",
    highlights: [
      "Фирменная серия NORD 9536 с электронным контролем давления",
      "Работа с густыми финишными пастами, огнезащитой и красками",
    ],
  },
  {
    id: "gtb-1095",
    code: "NORD 1095 HD",
    watermark: "1095 HD",
    badge: "ПРОМЫШЛЕННАЯ СЕРИЯ · НА 2 МАЛЯРНЫХ ПОСТА",
    taskLabel: "02 / Промышленная окраска",
    name: "NORD 1095 HD",
    subtitle: "Высокопроизводительный окрасочный агрегат на 6,0 л/мин. Позволяет работать одновременно на два малярных поста.",
    images: [
      { src: "/assets/products/nord-line/nord-1095.jpg", label: "Главный вид" },
    ],
    power: "3 500 Вт",
    flow: "6,0 л/мин",
    pressure: "230 бар",
    nozzle: "до 0.043″",
    buyPrice: "97 375 ₽",
    rentPrice: "2 000 ₽/сут",
    highlights: [
      "Бесщёточный двигатель TEFC 3,5 кВт с защитой от перепадов",
      "Стабильная подача факела на рукавах длиной до 60 метров",
    ],
  },
  {
    id: "putter-9528x",
    code: "NORD 9528-X",
    watermark: "9528-X",
    badge: "СЕРИЯ QUICKREEL · БАРАБАН ДЛЯ ШЛАНГА",
    taskLabel: "03 / Фасады и шпаклёвка",
    name: "NORD 9528-X QuickReel",
    subtitle: "Мощная поршневая станция на 10,5 л/мин со встроенным барабаном QuickReel для удобной смотки и хранения шланга ВД.",
    images: [
      { src: "/assets/products/nord-line/nord-9528x.png", label: "Вид 3/4" },
      { src: "/assets/products/nord-line/nord-9528x-studio.jpg", label: "Студия" },
    ],
    power: "5 000 Вт",
    flow: "10,5 л/мин",
    pressure: "230 бар",
    nozzle: "до 0.045″",
    buyPrice: "170 000 ₽",
    rentPrice: "2 500 ₽/сут",
    highlights: [
      "Встроенный барабан QuickReel для быстрой смотки шланга ВД",
      "Прямой забор густых полимерных паст из 30-литровой тары",
    ],
  },
];

export function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAngle, setActiveAngle] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { mode, addToCart } = useStore();

  const unit = HERO_UNITS[activeIndex] ?? HERO_UNITS[0];
  const currentPhoto = unit.images[activeAngle] ?? unit.images[0];

  function handleQuickAdd() {
    addToCart(unit.id, mode);
    setAddedId(unit.id);
    window.setTimeout(() => setAddedId(null), 1600);
  }

  return (
    <section className="hero-stage">
      {/* Deep Cobalt-Blue Architectural Backdrop with Left-to-Right NORD Watermark Bands */}
      <div className="hero-stage-bg" aria-hidden="true">
        <div className="hero-photo-backdrop" />
        <div className="hero-cobalt-overlay" />

        {/* Left-to-right aerodynamic pressure streamlines */}
        <svg
          className="hero-streamlines-svg"
          viewBox="0 0 1440 680"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="nordLineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="75%" stopColor="#8ab4ff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="nordLineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M-100 140 C 320 140, 620 80, 1540 40"
            stroke="url(#nordLineGrad1)"
            strokeWidth="1.5"
          />
          <path
            d="M-100 280 C 380 260, 740 190, 1540 150"
            stroke="url(#nordLineGrad2)"
            strokeWidth="1"
            strokeDasharray="10 8"
          />
          <path
            d="M-100 460 C 420 430, 820 340, 1540 290"
            stroke="url(#nordLineGrad1)"
            strokeWidth="1.5"
          />
          <path
            d="M-100 590 C 460 560, 880 490, 1540 440"
            stroke="url(#nordLineGrad2)"
            strokeWidth="1"
          />
        </svg>

        {/* Left-to-right NORD watermark marking bands */}
        <div className="hero-watermark-bands">
          <div className="watermark-band watermark-band--top">
            <div className="watermark-band-track">
              <span>NORD // HIGH PRESSURE AIRLESS SYSTEMS // 230–350 BAR // MOSCOW ENGINEERING</span>
              <span>NORD // HIGH PRESSURE AIRLESS SYSTEMS // 230–350 BAR // MOSCOW ENGINEERING</span>
              <span>NORD // HIGH PRESSURE AIRLESS SYSTEMS // 230–350 BAR // MOSCOW ENGINEERING</span>
            </div>
          </div>

          <div className="watermark-band watermark-band--middle">
            <div className="watermark-band-track watermark-band-track--giant">
              <span>NORD</span>
              <span className="wm-capsule" />
              <span>9536 PRO</span>
              <span className="wm-capsule" />
              <span>230 BAR</span>
              <span className="wm-capsule" />
              <span>NORD</span>
              <span className="wm-capsule" />
              <span>AIRLESS</span>
              <span className="wm-capsule" />
              <span>NORD</span>
              <span className="wm-capsule" />
              <span>9536 PRO</span>
            </div>
          </div>

          <div className="watermark-band watermark-band--bottom">
            <div className="watermark-band-track">
              <span>NORD 9536 · NORD 9528X QUICKREEL · NORD 1095 HD · NORD 1033 HYDRAULIC · NORD 9535 350 BAR · NORD WAREHOUSE</span>
              <span>NORD 9536 · NORD 9528X QUICKREEL · NORD 1095 HD · NORD 1033 HYDRAULIC · NORD 9535 350 BAR · NORD WAREHOUSE</span>
            </div>
          </div>
        </div>

        <div className="hero-ambient-glow" />
      </div>

      <div className="container hero-stage-inner">
        {/* Left column: Value proposition + live unit selector */}
        <div className="hero-stage-left">
          <div className="hero-brand-pill">
            <span className="hero-brand-dot" />
            <span>NORD ENGINEERING · СКЛАД И СЕРВИС В МОСКВЕ</span>
          </div>

          <h1>
            Профессиональные окрасочные и шпаклёвочные станции{" "}
            <span>высокого давления</span>
          </h1>

          <p className="hero-stage-lead">
            Прямая поставка в собственность и посуточная аренда безвоздушных агрегатов (200–350 бар). Полная комплектация поста из коробки, опрессовка на стенде перед выдачей и отгрузка в день оплаты.
          </p>

          {/* Interactive switcher of 3 flagship machines */}
          <div className="hero-unit-tabs" role="tablist" aria-label="Выберите класс оборудования">
            {HERO_UNITS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                className={idx === activeIndex ? "hero-unit-tab is-active" : "hero-unit-tab"}
                onClick={() => {
                  setActiveIndex(idx);
                  setActiveAngle(0);
                }}
              >
                <span className="tab-task">{item.taskLabel}</span>
                <strong>
                  {item.code} · {item.flow}
                </strong>
              </button>
            ))}
          </div>

          <div className="hero-stage-actions">
            <Link className="button button-white button-lg" href="/catalog">
              Смотреть весь каталог (12 станций) →
            </Link>
            <Link className="button button-outline-light button-lg" href="/rent">
              Парк аренды от 1 500 ₽/сут
            </Link>
          </div>

          {/* 3 clean engineering trust counters */}
          <div className="hero-trust-strip">
            <div className="hero-trust-item">
              <strong>2.0 – 50 л/мин</strong>
              <span>Диапазон подачи агрегатов</span>
            </div>
            <div className="hero-trust-item">
              <strong>200 – 350 бар</strong>
              <span>Испытание на стенде перед выдачей</span>
            </div>
            <div className="hero-trust-item">
              <strong>100% пост</strong>
              <span>Шланг ВД, пистолет и сопло в комплекте</span>
            </div>
          </div>
        </div>

        {/* Right column: Clean Studio Podium Card with Multi-Angle Switcher */}
        <div className="hero-podium-card">
          <div className="hero-podium-topbar">
            <span className="podium-series-badge">{unit.badge}</span>
            <span className="podium-stock-indicator">
              <i /> В наличии
            </span>
          </div>

          <div className="hero-podium-stage">
            <span className="podium-model-watermark" aria-hidden="true">
              {unit.watermark}
            </span>
            <div className="podium-radial-spotlight" aria-hidden="true" />

            <Link href={`/product/${unit.id}`} className="podium-img-link">
              <img
                key={currentPhoto.src}
                className="podium-machine-img"
                src={currentPhoto.src}
                alt={`${unit.name} — ${currentPhoto.label}`}
              />
            </Link>

            {unit.images.length > 1 ? (
              <div className="podium-angle-switcher" role="group" aria-label="Ракурс аппарата">
                {unit.images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    className={idx === activeAngle ? "angle-pill is-active" : "angle-pill"}
                    onClick={() => setActiveAngle(idx)}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hero-podium-info">
            <div className="podium-title-row">
              <div>
                <h3>
                  <Link href={`/product/${unit.id}`}>{unit.name}</Link>
                </h3>
                <p>{unit.subtitle}</p>
              </div>
            </div>

            <ul className="podium-highlights">
              {unit.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="podium-telemetry-grid">
              <div>
                <span>МОЩНОСТЬ</span>
                <strong>{unit.power}</strong>
              </div>
              <div>
                <span>ПОДАЧА</span>
                <strong>{unit.flow}</strong>
              </div>
              <div>
                <span>ДАВЛЕНИЕ</span>
                <strong>{unit.pressure}</strong>
              </div>
              <div>
                <span>ЦЕНА / ПРОКАТ</span>
                <strong>{mode === "rent" ? unit.rentPrice : unit.buyPrice}</strong>
              </div>
            </div>

            <div className="podium-action-bar">
              <button
                type="button"
                className="button button-primary"
                onClick={handleQuickAdd}
              >
                {addedId === unit.id
                  ? "✓ Добавлено в корзину"
                  : mode === "rent"
                    ? `Взять в аренду (${unit.rentPrice})`
                    : `В корзину (${unit.buyPrice})`}
              </button>
              <Link href={`/product/${unit.id}`} className="button button-blue-ghost">
                Техпаспорт →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
