"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Нижний стеклянный док быстрого доступа — виден только на мобильных устройствах (<= 768px). */
export function MobileBottomBar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/tg") || pathname?.startsWith("/admin")) {
    return null;
  }

  const isCatalog = pathname === "/catalog" || pathname?.startsWith("/category");
  const isRent = pathname?.startsWith("/rent");
  const isTg = pathname?.startsWith("/tg");

  return (
    <nav className="m-bottombar m-bottombar--4" aria-label="Быстрые действия">
      <Link href="/#catalog" className={isCatalog ? "is-current" : ""}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
        <span>Каталог</span>
      </Link>
      <Link href="/rent" className={isRent ? "is-current" : ""}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span>Прокат</span>
      </Link>
      <Link href="/tg" className={isTg ? "m-bottombar-lab is-current" : "m-bottombar-lab"}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span>TG-Терминал</span>
      </Link>
      <a href="#lead-form">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span>Счёт / КП</span>
      </a>
    </nav>
  );
}
