"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ACCESSORIES_AND_SPARES,
  SPARE_SUB_TABS,
  type SpareSubCategory,
} from "@/lib/spares-catalog";
import {
  AVITO_URL,
  COMPANY,
  KIT_ITEMS,
  MANAGER_USERNAME,
  STATIONS,
  TASKS,
  formatRub,
  matchStation,
  type ShowStation,
  type TaskId,
} from "./data";

/* ================================================================== */
/*  Telegram WebApp bridge (работает и в обычном браузере)             */
/* ================================================================== */

type TgWebApp = {
  ready: () => void;
  expand: () => void;
  initDataUnsafe?: { user?: { first_name?: string; last_name?: string; username?: string }; start_param?: string };
  setHeaderColor?: (c: string) => void;
  setBackgroundColor?: (c: string) => void;
  setBottomBarColor?: (c: string) => void;
  disableVerticalSwipes?: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  HapticFeedback?: {
    impactOccurred: (s: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (s: "success" | "error" | "warning") => void;
    selectionChanged: () => void;
  };
  BackButton?: { show: () => void; hide: () => void; onClick: (f: () => void) => void; offClick: (f: () => void) => void };
  isVersionAtLeast?: (v: string) => boolean;
};

function tg(): TgWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
}

const haptic = {
  tap: () => tg()?.HapticFeedback?.impactOccurred("light"),
  select: () => tg()?.HapticFeedback?.selectionChanged(),
  success: () => tg()?.HapticFeedback?.notificationOccurred("success"),
  heavy: () => tg()?.HapticFeedback?.impactOccurred("medium"),
};

function openTg(url: string) {
  const w = tg();
  if (w?.openTelegramLink && url.startsWith("https://t.me/")) w.openTelegramLink(url);
  else window.open(url, "_blank", "noopener");
}

function openExternal(url: string) {
  const w = tg();
  if (w?.openLink) w.openLink(url);
  else window.open(url, "_blank", "noopener");
}

/* ================================================================== */
/*  Icons — единый монохромный набор, stroke 1.75                      */
/* ================================================================== */

type IconName =
  | "grid" | "spark" | "doc" | "shield" | "plus" | "minus" | "check" | "close" | "share" | "search"
  | "chevron" | "arrow" | "paint" | "putty" | "fire" | "drop" | "texture" | "road" | "star" | "box"
  | "gauge" | "chat" | "phone" | "pin" | "clock" | "trash" | "bolt" | "truck" | "receipt";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const p: Record<IconName, ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></>,
    spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8.5 13.2 10.8 15.5 12 13.2 13.2 12 15.5 10.8 13.2 8.5 12 10.8 10.8Z" /></>,
    doc: <><path d="M7 3.5h7l4.5 4.5v12.5H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5Z" /><path d="M14 3.5V8h4.5M9 12.5h6M9 16h4" /></>,
    shield: <><path d="M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6Z" /><path d="m9 12 2 2 4-4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    share: <><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8" /><path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    paint: <><rect x="4" y="3.5" width="13" height="6" rx="1.5" /><path d="M17 6.5h2.5v5H11V14" /><rect x="9.5" y="14" width="3" height="6.5" rx="1" /></>,
    putty: <><path d="M4 16.5 14.5 6a2.1 2.1 0 0 1 3 3L7 19.5H4Z" /><path d="M12.5 8 16 11.5" /></>,
    fire: <path d="M12 3.5c.5 3-3.5 5-3.5 9a3.5 3.5 0 0 0 7 0c0-1.5-.7-2.6-1.5-3.5 2.6.8 4.5 3.4 4.5 6.2A6.5 6.5 0 0 1 12 21.5a6.5 6.5 0 0 1-6.5-6.3C5.5 9.5 11 8 12 3.5Z" />,
    drop: <path d="M12 3.5s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />,
    texture: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M3.5 9.5c3 1.5 5-1.5 8.5 0s5.5-1.5 8.5 0M3.5 15c3 1.5 5-1.5 8.5 0s5.5-1.5 8.5 0" /></>,
    road: <><path d="M8 3.5 4.5 20.5M16 3.5l3.5 17" /><path d="M12 4.5v3M12 10.5v3M12 16.5v3" /></>,
    star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8Z" />,
    box: <><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
    gauge: <><path d="M4.5 16.5a8 8 0 1 1 15 0" /><path d="m12 13 3.5-4" /><circle cx="12" cy="13.5" r="1.2" /></>,
    chat: <path d="M4.5 18.5V6A2.5 2.5 0 0 1 7 3.5h10A2.5 2.5 0 0 1 19.5 6v7.5A2.5 2.5 0 0 1 17 16H8Z" />,
    phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />,
    pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
    trash: <><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" /></>,
    bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6Z" />,
    truck: <><path d="M3.5 6.5h10v10h-10ZM13.5 10h4l3 3.5v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
    receipt: <><path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2Z" /><path d="M9 8.5h6M9 12h6" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name]}
    </svg>
  );
}

const TASK_ICON: Record<TaskId, IconName> = {
  paint: "paint", putty: "putty", fire: "fire", waterproof: "drop", texture: "texture", spares: "box",
};

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function SImg({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className?: string }) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      decoding="async"
      draggable={false}
      onError={(e) => {
        if (e.currentTarget.src.indexOf(fallback) === -1) e.currentTarget.src = fallback;
      }}
    />
  );
}

function useTween(target: number, ms = 480) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const f = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const cur = f + (target - f) * e;
      from.current = cur;
      setValue(cur);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

function Money({ value, suffix }: { value: number | null; suffix?: string }) {
  const v = useTween(value ?? 0);
  if (value === null) return <span>По запросу</span>;
  return (
    <span className="nx-money">
      {new Intl.NumberFormat("ru-RU").format(Math.round(v))}
      <span className="nx-money-cur"> ₽{suffix ?? ""}</span>
    </span>
  );
}

type Mode = "buy" | "rent";
type CartItem = { id: string; mode: Mode; days: number };
type Tab = "home" | "match" | "cart" | "about";

const byId = new Map(STATIONS.map((s) => [s.id, s]));
const bySlug = new Map(STATIONS.map((s) => [s.slug, s]));

function itemPrice(s: ShowStation, mode: Mode, days: number): number | null {
  if (mode === "rent") return s.rentDaily === null ? null : s.rentDaily * days;
  return s.price;
}

function shareStation(s: ShowStation, mode: Mode) {
  const appLink = process.env.NEXT_PUBLIC_TG_APP_LINK;
  const url = appLink ? `${appLink}?startapp=${s.slug}` : `${window.location.origin}/tg?p=${s.slug}`;
  const price = mode === "rent" && s.rentDaily ? `аренда от ${formatRub(s.rentDaily)}/сутки` : formatRub(s.price);
  const text = `${s.model} — ${s.tagline}. ${price}`;
  haptic.tap();
  if (tg()) {
    openTg(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  } else if (navigator.share) {
    navigator.share({ title: s.model, text, url }).catch(() => undefined);
  } else {
    navigator.clipboard?.writeText(`${text}\n${url}`).catch(() => undefined);
  }
}

/* ================================================================== */
/*  Фирменный логотип NORD с обводкой точно как на основном сайте      */
/* ================================================================== */

function NordBrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`nx-site-brand${compact ? " nx-site-brand--sm" : ""}`}>
      <svg className="nx-brand-frame-svg" viewBox="0 0 168 54" fill="none" aria-hidden="true">
        <rect className="nx-brand-frame-track" x="2" y="2" width="164" height="50" rx="14" ry="14" />
        <rect className="nx-brand-frame-draw" x="2" y="2" width="164" height="50" rx="14" ry="14" pathLength="100" />
        <rect className="nx-brand-frame-accent" x="2" y="2" width="164" height="50" rx="14" ry="14" pathLength="100" />
      </svg>
      <img className="nx-brand-logo-img" src="/assets/products/logo.png" alt="NORD" />
    </span>
  );
}

/* ================================================================== */
/*  Интерактивный синий инженерный фон с периферийными якорями доверия */
/* ================================================================== */

