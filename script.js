const products = [
  {
    id: "gtb-1095",
    name: "Окрасочный аппарат GTB-1095",
    shortName: "GTB-1095",
    price: 97375,
    oldPrice: 102500,
    badge: "Выгодная цена",
    category: "painting",
    description: "Безвоздушный окрасочный аппарат на тележке для профессиональной работы с лакокрасочными материалами.",
    specs: [["Производительность", "6 л/мин"], ["Мощность", "3 500 Вт"], ["Напряжение", "220 В"], ["Максимальное давление", "230 бар"], ["Максимальное сопло", "0.043″"], ["Тип", "Электрический, безвоздушный"]],
    images: [
      ["gtb-1095-main.png", "Аппарат GTB-1095 и основные параметры"],
      ["gtb-1095-side.png", "GTB-1095, вид сбоку"],
      ["gtb-1095-kit.png", "Комплектация GTB-1095"],
      ["gtb-1095-detail.png", "Деталь аппарата GTB-1095"],
    ],
    materials: "Краски и лакокрасочные материалы для безвоздушного распыления.",
  },
  {
    id: "putter-9528x",
    name: "Окрасочный аппарат PUTTER 9528-X QuickReel",
    shortName: "PUTTER 9528-X",
    price: 170000,
    badge: "Новинка",
    category: "painting",
    description: "Мощный окрасочный аппарат с системой QuickReel для удобного сматывания и хранения шланга.",
    specs: [["Производительность", "11 л/мин"], ["Мощность", "5 000 Вт"], ["Максимальное давление", "230 бар"], ["Максимальное сопло", "0.049″"], ["Система шланга", "QuickReel"], ["Гарантия", "2 года от магазина"], ["Тип", "Электрический, безвоздушный"]],
    images: [
      ["putter-9528x-main.png", "PUTTER 9528-X QuickReel и параметры"],
      ["putter-9528x-front.png", "PUTTER 9528-X, вид спереди"],
      ["putter-9528x-rear.png", "PUTTER 9528-X, вид сзади"],
      ["putter-9528x-kit.png", "Комплект PUTTER 9528-X"],
    ],
    materials: "Густые шпаклёвки, краски и огнезащитные материалы.",
  },
];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver;
const revealSelector = ".page-hero, .gallery-main, .section-heading, .category-card, .category-tile, .product-card, .step-card, .article-card, .benefit, .info-card, .rent-card, .fact, .summary-card, .empty-state, .form-card, .login-card, .contact-band";

const categories = [
  { id: "painting", name: "Окрасочное оборудование", description: "Аппараты для безвоздушного нанесения красок и покрытий.", icon: "01", children: [["Аппараты до 6 л/мин", "category.html?category=painting&flow=compact"], ["Аппараты от 10 л/мин", "category.html?category=painting&flow=high"], ["Модели с QuickReel", "category.html?category=painting&feature=quickreel"]] },
  { id: "putty", name: "Шпаклёвочные станции", description: "Оборудование и решения для механизированной отделки.", icon: "02", children: [["Шнековые станции", "category.html?category=putty&subcategory=screw"], ["Станции с компрессором", "category.html?category=putty&subcategory=compressor"]] },
  { id: "fire", name: "Оборудование для огнезащиты", description: "Подбор техники под тип материала и задачу.", icon: "03", children: [["Аппараты для огнезащитных составов", "category.html?category=fire&subcategory=fireproof"]] },
  { id: "accessories", name: "Комплектующие и расходники", description: "Шланги, сопла и оснащение для оборудования.", icon: "04", children: [["Шланги", "category.html?category=accessories&subcategory=hoses"], ["Сопла и пистолеты", "category.html?category=accessories&subcategory=nozzles"]] },
];

const articles = [
  { id: "choose-sprayer", tag: "ПОДБОР", title: "Как подобрать окрасочный аппарат под объект", teaser: "С чего начать выбор: материал, объём работ, длина шланга и параметры аппарата." },
  { id: "quickreel", tag: "ОБОРУДОВАНИЕ", title: "QuickReel: зачем аппарату система для шланга", teaser: "Как устроена система сматывания и в каких рабочих ситуациях она удобна." },
  { id: "rental-guide", tag: "АРЕНДА", title: "Аренда оборудования в Москве: что уточнить заранее", teaser: "Срок, комплект, доставка и материал — короткий список до бронирования." },
  { id: "sprayer-care", tag: "УХОД", title: "Подготовка аппарата к следующему рабочему циклу", teaser: "Базовые шаги по очистке и хранению; конкретные процедуры смотрите в руководстве модели." },
];

const money = new Intl.NumberFormat("ru-RU");
const asset = (product, filename) => `assets/products/${product.id}/${filename}`;
const productUrl = (product) => `product.html?id=${encodeURIComponent(product.id)}`;
const getStored = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};
const setStored = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let cart = getStored("nord-v2-cart", {});
let favorites = getStored("nord-v2-favorites", []);

function productImage(product, index = 0) {
  return asset(product, product.images[index][0]);
}

function productCard(product) {
  const saved = favorites.includes(product.id);
  return `<article class="product-card">
    <a class="product-card-image" href="${productUrl(product)}"><img src="${productImage(product)}" alt="${product.images[0][1]}" loading="lazy"></a>
    <div class="product-card-info">
      <span class="badge">${product.badge}</span>
      <h3><a href="${productUrl(product)}">${product.name}</a></h3>
      <p>${product.description}</p>
      <div class="mini-specs">${product.specs.slice(0, 4).map(([name, value]) => `<span>${name}<strong>${value}</strong></span>`).join("")}</div>
      <div class="product-card-bottom">
        <span class="price">${money.format(product.price)} ₽${product.oldPrice ? `<del class="price-old">${money.format(product.oldPrice)} ₽</del>` : ""}</span>
        <span class="actions-inline"><button class="icon-button ${saved ? "is-active" : ""}" type="button" data-favorite="${product.id}" aria-label="${saved ? "Убрать из избранного" : "В избранное"}" aria-pressed="${saved}">♡</button><button class="button button-primary" type="button" data-add-cart="${product.id}" aria-label="Добавить ${product.shortName} в корзину">В корзину</button></span>
      </div>
    </div>
  </article>`;
}

function renderHeader() {
  const page = document.body.dataset.page;
  const active = (name) => page === name ? ' aria-current="page"' : "";
  document.querySelector("#site-header").innerHTML = `<header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="NORD — главная"><span class="brand-mark" aria-hidden="true">N<i></i></span><span class="brand-copy"><span class="brand-name">NORD</span><span class="brand-caption">оборудование для дела</span></span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Открыть меню"><span></span><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="Основная навигация">
        <details class="nav-catalog"><summary>Каталог⌄</summary><div class="mega-menu">${categories.map((item) => `<a href="category.html?category=${item.id}">${item.name}</a>`).join("")}<a href="catalog.html">Все категории и товары →</a></div></details>
        <a href="rent.html"${active("rent")}>Аренда</a><a href="delivery.html"${active("delivery")}>Доставка</a><a href="about.html"${active("about")}>О компании</a><a href="blog.html"${active("blog")}>Статьи</a><a href="contacts.html"${active("contacts")}>Контакты</a>
      </nav>
      <div class="header-actions"><a class="icon-link" href="favorites.html" aria-label="Избранное">♡<span class="count" data-favorites-count>${favorites.length}</span></a><a class="icon-link" href="cart.html" aria-label="Корзина">▢<span class="count" data-cart-count>${Object.values(cart).reduce((a, b) => a + b, 0)}</span></a><a class="icon-link" href="account.html" aria-label="Личный кабинет">♙</a></div>
    </div>
  </header>`;
}

