"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store-context";

interface HeroUnit {
  id: string;
  labId: string;
  code: string;
  name: string;
  tierNum: number;
  loadBar: string;
  taskChip: string;
  taskTitle: string;
  objectScope: string;
  tierColor: string;
  badge: string;
  subtitle: string;
  flow: string;
  flowNum: number;
  pressure: string;
  nozzle: string;
  power: string;
  weight: string;
  shiftM2: string;
  replacesPainters: string;
  postsCount: string;
  buyPrice: string;
  rentPrice: string;
  materialsList: string[];
  strengths: string[];
  nextTaskHint: string;
  images: { src: string; label: string }[];
}

const HERO_UNITS: HeroUnit[] = [
  {
    id: "nord-2500",
    labId: "nord-2500",
    code: "NORD-2500",
    name: "NORD-2500 SmartControl",
    tierNum: 1,
    loadBar: "[■□□□□]",
    taskChip: "КВАРТИРЫ · Q4",
    taskTitle: "РЕЖИМ 01 // ИНТЕРЬЕР И ФИНИШ Q4",
    objectScope: "Квартиры, коттеджи и офисы до 500 м² · 1 малярный пост",
    tierColor: "#64748b",
    badge: "1 КЛАСС · ИНТЕРЬЕРНЫЙ ФИНИШ Q4",
    subtitle:
      "Компактный бесщёточный поршневой аппарат 1 600 Вт (15 кг) для чистовой окраски под финиш Q4. Стабильный факел 230 бар от обычной розетки 220В.",
    flow: "2,5 л/мин",
    flowNum: 2.5,
    pressure: "230 бар",
    nozzle: "до 0.023″",
    power: "1 600 Вт",
    weight: "15 кг",
    shiftM2: "до 400 м²/смену",
    replacesPainters: "Заменяет 3 маляров",
    postsCount: "1 пост · 15 кг",
    buyPrice: "35 000 ₽",
    rentPrice: "1 500 ₽/сут",
    materialsList: [
      "Водоэмульсионные, латексные и акриловые краски",
      "Интерьерные эмали и лаки под Q4",
      "Акриловые грунты глубокого проникновения",
      "Декоративные и финишные составы",
    ],
    strengths: [
      "Бесщёточный двигатель 1600 Вт с электронным контролем давления SmartControl",
      "Стабильный мягкий факел 230 бар без полос и шагрени под финиш Q4",
      "Вес нетто всего 15 кг — свободная переноска одним мастером и промывка за 10 мин",
    ],
    nextTaskHint: "Нужен повышенный ресурс под фасадные краски и сопло 0.033″? Перейти к РЕЖИМУ 02 (4,2 л/мин)",
    images: [
      { src: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg", label: "Аппарат 3/4" },
      { src: "/assets/machines/nord-2500/NORD-2500-view-front-nord-edit-2k.jpg", label: "Спереди" },
      { src: "/assets/machines/nord-2500/NORD-2500-view-side-nord-edit-2k.jpg", label: "Сбоку" },
    ],
  },
  {
    id: "nord-4500",
    labId: "nord-4500",
    code: "NORD-4500",
    name: "NORD-4500 HighFlow",
    tierNum: 2,
    loadBar: "[■■□□□]",
    taskChip: "ФАСАДЫ · МЕТАЛЛ",
    taskTitle: "РЕЖИМ 02 // СКОРОСТНАЯ ОКРАСКА, ФАСАДЫ И МЕТАЛЛ",
    objectScope: "Фасады зданий, склады, цеха и металлоконструкции до 2 500 м²",
    tierColor: "#0284c7",
    badge: "1 КЛАСС · СКОРОСТНАЯ ОКРАСКА И ФАСАДЫ",
    subtitle:
      "Универсальный бесщёточный аппарат 3 000 Вт (4,2 л/мин) для плотных фасадных красок, антикоррозийных грунт-эмалей и работы на длинных шлангах.",
    flow: "4,2 л/мин",
    flowNum: 4.2,
    pressure: "230 бар",
    nozzle: "до 0.033″",
    power: "3 000 Вт",
    weight: "22 кг",
    shiftM2: "до 900 м²/смену",
    replacesPainters: "Заменяет 5 маляров",
    postsCount: "1–2 поста (до 60 м)",
    buyPrice: "55 000 ₽",
    rentPrice: "2 000 ₽/сут",
    materialsList: [
      "Фасадные акриловые, силиконовые и силикатные краски",
      "Грунт-эмали 3-в-1 по ржавчине и металлоконструкциям",
      "Антикоррозийные, алкидные и полиуретановые эмали",
      "Огнебиозащитные пропитки для дерева и бетона",
    ],
    strengths: [
      "Повышенная производительность 4,2 л/мин — уверенно держит трассу до 60 метров",
      "Бесщёточный двигатель 3000 Вт без перегрева на непрерывных промышленных сменах",
      "Возможность разводки на 2 малярных поста на лёгких интерьерных красках",
    ],
    nextTaskHint: "Планируете механизировать нанесение финишной шпаклёвки? Перейти к РЕЖИМУ 03 (6,5 л/мин)",
    images: [
      { src: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg", label: "Аппарат 3/4" },
      { src: "/assets/machines/nord-4500/NORD-4500-view-front-nord-edit.jpg", label: "Спереди" },
      { src: "/assets/machines/nord-4500/NORD-4500-view-side-nord-edit.jpg", label: "Сбоку" },
    ],
  },
  {
    id: "nord-6000",
    labId: "nord-6000",
    code: "NORD-6000",
    name: "NORD-6000 HeavyDuty",
    tierNum: 3,
    loadBar: "[■■■□□]",
    taskChip: "ШПАКЛЁВКА · 2 ПОСТА",
    taskTitle: "РЕЖИМ 03 // МЕХАНИЗАЦИЯ ШПАКЛЁВКИ И 2 ПОСТА",
    objectScope: "Крупные коммерческие объекты, офисы и школы от 1 500 м²",
    tierColor: "#0095d9",
    badge: "2 КЛАСС · МЕХАНИЗАЦИЯ ШПАКЛЁВКИ И 2 ПОСТА",
    subtitle:
      "Тяжёлая поршневая станция 4 000 Вт (6,5 л/мин) на высокой колёсной тележке для механизированного нанесения готовых финишных шпаклёвок и работы в 2 поста.",
    flow: "6,5 л/мин",
    flowNum: 6.5,
    pressure: "230 бар",
    nozzle: "до 0.041″",
    power: "4 000 Вт",
    weight: "48 кг",
    shiftM2: "до 1 600 м²/смену",
    replacesPainters: "Заменяет бригаду 6–8 чел.",
    postsCount: "2 поста одновременно",
    buyPrice: "95 000 ₽",
    rentPrice: "2 300 ₽/сут",
    materialsList: [
      "Готовые полимерные финишные пасты (Danogips, Sheetrock, Semin)",
      "Стеклохолст и флизелиновые клеи",
      "Высоковязкие фасадные и фактурные составы",
      "Одновременная работа 2 маляров на окраске",
    ],
    strengths: [
      "Уверенно распыляет готовые финишные пасты через сопла 0.035″–0.041″",
      "Синхронная работа 2 малярных постов без пульсации факела и просадки давления",
      "Усиленный поршневой шток из закалённой хромированной стали для абразивных паст",
    ],
    nextTaskHint: "Требуется экстремальное давление 350 бар под огнезащиту и вязкую гидроизоляцию? Перейти к РЕЖИМУ 04 (350 бар)",
    images: [
      { src: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg", label: "Аппарат 3/4" },
      { src: "/assets/machines/nord-6000/NORD-6000-view-side-source.jpg", label: "Сбоку" },
      { src: "/assets/machines/nord-6000/NORD-6000-view-3q-b-source.jpg", label: "Тележка" },
    ],
  },
  {
    id: "nord-8000-pro",
    labId: "nord-8000-pro",
    code: "NORD-8000 PRO",
    name: "NORD-8000 PRO 350 BAR",
    tierNum: 4,
    loadBar: "[■■■■□]",
    taskChip: "ОГНЕЗАЩИТА 350 БАР",
    taskTitle: "РЕЖИМ 04 // ВЫСОКОНАПОРНАЯ ОГНЕЗАЩИТА И ГИДРОИЗОЛЯЦИЯ",
    objectScope: "Мосты, резервуары, металлокаркасы ТЦ, паркинги и цеха от 5 000 м²",
    tierColor: "#2563eb",
    badge: "2 КЛАСС · ОГНЕЗАЩИТА 350 БАР · ВЫСОКОНАПОРНЫЙ",
    subtitle:
      "Сверхмощный высоконапорный аппарат 4 500 Вт с экстремальным давлением 350 бар (7,5 л/мин) для конструктивной огнезащиты, гидроизоляции и эпоксидов со 100% сухим остатком.",
    flow: "7,5 л/мин",
    flowNum: 7.5,
    pressure: "350 бар",
    nozzle: "до 0.045″",
    power: "4 500 Вт",
    weight: "58 кг",
    shiftM2: "до 2 500 м²/смену",
    replacesPainters: "Заменяет 10 специалистов",
    postsCount: "2 поста высокого давления",
    buyPrice: "150 000 ₽",
    rentPrice: "2 700 ₽/сут",
    materialsList: [
      "Конструктивная вспучивающаяся огнезащита металлоконструкций (ОГЗ)",
      "Полиуретановая и битумная гидроизоляция, кровельные мастики",
      "Эпоксидные и цинконаполненные грунты с сухим остатком до 90%",
      "Тяжёлые высоковязкие антикоррозийные системы",
    ],
    strengths: [
      "Экстремальное давление 350 бар продавливает самые густые промышленные составы",
      "Специальная гидравлическая секция высокого давления повышенного ресурса",
      "Трасса подачи до 90 м по высоте без потери распыла на лесах и эстакадах",
    ],
    nextTaskHint: "Нужна непрерывная шнековая подача гипсовых шпаклёвок с бункером? Перейти к РЕЖИМУ 05 (Шнек 18 л/мин)",
    images: [
      { src: "/assets/machines/nord-8000-pro/NORD-8000-view-front-3q-source.jpg", label: "Аппарат 3/4" },
      { src: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg", label: "Сбоку" },
      { src: "/assets/machines/nord-8000-pro/NORD-8000-view-front-source.jpg", label: "Спереди" },
    ],
  },
  {
    id: "nord-18x",
    labId: "nord-18x",
    code: "NORD-18X",
    name: "NORD-18X ScrewMaster",
    tierNum: 5,
    loadBar: "[■■■■■]",
    taskChip: "ШНЕКОВЫЙ 18 Л/МИН",
    taskTitle: "РЕЖИМ 05 // ШНЕКОВАЯ ШПАКЛЁВОЧНАЯ СТАНЦИЯ 18 Л/МИН",
    objectScope: "Многоэтажные жилые комплексы, коммерческие объекты и фасадные объёмы от 10 000 м²",
    tierColor: "#d97706",
    badge: "3 КЛАСС · ШНЕКОВАЯ СТАНЦИЯ 18 Л/МИН С БУНКЕРОМ",
    subtitle:
      "Шнековая (героторная) станция 3 500 Вт с производительностью 18,0 л/мин и приёмным бункером для непрерывного скоростного нанесения гипсовых и полимерных шпаклёвок.",
    flow: "18,0 л/мин",
    flowNum: 18.0,
    pressure: "20–30 бар",
    nozzle: "до 0.055″",
    power: "3 500 Вт",
    weight: "85 кг",
    shiftM2: "до 3 500 м²/смену",
    replacesPainters: "Заменяет 12–14 шпаклёвщиков",
    postsCount: "Шнековый рукав до 40 м",
    buyPrice: "155 000 ₽",
    rentPrice: "2 900 ₽/сут",
    materialsList: [
      "Готовые и сухие гипсовые шпаклёвки механизированного нанесения",
      "Полимерные финишные и выравнивающие составы",
      "Декоративные штукатурки и текстурные пасты",
      "Фасадные армирующие и клеевые смеси",
    ],
    strengths: [
      "Колоссальная производительность 18,0 л/мин для потоковой отделки этажей ЖК",
      "Приёмный бункер с быстрой загрузкой — непрерывный цикл работы бригады",
      "Шнековая героторная пара снижает износ при работе с зернистыми составами",
    ],
    nextTaskHint: "Линейка NORD покрывает 100% задач: от интерьеров Q4 до шнековой отделки ЖК и огнезащиты 350 бар",
    images: [
      { src: "/assets/machines/nord-18x/NORD-18X-view-front-3q-a.jpg", label: "Станция 3/4" },
      { src: "/assets/machines/nord-18x/NORD-18X-view-front.jpg", label: "Спереди" },
      { src: "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg", label: "Бункер" },
    ],
  },
];

export function HeroShowcase() {
  const { mode, addToCart } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAngle, setActiveAngle] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [mobileSpecsOpen, setMobileSpecsOpen] = useState(false);

  const unit = HERO_UNITS[activeIndex] || HERO_UNITS[0];
  const currentPhoto = unit.images[activeAngle] || unit.images[0];

  function handleQuickBuy() {
    addToCart(unit.id, mode === "rent" ? "rent" : "buy");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  function handleNextTierUpsell() {
    const nextIdx = (activeIndex + 1) % HERO_UNITS.length;
    setActiveIndex(nextIdx);
    setActiveAngle(0);
  }

  return (
    <section className="hero-stage">
      {/* Animated Blue High-Pressure Snake Streamlines (NORD 230 BAR Fluid Jet) */}
      <svg
        className="hero-streamlines-svg"
        viewBox="0 0 1440 760"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nordSnakeGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nordSnakeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0095d9" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base guide tracks */}
        <path
          d="M-120 140 C 260 40, 560 260, 960 110 C 1200 20, 1360 160, 1560 90"
          stroke="rgba(125, 211, 252, 0.11)"
          strokeWidth="1.5"
        />
        <path
          d="M-120 420 C 300 540, 680 280, 1060 440 C 1260 520, 1400 380, 1560 410"
          stroke="rgba(125, 211, 252, 0.09)"
          strokeWidth="1.5"
        />
        <path
          d="M-120 670 C 340 580, 740 730, 1140 610 C 1320 555, 1440 640, 1560 590"
          stroke="rgba(125, 211, 252, 0.1)"
          strokeWidth="1.5"
        />

        {/* Animated glowing blue snake streams */}
        <path
          className="hero-snake-path hero-snake-path--1"
          d="M-120 140 C 260 40, 560 260, 960 110 C 1200 20, 1360 160, 1560 90"
          stroke="url(#nordSnakeGrad1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          className="hero-snake-path hero-snake-path--2"
          d="M-120 420 C 300 540, 680 280, 1060 440 C 1260 520, 1400 380, 1560 410"
          stroke="url(#nordSnakeGrad2)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="hero-snake-path hero-snake-path--3"
          d="M-120 670 C 340 580, 740 730, 1140 610 C 1320 555, 1440 640, 1560 590"
          stroke="url(#nordSnakeGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Subtle Industrial Watermark Backdrop */}
      <div className="hero-watermark-bands" aria-hidden="true">
        <div className="watermark-band watermark-band--top">
          <div className="watermark-band-track">
            <span>NORD AIRLESS SYSTEMS // ПОДБОР ПО ЗАДАЧЕ И ВЯЗКОСТИ // 2,5 → 18,0 Л/МИН</span>
            <span>NORD AIRLESS SYSTEMS // ПОДБОР ПО ЗАДАЧЕ И ВЯЗКОСТИ // 2,5 → 18,0 Л/МИН</span>
          </div>
        </div>
        <div className="watermark-band watermark-band--middle">
          <div className="watermark-band-track watermark-band-track--giant">
            <span>NORD</span>
            <i className="wm-capsule" />
            <span>595 PRO</span>
            <i className="wm-capsule" />
            <span>795S</span>
            <i className="wm-capsule" />
            <span>1095 HD</span>
            <i className="wm-capsule" />
            <span>9528X</span>
            <i className="wm-capsule" />
            <span>9536 PRO</span>
          </div>
        </div>
        <div className="watermark-band watermark-band--bottom">
          <div className="watermark-band-track">
            <span>КВАРТИРЫ Q4 · ФАСАДЫ И МЕТАЛЛ · ШПАКЛЁВКА + 2 ПОСТА · МЕХАНИЗАЦИЯ ЖК · ОГНЕЗАЩИТА</span>
            <span>КВАРТИРЫ Q4 · ФАСАДЫ И МЕТАЛЛ · ШПАКЛЁВКА + 2 ПОСТА · МЕХАНИЗАЦИЯ ЖК · ОГНЕЗАЩИТА</span>
          </div>
        </div>
      </div>

      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="container hero-stage-inner">
        {/* Left column: Task-First Engineering Configurator */}
        <div className="hero-stage-left">
          <div className="hero-brand-pill">
            <span className="hero-brand-dot" />
            <span>ОФИЦИАЛЬНЫЙ ИНЖЕНЕРНЫЙ ЦЕНТР NORD · МОСКВА</span>
          </div>

          <h1>
            Окрасочные и шпаклёвочные станции{" "}
            <span>под вашу задачу и состав</span>
          </h1>

          <p className="hero-stage-lead">
            Выберите свой тип работ и материал — от финишной покраски квартир Q4 (<strong>2,5 л/мин</strong>) до механизированной шпаклёвки ЖК и огнезащиты (<strong>18,0 л/мин</strong>). Полный комплект в коробке.
          </p>

          {/* 5-TASK SELECTOR RAIL (METALLURGICAL PROGRESSION) */}
          <div className="hero-tier-rail-label">
            <span className="rail-label-with-glyph">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M2 5V2H5M11 2H14V5M14 11V14H11M5 14H2V11" />
                <line x1="8" y1="5" x2="8" y2="11" />
                <line x1="5" y1="8" x2="11" y2="8" />
              </svg>
              <span>ВЫБЕРИТЕ ЗАДАЧУ НА ОБЪЕКТЕ:</span>
            </span>
            <strong>{unit.taskChip} · {unit.flow}</strong>
          </div>

          <div className="hero-unit-tabs hero-unit-tabs--5tiers" role="tablist" aria-label="Выберите задачу на объекте">
            {HERO_UNITS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={isActive ? "hero-unit-tab is-active" : "hero-unit-tab"}
                  style={{ "--tier-accent": item.tierColor } as React.CSSProperties}
                  onClick={() => {
                    setActiveIndex(idx);
                    setActiveAngle(0);
                  }}
                >
                  <div className="tab-tier-top">
                    <span
                      className="tab-tier-badge"
                      style={{
                        background: item.tierColor,
                        color: "#ffffff",
                        borderColor: item.tierColor,
                      }}
                    >
                      {item.taskChip}
                    </span>
                  </div>

                  <div className="tab-tier-showcase">
                    <div className="tab-tier-thumb">
                      <img
                        src={item.images[0].src}
                        alt={item.code}
                        onError={(e) => {
                          e.currentTarget.src = "/assets/site/nord-station-1095-cutout.png";
                        }}
                      />
                      <span className="tab-tier-flow-pill">{item.flow}</span>
                    </div>
                    <div className="tab-tier-mid-text">
                      <strong className="tab-tier-model">{item.code}</strong>
                      <div className="tab-tier-bottom-meta">
                        <span className="tab-tier-price">{mode === "rent" ? item.rentPrice : item.buyPrice}</span>
                        <span className="tab-tier-nozzle-sub">{item.nozzle.replace("до ", "Ø ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="tab-tier-mini-bar" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((barIdx) => (
                      <i
                        key={barIdx}
                        className={barIdx <= item.tierNum ? "is-lit" : ""}
                        style={barIdx <= item.tierNum ? { background: item.tierColor } : undefined}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hero-stage-actions desktop-only-flex">
            <Link className="button button-white button-lg" href="/catalog">
              Открыть весь каталог (8 станций) &gt;&gt;
            </Link>
            <Link className="button button-outline-light button-lg" href={`/lab?machine=${unit.labId}`}>
              Испытать {unit.code} в 3D-стенде &gt;&gt;
            </Link>
          </div>

          <div className="hero-trust-strip">
            <div className="hero-trust-item">
              <strong>5 рабочих режимов</strong>
              <span>От квартир Q4 до огнезащиты</span>
            </div>
            <div className="hero-trust-item">
              <strong>200 – 350 бар</strong>
              <span>Предпродажная опрессовка на стенде</span>
            </div>
            <div className="hero-trust-item">
              <strong>Пост 100% в сборе</strong>
              <span>Шланг ВД, пистолет, удочка и сопло</span>
            </div>
          </div>
        </div>

        {/* Right column: Flagship Engineering Podium Cockpit */}
        <div className="hero-podium-card">
          {/* Dark Industrial Top Header */}
          <div className="hero-podium-topbar">
            <span className="podium-series-badge" style={{ borderLeft: `3px solid ${unit.tierColor}`, paddingLeft: "8px" }}>
              {unit.badge}
            </span>
            <span className="podium-stock-indicator">
              <i /> В наличии · Москва
            </span>
          </div>

          {/* Blueprint Studio Stage with Live HUD Callouts around the Machine */}
          <div className="hero-podium-stage">
            <div className="podium-blueprint-grid" aria-hidden="true" />
            <div className="podium-radial-spotlight" aria-hidden="true" />

            {/* Floating Engineering HUD Callouts on Podium (1.5px Stroke ISO Glyphs) */}
            <div className="podium-hud-tag podium-hud-tag--tl">
              <span>OUT // ВЫРАБОТКА В СМЕНУ</span>
              <strong className="hud-tag-with-glyph">
                <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="3" width="12" height="12" />
                  <path d="M3 15L15 3" strokeDasharray="2 2" />
                </svg>
                <span>{unit.shiftM2}</span>
              </strong>
            </div>

            <div className="podium-hud-tag podium-hud-tag--tr">
              <span>EFF // ЭФФЕКТИВНОСТЬ ПОСТА</span>
              <strong className="hud-tag-with-glyph">
                <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <line x1="1" y1="9" x2="17" y2="9" />
                  <path d="M5 4C7.5 6.5 10.5 6.5 13 4" />
                  <path d="M5 14C7.5 11.5 10.5 11.5 13 14" />
                </svg>
                <span>{unit.replacesPainters}</span>
              </strong>
            </div>

            <Link href={`/product/${unit.id}`} className="podium-img-link">
              <img
                key={currentPhoto.src}
                className="podium-machine-img"
                src={currentPhoto.src}
                alt={`${unit.name} — ${currentPhoto.label}`}
                onError={(e) => {
                  e.currentTarget.src = "/assets/site/nord-station-1095-cutout.png";
                }}
              />
            </Link>

            {/* Quick Step Prev/Next arrows on mobile podium */}
            <div className="podium-tier-stepper">
              <button
                type="button"
                className="podium-step-btn"
                disabled={activeIndex === 0}
                onClick={() => {
                  setActiveIndex((i) => Math.max(0, i - 1));
                  setActiveAngle(0);
                }}
                aria-label="Предыдущая задача"
              >
                &lt;&lt; Младше
              </button>
              <span className="podium-step-status">
                {unit.taskChip} · {unit.flow}
              </span>
              <button
                type="button"
                className="podium-step-btn podium-step-btn--up"
                disabled={activeIndex === HERO_UNITS.length - 1}
                onClick={() => {
                  setActiveIndex((i) => Math.min(HERO_UNITS.length - 1, i + 1));
                  setActiveAngle(0);
                }}
                aria-label="Следующая задача"
              >
                Мощнее &gt;&gt;
              </button>
            </div>

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

          {/* Center & Bottom Cockpit Info (Task & Material First) */}
          <div className="hero-podium-info">
            {/* 1. Task Specialization + Model Title + Instant Price Box */}
            <div className="podium-cockpit-head">
              <div className="podium-cockpit-title">
                <span className="podium-tier-pill" style={{ background: unit.tierColor }}>
                  {unit.loadBar} {unit.taskTitle}
                </span>
                <h3>
                  <Link href={`/product/${unit.id}`}>Станция {unit.name}</Link>
                </h3>
              </div>
              <div className="podium-cockpit-price">
                <span>{mode === "rent" ? "АРЕНДА В СУТКИ" : "ЦЕНА С НДС"}</span>
                <strong>{mode === "rent" ? unit.rentPrice : unit.buyPrice}</strong>
              </div>
            </div>

            <p className="podium-cockpit-desc">{unit.subtitle}</p>

            {/* Mobile-only compact toggle button for materials passport */}
            <button
              type="button"
              className="mobile-passport-toggle"
              aria-expanded={mobileSpecsOpen}
              onClick={() => setMobileSpecsOpen((prev) => !prev)}
            >
              <span>
                {mobileSpecsOpen ? "[ − ] СКРЫТЬ РАБОЧИЕ СОСТАВЫ" : `[ + ] РАБОЧИЕ СОСТАВЫ И ОБЪЕКТЫ (${unit.materialsList.length})`}
              </span>
              <strong>{unit.postsCount}</strong>
            </button>
            {/* 2. Concrete Working Materials & Target Object Passport (Dark-Cobalt Industrial Card) */}
            <div className={`podium-task-passport${mobileSpecsOpen ? " is-mobile-open" : ""}`}>
              <div className="podium-task-passport-top">
                <span>РАБОЧИЕ СОСТАВЫ И МАТЕРИАЛЫ:</span>
                <strong>{unit.postsCount}</strong>
              </div>
              <div className="podium-materials-grid">
                {unit.materialsList.map((mat) => (
                  <div key={mat} className="podium-mat-chip">
                    <i className="mat-square-dot" />
                    <span>{mat}</span>
                  </div>
                ))}
              </div>
              <div className="podium-object-scope">
                <span className="scope-label-with-glyph">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <line x1="1" y1="8" x2="15" y2="8" />
                    <path d="M8 8L4 14H12L8 8Z" />
                  </svg>
                  <span>OBJ // Оптимальные объекты:</span>
                </span>
                <strong>{unit.objectScope}</strong>
              </div>
            </div>

            {/* 3. 4 High-Contrast Engineering Telemetry Capsules (1.5px Stroke ISO Glyphs) */}
            <div className="podium-spec-capsules">
              <div className="spec-capsule">
                <span className="capsule-glyph-head">
                  <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="4" y="4" width="10" height="10" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="14" y1="9" x2="17" y2="9" />
                    <path d="M7 11V7L11 11V7" />
                  </svg>
                  <span>DRV // ПРИВОД</span>
                </span>
                <strong>{unit.power}</strong>
              </div>
              <div className="spec-capsule">
                <span className="capsule-glyph-head">
                  <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <line x1="1" y1="9" x2="17" y2="9" />
                    <path d="M5 4C7.5 6.5 10.5 6.5 13 4" />
                    <path d="M5 14C7.5 11.5 10.5 11.5 13 14" />
                  </svg>
                  <span>Q // ПОДАЧА</span>
                </span>
                <strong>{unit.flow}</strong>
              </div>
              <div className="spec-capsule">
                <span className="capsule-glyph-head">
                  <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M2 7H5V11H2V7Z" />
                    <path d="M5 9L15 3V15L5 9Z" />
                    <line x1="11" y1="5.5" x2="11" y2="12.5" strokeDasharray="1.5 1.5" />
                  </svg>
                  <span>Ø // МАКС. СОПЛО</span>
                </span>
                <strong>{unit.nozzle}</strong>
              </div>
              <div className="spec-capsule">
                <span className="capsule-glyph-head">
                  <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M3.5 13.5A7 7 0 1 1 14.5 13.5" />
                    <line x1="9" y1="10" x2="13.5" y2="5.5" />
                    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  </svg>
                  <span>P // ДАВЛЕНИЕ</span>
                </span>
                <strong>{unit.pressure}</strong>
              </div>
            </div>

            {/* 4. 1-Click Task Progression Upsell Bar */}
            <div className="podium-upsell-wrap">
              {activeIndex < HERO_UNITS.length - 1 ? (
                <button
                  type="button"
                  className="podium-upsell-bar"
                  onClick={handleNextTierUpsell}
                >
                  <span>{unit.nextTaskHint} &gt;&gt;</span>
                </button>
              ) : (
                <div className="podium-upsell-bar podium-upsell-bar--max">
                  <span>{unit.nextTaskHint}</span>
                </div>
              )}
            </div>

            {/* 5. High-Conversion Action Bar */}
            <div className="podium-action-bar">
              <button
                type="button"
                className="button button-primary podium-btn-buy"
                onClick={handleQuickBuy}
              >
                {justAdded
                  ? "Добавлено в заявку"
                  : mode === "rent"
                  ? `В аренду · ${unit.rentPrice} >>`
                  : `В корзину с НДС · ${unit.buyPrice} >>`}
              </button>
              <Link className="button button-secondary podium-btn-lab" href={`/lab?machine=${unit.labId}`}>
                3D-тест на стене &gt;&gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}