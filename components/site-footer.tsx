import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

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
            <div className="footer-title">01 // Оборудование</div>
            <div className="footer-links">
              <Link href="/catalog">Весь каталог техники</Link>
              <Link href="/category/painting">Окрасочные аппараты</Link>
              <Link href="/category/putty">Шпаклёвочные станции</Link>
              <Link href="/category/fire">Установки огнезащиты</Link>
              <Link href="/category/hydraulic">Гидравлические распылители</Link>
              <Link href="/category/marking">Дорожная разметка</Link>
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

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NORD INDUSTRIAL EQUIPMENT · Все права защищены</span>
          <span>Работаем с юрлицами (счёт / договор) и физлицами · {SITE_CONFIG.address}</span>
        </div>
      </div>
    </footer>
  );
}