function renderFooter() {
  document.querySelector("#site-footer").innerHTML = `<footer class="site-footer"><span class="footer-watermark" aria-hidden="true">NORD</span><div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><a class="brand" href="index.html"><span class="brand-mark">N</span><span class="brand-copy"><span class="brand-name">NORD</span><span class="brand-caption">оборудование для дела</span></span></a><p class="footer-description">Оборудование для малярных и отделочных работ. Продажа и аренда.</p></div>
      <div><div class="footer-title">Каталог</div><div class="footer-links"><a href="catalog.html">Все оборудование</a><a href="category.html?category=painting">Окрасочные аппараты</a><a href="category.html?category=putty">Шпаклёвочные станции</a><a href="category.html?category=accessories">Комплектующие</a></div></div>
      <div><div class="footer-title">Покупателям</div><div class="footer-links"><a href="rent.html">Аренда</a><a href="delivery.html">Доставка</a><a href="warranty.html">Гарантии и сервис</a><a href="account.html">Личный кабинет</a></div></div>
      <div><div class="footer-title">Nord</div><div class="footer-links"><a href="about.html">О компании</a><a href="contacts.html">Контакты</a><a href="blog.html">Статьи и новости</a><a href="favorites.html">Избранное</a></div></div>
    </div>
    <div class="footer-bottom"><span>© NORD · Оборудование для дела</span><span>Москва, Окружной проезд, 34Ас6</span></div>
  </div></footer>`;
}

function breadcrumbs(current) {
  return `<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span>${current}</nav>`;
}

function paintParticles() {
  return `<div class="hero-theme hero-theme--paint" aria-hidden="true">${Array.from({ length: 20 }, (_, index) => {
    const x = (index * 47 + 13) % 100;
    const delay = -((index * 7) % 23);
    const duration = 16 + ((index * 11) % 11);
    const drift = ((index * 31) % 61) - 30;
    const color = ["#83aef5", "#c7d9f5", "#5488d7", "#a9bdd9"][index % 4];
    return `<span class="paint-particle" style="--particle-x:${x}%;--particle-delay:${delay}s;--particle-duration:${duration}s;--particle-drift:${drift}px;--particle-color:${color}"><i></i></span>`;
  }).join("")}</div>`;
}

function pageTheme(theme) {
  if (theme === "corporate") {
    return `<svg class="page-theme page-theme--dots" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: 18 }, (_, index) => `<circle cx="${(index * 97 + 41) % 1380 + 30}" cy="${(index * 53 + 31) % 360 + 24}" r="${index % 3 === 0 ? 2.4 : 1.5}" style="--dot-delay:${-index * 0.7}s;--dot-shift:${12 + index % 18}px"/>`).join("")}</svg>`;
  }
  if (theme === "spray") {
    return `<svg class="page-theme page-theme--spray" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true"><g>${[0, 1, 2, 3, 4, 5, 6].map((line) => `<path style="--spray-delay:${line * -.8}s" d="M35 ${210 + line * 11} Q440 ${120 + line * 18} 1435 ${24 + line * 54}"/>`).join("")}</g><circle class="spray-nozzle" cx="35" cy="265" r="5"/></svg>`;
  }
  if (theme === "putty") {
    return `<svg class="page-theme page-theme--putty" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 105 Q280 44 600 103 T1480 86"/><path d="M-40 221 Q300 155 640 223 T1480 205"/><path d="M-40 344 Q310 278 670 347 T1480 320"/></svg>`;
  }
  if (theme === "rent") {
    return `<svg class="page-theme page-theme--hose" viewBox="0 0 520 420" aria-hidden="true"><path class="hose-line" pathLength="100" d="M-36 355 C110 360 190 352 218 310 C247 266 191 235 203 172 C216 103 321 81 374 130 C429 181 398 260 344 269 C302 276 277 244 285 211 C292 178 326 166 349 182 C371 197 365 224 347 232"/></svg>`;
  }
  if (theme === "fire") {
    return `<svg class="page-theme page-theme--rings" viewBox="0 0 520 420" aria-hidden="true"><circle cx="260" cy="210" r="40"/><circle cx="260" cy="210" r="40"/><circle cx="260" cy="210" r="40"/></svg>`;
  }
  if (theme === "nozzle") {
    return `<svg class="nozzle-diagram" viewBox="0 0 300 300" aria-hidden="true"><path class="nozzle-body" d="M48 151h82l22-18 26 4 13 14-13 14-26 4-22-18H48l-12 12v-24z"/><path class="nozzle-fan" d="M190 151 286 77M190 151h103M190 151l96 76"/><path class="nozzle-fan nozzle-fan--thin" d="M190 151 270 99M190 151h85M190 151l80 52"/></svg>`;
  }
  return "";
}

function pageHero(title, lead, crumb, theme = "blueprint") {
  return `<section class="page-hero page-hero--${theme}"><div class="page-hero-particles" aria-hidden="true"><i></i><i></i><i></i></div>${pageTheme(theme)}<div class="container">${breadcrumbs(crumb)}<p class="eyebrow">NORD / ДАВЛЕНИЕ · ПОТОК · ТОЧНОСТЬ</p><h1>${title}</h1><p class="lead">${lead}</p><div class="hero-pressure-scale" aria-hidden="true"><span>0</span><i></i><span>MAX</span></div></div></section>`;
}

function comparisonSlider({ id, compact = false, caption = "Идеальный результат начинается с точного подбора техники." } = {}) {
  // TODO: Replace the illustrated before/after scenes with matching real job-site photos from the customer.
  return `<section class="comparison-section ${compact ? "comparison-section--compact" : ""}">
    ${compact ? "" : `<div class="comparison-heading"><p class="eyebrow">Результат точной подачи</p><h2>Идеальный результат</h2><p>${caption}</p></div>`}
    <div class="comparison-slider ${compact ? "comparison-slider--compact" : ""}" data-comparison tabindex="0" role="slider" aria-label="Сравнение результата до и после работы" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--split:50%">
      <div class="comparison-art comparison-art--before" aria-hidden="true"><svg viewBox="0 0 960 480" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="wall-before-${id}" x2="0" y2="1"><stop stop-color="#e3e8ee"/><stop offset="1" stop-color="#c7d0dc"/></linearGradient><pattern id="grain-before-${id}" width="42" height="38" patternUnits="userSpaceOnUse"><path d="M-4 12 Q5 7 12 13t16 0 21 1M-6 29q9-5 18 0t18 0 17 1" fill="none" stroke="#64748b" stroke-opacity=".34" stroke-width="2"/><circle cx="10" cy="23" r="1.5" fill="#8793a2" fill-opacity=".5"/><circle cx="31" cy="6" r="1.2" fill="#8793a2" fill-opacity=".46"/></pattern></defs><rect width="960" height="480" fill="#e9edf2"/><path d="M0 0h960v387H0z" fill="url(#wall-before-${id})"/><path d="M0 0h960v387H0z" fill="url(#grain-before-${id})" opacity=".7"/><path d="M0 336q105-26 192 0t175-9q115-41 213-9t189-15q91-28 191-8v92H0z" fill="#dbe1e9"/><path d="M0 339q105-27 192 0t175-10q115-40 213-8t189-15q91-29 191-8" fill="none" stroke="#8c99aa" stroke-width="4" stroke-dasharray="9 7" opacity=".65"/><path d="M0 387h960v93H0z" fill="#acb8c7"/><path d="M0 405h960" stroke="#8d9aad" stroke-width="3" opacity=".5"/></svg></div>
      <div class="comparison-art comparison-art--after" aria-hidden="true"><svg viewBox="0 0 960 480" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="wall-after-${id}" x2="0" y2="1"><stop stop-color="#fafdff"/><stop offset="1" stop-color="#dbe7f5"/></linearGradient><linearGradient id="light-after-${id}" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".74"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="960" height="480" fill="#eaf0f7"/><path d="M0 0h960v387H0z" fill="url(#wall-after-${id})"/><path d="M0 0h960v387H0z" fill="url(#light-after-${id})"/><path d="M0 387h960v93H0z" fill="#c6d5e8"/><path d="M0 387h960" stroke="#9db1cb" stroke-width="3"/><path d="M78 54v272m804-272v272" stroke="#ffffff" stroke-opacity=".65" stroke-width="2"/></svg></div>
      <span class="comparison-label comparison-label--before">До</span><span class="comparison-label comparison-label--after">С оборудованием NORD</span>
      <span class="comparison-divider" aria-hidden="true"><span>↔</span></span>
    </div>
    ${compact ? "" : `<p class="comparison-caption">Сравните фактуру поверхности — плавно передвиньте разделитель.</p>`}
  </section>`;
}