const PERIPHERAL_SETS: {
  top: string;
  giant: string[];
  bottom: string;
  pulse: string;
}[] = [
  {
    top: "ПОСТ 100% В СБОРЕ · ОПРЕССОВКА НА СТЕНДЕ ПЕРЕД ОТГРУЗКОЙ · БЕЗ ПРОСТОЯ БРИГАДЫ · СДАЧА ОБЪЕКТА В СРОК",
    giant: ["NORD", "2500", "3300", "4500", "6000", "8000 PRO", "18X"],
    bottom: "РОВНЫЙ ФАКЕЛ Q4 БЕЗ ПОЛОС · СКЛАД МОСКВА · СЧЁТ С НДС · 8 СТАНЦИЙ В НАЛИЧИИ · ДО 350 БАР",
    pulse: "ОПРЕССОВКА КАЖДОГО ПОСТА",
  },
  {
    top: "ВЫРАБОТКА ДО 3 000 М² В СМЕНУ · СТАБИЛЬНОЕ ДАВЛЕНИЕ 230–350 БАР · ГОТОВ К РАБОТЕ ИЗ КОРОБКИ",
    giant: ["230 БАР", "Q4 ФИНИШ", "2 ПОСТА", "ШПАКЛЁВКА", "350 БАР", "NORD"],
    bottom: "НИ ОДНОГО НЕДОВОЛЬНОГО КЛИЕНТА · ПОКУПКА И АРЕНДА · ПОДБОР ПОД ВАШ МАТЕРИАЛ И ОБЪЁМ",
    pulse: "ПОСТ ПОЛНОСТЬЮ В СБОРЕ",
  },
  {
    top: "ИНЖЕНЕРНЫЙ КОНТРОЛЬ · НАДЁЖНЫЙ БЕСЩЁТОЧНЫЙ ПОРШНЕВОЙ ПРИВОД · ДЛЯ ПОДРЯДЧИКОВ И БРИГАД",
    giant: ["NORD", "2,5 Л/М", "4,2 Л/М", "6,5 Л/М", "9,0 Л/М", "18,0 Л/М"],
    bottom: "КВАРТИРЫ Q4 · ФАСАДЫ И МЕТАЛЛ · МЕХАНИЗАЦИЯ ЖК · ОГНЕЗАЩИТА · ГИДРОИЗОЛЯЦИЯ · СКЛАД ЗИП",
    pulse: "СКЛАД В МОСКВЕ · СЧЁТ С НДС",
  },
];

