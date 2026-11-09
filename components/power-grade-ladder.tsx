"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store-context";

interface PowerTier {
  level: number;
  taskBadge: string;
  loadBar: string;
  shortTab: string;
  title: string;
  tagline: string;
  accent: string;
  flowRange: string;
  powerRange: string;
  maxNozzle: string;
  shiftOutput: string;
  posts: string;
  flagshipId: string;
  labId: string;
  flagshipName: string;
  secondaryName?: string;
  secondaryId?: string;
  image: string;
  buyFrom: string;
  rentFrom: string;
  materialsList: string[];
  summary: string;
}

const POWER_TIERS: PowerTier[] = [
  {
    level: 1,
    taskBadge: "РЕЖИМ 01 // ИНТЕРЬЕР Q4",
    loadBar: "[■□□□□]",
    shortTab: "Интерьер Q4",
    title: "Интерьерная окраска и финиш Q4",
    tagline: "Квартиры, коттеджи и коммерческие офисы до 500 м² (вес 15 кг)",
    accent: "#94A3B8",
    flowRange: "2,5 л/мин",
    powerRange: "1 600 Вт · 230 бар",
    maxNozzle: "до 0.023″",
    shiftOutput: "до 400 м² / 8ч",
    posts: "1 малярный пост · 15 кг",
    flagshipId: "nord-2500",
    labId: "nord-2500",
    flagshipName: "NORD-2500 SmartControl",
    secondaryName: "NORD-3300 (3,3 л/мин)",
    secondaryId: "nord-3300",
    image: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
    buyFrom: "35 000 ₽",
    rentFrom: "1 500 ₽/сут",
    materialsList: [
      "Водоэмульсионные, латексные и акриловые краски",
      "Грунты глубокого проникновения, пропитки и лаки",
      "Интерьерные эмали с зеркалом под Q4",
    ],
    summary: "Лёгкий мобильный бесщёточный пост от розетки 220В. Транспортировка в багажнике любого авто.",
  },
  {
    level: 2,
    taskBadge: "РЕЖИМ 02 // СКОРОСТЬ И ФАСАДЫ",
    loadBar: "[■■□□□]",
    shortTab: "Фасады · Металл",
    title: "Фасады, паркинги и металлоконструкции",
    tagline: "Объекты 500–2 500 м², ТРЦ, склады, цеха и работа с лесов",
    accent: "#38BDF8",
    flowRange: "3,3 – 4,2 л/мин",
    powerRange: "2 200 – 3 000 Вт · 230 бар",
    maxNozzle: "до 0.033″",
    shiftOutput: "до 900 м² / 8ч",
    posts: "1–2 поста (до 60 м)",
    flagshipId: "nord-4500",
    labId: "nord-4500",
    flagshipName: "NORD-4500 HighFlow",
    secondaryName: "NORD-3300 (3,3 л/мин)",
    secondaryId: "nord-3300",
    image: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
    buyFrom: "45 000 ₽",
    rentFrom: "1 700 ₽/сут",
    materialsList: [
      "Плотные фасадные, силиконовые и силикатные краски",
      "Эпоксидные и полиуретановые эмали по металлу и бетону",
      "Грунт-эмали 3-в-1 и антикоррозийная защита (АКЗ)",
    ],
    summary: "Бесщёточный двигатель 3,0 кВт на мобильной раме держит 230 бар на длинных магистралях до 60 м.",
  },
  {
    level: 3,
    taskBadge: "РЕЖИМ 03 // ШПАКЛЁВКА + 2 ПОСТА",
    loadBar: "[■■■□□]",
    shortTab: "Шпаклёвка + 2 поста",
    title: "Финишная шпаклёвка и окраска в 2 поста",
    tagline: "Базовый промышленный универсал на объектах 1 000–5 000 м²",
    accent: "#0095D9",
    flowRange: "6,5 л/мин",
    powerRange: "4 000 Вт · 230 бар",
    maxNozzle: "до 0.041″",
    shiftOutput: "до 1 600 м² / 8ч",
    posts: "2 полноценных поста",
    flagshipId: "nord-6000",
    labId: "nord-6000",
    flagshipName: "NORD-6000 HeavyDuty",
    secondaryName: "NORD-9200 (9,2 л/мин)",
    secondaryId: "nord-9200",
    image: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
    buyFrom: "95 000 ₽",
    rentFrom: "2 300 ₽/сут",
    materialsList: [
      "Готовые полимерные шпаклёвки (Danogips, Sheetrock, Semin)",
      "Клеи для стеклохолста и малярного флизелина",
      "Любые краски одновременно на 2 малярных поста",
    ],
    summary: "Одна станция закрывает сразу два технологических этапа: шпаклёвку под шпатель 60 см и скоростную окраску.",
  },
  {
    level: 4,
    taskBadge: "РЕЖИМ 04 // ОГНЕЗАЩИТА 350 БАР",
    loadBar: "[■■■■□]",
    shortTab: "Огнезащита 350 бар",
    title: "Высоконапорная огнезащита (ОГЗ) и гидроизоляция",
    tagline: "Мосты, резервуары, металлокаркасы ТЦ и спецобъекты от 3 000 м²",
    accent: "#2563EB",
    flowRange: "7,5 – 10,0 л/мин",
    powerRange: "4 500 – 5 000 Вт · 350 бар",
    maxNozzle: "до 0.045″",
    shiftOutput: "до 2 500 м² / 8ч",
    posts: "2 поста высокого давления",
    flagshipId: "nord-8000-pro",
    labId: "nord-8000-pro",
    flagshipName: "NORD-8000 PRO (350 бар)",
    secondaryName: "NORD-9900 (10,0 л/мин)",
    secondaryId: "nord-9900",
    image: "/assets/machines/nord-8000-pro/NORD-8000-view-front-3q-source.jpg",
    buyFrom: "150 000 ₽",
    rentFrom: "2 700 ₽/сут",
    materialsList: [
      "Конструктивная огнезащита (ОГЗ) и вспучивающиеся составы",
      "Тяжёлая гидроизоляция и мастики высокой вязкости",
      "Эпоксидные и цинконаполненные грунты с сухим остатком до 90%",
    ],
    summary: "Высоконапорная секция 350 бар продавливает экстремально густые составы без просадки факела.",
  },
  {
    level: 5,
    taskBadge: "РЕЖИМ 05 // ШНЕКОВЫЙ 18 Л/МИН",
    loadBar: "[■■■■■]",
    shortTab: "Шнек 18 л/мин",
    title: "Шнековая шпаклёвочная станция 18 л/мин с бункером",
    tagline: "Многоэтажные ЖК, фасадные объёмы и скоростная отделка от 10 000 м²",
    accent: "#E07A22",
    flowRange: "18,0 л/мин",
    powerRange: "3 500 Вт · 20–30 бар",
    maxNozzle: "до 0.055″",
    shiftOutput: "до 3 500 м² / 8ч",
    posts: "Шнековый рукав до 40 м",
    flagshipId: "nord-18x",
    labId: "nord-18x",
    flagshipName: "NORD-18X ScrewMaster",
    secondaryName: "NORD-9200 Поршень (9,2 л/м)",
    secondaryId: "nord-9200",
    image: "/assets/machines/nord-18x/NORD-18X-view-front-3q-a.jpg",
    buyFrom: "155 000 ₽",
    rentFrom: "2 900 ₽/сут",
    materialsList: [
      "Гипсовые и полимерные шпаклёвки непрерывной машинной подачи",
      "Декоративные штукатурки и текстурные пасты",
      "Фасадные армирующие и клеевые смеси",
    ],
    summary: "Непрерывная подача 18 л/мин с приёмным бункером для потоковой отделки этажей крупных ЖК.",
  },
];