function contactBand(title = "Нужна помощь с подбором?", text = "Расскажите о задаче — поможем выбрать подходящее оборудование.") {
  return `<div class="contact-band"><div><h2>${title}</h2><p>${text}</p></div><a class="button button-primary" href="contacts.html">Связаться с Nord <span aria-hidden="true">↗</span></a></div>`;
}

function renderHome() {
  return `<section class="hero"><div class="container hero-grid">
    <div class="hero-copy"><p class="eyebrow">Оборудование для профессиональной отделки</p><h1>Техника для работы.<br><span>Подбор без лишнего.</span></h1><p>Окрасочные аппараты, оборудование для шпаклёвки и огнезащиты — в продажу и аренду. Поможем подобрать решение под объект и материал.</p>
      <div class="hero-actions"><a class="button button-primary" href="catalog.html">Перейти в каталог <span>→</span></a><a class="button button-outline" href="rent.html">Аренда оборудования</a></div>
      <div class="hero-points"><span>Продажа и аренда</span><span>Подбор под задачу</span><span>Москва и доставка</span></div>
    </div>
    <div class="hero-visual"><span class="hero-podium" aria-hidden="true"></span><img src="${productImage(products[1], 1)}" alt="Окрасочный аппарат PUTTER 9528-X QuickReel"><div class="hero-stamp hero-chip hero-chip-model"><strong>PUTTER 9528-X</strong><span>Система QuickReel</span></div><div class="hero-stamp hero-chip hero-chip-flow"><strong>11 л/мин</strong><span>Подача материала</span></div><div class="hero-stamp hero-chip hero-chip-pressure"><strong>230 бар</strong><span>Рабочее давление</span></div><div class="hero-flow-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div>
  </div>${paintParticles()}</section>
  <section class="section section-soft comparison-wrap">${comparisonSlider({ id: "home", caption: "Ровная подача материала помогает получить аккуратное покрытие на объекте." })}</section>
  <section class="section"><div class="container"><div class="benefit-strip"><div class="benefit"><span class="benefit-icon">↗</span><div><strong>Подбор техники</strong><span>С учётом задачи и материала</span></div></div><div class="benefit"><span class="benefit-icon">▣</span><div><strong>Продажа и аренда</strong><span>Варианты под ваш срок и объём</span></div></div><div class="benefit"><span class="benefit-icon">⌁</span><div><strong>Комплектующие</strong><span>Оснащение для рабочего процесса</span></div></div><div class="benefit"><span class="benefit-icon">⌖</span><div><strong>Москва</strong><span>Самовывоз и доставка</span></div></div></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Каталог NORD</p><h2>Оборудование<br>под ваши задачи</h2></div><p>Выберите направление — или расскажите, что предстоит сделать, и мы поможем сориентироваться.</p></div><div class="category-grid">${categories.map((item) => `<a class="category-card" href="category.html?category=${item.id}"><span class="category-number">${item.icon} / НАПРАВЛЕНИЕ</span><div><h3>${item.name}</h3><p>${item.description}</p></div><span class="category-arrow" aria-hidden="true">↗</span></a>`).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Выбор Nord</p><h2>Популярное оборудование</h2></div><a class="button button-outline" href="catalog.html">Весь каталог →</a></div><div class="product-grid">${products.map(productCard).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="promo-banner"><div><p class="eyebrow">Новинка · QuickReel</p><h2>Шланг — под контролем.<br>Объект — в порядке.</h2><p>PUTTER 9528-X с системой для удобного сматывания шланга — для интенсивной работы с красками, шпаклёвками и огнезащитными материалами.</p></div><a class="button" href="${productUrl(products[1])}">Подробнее об аппарате <span>↗</span></a></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Почему NORD</p><h2>Сначала задача.<br>Потом оборудование.</h2></div><p>Хороший подбор начинается не с громких обещаний, а с понимания материала, объёма работ и условий объекта.</p></div><div class="steps-grid"><article class="step-card"><span class="step-num">01</span><h3>Разбираемся в задаче</h3><p>Учитываем тип работ, материал, масштаб объекта и важные условия на площадке.</p><svg class="step-flow-visual" viewBox="0 0 220 90" aria-hidden="true"><path class="flow-track" d="M12 70h49l22-36h57l20 22h48"/><circle cx="83" cy="34" r="6"/><circle cx="140" cy="34" r="4"/></svg></article><article class="step-card"><span class="step-num">02</span><h3>Сравниваем варианты</h3><p>Показываем характеристики и помогаем понять, чем модели отличаются для вашей работы.</p><svg class="step-flow-visual" viewBox="0 0 220 90" aria-hidden="true"><path class="flow-track" d="M12 70h43l18-45h39l20 45h75"/><path class="flow-secondary" d="M12 70h45l20-23h43l18 23h69"/></svg></article><article class="step-card"><span class="step-num">03</span><h3>Согласуем детали</h3><p>Уточняем наличие, комплектацию, срок аренды или условия покупки до оформления.</p><svg class="step-flow-visual" viewBox="0 0 220 90" aria-hidden="true"><path class="flow-track" d="M12 70h44l28-34h43l26 18h54"/><circle class="flow-pulse" cx="84" cy="36" r="5"/></svg></article></div></div></section>
  <section class="section"><div class="container split-panel"><div><p class="eyebrow">О компании</p><h2>Nord — техника<br>для дела.</h2><p class="lead">Мы работаем с оборудованием для малярных и отделочных работ: помогаем с выбором, предлагаем технику в продажу и аренду.</p><a class="button button-outline" href="about.html">О компании →</a></div><div class="about-facts"><div class="fact"><strong>Продажа</strong><span>Окрасочные аппараты и оснащение</span></div><div class="fact"><strong>Аренда</strong><span>Окраска, шпаклёвка, огнезащита</span></div><div class="fact"><strong>Подбор</strong><span>Под задачу и материал</span></div><div class="fact"><strong>Москва</strong><span>Точка выдачи оборудования</span></div></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Полезное</p><h2>Материалы и новости</h2></div><a class="button button-outline" href="blog.html">Все статьи →</a></div><div class="article-grid">${articles.slice(0, 3).map(articleCard).join("")}</div></div></section>
  <section class="section"><div class="container">${contactBand("Подберём оборудование под вашу работу", "Опишите материал, объём и условия объекта — обсудим подходящие варианты.")}</div></section>`;
}

function articleCard(item) {
  return `<article class="article-card"><p class="eyebrow">${item.tag}</p><h3>${item.title}</h3><p>${item.teaser}</p><a href="article.html?id=${item.id}">Читать материал →</a></article>`;
}

function renderCatalog() {
  return `${pageHero("Каталог оборудования", "Окрасочная техника, решения для шпаклёвки и огнезащиты, комплектующие и расходные материалы.", "Каталог", "spray")}
  <section class="section"><div class="container"><div class="category-tiles">${categories.map((item) => `<div class="category-tile"><a href="category.html?category=${item.id}"><strong>${item.name}</strong><span>${item.description}</span></a><div class="category-subcats">${item.children.map(([name, href]) => `<a href="${href}">${name} ↗</a>`).join("")}</div></div>`).join("")}</div><div class="section-heading"><div><p class="eyebrow">Окрасочное оборудование</p><h2>Аппараты в каталоге</h2></div><p>Смотрите характеристики, фотографии и варианты комплектации в карточке каждой модели.</p></div><div class="product-grid">${products.map(productCard).join("")}</div><div style="margin-top:36px">${contactBand()}</div></div></section>`;
}

