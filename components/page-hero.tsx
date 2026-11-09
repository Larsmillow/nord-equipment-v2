import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { MESSENGERS } from "@/components/messenger-links";

export function PageHero({
  title,
  description,
  eyebrow,
  theme = "corporate",
}: {
  title: string;
  description: string;
  eyebrow: string;
  theme?: "corporate" | "spray" | "rent" | "nozzle";
}) {
  const cleanEyebrow = eyebrow.replace(/\s*\/\/\s*/g, " · ");

  const telemetryItems =
    theme === "spray"
      ? [
          { label: "ДИАПАЗОН ПОДАЧИ", value: "2,5 – 50 л/мин" },
          { label: "РАБОЧЕЕ ДАВЛЕНИЕ", value: "200 – 350 бар" },
          { label: "КОМПЛЕКТАЦИЯ", value: "Пост 100% в сборе" },
        ]
      : theme === "rent"
        ? [
            { label: "СТАВКА ПРОКАТА", value: "от 1 500 ₽ / сут" },
            { label: "СРОК АРЕНДЫ", value: "от 1 суток" },
            { label: "ПРОВЕРКА ПОСТА", value: "Стенд 230 бар" },
          ]
        : theme === "nozzle"
          ? [
              { label: "КОНТРОЛЬ ПЕРЕД ВЫДАЧЕЙ", value: "Опрессовка 230 бар" },
              { label: "ГАРАНТИЯ И СЕРВИС", value: "До 24 месяцев" },
              { label: "СКЛАД И ЗИП", value: "Москва, ВАО" },
            ]
          : [
              { label: "СКЛАД И СТЕНД", value: "Москва, ВАО" },
              { label: "РЕЖИМ РАБОТЫ", value: SITE_CONFIG.workHours },
              { label: "ОТГРУЗКА / СЧЁТ", value: "В день обращения" },
            ];

  return (
    <section className={`page-hero page-hero--${theme} is-visible`}>
      {/* Architectural Cobalt-Blue Backdrop with Animated High-Pressure Snake */}
      <div className="page-hero-bg" aria-hidden="true">
        <div className="page-hero-watermark">NORD AIRLESS ENGINEERING · 230–350 BAR</div>
        <svg
          className="page-hero-lines"
          viewBox="0 0 1440 320"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pageHeroSnake1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#60a5fa" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-80 78 C 340 20, 680 150, 1080 54 C 1280 10, 1420 80, 1540 42"
            stroke="rgba(125, 211, 252, 0.14)"
            strokeWidth="1.5"
          />
          <path
            className="hero-snake-path hero-snake-path--1"
            d="M-80 78 C 340 20, 680 150, 1080 54 C 1280 10, 1420 80, 1540 42"
            stroke="url(#pageHeroSnake1)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M-80 235 C 400 280, 780 140, 1180 225 C 1340 255, 1450 195, 1540 210"
            stroke="rgba(125, 211, 252, 0.12)"
            strokeWidth="1.5"
          />
          <path
            className="hero-snake-path hero-snake-path--2"
            d="M-80 235 C 400 280, 780 140, 1180 225 C 1340 255, 1450 195, 1540 210"
            stroke="url(#pageHeroSnake1)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="container page-hero-grid">
        <div className="page-hero-main">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true"> / </span>
            <span>{cleanEyebrow}</span>
          </nav>

          <div className="page-hero-badge">
            <span className="page-hero-dot" />
            <span>{cleanEyebrow}</span>
          </div>

          <h1>{title}</h1>
          <p className="lead">{description}</p>
        </div>

        {/* Right-hand Engineering Telemetry & Direct Contact Console */}
        <aside className="page-hero-console" aria-label="Инженерная сводка">
          <div className="page-hero-console-top">
            <span className="console-status">
              <i /> СКЛАД И СТЕНД В МОСКВЕ
            </span>
            <span className="console-code">NORD ENGINEERING</span>
          </div>

          <div className="page-hero-telemetry">
            {telemetryItems.map((item) => (
              <div key={item.label} className="page-hero-stat">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="page-hero-console-actions">
            <a className="console-phone-btn" href={SITE_CONFIG.phoneHref}>
              <span>Прямая линия инженера:</span>
              <strong>{SITE_CONFIG.phone}</strong>
            </a>
            <div className="console-messengers">
              {MESSENGERS.map(({ key, label, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="console-msg-pill"
                  title={label}
                >
                  <Icon />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
