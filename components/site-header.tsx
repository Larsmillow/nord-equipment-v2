"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-context";
import { SITE_CONFIG } from "@/lib/site-config";

function ModeIcon({ mode }: { mode: "buy" | "rent" }) {
  return mode === "buy" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 12 4l8 4.5v10L12 23l-8-4.5zM4 8.5l8 4.5 8-4.5M12 13v10" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function SiteHeader() {
  const { mode, setMode, cart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const totalItems = cart.reduce((count, line) => count + line.quantity, 0);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = quickSearch.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  return (
    <header className="site-header">
      {/* Upper light utility bar: secondary links + direct contacts */}
      <div className="header-topbar">
        <div className="container header-topbar-inner">
          <div className="header-topbar-left">
            <span className="topbar-status">
              <i aria-hidden="true" /> Склад: {SITE_CONFIG.address}
            </span>
            <span className="topbar-divider" aria-hidden="true">·</span>
            <span className="topbar-meta">{SITE_CONFIG.workHours}</span>
          </div>

          <div className="header-topbar-links">
            <Link href="/delivery">Доставка и оплата</Link>
            <Link href="/warranty">Сервис и гарантия</Link>
            <Link href="/about">О компании</Link>
            <Link href="/articles">База знаний</Link>
          </div>

          <div className="header-topbar-right">
            <a className="topbar-link" href={`mailto:${SITE_CONFIG.email}`}>
              {SITE_CONFIG.email}
            </a>
            <a className="topbar-phone" href={SITE_CONFIG.phoneHref}>
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main commercial console bar */}
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="NORD — главная">
          <svg
            className="brand-frame-svg"
            viewBox="0 0 168 54"
            fill="none"
            aria-hidden="true"
          >
            {/* Base soft steel-gray rounded track */}
            <rect
              className="brand-frame-track"
              x="2"
              y="2"
              width="164"
              height="50"
              rx="14"
              ry="14"
            />
            {/* Self-drawing animated steel-gray & cobalt-blue stroke */}
            <rect
              className="brand-frame-draw"
              x="2"
              y="2"
              width="164"
              height="50"
              rx="14"
              ry="14"
              pathLength="100"
            />
            {/* Secondary trailing highlight stroke */}
            <rect
              className="brand-frame-accent"
              x="2"
              y="2"
              width="164"
              height="50"
              rx="14"
              ry="14"
              pathLength="100"
            />
          </svg>
          <img className="brand-logo" src="/assets/products/logo.png" alt="NORD" />
        </Link>

        <nav className={`site-nav${menuOpen ? " is-open" : ""}`} id="site-nav" aria-label="Основная навигация">
          <Link href="/catalog" className={pathname?.startsWith("/catalog") || pathname?.startsWith("/category") ? "is-current" : ""}>
            Каталог оборудования
          </Link>
          <Link href="/rent" className={pathname === "/rent" ? "is-current" : ""}>
            Аренда
          </Link>
          <Link href="/contacts" className={pathname === "/contacts" ? "is-current" : ""}>
            Контакты
          </Link>
          <Link href="/delivery" className="nav-mobile-only">
            Доставка и оплата
          </Link>
          <Link href="/warranty" className="nav-mobile-only">
            Сервис и гарантия
          </Link>
          <Link href="/about" className="nav-mobile-only">
            О компании
          </Link>
          <Link href="/articles" className="nav-mobile-only">
            База знаний
          </Link>
        </nav>

        <form className="header-search" onSubmit={handleSearchSubmit} role="search">
          <input
            type="search"
            className="header-search-input"
            placeholder="Поиск по каталогу (NORD 9536, NORD 1095, 230 бар)…"
            aria-label="Поиск по моделям оборудования"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
          />
          <button type="submit" className="header-search-btn" aria-label="Найти">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>

        <div className="global-mode-control global-mode-control--header">
          <div className="global-mode-switch" data-mode={mode} data-chosen="true" role="group" aria-label="Режим магазина">
            {(["buy", "rent"] as const).map((itemMode) => (
              <button
                className="global-mode-option"
                key={itemMode}
                type="button"
                aria-pressed={mode === itemMode}
                onClick={() => setMode(itemMode)}
              >
                <ModeIcon mode={itemMode} />
                {itemMode === "buy" ? "Покупка" : "Аренда"}
              </button>
            ))}
          </div>
        </div>

        <div className="header-actions">
          <Link className="header-icon-btn" href="/favorites" aria-label="Избранное" title="Избранное">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.5s-7-4.35-9.2-8.4C1.2 9.1 2.7 5.5 6.2 4.7c2.1-.45 4.2.45 5.8 2.2 1.6-1.75 3.7-2.65 5.8-2.2 3.5.8 5 4.4 3.4 7.4-2.2 4.05-9.2 8.4-9.2 8.4z" />
            </svg>
          </Link>
          <Link className="header-icon-btn header-cart-btn" href="/cart" aria-label={`Корзина: ${totalItems}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.47 1.2h8.86a1.5 1.5 0 0 0 1.45-1.12L21 7H6" />
              <circle cx="9.5" cy="19.5" r="1.5" />
              <circle cx="17" cy="19.5" r="1.5" />
            </svg>
            <span className="count-pill">{totalItems}</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label="Открыть меню"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