function renderCategory() {
  const params = new URLSearchParams(location.search);
  const selectedCategory = categories.find((item) => item.id === params.get("category")) || categories[0];
  const flowPreset = params.get("flow");
  const reelPreset = params.get("feature") === "quickreel";
  const selectedSubcategory = selectedCategory.children.find(([, href]) => {
    const childParams = new URLSearchParams(href.split("?")[1]);
    return ["subcategory", "flow", "feature"].some((key) => params.has(key) && params.get(key) === childParams.get(key));
  })?.[0];
  const available = selectedCategory.id === "painting"
    ? products.filter((item) => item.category === "painting")
    : selectedCategory.id === "putty" || selectedCategory.id === "fire"
      ? products.filter((item) => item.id === "putter-9528x")
      : [];
  const sectionTheme = selectedCategory.id === "painting" ? "spray" : selectedCategory.id === "putty" ? "putty" : selectedCategory.id === "fire" ? "fire" : "blueprint";
  const materialPreset = selectedCategory.id === "fire" ? "fire" : selectedCategory.id === "putty" ? "putty" : "";
  return `${pageHero(selectedSubcategory || selectedCategory.name, selectedCategory.description, selectedCategory.name, sectionTheme)}
  <section class="section category-section category-section--${sectionTheme}">${pageTheme(sectionTheme)}<div class="container">
    ${!available.length ? `<div class="empty-state"><h2>Подбор оборудования</h2><p>Расскажите, какой материал и объём работ планируются. Поможем подобрать подходящее решение и уточним наличие.</p><a class="button button-primary" href="contacts.html">Запросить подбор</a></div>` : `
      <div class="catalog-layout">
        <aside class="filter-panel" aria-label="Фильтры каталога"><h3>Фильтры</h3>
          <fieldset class="filter-group"><legend>Тип привода</legend><label><input type="checkbox" name="drive" value="electric"> Электрический</label></fieldset>
          <fieldset class="filter-group"><legend>Производительность</legend><label><input type="radio" name="flow" value="compact" ${flowPreset === "compact" ? "checked" : ""}> До 6 л/мин</label><label><input type="radio" name="flow" value="high" ${flowPreset === "high" ? "checked" : ""}> От 10 л/мин</label></fieldset>
          <fieldset class="filter-group"><legend>Система</legend><label><input type="checkbox" name="reel" value="quickreel" ${reelPreset ? "checked" : ""}> QuickReel</label></fieldset>
          <fieldset class="filter-group"><legend>Материал</legend><label><input type="checkbox" name="material" value="paint"> Краска</label><label><input type="checkbox" name="material" value="putty" ${materialPreset === "putty" ? "checked" : ""}> Шпаклёвка</label><label><input type="checkbox" name="material" value="fire" ${materialPreset === "fire" ? "checked" : ""}> Огнезащита</label></fieldset>
          <button class="button button-outline button-full" type="button" data-clear-filters>Сбросить фильтры</button>
        </aside>
        <div><div class="filter-row"><label class="visually-hidden" for="product-search">Поиск товара</label><input id="product-search" type="search" placeholder="Модель или название"><span class="result-count" data-result-count></span></div><div class="catalog-products" data-filter-products>${available.map(productCard).join("")}</div>${selectedCategory.id !== "painting" ? `<p class="form-note">Подходит для работ с ${selectedCategory.id === "fire" ? "огнезащитными материалами" : "шпаклёвочными составами"} согласно описанию аппарата.</p>` : ""}</div>
      </div>`}
    <div style="margin-top:36px">${contactBand()}</div>
  </div></section>`;
}