function BlueKineticBackdrop({ variant = "hero", activeIdx = 0 }: { variant?: "hero" | "feature"; activeIdx?: number }) {
  const [setIndex, setSetIndex] = useState(0);

  useEffect(() => {
    setSetIndex((prev) => (prev + 1) % PERIPHERAL_SETS.length);
  }, [activeIdx]);

  useEffect(() => {
    const t = setInterval(() => {
      setSetIndex((prev) => (prev + Math.floor(Math.random() * (PERIPHERAL_SETS.length - 1)) + 1) % PERIPHERAL_SETS.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  const current = PERIPHERAL_SETS[setIndex];

  return (
    <div className={`nx-blue-bg nx-blue-bg--${variant}`} aria-hidden="true">
      <svg className="nx-streamlines-svg" viewBox="0 0 800 560" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`nxJetGradA-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#93c5fd" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-80 42 C 160 12, 360 74, 580 34 C 700 14, 780 52, 880 28"
          stroke="rgba(125, 211, 252, 0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M-80 340 C 180 410, 420 260, 640 360 C 740 400, 810 330, 880 350"
          stroke="rgba(125, 211, 252, 0.1)"
          strokeWidth="1.5"
        />
        <path
          className="nx-jet-path nx-jet-path--1"
          d="M-80 42 C 160 12, 360 74, 580 34 C 700 14, 780 52, 880 28"
          stroke={`url(#nxJetGradA-${variant})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="nx-jet-path nx-jet-path--2"
          d="M-80 340 C 180 410, 420 260, 640 360 C 740 400, 810 330, 880 350"
          stroke={`url(#nxJetGradA-${variant})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="nx-wm-bands" key={setIndex}>
        <div className="nx-wm-band nx-wm-band--top">
          <div className="nx-wm-track">
            <span>{current.top}</span>
            <span>{current.top}</span>
          </div>
        </div>

        <div className="nx-wm-band nx-wm-band--giant">
          <div className="nx-wm-track nx-wm-track--giant">
            {[...current.giant, ...current.giant].map((word, idx) => (
              <span className="nx-wm-giant-item" key={`${word}-${idx}`}>
                <span>{word}</span>
                <i className="nx-wm-capsule" />
              </span>
            ))}
          </div>
        </div>

        <div className="nx-wm-band nx-wm-band--bottom">
          <div className="nx-wm-track nx-wm-track--rev">
            <span>{current.bottom}</span>
            <span>{current.bottom}</span>
          </div>
        </div>
      </div>

      <div className="nx-blue-ambient" />
    </div>
  );
}

/* ================================================================== */
/*  Hero — живая сцена с параллаксом от наклона телефона               */
/* ================================================================== */

const HERO_SET = [
  { id: "nord-18x", cutout: "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg" },
  { id: "nord-8000-pro", cutout: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg" },
  { id: "nord-6000", cutout: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg" },
  { id: "nord-2500", cutout: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg" },
];

function HeroStage({ mode, onOpen }: { mode: Mode; onOpen: (id: string) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SET.length), 4200);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--tx", cx.toFixed(3));
      el.style.setProperty("--ty", cy.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    window.addEventListener("deviceorientation", onOrient);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrient);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const active = byId.get(HERO_SET[idx].id)!;

  return (
    <div className="nx-stage" ref={stage} onTouchStart={() => setPaused(true)}>
      <div className="nx-stage-glow" />
      <div className="nx-stage-floor" />
      {HERO_SET.map((h, i) => {
        const s = byId.get(h.id)!;
        return (
          <button
            key={h.id}
            type="button"
            className={`nx-stage-item${i === idx ? " is-on" : ""}`}
            onClick={() => { haptic.tap(); onOpen(h.id); }}
            aria-label={s.model}
            tabIndex={i === idx ? 0 : -1}
          >
            <SImg className="nx-stage-img" src={h.cutout} fallback={s.fallback} alt={s.model} />
          </button>
        );
      })}
      <div className="nx-stage-chips" key={active.id}>
        {active.keySpecs.map((k, i) => (
          <span key={k.label} className={`nx-chip nx-chip--${i}`}>
            <b>{k.value}</b> {k.unit}
          </span>
        ))}
      </div>
      <div className="nx-stage-caption">
        <button
          type="button"
          key={active.id}
          className="nx-stage-caption-in"
          onClick={() => { haptic.tap(); onOpen(active.id); }}
        >
          <span className="nx-stage-tier">{active.tier.split(" · ")[0]}</span>
          <strong>{active.model}</strong>
          <span className="nx-stage-price">
            {mode === "rent" && active.rentDaily ? `от ${formatRub(active.rentDaily)}/сут` : formatRub(active.price)}
          </span>
        </button>
        <div className="nx-stage-dots">
          {HERO_SET.map((h, i) => (
            <button
              key={h.id}
              type="button"
              aria-label={`Показать ${byId.get(h.id)!.model}`}
              className={i === idx ? "is-on" : ""}
              onClick={() => { haptic.select(); setPaused(true); setIdx(i); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  UI atoms                                                           */
/* ================================================================== */

function Segmented({ value, onChange, size = "md" }: { value: Mode; onChange: (m: Mode) => void; size?: "md" | "sm" }) {
  return (
    <div className={`nx-seg nx-seg--${size}`} role="tablist" data-v={value}>
      <span className="nx-seg-thumb" />
      <button type="button" role="tab" aria-selected={value === "buy"} onClick={() => { haptic.select(); onChange("buy"); }}>
        Покупка
      </button>
      <button type="button" role="tab" aria-selected={value === "rent"} onClick={() => { haptic.select(); onChange("rent"); }}>
        Аренда
      </button>
    </div>
  );
}

function Stepper({ value, min, onChange }: { value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div className="nx-stepper">
      <button type="button" aria-label="Меньше" disabled={value <= min} onClick={() => { haptic.select(); onChange(Math.max(min, value - 1)); }}>
        <Icon name="minus" size={18} />
      </button>
      <span>
        <b>{value}</b> {plural(value, "сутки", "суток", "суток")}
      </span>
      <button type="button" aria-label="Больше" onClick={() => { haptic.select(); onChange(Math.min(90, value + 1)); }}>
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

function PriceLine({ s, mode }: { s: ShowStation; mode: Mode }) {
  if (mode === "rent") {
    if (s.rentDaily === null) return <span className="nx-price-na">Только покупка</span>;
    return (
      <span className="nx-price">
        <small>от</small> <Money value={s.rentDaily} />
        <small className="nx-price-unit">/сутки</small>
      </span>
    );
  }
  return (
    <span className="nx-price">
      <Money value={s.price} />
    </span>
  );
}

function StationRow({ s, mode, onOpen, onAdd, inCart }: { s: ShowStation; mode: Mode; onOpen: () => void; onAdd: () => void; inCart: boolean }) {
  return (
    <article className={`nx-row nx-row--${s.podiumTone}`} onClick={onOpen}>
      {/* Верхняя плашка: прямое назначение аппарата на языке строителя */}
      <div className="nx-podium-topbar">
        <div className="nx-podium-topbar-left">
          <span className="nx-podium-tier">{s.tier}</span>
          <span className="nx-podium-scope">{s.shiftScope}</span>
        </div>
        {s.inStock && (
          <span className="nx-podium-stock">
            <i /> В наличии
          </span>
        )}
      </div>

      {/* Чистый студийный подиум без перекрывающих фото плашек и без полосок */}
      <div className="nx-row-media">
        <span className="nx-row-stamp" aria-hidden="true">{s.codeStamp}</span>
        <SImg src={s.images[0].src} fallback={s.fallback} alt={s.images[0].alt} />
      </div>

      {/* Монолитная приборная панель мощности из 4 конкретных цифр */}
      <div className="nx-power-strip">
        {s.keySpecs.map((k) => (
          <div className="nx-power-cell" key={k.label}>
            <span>{k.label}</span>
            <b>
              {k.value} <small>{k.unit}</small>
            </b>
          </div>
        ))}
        <div className="nx-power-cell nx-power-cell--out">
          <span>За смену</span>
          <b>{s.shiftMetric}</b>
        </div>
      </div>

      {/* Основной корпус карточки */}
      <div className="nx-row-body">
        <div className="nx-row-title-line">
          <h3>{s.model}</h3>
          <p>{s.tagline}</p>
        </div>

        {/* Прямые, прозрачные строки ценности без вложенных коробок */}
        <div className="nx-row-specs-list">
          <div className="nx-mat-block">
            <span className="nx-block-label">Что качает:</span>
            <div className="nx-mat-tags">
              {s.materialTags.map((tag) => (
                <span key={tag} className="nx-mat-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="nx-benefit-lines">
            <div className="nx-benefit-item">
              <Icon name="spark" size={14} />
              <span><b>Эффект для бригады:</b> {s.crewMetric}</span>
            </div>
            <div className="nx-benefit-item">
              <Icon name="check" size={14} />
              <span><b>Полный комплект:</b> шланг ВД, пистолет, удочка, сопло, опрессовка</span>
            </div>
          </div>
        </div>

        {/* Нижний бар сделки: двойная связка цены + солидная кнопка */}
        <div className="nx-row-foot">
          <div className="nx-deal-price">
            <div className="nx-deal-main">
              <PriceLine s={s} mode={mode} />
              {mode === "buy" && <span className="nx-vat-tag">с НДС</span>}
            </div>
            {mode === "buy" && s.rentDaily !== null && (
              <span className="nx-deal-sub">или в прокат: от {formatRub(s.rentDaily)}/сут</span>
            )}
            {mode === "rent" && s.price !== null && (
              <span className="nx-deal-sub">покупка в собственность: {formatRub(s.price)}</span>
            )}
          </div>
          <button
            type="button"
            className={`nx-cta-pill${inCart ? " is-in" : ""}`}
            aria-label={inCart ? "В заявке" : "Добавить в заявку"}
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
          >
            <Icon name={inCart ? "check" : "plus"} size={16} />
            <span>{inCart ? "В заявке" : "В заявку"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================================================================== */
/*  Product sheet                                                      */
/* ================================================================== */

function resolveLabId(id: string): string {
  const s = id.toLowerCase();
  if (s.includes("2500")) return "nord-2500";
  if (s.includes("3300") || s.includes("3200")) return "nord-3300";
  if (s.includes("4500")) return "nord-4500";
  if (s.includes("6000")) return "nord-6000";
  if (s.includes("8000")) return "nord-8000-pro";
  if (s.includes("9200")) return "nord-9200";
  if (s.includes("9900")) return "nord-9900";
  return "nord-18x";
}

function ProductSheet({
  s, mode, setMode, onClose, onAdd, inCart, goCart, variant = "tg",
}: {
  s: ShowStation; mode: Mode; setMode: (m: Mode) => void; onClose: () => void;
  onAdd: (days: number) => void; inCart: boolean; goCart: () => void; variant?: "tg" | "web";
}) {
  const [days, setDays] = useState(s.rentMinDays);
  const [img, setImg] = useState(0);
  const [open, setOpen] = useState<string | null>("specs");
  const gallery = useRef<HTMLDivElement>(null);
  const effMode: Mode = mode === "rent" && s.rentDaily === null ? "buy" : mode;
  const total = itemPrice(s, effMode, days);
  const paybackDays = s.price && s.rentDaily ? Math.ceil(s.price / s.rentDaily) : null;

  const onScroll = () => {
    const g = gallery.current;
    if (!g) return;
    setImg(Math.round(g.scrollLeft / g.clientWidth));
  };

  const section = (id: string, title: string, children: ReactNode) => (
    <div key={id} className={`nx-acc${open === id ? " is-open" : ""}`}>
      <button type="button" className="nx-acc-head" onClick={() => { haptic.select(); setOpen(open === id ? null : id); }}>
        <span>{title}</span>
        <Icon name="chevron" size={18} />
      </button>
      <div className="nx-acc-body"><div className="nx-acc-inner">{children}</div></div>
    </div>
  );

  return (
    <div className="nx-sheet-wrap" role="dialog" aria-modal="true" aria-label={s.model}>
      <div className="nx-sheet-backdrop" onClick={onClose} />
      <div className="nx-sheet">
        <div className="nx-sheet-bar">
          <span className="nx-grab" />
          <button type="button" className="nx-icon-btn" aria-label="Поделиться" onClick={() => shareStation(s, effMode)}>
            <Icon name="share" size={19} />
          </button>
          <button type="button" className="nx-icon-btn" aria-label="Закрыть" onClick={onClose}>
            <Icon name="close" size={19} />
          </button>
        </div>

        <div className="nx-sheet-scroll">
          <div className="nx-gallery" ref={gallery} onScroll={onScroll}>
            {s.images.map((im) => (
              <div className="nx-gallery-slide" key={im.src}>
                <SImg src={im.src} fallback={s.fallback} alt={im.alt} />
              </div>
            ))}
          </div>
          {s.images.length > 1 && (
            <div className="nx-gallery-dots">
              {s.images.map((im, i) => <i key={im.src} className={i === img ? "is-on" : ""} />)}
            </div>
          )}

          <div className="nx-sheet-head">
            <div className="nx-row-top">
              <span className="nx-tier">{s.tier}</span>
              {s.inStock && <span className="nx-stock"><i />В наличии в Москве</span>}
            </div>
            <h2>{s.model}</h2>
            <p>{s.tagline}</p>
          </div>

          <div className="nx-power-strip nx-power-strip--sheet">
            {s.keySpecs.map((k) => (
              <div className="nx-power-cell" key={k.label}>
                <span>{k.label}</span>
                <b>{k.value} <small>{k.unit}</small></b>
              </div>
            ))}
            <div className="nx-power-cell nx-power-cell--out">
              <span>За смену</span>
              <b>{s.shiftMetric}</b>
            </div>
          </div>

          <div className="nx-buybox">
            {s.rentDaily !== null && <Segmented value={effMode} onChange={setMode} />}
            {effMode === "buy" ? (
              <div className="nx-buybox-price">
                <span className="nx-buybox-label">Стоимость с НДС</span>
                <strong><Money value={s.price} /></strong>
                <span className="nx-buybox-note">
                  Пост в сборе: станция, шланг, пистолет, удочка и сопло.
                  {paybackDays ? ` Окупаемость относительно проката: ~${paybackDays} смен.` : ""}
                </span>
              </div>
            ) : (
              <div className="nx-buybox-price">
                <span className="nx-buybox-label">Аренда · {formatRub(s.rentDaily)} в сутки</span>
                <strong><Money value={total} /></strong>
                <Stepper value={days} min={s.rentMinDays} onChange={setDays} />
                <span className="nx-buybox-note">
                  Минимальный срок — {s.rentMinDays} {plural(s.rentMinDays, "сутки", "суток", "суток")}. При выкупе станции засчитываем аренду в счёт покупки.
                </span>
              </div>
            )}
          </div>

          {variant === "web" && (
            <div className="nx-web-sheet-links">
              <a className="nx-web-sheet-link nx-web-sheet-link--lab" href={`/lab?machine=${resolveLabId(s.id)}`}>
                <Icon name="bolt" size={17} />
                <div>
                  <b>Испытать факел на 3D-стене NORD LAB</b>
                  <small>Проверить раскрытие сопла и укрывистость м² онлайн</small>
                </div>
                <Icon name="arrow" size={16} />
              </a>
              <a className="nx-web-sheet-link" href={`/product/${encodeURIComponent(s.id)}`}>
                <Icon name="doc" size={17} />
                <div>
                  <b>Открыть отдельную страницу аппарата</b>
                  <small>Полный техпаспорт, документация и расчёт окупаемости</small>
                </div>
                <Icon name="chevron" size={16} />
              </a>
            </div>
          )}

          <div className="nx-accs">
            {section("specs", "Технические характеристики", (
              <dl className="nx-spec-table">
                {s.allSpecs.map((c) => (
                  <div key={c.name}><dt>{c.name}</dt><dd>{c.value}</dd></div>
                ))}
              </dl>
            ))}
            {section("materials", "С какими материалами работает", <p className="nx-acc-text">{s.materials}</p>)}
            {section("kit", "Комплектация", (
              <ul className="nx-kit">
                {KIT_ITEMS.map((k) => (
                  <li key={k.title}><span className="nx-kit-ic"><Icon name="check" size={14} /></span><div><b>{k.title}</b><small>{k.note}</small></div></li>
                ))}
              </ul>
            ))}
            {section("about", "Описание", <p className="nx-acc-text">{s.description}</p>)}
          </div>

          <div className="nx-sheet-assure">
            <div><Icon name="shield" size={18} /><span>Опрессовка на стенде перед отгрузкой</span></div>
            <div><Icon name="receipt" size={18} /><span>Счёт с НДС для юрлиц</span></div>
          </div>
        </div>

        <div className="nx-sheet-cta">
          <button type="button" className="nx-btn nx-btn--ghost" onClick={() => shareStation(s, effMode)}>
            <Icon name="share" size={18} /> Отправить
          </button>
          {inCart ? (
            <button type="button" className="nx-btn nx-btn--primary" onClick={goCart}>
              <Icon name="check" size={18} /> В заявке · Открыть
            </button>
          ) : (
            <button type="button" className="nx-btn nx-btn--primary" onClick={() => onAdd(days)}>
              Добавить в заявку
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Match (подбор за 3 шага)                                           */
/* ================================================================== */

function MatchFlow({ mode, onOpen, onAdd, cartIds }: { mode: Mode; onOpen: (id: string) => void; onAdd: (id: string) => void; cartIds: Set<string> }) {
  const [step, setStep] = useState(0);
  const [task, setTask] = useState<TaskId | null>(null);
  const [area, setArea] = useState(600);
  const [p380, setP380] = useState(false);

  const needsArea = task !== null && task !== "texture" && task !== "spares" && task !== "waterproof";
  const result = task ? matchStation({ task, area, power380: p380 }) : null;
  const primary = result ? byId.get(result.primary)! : null;

  const reset = () => { haptic.tap(); setStep(0); setTask(null); };

  return (
    <section className="nx-match">
      <div className="nx-match-progress">
        {[0, 1, 2].map((i) => <i key={i} className={i <= step ? "is-on" : ""} />)}
      </div>

      {step === 0 && (
        <div className="nx-step" key="s0">
          <span className="nx-eyebrow">Шаг 1 из 3</span>
          <h2>Что будете наносить?</h2>
          <p className="nx-step-sub">Подберём станцию под материал и объём работ.</p>
          <div className="nx-tasks">
            {TASKS.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`nx-task${task === t.id ? " is-on" : ""}`}
                onClick={() => {
                  haptic.select();
                  setTask(t.id);
                  const skip = t.id === "texture" || t.id === "spares" || t.id === "waterproof";
                  setTimeout(() => setStep(skip ? 2 : 1), 180);
                }}
              >
                <span className="nx-task-ic"><Icon name={TASK_ICON[t.id]} size={22} /></span>
                <b>{t.title}</b>
                <small>{t.hint}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && needsArea && (
        <div className="nx-step" key="s1">
          <span className="nx-eyebrow">Шаг 2 из 3</span>
          <h2>Объём работ в смену</h2>
          <p className="nx-step-sub">Примерная площадь, которую нужно покрыть за день.</p>
          <div className="nx-area">
            <div className="nx-area-value">
              <Money value={area} suffix="" />
              <span className="nx-area-unit">м²</span>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={area}
              onChange={(e) => { setArea(Number(e.target.value)); haptic.select(); }}
              style={{ ["--p" as string]: `${((area - 100) / 2900) * 100}%` }}
              aria-label="Площадь в смену"
            />
            <div className="nx-area-scale"><span>100</span><span>1 500</span><span>3 000 м²</span></div>
          </div>
          {(task === "putty" || task === "fire") && (
            <button type="button" className={`nx-toggle${p380 ? " is-on" : ""}`} onClick={() => { haptic.select(); setP380(!p380); }}>
              <span className="nx-toggle-ic"><Icon name="bolt" size={18} /></span>
              <span className="nx-toggle-txt"><b>На объекте есть сеть 380 В</b><small>Откроет гидравлические станции</small></span>
              <span className="nx-switch"><i /></span>
            </button>
          )}
          <div className="nx-step-actions">
            <button type="button" className="nx-btn nx-btn--ghost" onClick={() => { haptic.tap(); setStep(0); }}>Назад</button>
            <button type="button" className="nx-btn nx-btn--primary" onClick={() => { haptic.heavy(); setStep(2); }}>Показать станцию</button>
          </div>
        </div>
      )}

      {step === 2 && primary && result && (
        <div className="nx-step nx-result" key="s2">
          <span className="nx-eyebrow">Ваш результат</span>
          <h2>Рекомендуем</h2>
          <div className="nx-result-card" onClick={() => onOpen(primary.id)}>
            <div className="nx-result-media">
              <div className="nx-stage-glow" />
              <SImg src={primary.images[0].src} fallback={primary.fallback} alt={primary.model} />
            </div>
            <div className="nx-result-body">
              <span className="nx-tier">{primary.tier}</span>
              <h3>{primary.model}</h3>
              <p>{primary.tagline}</p>
              <ul className="nx-reasons">
                {result.reasons.map((r) => (
                  <li key={r}><span><Icon name="check" size={14} /></span>{r}</li>
                ))}
              </ul>
              <div className="nx-result-foot">
                <PriceLine s={primary} mode={mode} />
              </div>
            </div>
          </div>
          <div className="nx-step-actions">
            <button type="button" className="nx-btn nx-btn--ghost" onClick={() => onOpen(primary.id)}>Подробнее</button>
            <button type="button" className="nx-btn nx-btn--primary" onClick={() => onAdd(primary.id)} disabled={cartIds.has(primary.id)}>
              {cartIds.has(primary.id) ? "Уже в заявке" : "Добавить в заявку"}
            </button>
          </div>
          {result.alt.length > 0 && (
            <>
              <h4 className="nx-subhead">Также подойдут</h4>
              <div className="nx-alt">
                {result.alt.map((id) => {
                  const a = byId.get(id)!;
                  return (
                    <button type="button" key={id} className="nx-alt-item" onClick={() => onOpen(id)}>
                      <div className="nx-alt-media"><SImg src={a.images[0].src} fallback={a.fallback} alt={a.model} /></div>
                      <b>{a.model}</b>
                      <small>{a.keySpecs.map((k) => `${k.value} ${k.unit}`).slice(0, 2).join(" · ")}</small>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <button type="button" className="nx-link-btn" onClick={reset}>Начать подбор заново</button>
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/*  Cart / заявка                                                      */
/* ================================================================== */

function CartView({
  cart, setCart, onOpen, goHome, goMatch, tgName, tgUser,
}: {
  cart: CartItem[]; setCart: (f: (c: CartItem[]) => CartItem[]) => void; onOpen: (id: string) => void;
  goHome: () => void; goMatch: () => void; tgName: string; tgUser: string;
}) {
  const [name, setName] = useState(tgName);
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState("");
  const [doneId, setDoneId] = useState("");

  useEffect(() => { if (tgName && !name) setName(tgName); }, [tgName]); // eslint-disable-line react-hooks/exhaustive-deps

  const lines = cart.map((c) => {
    const s = byId.get(c.id)!;
    const mode: Mode = c.mode === "rent" && s.rentDaily === null ? "buy" : c.mode;
    return { c, s, mode, price: itemPrice(s, mode, c.days) };
  });
  const hasNull = lines.some((l) => l.price === null);
  const total = hasNull ? null : lines.reduce((a, l) => a + (l.price ?? 0), 0);

  const update = (id: string, patch: Partial<CartItem>) => setCart((cs) => cs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id: string) => { haptic.tap(); setCart((cs) => cs.filter((x) => x.id !== id)); };

  const submit = async () => {
    setErr("");
    if (name.trim().length < 2) { setErr("Укажите имя"); return; }
    if (phone.replace(/\D/g, "").length < 10) { setErr("Укажите номер телефона"); return; }
    setState("sending");
    const payload = {
      name: name.trim(), phone: phone.trim(), comment: comment.trim(), tgUser,
      items: lines.map((l) => ({ model: l.s.model, mode: l.mode, days: l.mode === "rent" ? l.c.days : undefined, price: l.price })),
      total,
    };
    try {
      const res = await fetch("/api/tg-lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json()) as { ok: boolean; id?: string; delivered?: boolean; text?: string; error?: string };
      if (!data.ok) throw new Error(data.error || "Ошибка");
      if (!data.delivered && data.text) {
        openTg(`https://t.me/${MANAGER_USERNAME}?text=${encodeURIComponent(data.text)}`);
      }
      haptic.success();
      setDoneId(data.id ?? "");
      setState("done");
      setCart(() => []);
    } catch {
      setState("idle");
      setErr("Не удалось отправить. Проверьте соединение и попробуйте ещё раз.");
    }
  };

  if (state === "done") {
    return (
      <section className="nx-done">
        <div className="nx-done-ic"><Icon name="check" size={40} /></div>
        <h2>Заявка отправлена</h2>
        <p>Менеджер NORD свяжется с вами в Telegram или по телефону. Рабочее время: {COMPANY.hours}.</p>
        {doneId && <span className="nx-done-id">Номер заявки {doneId}</span>}
        <button type="button" className="nx-btn nx-btn--primary nx-btn--wide" onClick={() => { setState("idle"); goHome(); }}>Вернуться в витрину</button>
      </section>
    );
  }

  if (!cart.length) {
    return (
      <section className="nx-empty">
        <div className="nx-empty-ic"><Icon name="doc" size={34} /></div>
        <h2>Заявка пока пуста</h2>
        <p>Добавьте станции из витрины или пройдите подбор — менеджер подготовит предложение.</p>
        <div className="nx-step-actions">
          <button type="button" className="nx-btn nx-btn--ghost" onClick={goHome}>В витрину</button>
          <button type="button" className="nx-btn nx-btn--primary" onClick={goMatch}>Подобрать станцию</button>
        </div>
      </section>
    );
  }

  return (
    <section className="nx-cart">
      <h2 className="nx-page-title">Заявка</h2>
      <div className="nx-cart-list">
        {lines.map(({ c, s, mode, price }) => (
          <div className="nx-cart-item" key={c.id}>
            <div className="nx-cart-top">
              <button type="button" className="nx-cart-media" onClick={() => onOpen(s.id)}>
                <SImg src={s.images[0].src} fallback={s.fallback} alt={s.model} />
              </button>
              <div className="nx-cart-info">
                <b>{s.model}</b>
                <small>{s.tagline}</small>
                <strong>{formatRub(price)}</strong>
              </div>
              <button type="button" className="nx-icon-btn nx-icon-btn--soft" aria-label="Удалить" onClick={() => remove(c.id)}>
                <Icon name="trash" size={18} />
              </button>
            </div>
            {s.rentDaily !== null && (
              <div className="nx-cart-controls">
                <Segmented size="sm" value={mode} onChange={(m) => update(c.id, { mode: m, days: Math.max(c.days, s.rentMinDays) })} />
                {mode === "rent" && <Stepper value={c.days} min={s.rentMinDays} onChange={(d) => update(c.id, { days: d })} />}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="nx-total">
        <span>Итого предварительно</span>
        <strong>{total === null ? "По запросу" : <Money value={total} />}</strong>
      </div>

      <div className="nx-form">
        <h3>Контакты</h3>
        <label className="nx-field">
          <span>Имя</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" autoComplete="name" />
        </label>
        <label className="nx-field">
          <span>Телефон</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" inputMode="tel" autoComplete="tel" />
        </label>
        <label className="nx-field">
          <span>Комментарий</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Объект, материал, сроки. ИНН — если нужен счёт с НДС" />
        </label>
        {tgUser && <p className="nx-form-note"><Icon name="chat" size={15} /> Менеджер ответит вам в Telegram: @{tgUser}</p>}
        {err && <p className="nx-form-err">{err}</p>}
        <button type="button" className="nx-btn nx-btn--primary nx-btn--wide" onClick={submit} disabled={state === "sending"}>
          {state === "sending" ? "Отправляем…" : "Отправить заявку"}
        </button>
        <p className="nx-form-legal">Без предоплаты и обязательств. Заявку обработает менеджер NORD.</p>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  About / NORD                                                       */
/* ================================================================== */

function AboutView() {
  const minRent = Math.min(...STATIONS.map((s) => s.rentDaily ?? Infinity));
  const chat = () => { haptic.tap(); openTg(`https://t.me/${MANAGER_USERNAME}`); };
  return (
    <section className="nx-about">
      <div className="nx-about-hero">
        <span className="nx-eyebrow">Официальный инженерный центр · Москва</span>
        <h2>Промышленное окрасочное и шпаклёвочное оборудование NORD</h2>
        <p>Подбор, продажа и аренда безвоздушных станций для покраски, шпаклёвки, огнезащиты и гидроизоляции.</p>
      </div>

      <button type="button" className="nx-trust-card" onClick={() => openExternal(AVITO_URL)}>
        <div className="nx-trust-stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={18} />)}</div>
        <b>Ни одного недовольного клиента</b>
        <span>Все отзывы открыты — проверьте сами на Авито</span>
        <span className="nx-trust-link">Открыть отзывы <Icon name="arrow" size={16} /></span>
      </button>

      <div className="nx-list">
        <div className="nx-list-item"><span className="nx-list-ic"><Icon name="box" /></span><div><b>Продажа</b><small>{STATIONS.length} моделей в наличии на складе в Москве</small></div></div>
        <div className="nx-list-item"><span className="nx-list-ic"><Icon name="clock" /></span><div><b>Аренда</b><small>От {formatRub(minRent)} в сутки</small></div></div>
        <div className="nx-list-item"><span className="nx-list-ic"><Icon name="gauge" /></span><div><b>Опрессовка</b><small>Каждая станция проверяется на стенде перед отгрузкой</small></div></div>
        <div className="nx-list-item"><span className="nx-list-ic"><Icon name="receipt" /></span><div><b>Для юрлиц</b><small>Работаем по счёту, цены указаны с НДС</small></div></div>
      </div>

      <h3 className="nx-subhead">Связаться</h3>
      <div className="nx-list">
        <button type="button" className="nx-list-item nx-list-item--link" onClick={chat}>
          <span className="nx-list-ic nx-list-ic--blue"><Icon name="chat" /></span>
          <div><b>Написать менеджеру</b><small>@{MANAGER_USERNAME} в Telegram</small></div>
          <Icon name="chevron" size={18} />
        </button>
        <a className="nx-list-item nx-list-item--link" href={COMPANY.phoneHref}>
          <span className="nx-list-ic"><Icon name="phone" /></span>
          <div><b>{COMPANY.phone}</b><small>{COMPANY.hours}</small></div>
          <Icon name="chevron" size={18} />
        </a>
        <button type="button" className="nx-list-item nx-list-item--link" onClick={() => openExternal(COMPANY.mapUrl)}>
          <span className="nx-list-ic"><Icon name="pin" /></span>
          <div><b>Склад в Москве</b><small>{COMPANY.address}</small></div>
          <Icon name="chevron" size={18} />
        </button>
      </div>
    </section>
  );
}

const WEB_RENT_TIERS = [
  {
    id: "nord-2500",
    title: "Интерьер и фасады",
    models: "NORD-2500 · NORD-3300 · NORD-4500",
    flow: "2,5–4,2 л/мин",
    shortRate: 1500,
    longRate: 1350,
  },
  {
    id: "nord-6000",
    title: "Краска в 2 поста и шпаклёвка",
    models: "NORD-6000 HD",
    flow: "6,5 л/мин",
    shortRate: 2300,
    longRate: 2000,
  },
  {
    id: "nord-8000-pro",
    title: "350 бар · Мастики и шпаклёвка 9 л/мин",
    models: "NORD-8000 PRO · NORD-9200",
    flow: "7,5–9,0 л/мин",
    shortRate: 2700,
    longRate: 2400,
  },
  {
    id: "nord-18x",
    title: "Тяжёлый пром и Флагман 18 л/мин",
    models: "NORD-9900 · NORD-18X",
    flow: "11,0–18,0 л/мин",
    shortRate: 2900,
    longRate: 2600,
  },
];

function WebExtrasStage({
  onSwitchRent,
  onOpenStation,
}: {
  onSwitchRent: () => void;
  onOpenStation: (id: string) => void;
}) {
  const [days, setDays] = useState(5);
  const isDiscount = days >= 3;

  return (
    <>
      <section className="nx-web-rent">
        <div className="nx-web-rent-head">
          <span className="nx-eyebrow">Промышленный прокат · Москва и МО</span>
          <h2>Нужна станция на смену или тест-драйв перед покупкой?</h2>
          <p>
            Выдаём полностью укомплектованный пост со шлангами ВД, пистолетом и соплом после опрессовки 230 бар. При выкупе станции засчитываем аренду в счёт покупки.
          </p>
        </div>

        <div className="nx-web-rent-calc">
          <div className="nx-web-rent-days">
            <span>Срок аренды на объекте</span>
            <div className="nx-web-rent-pills">
              {[2, 5, 10, 20].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={days === d ? "is-on" : ""}
                  onClick={() => { haptic.select(); setDays(d); }}
                >
                  {d} сут
                </button>
              ))}
            </div>
          </div>
          <div className="nx-web-rent-badge">
            <Icon name="check" size={14} />
            <span>
              {isDiscount
                ? `Тариф со скидкой от 3 суток · Расчёт на ${days} сут`
                : `Краткосрочный тариф (от 3 суток ставка ниже)`}
            </span>
          </div>

          <div className="nx-web-rent-grid">
            {WEB_RENT_TIERS.map((t) => {
              const rate = isDiscount ? t.longRate : t.shortRate;
              const sum = rate * days;
              return (
                <button
                  key={t.id}
                  type="button"
                  className="nx-web-rent-card"
                  onClick={() => { haptic.tap(); onOpenStation(t.id); }}
                >
                  <div className="nx-web-rent-top">
                    <b>{t.title}</b>
                    <span>{t.flow}</span>
                  </div>
                  <small className="nx-web-rent-models">{t.models}</small>
                  <div className="nx-web-rent-foot">
                    <div>
                      <strong>{formatRub(rate)}/сут</strong>
                      <span>Итого за {days} сут: {formatRub(sum)}</span>
                    </div>
                    <Icon name="chevron" size={16} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="nx-web-rent-actions">
            <button type="button" className="nx-btn nx-btn--primary" onClick={onSwitchRent}>
              Переключить витрину в «Аренда»
            </button>
            <a className="nx-btn nx-btn--ghost" href="/rent">
              Все условия проката →
            </a>
          </div>
        </div>
      </section>

      <section className="nx-section">
        <a className="nx-web-lab-card" href="/lab">
          <div className="nx-web-lab-top">
            <span className="nx-web-lab-pill">
              <Icon name="bolt" size={14} /> 3D-СТЕНД NORD LAB
            </span>
            <span className="nx-web-lab-go">Открыть 3D <Icon name="arrow" size={15} /></span>
          </div>
          <h3>Испытайте факел 230–350 бар на виртуальной стене</h3>
          <p>Сравните скорость укрытия м² и работу сопел от NORD-2500 до флагмана NORD-18X прямо в браузере.</p>
        </a>
      </section>
    </>
  );
}

/* ================================================================== */
/*  Root                                                               */
/* ================================================================== */

export function NordShowroom({ variant = "tg" }: { variant?: "tg" | "web" }) {
  const [tab, setTab] = useState<Tab>("home");
  const [mode, setMode] = useState<Mode>("buy");
  const [task, setTask] = useState<TaskId | "all">("all");
  const [spareSubTab, setSpareSubTab] = useState<SpareSubCategory>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [tgName, setTgName] = useState("");
  const [tgUser, setTgUser] = useState("");
  const catalogRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* --- init: Telegram + deep link + сохранённая заявка --- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nord-tg-cart");
      if (saved) setCartState((JSON.parse(saved) as CartItem[]).filter((c) => byId.has(c.id)));
    } catch { /* ignore */ }

    const init = () => {
      const w = tg();
      if (w) {
        w.ready();
        w.expand();
        w.setHeaderColor?.("#ffffff");
        w.setBackgroundColor?.("#ffffff");
        w.setBottomBarColor?.("#ffffff");
        if (w.isVersionAtLeast?.("7.7")) w.disableVerticalSwipes?.();
        const u = w.initDataUnsafe?.user;
        if (u) {
          setTgName([u.first_name, u.last_name].filter(Boolean).join(" "));
          setTgUser(u.username ?? "");
        }
      }
      const start = w?.initDataUnsafe?.start_param || new URLSearchParams(window.location.search).get("p");
      if (start) {
        const s = bySlug.get(start) ?? byId.get(start);
        if (s) setOpenId(s.id);
      }
    };
    if (tg()) init();
    else {
      const t = setTimeout(init, 600);
      return () => clearTimeout(t);
    }
  }, []);

  const setCart = useCallback((f: (c: CartItem[]) => CartItem[]) => {
    setCartState((prev) => {
      const next = f(prev);
      try { localStorage.setItem("nord-tg-cart", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  /* --- системная кнопка «Назад» Telegram --- */
  useEffect(() => {
    const w = tg();
    const back = w?.BackButton;
    if (!back) return;
    const handler = () => {
      if (openId) setOpenId(null);
      else setTab("home");
    };
    if (openId || tab !== "home") back.show();
    else back.hide();
    back.onClick(handler);
    return () => back.offClick(handler);
  }, [openId, tab]);

  /* --- блокировка прокрутки под карточкой --- */
  useEffect(() => {
    document.documentElement.classList.toggle("nx-lock", !!openId);
  }, [openId]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const cartIds = useMemo(() => new Set(cart.map((c) => c.id)), [cart]);

  const addToCart = (id: string, days?: number) => {
    const s = byId.get(id);
    if (!s) return;
    haptic.success();
    const m: Mode = mode === "rent" && s.rentDaily !== null ? "rent" : "buy";
    setCart((c) => (c.some((x) => x.id === id) ? c : [...c, { id, mode: m, days: Math.max(days ?? s.rentMinDays, s.rentMinDays) }]));
    showToast(`${s.model} — в заявке`);
  };

  const goTab = (t: Tab) => {
    haptic.select();
    setTab(t);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const pickTask = (t: TaskId | "all") => {
    haptic.select();
    setTask(t);
    requestAnimationFrame(() => catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const [stationList, setStationList] = useState<ShowStation[]>(STATIONS);

  useEffect(() => {
    fetch("/api/admin/db")
      .then((r) => r.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
          setStationList((prev) =>
            prev
              .map((s) => {
                const p = data.products.find((item: any) => item.id === s.id);
                if (!p) return s;
                const updated: ShowStation = {
                  ...s,
                  price: Number(p.priceRub) || s.price,
                  rentDaily: Number(p.rentDayRub) || s.rentDaily,
                  inStock: p.inStock !== false,
                  images: p.photoUrl
                    ? [{ src: p.photoUrl, alt: p.name }, ...s.images.filter((img) => img.src !== p.photoUrl)]
                    : s.images,
                };
                byId.set(s.id, updated);
                bySlug.set(s.slug, updated);
                return updated;
              })
              .filter((s) => s.inStock !== false)
          );
        }
      })
      .catch(() => {});
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stationList.filter((s) => {
      if (task !== "all" && !s.tasks.includes(task)) return false;
      if (mode === "rent" && s.rentDaily === null) return false;
      if (!q) return true;
      return `${s.model} ${s.tagline} ${s.materials} ${s.fullName}`.toLowerCase().includes(q);
    });
  }, [stationList, task, query, mode]);

  const featured = stationList.find((s) => s.featured) || stationList[0];
  const opened = openId ? byId.get(openId) ?? stationList.find((s) => s.id === openId) ?? null : null;

  return (
    <div className={`nx ${variant === "web" ? "nx-web-mobile" : "nx-tg-standalone"}`}>
      {/* ---------------- top bar ---------------- */}
      <header className="nx-top">
        <button type="button" className="nx-brand" onClick={() => goTab("home")} aria-label="NORD — главная">
          <NordBrandLogo compact />
        </button>
        <span className="nx-top-sub">Инженерный центр · Москва</span>
        <div className="nx-top-actions">
          {variant === "web" && (
            <a className="nx-top-phone" href={COMPANY.phoneHref} aria-label="Позвонить инженеру">
              <Icon name="phone" size={18} />
            </a>
          )}
          <button type="button" className="nx-top-cart" onClick={() => goTab("cart")} aria-label="Заявка">
            <Icon name="doc" size={20} />
            {cart.length > 0 && <i>{cart.length}</i>}
          </button>
        </div>
      </header>

      <main className="nx-main" key={tab}>
        {tab === "home" && (
          <>
            <section className="nx-hero">
              <BlueKineticBackdrop variant="hero" />
              <div className="nx-hero-inner">
                <span className="nx-hero-pill">
                  <i /> Официальный инженерный центр NORD · Москва
                </span>
                <h1>
                  Окрасочные станции
                  <br />
                  <span>под вашу задачу</span>
                </h1>
                <p>Продажа и аренда профессионального оборудования. {stationList.length} моделей на складе в Москве.</p>
                <HeroStage mode={mode} onOpen={setOpenId} />
                <Segmented value={mode} onChange={setMode} />
              </div>
            </section>

            <section className="nx-trust">
              <button type="button" className="nx-trust-tile nx-trust-tile--main" onClick={() => openExternal(AVITO_URL)}>
                <span className="nx-trust-stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={13} />)}</span>
                <b>Ни одного недовольного клиента</b>
                <small>Отзывы на Авито <Icon name="arrow" size={13} /></small>
              </button>
              <div className="nx-trust-tile">
                <Icon name="gauge" size={20} />
                <b>Опрессовка</b>
                <small>каждой станции</small>
              </div>
              <div className="nx-trust-tile">
                <Icon name="receipt" size={20} />
                <b>Счёт с НДС</b>
                <small>для юрлиц</small>
              </div>
            </section>

            <section className="nx-section">
              <div className="nx-section-head">
                <h2>Что нужно сделать?</h2>
              </div>
              <div className="nx-tasks">
                {TASKS.map((t) => {
                  const isSpares = t.id === "spares";
                  return (
                    <button
                      type="button"
                      key={t.id}
                      className={`nx-task${task === t.id ? " is-on" : ""}`}
                      onClick={() => pickTask(t.id)}
                      style={
                        isSpares
                          ? {
                              border: task === "spares" ? "2px solid #10b981" : "1.5px solid rgba(16, 185, 129, 0.55)",
                              background:
                                task === "spares"
                                  ? "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)"
                                  : "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(2, 132, 199, 0.08) 100%)",
                              color: task === "spares" ? "#ffffff" : undefined,
                            }
                          : undefined
                      }
                    >
                      <span className="nx-task-ic"><Icon name={TASK_ICON[t.id]} size={22} /></span>
                      <b>{t.title}</b>
                      <small>{t.hint}</small>
                    </button>
                  );
                })}
              </div>
            </section>

            {task === "all" && !query ? (
              <section className="nx-blue-zone">
                <BlueKineticBackdrop variant="feature" />
                <div className="nx-blue-zone-inner">
                  <div className="nx-section-head nx-section-head--on-blue">
                    <span className="nx-zone-kicker">Выбор инженеров NORD</span>
                    <h2>Универсальный стандарт для бригад</h2>
                  </div>
                  <article className="nx-feature" onClick={() => setOpenId(featured.id)}>
                    <div className="nx-feature-media">
                      <SImg src={featured.images[0].src} fallback={featured.fallback} alt={featured.model} />
                    </div>
                    <div className="nx-feature-body">
                      <span className="nx-tier">{featured.tier} · Самая востребованная</span>
                      <h3>{featured.model}</h3>
                      <p>{featured.tagline}</p>
                      <div className="nx-keys nx-keys--compact">
                        {featured.keySpecs.map((k) => (
                          <div key={k.label}><b>{k.value}<small> {k.unit}</small></b><span>{k.label}</span></div>
                        ))}
                      </div>
                      <div className="nx-row-foot">
                        <PriceLine s={featured} mode={mode} />
                        <button type="button" className={`nx-add nx-add--lg${cartIds.has(featured.id) ? " is-in" : ""}`} onClick={(e) => { e.stopPropagation(); addToCart(featured.id); }} aria-label="Добавить в заявку">
                          <Icon name={cartIds.has(featured.id) ? "check" : "plus"} size={20} />
                        </button>
                      </div>
                    </div>
                  </article>

                  <button type="button" className="nx-match-glass" onClick={() => goTab("match")}>
                    <div>
                      <span className="nx-eyebrow nx-eyebrow--light">Подбор за 30 секунд</span>
                      <b>Не знаете, какая станция нужна?</b>
                      <small>Ответьте на 2 вопроса — покажем точное решение</small>
                    </div>
                    <span className="nx-match-banner-go"><Icon name="arrow" size={22} /></span>
                  </button>
                </div>
              </section>
            ) : (
              <section className="nx-section">
                <button type="button" className="nx-match-banner" onClick={() => goTab("match")}>
                  <div>
                    <span className="nx-eyebrow nx-eyebrow--light">Подбор за 30 секунд</span>
                    <b>Не знаете, какая станция нужна?</b>
                    <small>Ответьте на 2 вопроса — покажем точное решение</small>
                  </div>
                  <span className="nx-match-banner-go"><Icon name="arrow" size={22} /></span>
                </button>
              </section>
            )}

            <section className="nx-catalog-stage" ref={catalogRef}>
              <div className="nx-catalog-head">
                <div className="nx-section-head">
                  <h2>Каталог станций</h2>
                  <span className="nx-count">{list.length}</span>
                </div>
                <label className="nx-search">
                  <Icon name="search" size={18} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Модель или материал" enterKeyHint="search" />
                  {query && <button type="button" aria-label="Очистить" onClick={() => setQuery("")}><Icon name="close" size={16} /></button>}
                </label>
                <div className="nx-chips">
                  <button type="button" className={task === "all" ? "is-on" : ""} onClick={() => { haptic.select(); setTask("all"); }}>Все</button>
                  {TASKS.map((t) => (
                    <button type="button" key={t.id} className={task === t.id ? "is-on" : ""} onClick={() => { haptic.select(); setTask(t.id); }}>
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="nx-rows">
                {task === "spares" ? (
                  <div style={{ padding: "8px 0" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                      {SPARE_SUB_TABS.map((st) => {
                        const active = spareSubTab === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => { haptic.select(); setSpareSubTab(st.id); }}
                            style={{
                              padding: "7px 12px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              border: active ? "1px solid #059669" : "1px solid #cbd5e1",
                              background: active ? "#059669" : "#ffffff",
                              color: active ? "#ffffff" : "#1e293b",
                            }}
                          >
                            {st.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {ACCESSORIES_AND_SPARES.filter((item) => {
                        if (spareSubTab !== "all" && item.subCategory !== spareSubTab) return false;
                        if (!query.trim()) return true;
                        return `${item.name} ${item.sku} ${item.compatibility}`.toLowerCase().includes(query.trim().toLowerCase());
                      }).map((spare) => (
                        <div
                          key={spare.id}
                          style={{
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid #e2e8f0",
                            background: "#ffffff",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>АРТ: {spare.sku}</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#059669" }}>● В наличии</span>
                          </div>
                          <strong style={{ fontSize: "14px", color: "#0f172a", lineHeight: 1.3 }}>{spare.name}</strong>
                          <small style={{ fontSize: "12px", color: "#475569" }}>{spare.specSummary}</small>
                          <small style={{ fontSize: "11px", color: "#0284c7" }}>Совместимость: {spare.compatibility}</small>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                            <strong style={{ fontSize: "16px", fontWeight: 900, color: "#0f172a" }}>{formatRub(spare.priceRub)}</strong>
                            <button
                              type="button"
                              className="nx-btn nx-btn--primary"
                              style={{ padding: "7px 14px", fontSize: "12px" }}
                              onClick={() => openTg(`https://t.me/${MANAGER_USERNAME}?text=${encodeURIComponent(`Здравствуйте! Хочу заказать ЗИП: ${spare.name} (${spare.sku}) — ${formatRub(spare.priceRub)}`)}`)}
                            >
                              Заказать ЗИП
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : task === "texture" ? (
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "#ffffff",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                      БУНКЕРНЫЕ ШНЕКОВЫЕ СТАНЦИИ NORD
                    </span>
                    <h3 style={{ fontSize: "19px", fontWeight: 900, margin: "6px 0 8px 0" }}>
                      Шнековые шпаклёвочные аппараты для гипсовых и фактурных смесей
                    </h3>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5, marginBottom: "14px" }}>
                      Шнековые станции непрерывной подачи для нанесения базовых и финишных шпаклёвок, декоративной штукатурки «короед», «шуба» и гидроизоляции с фракцией до 3 мм.
                    </p>
                    <button
                      type="button"
                      className="nx-btn nx-btn--primary nx-btn--wide"
                      onClick={() => openTg(`https://t.me/${MANAGER_USERNAME}?text=${encodeURIComponent("Здравствуйте! Интересует поставка шнекового шпаклёвочного аппарата NORD.")}`)}
                    >
                      Запросить прайс на шнековый аппарат
                    </button>
                  </div>
                ) : (
                  <>
                    {task === "all" && !query && (
                      <div className="nx-chapter-bar">
                        <span className="nx-chapter-num">01</span>
                        <div>
                          <b>Окрасочные аппараты · Интерьер и Фасад (3 модели)</b>
                          <small>NORD-2500 · NORD-3300 · NORD-4500 (от 35 000 ₽ · 2,5–4,2 л/мин)</small>
                        </div>
                      </div>
                    )}
                    {list.map((s, idx) => {
                      const showHeavyDivider =
                        task === "all" && !query && s.isHeavyChapter && (idx === 0 || !list[idx - 1].isHeavyChapter);
                      return (
                        <div key={s.id} className="nx-row-slot">
                          {showHeavyDivider && (
                            <div className="nx-chapter-bar nx-chapter-bar--heavy">
                              <span className="nx-chapter-num">02</span>
                              <div>
                                <b>Шпаклёвочно-окрасочные станции HD · до 18 л/мин и 350 бар (5 моделей)</b>
                                <small>NORD-6000 · NORD-8000 PRO (350 бар) · NORD-9200 · NORD-9900 · NORD-18X</small>
                              </div>
                            </div>
                          )}
                          <StationRow
                            s={s}
                            mode={mode}
                            inCart={cartIds.has(s.id)}
                            onOpen={() => { haptic.tap(); setOpenId(s.id); }}
                            onAdd={() => addToCart(s.id)}
                          />
                        </div>
                      );
                    })}
                    {!list.length && (
                      <div className="nx-noresult">
                        <b>Ничего не нашли</b>
                        <span>Попробуйте другой запрос или напишите менеджеру — подберём вручную.</span>
                        <button type="button" className="nx-btn nx-btn--ghost" onClick={() => openTg(`https://t.me/${MANAGER_USERNAME}`)}>Написать менеджеру</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            {variant === "web" && (
              <WebExtrasStage
                onSwitchRent={() => {
                  haptic.select();
                  setMode("rent");
                  catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                onOpenStation={(id) => setOpenId(id)}
              />
            )}

            <section className="nx-section">
              <div className="nx-help">
                <div className="nx-help-ic"><Icon name="chat" size={22} /></div>
                <b>Нужна консультация инженера?</b>
                <span>Подскажем станцию, сопла и длину рукавов под ваш объект.</span>
                <button type="button" className="nx-btn nx-btn--primary nx-btn--wide" onClick={() => { haptic.tap(); openTg(`https://t.me/${MANAGER_USERNAME}`); }}>
                  Написать в Telegram
                </button>
              </div>
            </section>

            <footer className="nx-foot">
              <span className="nx-wordmark">NORD</span>
              <span>{COMPANY.address}</span>
              <span>{COMPANY.hours} · {COMPANY.phone}</span>
            </footer>
          </>
        )}

        {tab === "match" && <MatchFlow mode={mode} onOpen={setOpenId} onAdd={(id) => addToCart(id)} cartIds={cartIds} />}
        {tab === "cart" && (
          <CartView cart={cart} setCart={setCart} onOpen={setOpenId} goHome={() => goTab("home")} goMatch={() => goTab("match")} tgName={tgName} tgUser={tgUser} />
        )}
        {tab === "about" && <AboutView />}
      </main>

      {/* ---------------- bottom navigation ---------------- */}
      <nav className="nx-nav" aria-label="Разделы">
        {([
          ["home", "grid", "Витрина"],
          ["match", "spark", "Подбор"],
          ["cart", "doc", "Заявка"],
          ["about", "shield", "О NORD"],
        ] as [Tab, IconName, string][]).map(([id, ic, label]) => (
          <button type="button" key={id} className={tab === id ? "is-on" : ""} onClick={() => goTab(id)}>
            <span className="nx-nav-ic">
              <Icon name={ic} size={22} />
              {id === "cart" && cart.length > 0 && <i>{cart.length}</i>}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* ---------------- toast ---------------- */}
      <div className={`nx-toast${toast ? " is-on" : ""}`} role="status">
        <span className="nx-toast-ic"><Icon name="check" size={16} /></span>
        <span>{toast}</span>
        <button type="button" onClick={() => { setToast(null); goTab("cart"); }}>Открыть</button>
      </div>

      {opened && (
        <ProductSheet
          key={opened.id}
          s={opened}
          mode={mode}
          setMode={setMode}
          onClose={() => setOpenId(null)}
          onAdd={(days) => addToCart(opened.id, days)}
          inCart={cartIds.has(opened.id)}
          goCart={() => { setOpenId(null); goTab("cart"); }}
          variant={variant}
        />
      )}
    </div>
  );
}