export function PowerGradeLadder() {
  const { mode } = useStore();
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  return (
    <section className="section section-power-ladder" id="power-grades">
      <div className="container">
        <div className="ladder-hero-banner">
          <div className="ladder-hero-top">
            <div className="ladder-hero-title-col">
              <div className="ladder-kicker-row">
                <span className="ladder-kicker-badge">КЛАССИФИКАЦИЯ ОБОРУДОВАНИЯ ПО РЕГЛАМЕНТУ</span>
                <span className="ladder-kicker-tag">5 РЕЖИМОВ НАГРУЖЕНИЯ</span>
              </div>
              <h2>Подберите станцию NORD под технологическую задачу: от квартир Q4 до огнезащиты</h2>
              <p className="ladder-head-note">
                Аппараты сгруппированы по типу распыляемого материала и объёму объекта — со строгим ростом гидравлической подачи насоса от 2,5 до 18,0 л/мин.
              </p>
            </div>

            {/* Interactive 5-Task Visual Trajectory Scale */}
            <div className="ladder-trajectory-box">
              <div className="ladder-trajectory-head">
                <span>SYS // ВЫБОР РЕЖИМА ДЛЯ ФИЛЬТРАЦИИ:</span>
                <strong>{selectedLevel === 0 ? "Все классы" : `Класс 0${selectedLevel} активен`}</strong>
              </div>
              <div className="ladder-trajectory-steps">
                {POWER_TIERS.map((t) => {
                  const isActive = selectedLevel === t.level;
                  return (
                    <button
                      key={t.level}
                      type="button"
                      onClick={() => setSelectedLevel(isActive ? 0 : t.level)}
                      className={isActive ? "trajectory-step is-active" : "trajectory-step"}
                      style={{ "--step-color": t.accent } as React.CSSProperties}
                    >
                      <span className="trajectory-step-lvl" style={{ background: t.accent }}>
                        {t.loadBar}
                      </span>
                      <strong className="trajectory-step-flow">{t.flowRange}</strong>
                      <span className="trajectory-step-role">{t.shortTab}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile quick filter pills by Concrete Task */}
        <div className="ladder-mobile-filter">
          <button
            type="button"
            className={selectedLevel === 0 ? "ladder-m-pill is-active" : "ladder-m-pill"}
            onClick={() => setSelectedLevel(0)}
          >
            Все 5 режимов
          </button>
          {POWER_TIERS.map((t) => (
            <button
              key={t.level}
              type="button"
              className={selectedLevel === t.level ? "ladder-m-pill is-active" : "ladder-m-pill"}
              onClick={() => setSelectedLevel(t.level)}
            >
              {t.shortTab} · {t.flowRange}
            </button>
          ))}
        </div>

        <div className="power-ladder-grid">
          {POWER_TIERS.filter((t) => selectedLevel === 0 || t.level === selectedLevel).map((tier) => {
            const barWidthPercent = tier.level * 20;
            return (
              <article
                key={tier.level}
                className={`power-tier-card power-tier-card--lvl${tier.level}`}
                style={{ "--tier-accent": tier.accent } as React.CSSProperties}
              >
                <div className="power-tier-topbar">
                  <span className="power-tier-badge" style={{ background: tier.accent }}>
                    {tier.taskBadge}
                  </span>
                  <span className="power-tier-shift">{tier.shiftOutput}</span>
                </div>

                <div className="power-tier-main">
                  <div className="power-tier-visual">
                    <span className="power-tier-corner-num" style={{ borderColor: tier.accent, color: tier.accent }}>
                      {tier.flowRange}
                    </span>
                    <Link href={`/product/${tier.flagshipId}`}>
                      <img
                        src={tier.image}
                        alt={tier.flagshipName}
                        onError={(e) => {
                          e.currentTarget.src = "/assets/site/nord-station-1095-cutout.png";
                        }}
                      />
                    </Link>
                  </div>

                  <div className="power-tier-content">
                    <div className="power-tier-head">
                      <h3>{tier.title}</h3>
                      <p>{tier.tagline}</p>
                    </div>

                    {/* Power Growth Bar */}
                    <div className="power-tier-meter">
                      <div className="power-tier-meter-labels">
                        <span>Подача Q: <strong>{tier.flowRange}</strong></span>
                        <span>Сопло Ø: <strong>{tier.maxNozzle}</strong></span>
                      </div>
                      <div className="power-tier-meter-track">
                        <div
                          className="power-tier-meter-fill"
                          style={{ width: `${barWidthPercent}%`, background: tier.accent }}
                        />
                      </div>
                    </div>

                    {/* Concrete Materials List */}
                    <div className="power-tier-mat-list">
                      {tier.materialsList.map((mat) => (
                        <div key={mat} className="power-tier-mat-row">
                          <span className="mat-marker" style={{ background: tier.accent }} />
                          <span>{mat}</span>
                        </div>
                      ))}
                    </div>

                    <p className="power-tier-summary">{tier.summary}</p>
                  </div>
                </div>

                <div className="power-tier-footer">
                  <div className="power-tier-models">
                    <span>Базовая станция под регламент:</span>
                    <Link href={`/product/${tier.flagshipId}`} className="power-tier-model-link">
                      {tier.flagshipName} &gt;&gt;
                    </Link>
                    {tier.secondaryName && tier.secondaryId ? (
                      <Link href={`/product/${tier.secondaryId}`} className="power-tier-submodel">
                        + {tier.secondaryName}
                      </Link>
                    ) : null}
                  </div>

                  <div className="power-tier-cta-row">
                    <div className="power-tier-price">
                      <span>{mode === "rent" ? "Аренда от" : "С НДС от"}</span>
                      <strong>{mode === "rent" ? tier.rentFrom : tier.buyFrom}</strong>
                    </div>
                    <div className="power-tier-buttons">
                      <Link
                        href={`/lab?machine=${tier.labId}`}
                        className="button button-secondary power-tier-btn-lab"
                        title="Испытать в 3D-стенде"
                      >
                        Тест 3D
                      </Link>
                      <Link
                        href={`/product/${tier.flagshipId}`}
                        className="button button-primary power-tier-btn-open"
                      >
                        Техпаспорт &gt;&gt;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}