function renderProduct() {
  const product = products.find((item) => item.id === new URLSearchParams(location.search).get("id")) || products[0];
  const saved = favorites.includes(product.id);
  return `${pageHero(product.name, product.description, product.shortName, "nozzle")}
  <section class="section"><div class="container"><div class="product-layout">
    <div><div class="gallery-main">${pageTheme("nozzle")}<img data-gallery-main src="${productImage(product)}" alt="${product.images[0][1]}"></div><div class="gallery-thumbs" role="group" aria-label="Фотографии ${product.shortName}">${product.images.map(([file, alt], index) => `<button class="gallery-thumb" type="button" data-gallery-src="${asset(product, file)}" data-gallery-alt="${alt}" aria-label="Фото ${index + 1}: ${alt}" aria-pressed="${index === 0}"><img src="${asset(product, file)}" alt="" loading="lazy"></button>`).join("")}</div></div>
    <div class="product-detail-copy"><span class="badge">${product.badge}</span><h1>${product.name}</h1><p>${product.description}</p><div class="detail-price">${money.format(product.price)} ₽${product.oldPrice ? `<del>${money.format(product.oldPrice)} ₽</del>` : ""}</div><div class="detail-actions"><button class="button button-primary" type="button" data-add-cart="${product.id}">Добавить в корзину</button><button class="icon-button ${saved ? "is-active" : ""}" type="button" data-favorite="${product.id}" aria-label="${saved ? "Убрать из избранного" : "В избранное"}" aria-pressed="${saved}">♡</button></div><table class="spec-table"><tbody>${product.specs.map(([name, value]) => `<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("")}</tbody></table>    <div class="detail-section"><h3>Для каких материалов</h3><p>${product.materials}</p></div>${product.id === "putter-9528x" ? '<div class="detail-section"><h3>Гарантия</h3><p>2 года гарантии от магазина.</p></div>' : ""}<div class="detail-section"><h3>Комплектация</h3><p>Состав комплекта зависит от выбранной комплектации. Уточните его при заказе оборудования.</p></div><div class="detail-section product-result"><h3>Результат работы аппаратом ${product.shortName}</h3>${comparisonSlider({ id: product.id, compact: true })}</div></div>
  </div><section class="section"><div class="section-heading"><div><p class="eyebrow">Другие модели</p><h2>Похожие товары</h2></div></div><div class="product-grid">${products.filter((item) => item.id !== product.id).map(productCard).join("")}</div></section></div></section>`;
}

function renderCart() {
  const entries = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product);
  if (!entries.length) return `${pageHero("Корзина", "Товары, которые вы выбрали.", "Корзина")}<section class="section"><div class="container"><div class="empty-state"><h2>В корзине пока пусто</h2><p>Выберите подходящее оборудование в каталоге.</p><a class="button button-primary" href="catalog.html">Перейти в каталог</a></div></div></section>`;
  const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return `${pageHero("Корзина", "Проверьте выбранное оборудование и количество.", "Корзина")}<section class="section"><div class="container cart-layout"><div class="cart-list">${entries.map(({ product, quantity }) => `<article class="cart-row"><a href="${productUrl(product)}"><img src="${productImage(product)}" alt="${product.images[0][1]}"></a><div><h3><a href="${productUrl(product)}">${product.name}</a></h3><p>${money.format(product.price)} ₽ за единицу</p></div><div class="cart-row-actions"><div class="quantity"><button type="button" data-quantity="${product.id}" data-delta="-1" aria-label="Уменьшить количество">−</button><strong>${quantity}</strong><button type="button" data-quantity="${product.id}" data-delta="1" aria-label="Увеличить количество">+</button></div><button class="remove-button" type="button" data-remove-cart="${product.id}">Удалить</button></div></article>`).join("")}</div><aside class="summary-card"><h3>Итого</h3><div class="summary-line"><span>Товары (${entries.reduce((sum, item) => sum + item.quantity, 0)})</span><strong>${money.format(total)} ₽</strong></div><div class="summary-total"><span>Сумма</span><span>${money.format(total)} ₽</span></div><a class="button button-primary button-full" href="contacts.html?order=1">Оформить заказ</a><p class="form-note">Условия заказа и наличие согласуются при обращении.</p></aside></div></section>`;
}

function renderFavorites() {
  const saved = products.filter((item) => favorites.includes(item.id));
  return `${pageHero("Избранное", "Сохранённые модели оборудования.", "Избранное")}<section class="section"><div class="container">${saved.length ? `<div class="product-grid">${saved.map(productCard).join("")}</div>` : `<div class="empty-state"><h2>Здесь появятся ваши модели</h2><p>Нажмите на значок ♡ в карточке оборудования, чтобы сохранить его.</p><a class="button button-primary" href="catalog.html">Открыть каталог</a></div>`}</div></section>`;
}

function renderAccount() {
  return `${pageHero("Личный кабинет", "Вход для клиентов Nord.", "Личный кабинет")}<section class="section"><div class="container login-wrap"><div class="login-card"><p class="eyebrow">Вход в кабинет</p><h2>Рады видеть вас</h2><form data-login-form><div class="form-field"><label for="login-phone">Номер телефона</label><input class="form-control" id="login-phone" name="phone" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div><div class="form-field"><label for="login-password">Пароль</label><input class="form-control" id="login-password" name="password" type="password" autocomplete="current-password" required></div><button class="button button-primary button-full" type="submit">Войти</button><p class="form-status" data-login-status aria-live="polite">Для доступа к заказам обратитесь к менеджеру Nord.</p></form></div></div></section>`;
}

function renderRent() {
  const rates = [
    ["Окраска · компактные задачи", "Аппараты 2–4 л", [["1–2 дня", "1 700 ₽ / сутки"], ["От 2 дней", "1 500 ₽ / сутки"]]],
    ["Окраска · большой объём", "Аппараты 6–9 л", [["1–3 дня", "2 500 ₽ / сутки"], ["От 3 дней", "2 000 ₽ / сутки"]]],
    ["Шпаклёвочные работы", "Шнековая станция + компрессор", [["1–2 дня", "2 000 ₽ / сутки"], ["От 2 дней", "1 500 ₽ / сутки"]]],
    ["Огнезащитные материалы", "Аппарат для огнезащиты", [["Стоимость", "Уточните при обращении"]]],
  ];
  return `${pageHero("Аренда оборудования", "Окрасочные аппараты, шпаклёвочные станции и техника для огнезащиты в Москве.", "Аренда", "rent")}
  <section class="section"><div class="container"><div class="rent-grid">${rates.map(([tag, name, lines]) => `<article class="rent-card"><p class="eyebrow">${tag}</p><h3>${name}</h3>${lines.map(([period, price]) => `<div class="rent-price-line"><span>${period}</span><strong>${price}</strong></div>`).join("")}</article>`).join("")}</div><div class="info-grid" style="margin-top:16px"><article class="info-card"><p class="eyebrow">Срок аренды</p><h3>Краткосрочно и надолго</h3><p>Доступна долгосрочная аренда. Условия согласуются индивидуально.</p></article><article class="info-card"><p class="eyebrow">Для бизнеса</p><h3>Компании и ИП</h3><p>Работа с юридическими лицами и индивидуальными предпринимателями.</p></article><article class="info-card"><p class="eyebrow">Получение техники</p><h3>Доставка или самовывоз</h3><p>Доставка доступна по согласованию с Nord.</p></article></div><div class="section" style="padding-bottom:0"><div class="section-heading"><div><p class="eyebrow">Самовывоз и доставка</p><h2>Точка выдачи в Москве</h2></div></div><div class="address-card"><h3>Окружной проезд, 34Ас6</h3><p>Соколиная гора · 6–10 мин<br>Шоссе Энтузиастов · 11–15 мин<br>Сортировочная · 21–30 мин</p><a href="https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9E%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B5%D0%B7%D0%B4%2C%2034%D0%90%D1%816" target="_blank" rel="noreferrer">Показать на карте ↗</a></div></div><div style="margin-top:30px">${contactBand("Уточнить аренду", "Согласуем доступность техники, срок, комплектацию и доставку.")}</div></div></section>`;
}

function renderAbout() {
  return `${pageHero("О компании Nord", "Профессиональное оборудование для малярных и отделочных работ.", "О компании", "corporate")}
  <section class="section"><div class="container split-panel"><div><p class="eyebrow">Nord · оборудование для дела</p><h2>Техника, которая помогает работать.</h2><p class="lead">Nord предлагает оборудование для окраски, шпаклёвочных и огнезащитных работ. Можно выбрать аппарат для покупки или подобрать технику в аренду.</p><p class="lead">Помогаем разобраться в характеристиках, комплектации и соответствии оборудования рабочей задаче.</p></div><div class="about-facts"><div class="fact"><strong>Продажа</strong><span>Окрасочные аппараты</span></div><div class="fact"><strong>Аренда</strong><span>От краткого срока до долгосрочной</span></div><div class="fact"><strong>Подбор</strong><span>Под материал и объект</span></div><div class="fact"><strong>Москва</strong><span>Точка выдачи оборудования</span></div></div></div></section><section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Наш подход</p><h2>Понятный выбор техники</h2></div></div><div class="steps-grid"><article class="step-card"><span class="step-num">01</span><h3>Уточняем условия</h3><p>Какой материал предстоит наносить, где и в каком объёме?</p></article><article class="step-card"><span class="step-num">02</span><h3>Подбираем вариант</h3><p>Обсуждаем характеристики, оснащение и формат — покупка или аренда.</p></article><article class="step-card"><span class="step-num">03</span><h3>Согласуем детали</h3><p>Подтверждаем наличие, комплект и условия до заказа или бронирования.</p></article></div></div></section>`;
}

function renderContacts() {
  return `${pageHero("Контакты Nord", "Обсудите задачу по телефону при обращении или оставьте описание для подготовки.", "Контакты", "corporate")}
  <section class="section"><div class="container form-layout"><div><p class="eyebrow">Москва · точка выдачи</p><h2>Окружной проезд,<br>34Ас6</h2><p class="lead">Соколиная гора — 6–10 минут<br>Шоссе Энтузиастов — 11–15 минут<br>Сортировочная — 21–30 минут</p><a class="button button-outline" href="https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9E%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B5%D0%B7%D0%B4%2C%2034%D0%90%D1%816" target="_blank" rel="noreferrer">Открыть карту ↗</a></div><div class="form-card"><h2>Напишите нам</h2><p class="form-note">Опишите задачу и оставьте контакт — подготовим текст обращения, который можно отправить менеджеру.</p><form data-contact-form><div class="form-grid"><div class="form-field"><label for="contact-name">Ваше имя</label><input class="form-control" id="contact-name" name="name" autocomplete="name" required minlength="2"></div><div class="form-field"><label for="contact-phone">Телефон или другой контакт</label><input class="form-control" id="contact-phone" name="phone" autocomplete="tel" required></div><div class="form-field form-field-wide"><label for="contact-message">Что нужно подобрать?</label><textarea class="form-control" id="contact-message" name="message" required minlength="10"></textarea></div></div><button class="button button-primary" type="submit">Подготовить обращение</button><p class="form-status" data-contact-status aria-live="polite"></p><div class="copy-draft" data-copy-draft><textarea class="form-control" data-draft-text aria-label="Текст обращения"></textarea><button class="button button-outline" type="button" data-copy-text>Скопировать текст</button></div></form></div></div></section>`;
}

function renderDelivery() {
  return `${pageHero("Доставка и самовывоз", "Согласуйте удобный способ получения оборудования с менеджером Nord.", "Доставка")}
  <section class="section"><div class="container"><div class="info-grid"><article class="info-card"><p class="eyebrow">Самовывоз</p><h3>Точка выдачи</h3><p>Москва, Окружной проезд, 34Ас6. Время визита согласуйте перед поездкой.</p></article><article class="info-card"><p class="eyebrow">Доставка</p><h3>До вашего объекта</h3><p>Доставка доступна по согласованию. Стоимость, срок и адрес уточняются при оформлении.</p></article><article class="info-card"><p class="eyebrow">Заказ</p><h3>Подтверждение деталей</h3><p>Перед получением согласуйте наличие, комплектацию и способ перевозки выбранной модели.</p></article></div><div style="margin-top:30px">${contactBand("Согласовать получение", "Укажите модель и адрес — уточним доступные варианты.")}</div></div></section>`;
}

function renderWarranty() {
  return `${pageHero("Гарантии и сервис", "Условия гарантийного обслуживания зависят от модели и продавца.", "Гарантии")}
  <section class="section"><div class="container"><div class="info-grid"><article class="info-card"><p class="eyebrow">До покупки</p><h3>Условия по модели</h3><p>Уточните срок гарантии, перечень случаев обслуживания и документы для обращения при заказе конкретного аппарата.</p></article><article class="info-card"><p class="eyebrow">Обслуживание</p><h3>Сервисная поддержка</h3><p>Для вопросов по эксплуатации подготовьте модель, описание задачи и сведения о материале.</p></article><article class="info-card"><p class="eyebrow">Запчасти</p><h3>Комплектация и детали</h3><p>Совместимость запасных частей подтверждается для точной модели оборудования.</p></article></div><div style="margin-top:30px">${contactBand("Нужна консультация по аппарату?", "Укажите точную модель и вопрос по гарантии или обслуживанию.")}</div></div></section>`;
}

function renderBlog() {
  return `${pageHero("Статьи и новости", "Полезные материалы о подборе, оборудовании и аренде.", "Статьи и новости")}<section class="section"><div class="container"><div class="article-grid">${articles.map(articleCard).join("")}</div></div></section>`;
}

function renderArticle() {
  const item = articles.find((article) => article.id === new URLSearchParams(location.search).get("id")) || articles[0];
  const content = {
    "choose-sprayer": `<p>Подбор начинается с материала и условий объекта. Один и тот же аппарат может по-разному подходить для разных составов и объёмов работ.</p><h2>Что учесть перед выбором</h2><ul><li>Тип материала и рекомендации его производителя по нанесению.</li><li>Площадь, темп и продолжительность работ.</li><li>Требуемые длина шланга и удобство перемещения на объекте.</li><li>Производительность, максимальное давление и допустимый размер сопла конкретной модели.</li><li>Наличие подходящих фильтров, пистолета и других элементов комплекта.</li></ul><p>Сверьте параметры с руководством аппарата и технической документацией материала. Если остаются вопросы, подготовьте эти данные для консультации.</p>`,
    quickreel: `<p>QuickReel — система для сматывания шланга на аппарате PUTTER 9528-X. Она позволяет размотать нужную длину на площадке и убрать шланг после завершения работ.</p><h2>Перед началом работ</h2><ul><li>Проверьте состояние шланга, соединений и фиксаторов.</li><li>Разматывайте шланг на длину, необходимую для рабочего участка.</li><li>Не допускайте перегибов и контакта шланга с острыми кромками.</li><li>При очистке и хранении следуйте руководству к оборудованию.</li></ul><p>Фактическая комплектация и порядок использования зависят от исполнения аппарата.</p>`,
    "rental-guide": `<p>Предварительная проверка помогает согласовать подходящий комплект и избежать задержек на объекте.</p><h2>Что уточнить до бронирования</h2><ul><li>Какой материал и на какую поверхность планируется наносить.</li><li>На сколько дней нужна техника и когда её можно забрать.</li><li>Какие аксессуары входят в комплект и что понадобится отдельно.</li><li>Доступны ли доставка или самовывоз и какова стоимость доставки.</li><li>Каковы действующие условия залога и возврата.</li></ul><p>Тарифы зависят от категории оборудования и срока аренды. Актуальную доступность и итоговую стоимость подтвердите перед бронированием.</p>`,
    "sprayer-care": `<p>Остатки материала могут мешать следующему рабочему циклу. Порядок очистки и допустимая промывочная жидкость определяются руководством конкретного аппарата и требованиями материала.</p><h2>Базовый порядок</h2><ul><li>Безопасно сбросьте давление согласно инструкции аппарата.</li><li>Используйте только рекомендованный способ очистки для данного состава.</li><li>Проверьте фильтры, соединения и видимые части шланга.</li><li>Храните оборудование в условиях, указанных производителем.</li></ul><p>Не разбирайте узлы под давлением. Для точных процедур используйте руководство вашей модели.</p>`,
  }[item.id];
  return `${pageHero(item.title, item.teaser, "Статьи")}<section class="section"><article class="container article-body"><p class="eyebrow">${item.tag} · NORD</p>${content}<div style="margin-top:36px">${contactBand("Обсудить оборудование", "Поможем подобрать технику под ваш материал и задачу.")}</div></article></section>`;
}

function renderPage() {
  const page = document.body.dataset.page;
  const renderers = {
    home: renderHome,
    catalog: renderCatalog,
    category: renderCategory,
    product: renderProduct,
    cart: renderCart,
    favorites: renderFavorites,
    account: renderAccount,
    rent: renderRent,
    about: renderAbout,
    contacts: renderContacts,
    delivery: renderDelivery,
    warranty: renderWarranty,
    blog: renderBlog,
    article: renderArticle,
  };
  document.querySelector("#main").innerHTML = (renderers[page] || renderHome)();
  const main = document.querySelector("#main");
  const existingCta = main.querySelector(".contact-band");
  let cta = existingCta;
  if (existingCta) {
    const oldSection = existingCta.closest(".section");
    const oldContainer = existingCta.closest(".container");
    const oldWrapper = existingCta.parentElement;
    existingCta.remove();
    if (oldWrapper && oldWrapper !== oldContainer && !oldWrapper.children.length && !oldWrapper.textContent.trim()) oldWrapper.remove();
    if (oldSection && oldContainer && !oldContainer.children.length && !oldContainer.textContent.trim()) oldSection.remove();
  } else {
    const template = document.createElement("template");
    template.innerHTML = contactBand("Точная задача — точное решение", "Опишите материал и условия объекта. Подберём технику и согласуем следующий шаг.");
    cta = template.content.firstElementChild;
  }
  main.insertAdjacentHTML("beforeend", `<section class="section is-contrast shared-cta"><div class="container"></div></section>`);
  main.querySelector(".shared-cta .container").append(cta);
  document.title = `${(document.querySelector("#main h1")?.innerText || "NORD").replace(/\s+/g, " ").trim()} — NORD`;
  if (page === "contacts" && new URLSearchParams(location.search).has("order")) {
    const lines = Object.entries(cart)
      .map(([id, quantity]) => {
        const product = products.find((item) => item.id === id);
        return product ? `${product.name} — ${quantity} шт.` : "";
      })
      .filter(Boolean);
    const messageField = document.querySelector("#contact-message");
    if (messageField && lines.length) messageField.value = `Интересует заказ:\n${lines.join("\n")}`;
  }
  decorateSensors(main);
  animateHeadlines(main);
  revealTargets(main);
}

function decorateSensors(root) {
  root.querySelectorAll(".product-card, .category-card, .category-tile, .rent-card, .step-card, .info-card, .article-card, .benefit, .fact, .summary-card, .empty-state, .form-card, .login-card").forEach((card, index) => {
    card.classList.add("is-sensor");
    card.style.setProperty("--sensor-order", index % 5);
    if (card.querySelector(".sensor-gauge")) return;
    card.insertAdjacentHTML("afterbegin", `<span class="sensor-gauge" aria-hidden="true"><svg viewBox="0 0 40 40"><circle class="sensor-gauge-track" cx="20" cy="20" r="16"/><circle class="sensor-gauge-value" cx="20" cy="20" r="16"/></svg><span>${String((index % 5) * 20 + 20).padStart(2, "0")}</span></span>`);
  });
}

function animateHeadlines(root) {
  root.querySelectorAll("h1").forEach((heading) => {
    if (heading.dataset.animated) return;
    heading.dataset.animated = "true";
    heading.querySelectorAll(":scope > span").forEach((line, index) => {
      line.classList.add("headline-line");
      line.style.setProperty("--line-order", index);
    });
    [...heading.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
      const line = document.createElement("span");
      line.className = "headline-line";
      line.textContent = node.textContent.trim();
      heading.replaceChild(line, node);
    });
  });
}

function updateCounts() {
  const cartCount = Object.values(cart).reduce((sum, value) => sum + value, 0);
  if (updateCounts.lastCartCount === undefined) updateCounts.lastCartCount = cartCount;
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cartCount;
    if (cartCount !== updateCounts.lastCartCount) {
      el.classList.remove("is-pulsing");
      void el.offsetWidth;
      el.classList.add("is-pulsing");
    }
  });
  document.querySelectorAll("[data-favorites-count]").forEach((el) => { el.textContent = favorites.length; });
  updateCounts.lastCartCount = cartCount;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2100);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.matches(".menu-toggle")) {
    const nav = document.querySelector("#site-nav");
    const open = target.getAttribute("aria-expanded") !== "true";
    target.setAttribute("aria-expanded", String(open));
    target.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("is-open", open);
  }
  if (target.matches("[data-add-cart]")) {
    const id = target.dataset.addCart;
    cart[id] = (cart[id] || 0) + 1;
    setStored("nord-v2-cart", cart);
    updateCounts();
    const originalLabel = target.textContent;
    target.textContent = "✓ Добавлено";
    target.classList.add("is-added");
    window.setTimeout(() => {
      if (!target.isConnected) return;
      target.textContent = originalLabel;
      target.classList.remove("is-added");
    }, 950);
    showToast("Товар добавлен в корзину");
  }
  if (target.matches("[data-favorite]")) {
    const id = target.dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setStored("nord-v2-favorites", favorites);
    renderPage();
    updateCounts();
    showToast(favorites.includes(id) ? "Добавлено в избранное" : "Удалено из избранного");
  }
  if (target.matches("[data-gallery-src]")) {
    const image = document.querySelector("[data-gallery-main]");
    image.src = target.dataset.gallerySrc;
    image.alt = target.dataset.galleryAlt;
    document.querySelectorAll("[data-gallery-src]").forEach((button) => button.setAttribute("aria-pressed", String(button === target)));
  }
  if (target.matches("[data-remove-cart]")) {
    delete cart[target.dataset.removeCart];
    setStored("nord-v2-cart", cart);
    renderPage();
    updateCounts();
  }
  if (target.matches("[data-quantity]")) {
    const id = target.dataset.quantity;
    cart[id] = Math.max(0, (cart[id] || 0) + Number(target.dataset.delta));
    if (!cart[id]) delete cart[id];
    setStored("nord-v2-cart", cart);
    renderPage();
    updateCounts();
  }
  if (target.matches("[data-clear-filters]")) {
    document.querySelectorAll(".filter-panel input").forEach((input) => { input.checked = false; });
    const search = document.querySelector("#product-search");
    if (search) search.value = "";
    filterProducts();
  }
  if (target.matches("[data-copy-text]")) {
    const draft = document.querySelector("[data-draft-text]");
    const selectDraft = () => {
      draft.focus();
      draft.select();
      showToast("Выделите и скопируйте текст вручную");
    };
    if (!navigator.clipboard?.writeText) {
      selectDraft();
    } else {
      navigator.clipboard.writeText(draft.value)
        .then(() => showToast("Текст обращения скопирован"))
        .catch(selectDraft);
    }
  }
});

function filterProducts() {
  const container = document.querySelector("[data-filter-products]");
  if (!container) return;
  const search = document.querySelector("#product-search").value.trim().toLocaleLowerCase("ru");
  const drive = document.querySelector('input[name="drive"]').checked;
  const flowMode = document.querySelector('input[name="flow"]:checked')?.value;
  const reel = document.querySelector('input[name="reel"]').checked;
  const materials = [...document.querySelectorAll('input[name="material"]:checked')].map((input) => input.value);
  const categoryId = new URLSearchParams(location.search).get("category") || "painting";
  const categoryProducts = categoryId === "painting"
    ? products.filter((product) => product.category === "painting")
    : categoryId === "putty" || categoryId === "fire"
      ? products.filter((product) => product.id === "putter-9528x")
      : [];
  const matches = categoryProducts.filter((product) => {
    const flow = Number(product.specs[0][1].match(/\d+/)?.[0] || 0);
    return (!search || `${product.name} ${product.description}`.toLocaleLowerCase("ru").includes(search))
      && (!drive || product.specs.some(([name, value]) => name === "Тип" && value.includes("Электрический")))
      && (!flowMode || (flowMode === "high" ? flow >= 10 : flow <= 6))
      && (!reel || product.id === "putter-9528x")
      && (!materials.length || materials.some((material) => material === "paint"
        ? /краск|лакокрас/i.test(product.materials)
        : material === "putty"
          ? /шпакл/i.test(product.materials)
          : /огнезащит/i.test(product.materials)));
  });
  container.innerHTML = matches.length ? matches.map(productCard).join("") : `<div class="empty-state"><h3>По вашему запросу ничего не найдено</h3><p>Измените фильтры или свяжитесь с нами для подбора.</p></div>`;
  decorateSensors(container);
  revealTargets(container);
  const count = document.querySelector("[data-result-count]");
  if (count) count.textContent = `Найдено: ${matches.length}`;
}

document.addEventListener("change", (event) => {
  if (event.target.matches('.filter-panel input')) filterProducts();
});
document.addEventListener("input", (event) => {
  if (event.target.matches("#product-search")) filterProducts();
});
document.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.matches("[data-login-form]")) {
    event.preventDefault();
    document.querySelector("[data-login-status]").textContent = "Для доступа к заказам свяжитесь с Nord через страницу контактов.";
  }
  if (form.matches("[data-contact-form]")) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const draft = `Обращение в Nord\nИмя: ${values.get("name")}\nКонтакт: ${values.get("phone")}\nЗадача: ${values.get("message")}`;
    document.querySelector("[data-draft-text]").value = draft;
    document.querySelector("[data-copy-draft]").classList.add("is-visible");
    document.querySelector("[data-contact-status]").textContent = "Текст обращения подготовлен. Скопируйте его и отправьте менеджеру.";
    document.querySelector("[data-contact-status]").classList.add("is-success");
  }
});

renderHeader();
renderFooter();
renderPage();
updateCounts();
if (document.body.dataset.page === "category") filterProducts();

const siteHeader = document.querySelector(".site-header");
let scrollFrame = 0;
let latestScrollY = window.scrollY;
const progress = document.createElement("div");
progress.className = "page-progress";
progress.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="page-gauge-track" cx="32" cy="32" r="27"/><circle class="page-gauge-value" cx="32" cy="32" r="27"/><path class="page-gauge-needle" d="M32 32 46 20"/><circle class="page-gauge-hub" cx="32" cy="32" r="2.5"/></svg><span>BAR</span>`;
progress.setAttribute("role", "progressbar");
progress.setAttribute("aria-label", "Прокрутка страницы");
progress.setAttribute("aria-valuemin", "0");
progress.setAttribute("aria-valuemax", "100");
progress.setAttribute("aria-valuenow", "0");
document.body.append(progress);
document.body.classList.add("page-enter");

