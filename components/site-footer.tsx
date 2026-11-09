import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { MESSENGERS } from "@/components/messenger-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/">
              <img className="brand-logo" src="/assets/products/logo.png" alt="NORD" />
            </Link>
            <p className="footer-description">
              Профессиональное безвоздушное окрасочное, шпаклёвочное и огнезащитное оборудование. Поставка со склада в Москве, аренда на объект, пусконаладка и обеспечение ЗИП.
            </p>
            <div className="footer-contacts-direct">
              <a className="footer-phone" href={SITE_CONFIG.phoneHref}>
                {SITE_CONFIG.phone}
              </a>
              <a className="footer-email" href={`mailto:${SITE_CONFIG.email}`}>
                {SITE_CONFIG.email}
              </a>
              <span className="footer-hours">
                {SITE_CONFIG.address} · {SITE_CONFIG.workHours}
              </span>
            </div>
          </div>

          <div>
            <div className="footer-title">01 // Оборудование и ЗИП</div>
            <div className="footer-links">
              <Link href="/catalog">Все 8 станций NORD</Link>
              <Link href="/category/piston_paint">Окрасочные аппараты (3)</Link>
              <Link href="/category/piston_putty">Шпаклёвочные станции HD (5)</Link>
              <Link href="/category/screw_putty">Шнековые шпаклёвочные аппараты</Link>
              <Link href="/category/spares_accessories">Запчасти и аксессуары (ЗИП)</Link>
            </div>
          </div>

          <div>
            <div className="footer-title">02 // Заказчикам и ИП/ООО</div>
            <div className="footer-links">
              <Link href="/rent">Аренда на объект</Link>
              <Link href="/delivery">Доставка и самовывоз</Link>
              <Link href="/warranty">Гарантия и сервис</Link>
              <Link href="/contacts">Запрос КП и счёта</Link>
              <Link href="/favorites">Сохранённые модели</Link>
            </div>
          </div>

          <div>
            <div className="footer-title">03 // Компания NORD</div>
            <div className="footer-links">
              <Link href="/about">О подразделении NORD</Link>
              <Link href="/articles">Инженерная база знаний</Link>
              <Link href="/contacts">Склад и точка выдачи</Link>
              <Link href="/privacy">Политика конфиденциальности</Link>
              <Link href="/terms">Условия поставки и проката</Link>
            </div>
          </div>
        </div>

        <div className="m-footer mobile-only">
          <img className="m-footer-logo" src="/assets/products/logo.png" alt="NORD" />
          <a className="m-footer-phone" href={SITE_CONFIG.phoneHref}>
            {SITE_CONFIG.phone}
          </a>
          <span className="m-footer-meta">
            {SITE_CONFIG.address} · {SITE_CONFIG.workHours}
          </span>
          <div className="m-footer-msg">
            {MESSENGERS.map(({ key, label, href, Icon }) => (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
          <div className="m-footer-links">
            <Link href="/catalog">Каталог</Link>
            <Link href="/rent">Аренда</Link>
            <Link href="/delivery">Доставка</Link>
            <Link href="/warranty">Гарантия</Link>
            <Link href="/about">О компании</Link>
            <Link href="/contacts">Контакты</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NORD INDUSTRIAL EQUIPMENT · Все права защищены</span>
          <span>Работаем с юрлицами (счёт / договор) и физлицами · {SITE_CONFIG.address}</span>
        </div>
      </div>
    </footer>
  );
}