function updateScrollEffects() {
  scrollFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? Math.min(100, Math.max(0, latestScrollY / scrollable * 100)) : 0;
  const gaugeValue = progress.querySelector(".page-gauge-value");
  const circumference = 2 * Math.PI * 27;
  gaugeValue.style.strokeDasharray = String(circumference);
  gaugeValue.style.strokeDashoffset = String(circumference * (1 - percentage / 100));
  progress.style.setProperty("--gauge-angle", `${percentage * 3.6}deg`);
  progress.setAttribute("aria-valuenow", String(Math.round(percentage)));
  siteHeader.classList.toggle("is-compact", latestScrollY > 32);

  const heroImage = document.querySelector(".hero-visual img");
  if (heroImage && !motionPreference.matches) {
    const hero = document.querySelector(".hero");
    const heroBottom = hero.getBoundingClientRect().bottom + latestScrollY;
    if (latestScrollY < heroBottom) {
      heroImage.dataset.speed ||= "0.36";
      const distanceIntoHero = Math.max(0, latestScrollY - hero.offsetTop);
      const offset = Math.min(48, distanceIntoHero * Number(heroImage.dataset.speed));
      heroImage.style.translate = `0 ${Math.round(offset)}px`;
    }
  }
}

window.addEventListener("scroll", () => {
  latestScrollY = window.scrollY;
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollEffects);
}, { passive: true });
window.addEventListener("resize", () => {
  latestScrollY = window.scrollY;
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollEffects);
}, { passive: true });
updateScrollEffects();

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/svg+xml";
favicon.href = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#1E4FA3"/><path d="M13 35V13h5l12 14V13h5v22h-5L18 21v14z" fill="white"/></svg>')}`;
document.head.append(favicon);

document.head.insertAdjacentHTML("beforeend", `<style>@view-transition { navigation: auto; }</style>`);

function revealTargets(root = document) {
  if (!motionPreference.matches && "IntersectionObserver" in window) {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          animateReadings(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });
    }
  }

  const stagger = new Map();
  root.querySelectorAll(revealSelector).forEach((target) => {
    if (target.dataset.revealBound) return;
    target.dataset.revealBound = "true";
    target.dataset.reveal = "pressure";
    const parent = target.parentElement;
    const index = stagger.get(parent) || 0;
    stagger.set(parent, index + 1);
    target.style.setProperty("--reveal-delay", `${(index % 5) * 75}ms`);
    if (motionPreference.matches || !revealObserver) {
      target.classList.add("is-visible");
      animateReadings(target);
    } else {
      revealObserver.observe(target);
    }
  });
}

function updateComparisonSlider(slider, value) {
  const position = Math.round(Math.min(100, Math.max(0, value)));
  slider.style.setProperty("--split", `${position}%`);
  slider.setAttribute("aria-valuenow", String(position));
  slider.setAttribute("aria-valuetext", `До ${position} процентов, с оборудованием NORD ${100 - position} процентов`);
}

const comparisonDrags = new Map();
document.addEventListener("pointerover", (event) => {
  const slider = event.target.closest("[data-comparison]");
  if (!slider || event.pointerType !== "mouse" || slider.dataset.previewed || slider.dataset.interacted || motionPreference.matches) return;
  if (event.relatedTarget && slider.contains(event.relatedTarget)) return;
  slider.dataset.previewed = "true";
  slider.classList.add("is-previewing");
  const startedAt = performance.now();
  const duration = 3900;
  const movePreview = (now) => {
    if (!slider.isConnected || slider.dataset.interacted) {
      slider.classList.remove("is-previewing");
      return;
    }
    const progress = Math.min(1, (now - startedAt) / duration);
    const segment = progress < 1 / 3
      ? [50, 25, progress * 3]
      : progress < 2 / 3
        ? [25, 75, (progress - 1 / 3) * 3]
        : [75, 50, (progress - 2 / 3) * 3];
    const eased = (1 - Math.cos(segment[2] * Math.PI)) / 2;
    updateComparisonSlider(slider, segment[0] + (segment[1] - segment[0]) * eased);
    if (progress < 1) slider._comparisonPreview = requestAnimationFrame(movePreview);
    else slider.classList.remove("is-previewing");
  };
  slider._comparisonPreview = requestAnimationFrame(movePreview);
});

document.addEventListener("pointerdown", (event) => {
  const slider = event.target.closest("[data-comparison]");
  if (!slider || event.button !== 0) return;
  slider.dataset.interacted = "true";
  slider.classList.add("is-dragging");
  cancelAnimationFrame(slider._comparisonPreview);
  slider.focus({ preventScroll: true });
  slider.setPointerCapture(event.pointerId);
  comparisonDrags.set(event.pointerId, slider);
  const bounds = slider.getBoundingClientRect();
  if (bounds.width) updateComparisonSlider(slider, (event.clientX - bounds.left) / bounds.width * 100);
  event.preventDefault();
});

document.addEventListener("pointermove", (event) => {
  const slider = comparisonDrags.get(event.pointerId);
  if (!slider) return;
  const bounds = slider.getBoundingClientRect();
  if (bounds.width) updateComparisonSlider(slider, (event.clientX - bounds.left) / bounds.width * 100);
});

function finishComparisonDrag(event) {
  const slider = comparisonDrags.get(event.pointerId);
  if (!slider) return;
  comparisonDrags.delete(event.pointerId);
  slider.classList.remove("is-dragging");
  if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
}

document.addEventListener("pointerup", finishComparisonDrag);
document.addEventListener("pointercancel", finishComparisonDrag);
document.addEventListener("keydown", (event) => {
  const slider = event.target.closest("[data-comparison]");
  if (!slider) return;
  const current = Number(slider.getAttribute("aria-valuenow")) || 50;
  const increment = event.shiftKey ? 10 : 2;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") updateComparisonSlider(slider, current - increment);
  else if (event.key === "ArrowRight" || event.key === "ArrowUp") updateComparisonSlider(slider, current + increment);
  else if (event.key === "Home") updateComparisonSlider(slider, 0);
  else if (event.key === "End") updateComparisonSlider(slider, 100);
  else return;
  slider.dataset.interacted = "true";
  event.preventDefault();
});

function animateReadings(root) {
  const stepNumber = root.querySelector(".step-num");
  if (stepNumber && !stepNumber.dataset.counted) {
    stepNumber.dataset.counted = "true";
    const goal = Number(stepNumber.textContent) || 0;
    const startedAt = performance.now();
    const countUp = (now) => {
      const progress = Math.min(1, (now - startedAt) / 430);
      stepNumber.textContent = String(Math.round(goal * (1 - (1 - progress) ** 3))).padStart(2, "0");
      if (progress < 1) window.requestAnimationFrame(countUp);
    };
    window.requestAnimationFrame(countUp);
  }
  root.querySelectorAll(".mini-specs strong").forEach((reading) => {
    if (reading.dataset.counted) return;
    const match = reading.textContent.match(/^([\d ]+)(.*)$/);
    if (!match) return;
    const goal = Number(match[1].replace(/\s/g, ""));
    if (!goal || goal > 250000) return;
    reading.dataset.counted = "true";
    const suffix = match[2];
    const startedAt = performance.now();
    const countUp = (now) => {
      const progress = Math.min(1, (now - startedAt) / 560);
      reading.textContent = `${money.format(Math.round(goal * (1 - (1 - progress) ** 3)))}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(countUp);
    };
    window.requestAnimationFrame(countUp);
  });
}

document.querySelectorAll(".section").forEach((section) => {
  const heading = section.querySelector(".section-heading h2");
  if (heading?.textContent.includes("Сначала задача")) section.classList.add("is-contrast");
});
revealTargets(document);

const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (supportsFinePointer && !motionPreference.matches) {
  const cursor = document.createElement("div");
  cursor.className = "nord-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = "<span>↗</span>";
  document.body.append(cursor);
  let cursorX = -40;
  let cursorY = -40;
  let pointerX = -40;
  let pointerY = -40;
  let cursorFrame = 0;
  const moveCursor = () => {
    cursorX += (pointerX - cursorX) * 0.15;
    cursorY += (pointerY - cursorY) * 0.15;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(pointerX - cursorX) + Math.abs(pointerY - cursorY) > 0.2) cursorFrame = requestAnimationFrame(moveCursor);
    else cursorFrame = 0;
  };
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add("is-visible");
    if (!cursorFrame) cursorFrame = requestAnimationFrame(moveCursor);
  }, { passive: true });
  document.addEventListener("pointerover", (event) => {
    cursor.classList.toggle("is-active", Boolean(event.target.closest("a, button, summary, input, textarea, select, .product-card")));
    cursor.classList.toggle("is-plus", Boolean(event.target.closest("[data-add-cart], .icon-button")));
  });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) cursor.classList.remove("is-visible", "is-active", "is-plus");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(cursorFrame);
      cursorFrame = 0;
      cursor.classList.remove("is-visible");
    }
  });
}

document.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || motionPreference.matches) return;
  const gallery = event.target.closest(".gallery-main");
  if (!gallery) return;
  const image = gallery.querySelector("img");
  const bounds = gallery.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  image.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) scale(1.025)`;
}, { passive: true });
document.addEventListener("pointerout", (event) => {
  const gallery = event.target.closest(".gallery-main");
  if (gallery && !gallery.contains(event.relatedTarget)) gallery.querySelector("img").style.transform = "";
});

const intro = document.createElement("div");
intro.className = "nord-intro";
intro.setAttribute("aria-hidden", "true");
intro.innerHTML = `<span class="intro-logo"><i></i><b>N</b></span><span class="intro-readout">PRESSURE / FLOW / PRECISION</span>`;
document.body.append(intro);
window.setTimeout(() => {
  intro.classList.add("is-done");
  window.setTimeout(() => intro.remove(), motionPreference.matches ? 40 : 420);
}, motionPreference.matches ? 80 : 470);
