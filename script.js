const featuredProducts = [
  {
    id: "gtb-1095",
    name: "Окрасочный аппарат GTB-1095",
    shortName: "GTB-1095",
    price: 97375,
    oldPrice: 102500,
    badge: "Выгодная цена",
    category: "painting",
    description: "Безвоздушный окрасочный аппарат на тележке для профессиональной работы с лакокрасочными материалами.",
    model: "GTB-1095",
    drive: "electric",
    flowLpm: 6,
    specs: [["Производительность", "6 л/мин"], ["Мощность", "3 500 Вт"], ["Напряжение", "220 В"], ["Максимальное давление", "230 бар"], ["Максимальное сопло", "0.043″"], ["Тип", "Электрический, безвоздушный"]],
    images: [
      ["manufacturer-materials/GUTUBAO/1174453/image-01.jpg", "GUTUBAO GTB-1095 — фото аппарата"],
      ["gtb-1095-side.png", "GTB-1095, вид сбоку"],
      ["gtb-1095-kit.png", "Комплектация GTB-1095"],
      ["gtb-1095-detail.png", "Деталь аппарата GTB-1095"],
    ],
    materials: "Краски и лакокрасочные материалы для безвоздушного распыления.",
    featured: true,
  },
  {
    id: "putter-9528x",
    name: "Окрасочный аппарат PUTTER 9528-X QuickReel",
    shortName: "PUTTER 9528-X",
    price: 170000,
    badge: "Новинка",
    category: "painting",
    description: "Мощный окрасочный аппарат с системой QuickReel для удобного сматывания и хранения шланга.",
    manufacturer: "PUTTER",
    model: "PT-9528-X",
    drive: "electric",
    flowLpm: 10.5,
    specs: [["Мощность", "5 000 Вт"], ["Напряжение / частота", "220 В / 50–60 Гц"], ["Максимальная подача", "10,5 л/мин"], ["Система шланга", "QuickReel"], ["Гарантия", "2 года от магазина"], ["Тип", "Электрический, безвоздушный"]],
    images: [
      ["manufacturer-materials/PUTTER/PT-9528-X-High-Power-Electric-Paint-Sprayer-for-Large-Projects-PUTIAN/image-01.jpg", "PUTTER PT-9528-X — фото аппарата"],
    ],
    materials: "Густые шпаклёвки, краски и огнезащитные материалы.",
    featured: true,
    features: ["QuickReel"],
  },
];
const manufacturerProducts = window.NORD_MANUFACTURER_PRODUCTS;
if (!Array.isArray(manufacturerProducts)) throw new Error("Manufacturer product data did not load");
const productMap = new Map(featuredProducts.map((product) => [product.id, product]));
manufacturerProducts.forEach((product) => {
  const existing = productMap.get(product.id);
  productMap.set(product.id, existing
    ? { ...existing, ...product, price: existing.price, oldPrice: existing.oldPrice, badge: existing.badge, featured: existing.featured }
    : product);
});
const products = [...productMap.values()];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver;
const revealSelector = ".page-hero, .gallery-main, .section-heading, .category-card, .category-tile, .product-card, .step-card, .article-card, .benefit, .info-card, .rent-card, .fact, .summary-card, .empty-state, .form-card, .login-card, .contact-band";
const rentalTariffs = [
  { id: "painting-compact", category: "painting", label: "Окраска · компактные задачи", model: "Аппараты 2–4 л/мин", minFlow: 2, maxFlow: 4, rates: [{ period: "1–2 дня", price: 1700 }, { period: "От 2 дней", price: 1500, minDays: 2 }] },
  { id: "painting-volume", category: "painting", label: "Окраска · большой объём", model: "Аппараты 6–9 л/мин", minFlow: 6, maxFlow: 9, rates: [{ period: "1–3 дня", price: 2500 }, { period: "От 3 дней", price: 2000, minDays: 3 }] },
  { id: "putty", category: "putty", label: "Шпаклёвочные работы", model: "Шнековая станция + компрессор", rates: [{ period: "1–2 дня", price: 2000 }, { period: "От 2 дней", price: 1500, minDays: 2 }] },
  { id: "fire", category: "fire", label: "Огнезащитные материалы", model: "Аппарат для огнезащиты", rates: [{ period: "Стоимость", price: null }] },
];

const categories = [
  { id: "painting", name: "Окрасочное оборудование", description: "Аппараты для безвоздушного нанесения красок и покрытий.", icon: "01", children: [["Аппараты до 6 л/мин", "category.html?category=painting&flow=compact"], ["Аппараты от 10 л/мин", "category.html?category=painting&flow=high"], ["Модели с QuickReel", "category.html?category=painting&feature=quickreel"]] },
  { id: "putty", name: "Шпаклёвочное оборудование", description: "Машины для подачи шпаклёвочных и строительных составов.", icon: "02", children: [["Все шпаклёвочные машины", "category.html?category=putty"]] },
  { id: "fire", name: "Огнезащитное оборудование", description: "Аппараты для нанесения огнезащитных покрытий.", icon: "03", children: [["Все аппараты для огнезащиты", "category.html?category=fire"]] },
  { id: "hydraulic", name: "Гидравлические распылители", description: "Аппараты с гидравлическим приводом для строительных и отделочных работ.", icon: "04", children: [["Все гидравлические распылители", "category.html?category=hydraulic"]] },
  { id: "texture", name: "Текстурные распылители", description: "Техника для текстурных и штукатурных составов.", icon: "05", children: [["Все текстурные распылители", "category.html?category=texture"]] },
  { id: "waterproof", name: "Гидроизоляция", description: "Аппараты для нанесения гидроизоляционных покрытий.", icon: "06", children: [["Все аппараты для гидроизоляции", "category.html?category=waterproof"]] },
  { id: "marking", name: "Дорожная разметка", description: "Машины для нанесения дорожной разметки.", icon: "07", children: [["Все машины для разметки", "category.html?category=marking"]] },
  { id: "accessories", name: "Комплектующие и расходники", description: "Шланги, сопла и оснащение для оборудования.", icon: "08", children: [["Шланги", "category.html?category=accessories&subcategory=hoses"], ["Сопла и пистолеты", "category.html?category=accessories&subcategory=nozzles"]] },
];

const catalogMetrics = {
  flow: { label: "Производительность", unit: "л/мин", step: 0.5, min: 0 },
  power: { label: "Мощность", unit: "Вт", step: 500, min: 0 },
  pressure: { label: "Макс. давление", unit: "бар", step: 10, min: 0 },
  price: { label: "Цена", unit: "₽", step: 5000, min: 0 },
};
const catalogNumber = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

function modelMetricValues(product, metric) {
  if (metric === "price") return Number.isFinite(product.price) && product.price > 0 ? [product.price] : [];
  if (metric === "flow" && Number.isFinite(product.flowLpm)) return [product.flowLpm];
  const spec = product.specs.find(([name]) => {
    if (metric === "flow") return /подач|производительност/i.test(name);
    if (metric === "power") return /мощност/i.test(name);
    return /давлен/i.test(name);
  });
  if (!spec) return [];
  const value = String(spec[1]);
  const numberPattern = /\d+(?:[\s\u00a0]\d{3})*(?:[.,]\d+)?/g;
  if (metric === "flow") {
    if (!/л\s*\/\s*мин/i.test(value)) return [];
    return [...value.matchAll(numberPattern)].map(([number]) => Number(number.replace(/[\s\u00a0]/g, "").replace(",", "."))).filter(Number.isFinite);
  }
  if (metric === "power") {
    const normalized = value.toLocaleLowerCase("ru");
    const wattsAt = normalized.lastIndexOf("вт");
    if (wattsAt < 0) return [];
    const horsepowerAt = normalized.lastIndexOf("л.с.");
    const wattValues = value.slice(horsepowerAt < 0 ? 0 : horsepowerAt + 4, wattsAt);
    return [...wattValues.matchAll(numberPattern)].map(([number]) => Number(number.replace(/[\s\u00a0]/g, "").replace(",", "."))).filter(Number.isFinite);
  }
  const pressureAt = value.toLocaleLowerCase("ru").search(/бар|мпа/);
  if (pressureAt < 0) return [];
  const pressureValues = [...value.slice(0, pressureAt).matchAll(numberPattern)]
    .map(([number]) => Number(number.replace(/[\s\u00a0]/g, "").replace(",", ".")))
    .filter(Number.isFinite);
  return /мпа/i.test(value.slice(pressureAt)) ? pressureValues.map((number) => number * 10) : pressureValues;
}

function formatMetric(value, unit) {
  return `${catalogNumber.format(value)} ${unit}`;
}

function modelCountLabel(count) {
  const lastTwo = count % 100;
  const last = count % 10;
  const noun = lastTwo >= 11 && lastTwo <= 14 ? "моделей" : last === 1 ? "модель" : last >= 2 && last <= 4 ? "модели" : "моделей";
  return `${count} ${noun}`;
}

function rangeFilterMarkup(metric, available, params) {
  const config = catalogMetrics[metric];
  let values = available.flatMap((product) => modelMetricValues(product, metric));
  if (!values.length) return "";
  const domainMin = config.min;
  const domainMax = Math.max(config.step, Math.ceil(Math.max(...values) / config.step) * config.step);
  let initialMin = domainMin;
  let initialMax = domainMax;
  if (metric === "flow" && params.get("flow") === "compact") initialMax = Math.min(6, domainMax);
  if (metric === "flow" && params.get("flow") === "high") initialMin = Math.min(10, domainMax);
  const inputMinId = `filter-${metric}-min`;
  const inputMaxId = `filter-${metric}-max`;
  return `<fieldset class="range-filter" data-range-filter="${metric}" data-domain-min="${domainMin}" data-domain-max="${domainMax}">
    <legend>${config.label}, ${config.unit}</legend>
    <div class="range-values"><label for="${inputMinId}">От <output data-range-min-label>${formatMetric(initialMin, config.unit)}</output></label><label for="${inputMaxId}">До <output data-range-max-label>${formatMetric(initialMax, config.unit)}</output></label></div>
    <div class="range-slider">
      <input id="${inputMinId}" type="range" min="${domainMin}" max="${domainMax}" step="${config.step}" value="${initialMin}" data-range-min-input aria-label="${config.label}: минимальное значение">
      <input id="${inputMaxId}" type="range" min="${domainMin}" max="${domainMax}" step="${config.step}" value="${initialMax}" data-range-max-input aria-label="${config.label}: максимальное значение">
    </div>
  </fieldset>`;
}

const articles = [
  { id: "choose-sprayer", tag: "ПОДБОР", title: "Как подобрать окрасочный аппарат под объект", teaser: "С чего начать выбор: материал, объём работ, длина шланга и параметры аппарата." },
  { id: "quickreel", tag: "ОБОРУДОВАНИЕ", title: "QuickReel: зачем аппарату система для шланга", teaser: "Как устроена система сматывания и в каких рабочих ситуациях она удобна." },
  { id: "rental-guide", tag: "АРЕНДА", title: "Аренда оборудования в Москве: что уточнить заранее", teaser: "Срок, комплект, доставка и материал — короткий список до бронирования." },
  { id: "sprayer-care", tag: "УХОД", title: "Подготовка аппарата к следующему рабочему циклу", teaser: "Базовые шаги по очистке и хранению; конкретные процедуры смотрите в руководстве модели." },
];

const money = new Intl.NumberFormat("ru-RU");
const asset = (product, filename) => filename.startsWith("manufacturer-materials/")
  ? filename
  : `assets/products/${product.id}/${filename}`;
const productUrl = (product) => `product.html?id=${encodeURIComponent(product.id)}`;
const quoteUrl = (product) => `contacts.html?product=${encodeURIComponent(product.id)}`;
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
const storedCommerceMode = getStored("nord_mode", null);
let commerceMode = storedCommerceMode === "buy" || storedCommerceMode === "rent" ? storedCommerceMode : null;
const currentCommerceMode = () => commerceMode || "buy";

function productImage(product, index = 0) {
  return asset(product, product.images[index][0]);
}

function rentalOffer(product) {
  if (product.category === "painting") {
    const flowValues = Number.isFinite(product.flowLpm) ? [product.flowLpm] : modelMetricValues(product, "flow");
    const tariff = rentalTariffs.find((item) => item.category === "painting"
      && flowValues.length
      && flowValues.every((flow) => flow >= item.minFlow && flow <= item.maxFlow));
    if (!tariff) return null;
    const rate = tariff.rates[tariff.rates.length - 1];
    return { tariff, dailyRate: rate.price, minDays: rate.minDays };
  }
  const tariff = rentalTariffs.find((item) => item.category === product.category);
  if (!tariff) return null;
  if (!tariff.rates.length) return { tariff, dailyRate: null, minDays: null };
  const rate = tariff.rates[tariff.rates.length - 1];
  return { tariff, dailyRate: rate.price, minDays: rate.minDays };
}

function rentalUrl(product) {
  return `contacts.html?rent=${encodeURIComponent(product.id)}`;
}

function commerceSwitchMarkup(product, mode = "buy", context = "card") {
  const available = Boolean(rentalOffer(product));
  const switchId = `commerce-${context}-${product.id}`;
  const selectedMode = available ? mode : "unavailable";
  const rentalButton = `<button id="${switchId}-rent" class="commerce-switch-option" type="button" data-commerce-mode="rent" data-product-id="${product.id}" aria-pressed="${mode === "rent" && available}" ${available ? "" : 'aria-disabled="true"'}>Арендовать</button>`;
  return `<div class="commerce-switch" data-commerce-switch data-mode="${selectedMode}" role="group" aria-label="Способ получения ${product.shortName}">
    <button id="${switchId}-buy" class="commerce-switch-option" type="button" data-commerce-mode="buy" data-product-id="${product.id}" aria-pressed="${mode === "buy"}">Купить</button>
    ${available ? rentalButton : `<span class="commerce-disabled-option" title="Доступно только для продажи">${rentalButton}<span class="commerce-tooltip" role="tooltip">Доступно только для продажи</span></span>`}
  </div>`;
}

function commerceOfferMarkup(product, mode = "buy", context = "card") {
  const hasPrice = Number.isFinite(product.price) && product.price > 0;
  if (mode === "rent") {
    const offer = rentalOffer(product);
    if (!offer) return `<div class="commerce-price commerce-price--unavailable" data-commerce-price><strong>Аренда недоступна</strong><span>Для этой модели не опубликован тариф аренды</span></div>
      <a class="button button-outline commerce-action" href="${productUrl(product)}">Только продажа</a>`;
    const tariffNote = offer.tariff.id === "putty" ? `<span class="commerce-rate-note">Тариф для шпаклёвочной станции; модель и комплект подтвердим</span>` : "";
    return `<div class="commerce-price" data-commerce-price>${offer.dailyRate ? `<strong>${money.format(offer.dailyRate)} ₽</strong><span>/ сутки · от ${offer.minDays} дн.</span>${tariffNote}` : `<strong>Стоимость уточните</strong><span>Условия аренды огнезащитной техники</span>`}</div>
      <a class="button button-primary commerce-action" href="${rentalUrl(product)}">${offer.dailyRate ? "Арендовать" : "Уточнить аренду"}</a>`;
  }
  return `<div class="commerce-price" data-commerce-price>${hasPrice ? `<strong>${money.format(product.price)} ₽</strong>${product.oldPrice ? `<del class="price-old">${money.format(product.oldPrice)} ₽</del>` : ""}` : `<strong class="price-request-label">Цена по запросу</strong>`}</div>
    ${hasPrice ? `<button class="button button-primary commerce-action" type="button" data-add-cart="${product.id}">В корзину</button>` : `<a class="button button-outline commerce-action" href="${quoteUrl(product)}">Уточнить цену</a>`}`;
}

function breakEvenMarkup(product) {
  const offer = rentalOffer(product);
  if (!offer?.dailyRate || !Number.isFinite(product.price) || product.price <= 0) return "";
  const days = Math.ceil(product.price / offer.dailyRate);
  return `<p class="break-even-note">Планируете работу дольше? Покупка выгоднее примерно с <strong>${days} дней</strong> аренды по долгосрочному тарифу ${money.format(offer.dailyRate)} ₽/сутки. Без учёта доставки и комплектации.</p>`;
}

function globalCommerceSwitch() {
  const mode = currentCommerceMode();
  return `<div class="global-mode-control global-mode-control--header">
    <div class="global-mode-switch" data-global-mode-switch data-mode="${mode}" role="group" aria-label="Глобальный режим покупки или аренды">
      <button class="global-mode-option" type="button" data-global-mode="buy" aria-pressed="${mode === "buy"}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5 12 4l8 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-10Z"/><path d="M4.5 8.5 12 13l7.5-4.5M12 13v7M8 6.3l7.5 4.5"/></svg><span>Купить</span></button>
      <button class="global-mode-option" type="button" data-global-mode="rent" aria-pressed="${mode === "rent"}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg><span>Арендовать</span></button>
    </div>
  </div>`;
}

function syncCommerceMode({ animate = false } = {}) {
  const mode = currentCommerceMode();
  document.querySelectorAll("[data-global-mode-switch]").forEach((switcher) => {
    switcher.dataset.mode = mode;
    switcher.querySelectorAll("[data-global-mode]").forEach((option) => {
      const active = option.dataset.globalMode === mode;
      option.setAttribute("aria-pressed", String(active));
      option.classList.toggle("is-pulsing", active && animate);
    });
  });
  const hero = document.querySelector(".hero");
  if (hero) {
    const renting = mode === "rent";
    const copy = hero.querySelector("[data-hero-mode-copy]");
    const primary = hero.querySelector("[data-hero-primary]");
    if (copy) copy.textContent = renting
      ? "Арендуйте профессиональное оборудование на нужный срок — без лишних вложений. Поможем подобрать технику под ваш объект и материал."
      : "Окрасочные аппараты, оборудование для шпаклёвки и огнезащиты — в продажу и аренду. Поможем подобрать решение под объект и материал.";
    if (primary) {
      primary.href = renting ? "rent.html" : "catalog.html";
      primary.textContent = renting ? "Перейти к аренде" : "Перейти в каталог покупки";
    }
  }
  document.querySelectorAll("[data-commerce-panel]").forEach((panel) => {
    const product = products.find((item) => item.id === panel.dataset.productId);
    if (!product) return;
    panel.dataset.mode = mode;
    const switcher = panel.querySelector("[data-commerce-switch]");
    const available = Boolean(rentalOffer(product));
    switcher.dataset.mode = available ? mode : "unavailable";
    switcher.querySelectorAll("[data-commerce-mode]").forEach((option) => {
      option.setAttribute("aria-pressed", String(available && option.dataset.commerceMode === mode));
    });
    const offer = panel.querySelector("[data-commerce-offer]");
    if (animate) offer.classList.remove("is-changing");
    offer.innerHTML = commerceOfferMarkup(product, mode, panel.dataset.context);
    if (animate) window.requestAnimationFrame(() => offer.classList.add("is-changing"));
    const note = panel.querySelector(".break-even-note");
    if (note) note.hidden = mode === "rent";
  });
}

function setCommerceMode(mode, { persist = true } = {}) {
  if (mode !== "buy" && mode !== "rent") return;
  commerceMode = mode;
  if (persist) setStored("nord_mode", mode);
  syncCommerceMode({ animate: true });
  window.setTimeout(() => {
    document.querySelectorAll("[data-global-mode].is-pulsing").forEach((option) => option.classList.remove("is-pulsing"));
  }, 520);
}

window.addEventListener("storage", (event) => {
  if (event.key !== "nord_mode") return;
  try {
    const storedMode = event.newValue === null ? null : JSON.parse(event.newValue);
    commerceMode = storedMode === "buy" || storedMode === "rent" ? storedMode : null;
    syncCommerceMode({ animate: true });
  } catch (error) {
    console.error("Unable to read the saved purchase/rental mode", error);
  }
});

function productCard(product, { featured = false } = {}) {
  const saved = favorites.includes(product.id);
  const mode = currentCommerceMode();
  return `<article class="product-card${featured ? " product-card--focus" : ""}">
    <a class="product-card-image" href="${productUrl(product)}"><img src="${productImage(product)}" alt="${product.images[0][1]}" loading="lazy"></a>
    <div class="product-card-info">
      <span class="badge">${featured ? "Фокус раздела" : product.badge}</span>
      ${product.manufacturer ? `<span class="product-manufacturer">${product.manufacturer} · ${product.model}</span>` : ""}
      <h3><a href="${productUrl(product)}">${product.name}</a></h3>
      <p>${product.description}</p>
      <div class="mini-specs">${product.specs.slice(0, 4).map(([name, value]) => `<span>${name}<strong>${value}</strong></span>`).join("")}</div>
      <div class="product-card-bottom">
        <div class="commerce-panel" data-commerce-panel data-product-id="${product.id}" data-context="card" data-mode="${mode}">
          ${commerceSwitchMarkup(product, mode, "card")}
          <div class="commerce-offer" data-commerce-offer>${commerceOfferMarkup(product, mode, "card")}</div>
        </div>
        <button class="icon-button ${saved ? "is-active" : ""}" type="button" data-favorite="${product.id}" aria-label="${saved ? "Убрать из избранного" : "В избранное"}" aria-pressed="${saved}">♡</button>
      </div>
    </div>
  </article>`;
}

function renderHeader() {
  const page = document.body.dataset.page;
  const active = (name) => page === name ? ' aria-current="page"' : "";
  document.querySelector("#site-header").innerHTML = `<header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="NORD — главная"><img class="brand-logo" src="assets/products/logo.png" alt="NORD — оборудование для малярных работ"><svg class="brand-outline" viewBox="0 0 168 62" aria-hidden="true" focusable="false"><rect x="0.75" y="0.75" width="166.5" height="60.5" rx="10" ry="10" pathLength="1000"></rect></svg></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Открыть меню"><span></span><span></span></button>
        <nav class="site-nav" id="site-nav" aria-label="Основная навигация">
          <details class="nav-catalog"><summary${["catalog", "category", "product"].includes(page) ? ' aria-current="page"' : ""}>Каталог</summary><div class="mega-menu">${categories.map((category) => `<div class="mega-menu-group"><a class="mega-menu-title" href="category.html?category=${category.id}">${category.name}</a>${category.children.map(([name, href]) => `<a href="${href}">${name} ↗</a>`).join("")}</div>`).join("")}</div></details>
          <a href="rent.html"${active("rent")}>Аренда</a>
          <a href="delivery.html"${active("delivery")}>Доставка</a><a href="about.html"${active("about")}>О компании</a><a href="blog.html"${active("blog")}>Статьи</a><a href="contacts.html"${active("contacts")}>Контакты</a>
        </nav>
      ${globalCommerceSwitch()}
      <div class="header-actions"><a class="icon-link" href="favorites.html" aria-label="Избранное">♡<span class="count" data-favorites-count>${favorites.length}</span></a><a class="icon-link" href="cart.html" aria-label="Корзина">▢<span class="count" data-cart-count>${Object.values(cart).reduce((a, b) => a + b, 0)}</span></a><a class="icon-link" href="account.html" aria-label="Личный кабинет">♙</a></div>
    </div>
  </header>`;
}

function renderFooter() {
  document.querySelector("#site-footer").innerHTML = `<footer class="site-footer"><span class="footer-watermark" aria-hidden="true">NORD</span><div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><a class="brand" href="index.html" aria-label="NORD — главная"><img class="brand-logo" src="assets/products/logo.png" alt="NORD — оборудование для малярных работ"></a><p class="footer-description">Оборудование для малярных и отделочных работ. Продажа и аренда.</p></div>
      <div><div class="footer-title">Каталог</div><div class="footer-links"><a href="catalog.html">Все оборудование</a><a href="category.html?category=painting">Окрасочные аппараты</a><a href="category.html?category=putty">Шпаклёвочные аппараты</a><a href="category.html?category=accessories">Комплектующие</a></div></div>
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

function contactBand(title = "Нужна помощь с подбором?", text = "Расскажите о задаче — поможем выбрать подходящее оборудование.") {
  return `<div class="contact-band"><div><h2>${title}</h2><p>${text}</p></div><a class="button button-primary" href="contacts.html">Связаться с Nord <span aria-hidden="true">↗</span></a></div>`;
}

function purchaseTrustGrid() {
  return `<div class="purchase-trust-grid">
    <article class="info-card"><p class="eyebrow">Гарантия и сервис</p><h3>Условия по каждой модели</h3><p>Срок и порядок гарантийного обслуживания указываются для конкретного аппарата. Для PUTTER PT-9528-X действует 2 года гарантии от магазина.</p></article>
    <article class="info-card"><p class="eyebrow">Получение · по России</p><h3>Доставка до вашего города</h3><p>Возможность отправки, сроки и стоимость согласуем по выбранной модели и адресу до оформления заказа.</p></article>
    <article class="info-card"><p class="eyebrow">Юрлица и ИП</p><h3>Покупка для бизнеса</h3><p>Вариант оформления сделки и комплект закрывающих документов подтвердим при подготовке заказа.</p></article>
    <article class="info-card"><p class="eyebrow">Оплата</p><h3>Условия до заказа</h3><p>Доступный способ оплаты и возможность рассрочки уточняйте у менеджера — подтвердим условия до оформления.</p></article>
  </div>`;
}

function renderHome() {
  return `<section class="hero"><div class="container"><div class="hero-grid">
    <div class="hero-copy"><p class="eyebrow">Оборудование для профессиональной отделки</p><h1>Техника для работы.<br><span>Подбор без лишнего.</span></h1><p data-hero-mode-copy></p>
      <div class="hero-mode-actions"><a class="button button-primary" data-hero-primary href="${currentCommerceMode() === "rent" ? "rent.html" : "catalog.html"}">${currentCommerceMode() === "rent" ? "Перейти к аренде" : "Перейти в каталог покупки"}</a></div>
      <div class="hero-points"><span>Продажа и аренда</span><span>Подбор под задачу</span><span>Москва и доставка</span></div>
    </div>
    <div class="hero-visual"><span class="hero-podium" aria-hidden="true"></span><img src="assets/products/putter-9528x-cutout.png" alt="Окрасочный аппарат PUTTER 9528-X QuickReel"><div class="hero-stamp hero-chip hero-chip-model"><strong>PUTTER 9528-X</strong><span>Система QuickReel</span></div><div class="hero-stamp hero-chip hero-chip-flow"><strong>10,5 л/мин</strong><span>Максимальная подача</span></div><div class="hero-stamp hero-chip hero-chip-pressure"><strong>5 000 Вт</strong><span>Мощность</span></div><div class="hero-flow-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div>
  </div></div>${paintParticles()}</section>
  <section class="section"><div class="container"><div class="benefit-strip"><div class="benefit"><span class="benefit-icon">↗</span><div><strong>Подбор техники</strong><span>С учётом задачи и материала</span></div></div><div class="benefit"><span class="benefit-icon">▣</span><div><strong>Продажа и аренда</strong><span>Варианты под ваш срок и объём</span></div></div><div class="benefit"><span class="benefit-icon">⌁</span><div><strong>Комплектующие</strong><span>Оснащение для рабочего процесса</span></div></div><div class="benefit"><span class="benefit-icon">⌖</span><div><strong>Москва</strong><span>Самовывоз и доставка</span></div></div></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Каталог NORD</p><h2>Оборудование<br>под ваши задачи</h2></div><p>Выберите направление — или расскажите, что предстоит сделать, и мы поможем сориентироваться.</p></div><div class="category-grid">${categories.map((item) => `<a class="category-card" href="category.html?category=${item.id}"><span class="category-number">${item.icon} / НАПРАВЛЕНИЕ</span><div><h3>${item.name}</h3><p>${item.description}</p></div><span class="category-arrow" aria-hidden="true">↗</span></a>`).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Выбор Nord</p><h2>Популярное оборудование</h2></div><a class="button button-outline" href="catalog.html">Весь каталог →</a></div><div class="product-grid">${products.filter((product) => product.featured).map(productCard).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="promo-banner"><div><p class="eyebrow">Новинка · QuickReel</p><h2>Шланг — под контролем.<br>Объект — в порядке.</h2><p>PUTTER 9528-X с системой для удобного сматывания шланга — для интенсивной работы с красками, шпаклёвками и огнезащитными материалами.</p></div><a class="button" href="${productUrl(products[1])}">Подробнее об аппарате <span>↗</span></a></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Почему NORD</p><h2>Сначала задача.<br>Потом оборудование.</h2></div><p>Хороший подбор начинается не с громких обещаний, а с понимания материала, объёма работ и условий объекта.</p></div><div class="steps-grid"><article class="step-card"><span class="step-num">01</span><h3>Разбираемся в задаче</h3><p>Учитываем тип работ, материал, масштаб объекта и важные условия на площадке.</p><svg class="step-flow-visual" viewBox="0 0 220 90" aria-hidden="true"><path class="flow-track" d="M12 70h49l22-36h57l20 22h48"/><circle cx="83" cy="34" r="6"/><circle cx="140" cy="34" r="4"/></svg></article><article class="step-card"><span class="step-num">02</span><h3>Сравниваем варианты</h3><p>Показываем характеристики и помогаем понять, чем модели отличаются для вашей работы.</p><svg class="step-flow-visual" viewBox="0 0 220 90" aria-hidden="true"><path class="flow-track" d="M12 70h43l18-45h39l20 45h75"/><path class="flow-secondary" d="M12 70h45l20-23h43l18 23h69"/></svg></article><article class="step-card"><span class="step-num">03</span><h3>Согласуем детали</h3><p>Уточняем наличие, комплектацию, срок аренды или условия покупки до оформления.</p><svg class="step-flow-visual" viewBox="0 0 220 90" aria-hidden="true"><path class="flow-track" d="M12 70h44l28-34h43l26 18h54"/><circle class="flow-pulse" cx="84" cy="36" r="5"/></svg></article></div></div></section>
  <section class="section"><div class="container split-panel"><div><p class="eyebrow">О компании</p><h2>Nord — техника<br>для дела.</h2><p class="lead">Мы работаем с оборудованием для малярных и отделочных работ: помогаем с выбором, предлагаем технику в продажу и аренду.</p><a class="button button-outline" href="about.html">О компании →</a></div><div class="about-facts"><div class="fact"><strong>Продажа</strong><span>Окрасочные аппараты и оснащение</span></div><div class="fact"><strong>Аренда</strong><span>Окраска, шпаклёвка, огнезащита</span></div><div class="fact"><strong>Подбор</strong><span>Под задачу и материал</span></div><div class="fact"><strong>Москва</strong><span>Точка выдачи оборудования</span></div></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Полезное</p><h2>Материалы и новости</h2></div><a class="button button-outline" href="blog.html">Все статьи →</a></div><div class="article-grid">${articles.slice(0, 3).map(articleCard).join("")}</div></div></section>
  <section class="section"><div class="container">${contactBand("Подберём оборудование под вашу работу", "Опишите материал, объём и условия объекта — обсудим подходящие варианты.")}</div></section>`;
}

function articleCard(item) {
  return `<article class="article-card"><p class="eyebrow">${item.tag}</p><h3>${item.title}</h3><p>${item.teaser}</p><a href="article.html?id=${item.id}">Читать материал →</a></article>`;
}

function catalogFilters(categoryId = "", params = new URLSearchParams(location.search)) {
  const selectedMaterial = ({ painting: "paint", putty: "putty", fire: "fire", hydraulic: "hydraulic", texture: "texture", waterproof: "waterproof", marking: "marking" })[categoryId];
  const available = products.filter((product) => !categoryId || product.category === categoryId);
  const manufacturers = [...new Set(available.map((product) => product.manufacturer).filter(Boolean))];
  const electricCount = available.filter((product) => product.drive === "electric" || product.drive === "multi").length;
  const pneumaticCount = available.filter((product) => product.drive === "pneumatic").length;
  return `<aside class="filter-panel" aria-label="Фильтры каталога"><h3>Фильтры</h3>
    <label class="filter-select-label" for="manufacturer-filter">Производитель</label>
    <select class="form-control" id="manufacturer-filter"><option value="">Все производители</option>${manufacturers.map((name) => `<option value="${name}" ${params.get("manufacturer") === name ? "selected" : ""}>${name}</option>`).join("")}</select>
    <fieldset class="filter-group"><legend>Тип привода</legend>
      <label><input type="checkbox" name="drive" value="electric"> Электрический <span class="filter-option-count">${electricCount}</span></label>
      <label class="${pneumaticCount ? "" : "is-unavailable"}"><input type="checkbox" name="drive" value="pneumatic" ${pneumaticCount ? "" : "disabled"}> Пневматический <span class="filter-option-count">${pneumaticCount}</span></label>
    </fieldset>
    ${["flow", "power", "pressure", "price"].map((metric) => rangeFilterMarkup(metric, available, params)).join("")}
    <p class="filter-note">Учитываются только опубликованные значения параметров.</p>
    <fieldset class="filter-group"><legend>Система</legend><label><input type="checkbox" name="reel" value="quickreel" ${params.get("feature") === "quickreel" ? "checked" : ""}> QuickReel</label></fieldset>
    <fieldset class="filter-group"><legend>Назначение</legend>
      ${[["paint", "Окраска"], ["putty", "Шпаклёвка"], ["fire", "Огнезащита"], ["hydraulic", "Гидравлические распылители"], ["texture", "Текстурные составы"], ["waterproof", "Гидроизоляция"], ["marking", "Разметка"]].map(([value, label]) => `<label><input type="checkbox" name="material" value="${value}" ${value === selectedMaterial ? "checked" : ""}> ${label}</label>`).join("")}
    </fieldset>
    <button class="button button-outline button-full" type="button" data-clear-filters>Сбросить фильтры</button>
  </aside>`;
}

function catalogListing({ categoryId = "" } = {}) {
  const params = new URLSearchParams(location.search);
  const available = products.filter((product) => !categoryId || product.category === categoryId);
  return `<div class="catalog-layout">${catalogFilters(categoryId, params)}
    <div class="catalog-results"><div class="filter-row"><label class="visually-hidden" for="product-search">Поиск товара</label><input id="product-search" type="search" placeholder="Модель, производитель или назначение"><span class="result-count" data-result-count role="status" aria-live="polite">Найдено: ${modelCountLabel(available.length)}</span></div>
    <div class="catalog-products" data-filter-products>${catalogGroupsMarkup(available)}</div></div>
  </div>`;
}

function catalogGroupsMarkup(items) {
  const groups = categories
    .map((category) => ({ category, products: items.filter((product) => product.category === category.id) }))
    .filter((group) => group.products.length);
  if (!groups.length) return `<div class="empty-state"><h3>По вашему запросу ничего не найдено</h3><p>Измените фильтры или свяжитесь с нами для подбора.</p></div>`;
  return groups.map(({ category, products: groupProducts }, index) => `<section class="catalog-group" aria-labelledby="catalog-group-${category.id}">
    <header class="catalog-group-heading">
      <div><p class="eyebrow">Направление ${String(index + 1).padStart(2, "0")}</p><h3 id="catalog-group-${category.id}">${category.name}</h3><p>${category.description}</p></div>
      <span class="catalog-group-count">${modelCountLabel(groupProducts.length)}</span>
    </header>
    <div class="catalog-group-products">${groupProducts.map((product, productIndex) => productCard(product, { featured: productIndex === 0 })).join("")}</div>
  </section>`).join("");
}

function renderCatalog() {
  const visibleCategories = categories.filter((category) => products.some((product) => product.category === category.id));
  return `${pageHero("Каталог оборудования", "Профессиональная техника для окраски, шпаклёвки, огнезащиты, гидроизоляции и других отделочных задач.", "Каталог", "spray")}
  <section class="section"><div class="container"><div class="category-tiles">${visibleCategories.map((item) => `<div class="category-tile"><a href="category.html?category=${item.id}"><strong>${item.name}</strong><span>${item.description}</span></a><div class="category-subcats">${item.children.map(([name, href]) => `<a href="${href}">${name} ↗</a>`).join("")}</div></div>`).join("")}</div>
    <div class="purchase-trust-heading"><p class="eyebrow">Покупка оборудования</p><h2>Понятные условия до заказа</h2></div>${purchaseTrustGrid()}
    <div class="section-heading"><div><p class="eyebrow">Модели и характеристики</p><h2>Оборудование в каталоге</h2></div><p>Цена и наличие моделей уточняются у менеджера. Технические данные приведены по материалам производителей.</p></div>${catalogListing()}<div style="margin-top:36px">${contactBand()}</div></div></section>`;
}

function renderCategory() {
  const params = new URLSearchParams(location.search);
  const selectedCategory = categories.find((item) => item.id === params.get("category")) || categories[0];
  const selectedSubcategory = selectedCategory.children.find(([, href]) => {
    const childParams = new URLSearchParams(href.split("?")[1]);
    return ["subcategory", "flow", "feature"].some((key) => params.has(key) && params.get(key) === childParams.get(key));
  })?.[0];
  const sectionTheme = selectedCategory.id === "painting" ? "spray" : selectedCategory.id === "putty" ? "putty" : selectedCategory.id === "fire" ? "fire" : "blueprint";
  const count = products.filter((product) => product.category === selectedCategory.id).length;
  return `${pageHero(selectedSubcategory || selectedCategory.name, selectedCategory.description, selectedCategory.name, sectionTheme)}
  <section class="section category-section category-section--${sectionTheme}">${pageTheme(sectionTheme)}<div class="container">
    ${count ? catalogListing({ categoryId: selectedCategory.id }) : `<div class="empty-state"><h2>Раздел обновляется</h2><p>Сейчас модели в этом разделе не опубликованы. Свяжитесь с нами — подскажем по наличию и совместимости.</p><a class="button button-primary" href="contacts.html">Запросить подбор</a></div>`}
    <div style="margin-top:36px">${contactBand()}</div>
  </div></section>`;
}

function renderProduct() {
  const product = products.find((item) => item.id === new URLSearchParams(location.search).get("id")) || products[0];
  const saved = favorites.includes(product.id);
  const mode = currentCommerceMode();
  return `${pageHero(product.name, product.description, product.shortName, "nozzle")}
  <section class="section"><div class="container"><div class="product-layout">
    <div><div class="gallery-main"><img data-gallery-main src="${productImage(product)}" alt="${product.images[0][1]}"></div>${product.images.length > 1 ? `<div class="gallery-thumbs" role="group" aria-label="Фотографии ${product.shortName}">${product.images.map(([file, alt], index) => `<button class="gallery-thumb" type="button" data-gallery-src="${asset(product, file)}" data-gallery-alt="${alt}" aria-label="Фото ${index + 1}: ${alt}" aria-pressed="${index === 0}"><img src="${asset(product, file)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}</div>
    <div class="product-detail-copy"><span class="badge">${product.badge}</span><h1>${product.name}</h1><p>${product.description}</p>
      <div class="detail-commerce-row"><div class="commerce-panel commerce-panel--detail" data-commerce-panel data-product-id="${product.id}" data-context="detail" data-mode="${mode}">
        ${commerceSwitchMarkup(product, mode, "detail")}
        <div class="commerce-offer" data-commerce-offer>${commerceOfferMarkup(product, mode, "detail")}</div>
        ${breakEvenMarkup(product)}
      </div><button class="icon-button ${saved ? "is-active" : ""}" type="button" data-favorite="${product.id}" aria-label="${saved ? "Убрать из избранного" : "В избранное"}" aria-pressed="${saved}">♡</button></div>
      <table class="spec-table"><tbody>${product.specs.map(([name, value]) => `<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("")}</tbody></table><div class="detail-section"><h3>Для каких материалов</h3><p>${product.materials}</p></div>${product.id === "putter-9528x" ? '<div class="detail-section"><h3>Гарантия</h3><p>2 года гарантии от магазина.</p></div>' : ""}${product.sourceUrl ? `<div class="detail-section product-source"><a href="${product.sourceUrl}" target="_blank" rel="noreferrer">Страница модели у производителя ↗</a></div>` : ""}<div class="detail-section"><h3>Комплектация</h3><p>Состав комплекта зависит от выбранной комплектации. Уточните его при заказе оборудования.</p></div></div>
  </div><section class="section"><div class="section-heading"><div><p class="eyebrow">Другие модели</p><h2>Похожие товары</h2></div></div><div class="product-grid">${products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map(productCard).join("")}</div></section></div></section>`;
}

function renderCart() {
  const entries = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product && Number.isFinite(item.product.price) && item.product.price > 0);
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
  return `${pageHero("Аренда оборудования", "Окрасочные аппараты, шпаклёвочные станции и техника для огнезащиты в Москве.", "Аренда", "rent")}
  <section class="section"><div class="container"><div class="rent-grid">${rentalTariffs.map((tariff) => `<article class="rent-card"><p class="eyebrow">${tariff.label}</p><h3>${tariff.model}</h3>${tariff.rates.map(({ period, price }) => `<div class="rent-price-line"><span>${period}</span><strong>${price ? `${money.format(price)} ₽ / сутки` : "Уточните при обращении"}</strong></div>`).join("")}</article>`).join("")}</div><div class="info-grid" style="margin-top:16px"><article class="info-card"><p class="eyebrow">Срок аренды</p><h3>Краткосрочно и надолго</h3><p>Доступна долгосрочная аренда. Условия согласуются индивидуально.</p></article><article class="info-card"><p class="eyebrow">Для бизнеса</p><h3>Компании и ИП</h3><p>Работа с юридическими лицами и индивидуальными предпринимателями.</p></article><article class="info-card"><p class="eyebrow">Получение техники</p><h3>Доставка или самовывоз</h3><p>Доставка доступна по согласованию с Nord.</p></article></div><div class="section" style="padding-bottom:0"><div class="section-heading"><div><p class="eyebrow">Самовывоз и доставка</p><h2>Точка выдачи в Москве</h2></div></div><div class="address-card"><h3>Окружной проезд, 34Ас6</h3><p>Соколиная гора · 6–10 мин<br>Шоссе Энтузиастов · 11–15 мин<br>Сортировочная · 21–30 мин</p><a href="https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9E%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B5%D0%B7%D0%B4%2C%2034%D0%90%D1%816" target="_blank" rel="noreferrer">Показать на карте ↗</a></div></div><div style="margin-top:30px">${contactBand("Уточнить аренду", "Согласуем доступность техники, срок, комплектацию и доставку.")}</div></div></section>`;
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
  main.querySelectorAll("[data-range-filter]").forEach(updateRangeDisplay);
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
  accentSectionHeadings(main);
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
  } else if (page === "contacts") {
    const params = new URLSearchParams(location.search);
    const rentalRequest = params.has("rent");
    const requestedProduct = products.find((product) => product.id === (params.get("rent") || params.get("product")));
    const messageField = document.querySelector("#contact-message");
    if (requestedProduct && messageField) {
      const modelName = [requestedProduct.manufacturer, requestedProduct.model || requestedProduct.shortName].filter(Boolean).join(" ");
      messageField.value = rentalRequest
        ? `Интересует аренда модели ${modelName}. Прошу уточнить доступность, стоимость, сроки и комплектацию.`
        : `Интересует модель ${modelName}. Прошу уточнить цену, наличие и комплектацию.`;
    }
  }
  syncCommerceMode();
  decorateSensors(main);
  animateHeadlines(main);
  revealTargets(main);
}

function accentSectionHeadings(root) {
  root.querySelectorAll("h2").forEach((heading) => {
    if (heading.dataset.accented) return;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let lastText = null;
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim()) lastText = walker.currentNode;
    }
    if (!lastText) return;
    const match = lastText.textContent.match(/(\S+)(\s*)$/);
    if (!match) return;
    const accent = document.createElement("span");
    accent.className = "heading-accent";
    accent.textContent = match[1];
    lastText.replaceData(match.index, match[0].length, "");
    lastText.parentNode.insertBefore(accent, lastText.nextSibling);
    heading.dataset.accented = "true";
  });
}

function decorateSensors(root) {
  root.querySelectorAll(".product-card, .category-card, .category-tile, .rent-card, .step-card, .info-card, .article-card, .benefit, .fact, .summary-card, .empty-state, .form-card, .login-card").forEach((card) => {
    card.classList.add("is-sensor");
  });
  root.querySelectorAll(".step-card").forEach((card, index) => {
    const icon = card.querySelector(".step-flow-visual");
    if (!icon) return;
    const illustrations = [
      '<circle cx="94" cy="39" r="21"/><path d="m110 55 17 17M85 39h18M94 30v18M80 70h-20m20 0 7-7m-7 7 7 7"/>',
      '<path d="M110 20v53M70 32h80M110 22l-32 10m32-10 32 10M77 34l-16 25h32L77 34Zm66 0-16 25h32l-16-25ZM91 75h38M104 68h12"/>',
      '<path d="M71 46 88 30q6-5 12 0l4 4q6-6 12 0l4 4q6-5 12 1l15 14q5 6-1 11l-3 3q-6 5-11 0l-4-4q-6 5-11 0l-4-4q-6 4-11-1l-8-8-8 8q-5 5-10 0l-5-5q-5-6 0-11Z"/><path d="m101 34 12 11m-2-10 11 10m-2-7 11 11"/>',
    ];
    icon.innerHTML = illustrations[index] || illustrations[0];
    icon.setAttribute("viewBox", "0 0 220 90");
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
  const link = event.target.closest("[data-mode-navigation]");
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const mode = link.dataset.modeValue;
  setCommerceMode(mode);
  if (motionPreference.matches) return;
  event.preventDefault();
  link.classList.add("is-pressed");
  window.setTimeout(() => link.classList.remove("is-pressed"), 100);
  window.setTimeout(() => window.location.assign(link.href), 320);
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.matches("[data-global-mode]")) {
    setCommerceMode(target.dataset.globalMode);
    return;
  }
  if (target.matches("[data-commerce-mode]")) {
    if (target.getAttribute("aria-disabled") === "true") return;
    setCommerceMode(target.dataset.commerceMode);
    return;
  }
  if (target.matches(".menu-toggle")) {
    const nav = document.querySelector("#site-nav");
    const open = target.getAttribute("aria-expanded") !== "true";
    target.setAttribute("aria-expanded", String(open));
    target.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("is-open", open);
  }
  if (target.matches("[data-add-cart]")) {
    const id = target.dataset.addCart;
    const product = products.find((item) => item.id === id);
    if (!product || !Number.isFinite(product.price) || product.price <= 0) {
      showToast("Для этой модели уточните цену и наличие");
      return;
    }
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
    document.querySelectorAll("[data-range-filter]").forEach((group) => {
      const minInput = group.querySelector("[data-range-min-input]");
      const maxInput = group.querySelector("[data-range-max-input]");
      minInput.value = minInput.min;
      maxInput.value = maxInput.max;
      updateRangeDisplay(group);
    });
    const manufacturer = document.querySelector("#manufacturer-filter");
    if (manufacturer) manufacturer.value = "";
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
  const search = (document.querySelector("#product-search")?.value || "").trim().toLocaleLowerCase("ru");
  const drives = [...document.querySelectorAll('input[name="drive"]:checked')].map((input) => input.value);
  const manufacturer = document.querySelector("#manufacturer-filter")?.value || "";
  const reel = document.querySelector('input[name="reel"]')?.checked || false;
  const ranges = [...document.querySelectorAll("[data-range-filter]")].map((group) => ({
    metric: group.dataset.rangeFilter,
    domainMin: Number(group.dataset.domainMin),
    domainMax: Number(group.dataset.domainMax),
    min: Number(group.querySelector("[data-range-min-input]").value),
    max: Number(group.querySelector("[data-range-max-input]").value),
  }));
  const materials = [...document.querySelectorAll('input[name="material"]:checked')].map((input) => input.value);
  const categoryId = new URLSearchParams(location.search).get("category");
  const categoryProducts = products.filter((product) => !categoryId || product.category === categoryId);
  const materialCategories = { paint: "painting", putty: "putty", fire: "fire", hydraulic: "hydraulic", texture: "texture", waterproof: "waterproof", marking: "marking" };
  const matches = categoryProducts.filter((product) => {
    const searchable = `${product.name} ${product.model || ""} ${product.manufacturer || ""} ${product.description} ${product.category}`.toLocaleLowerCase("ru");
    return (!search || searchable.includes(search))
      && (!manufacturer || product.manufacturer === manufacturer)
      && (!drives.length || drives.some((drive) => drive === "electric"
        ? product.drive === "electric" || product.drive === "multi"
        : product.drive === "pneumatic"))
      && ranges.every(({ metric, domainMin, domainMax, min, max }) => {
        if (min <= domainMin && max >= domainMax) return true;
        const values = modelMetricValues(product, metric);
        return values.some((value) => value >= min && value <= max);
      })
      && (!reel || product.features?.includes("QuickReel"))
      && (!materials.length || materials.some((material) => product.category === materialCategories[material]));
  });
  container.innerHTML = catalogGroupsMarkup(matches);
  decorateSensors(container);
  revealTargets(container);
  const count = document.querySelector("[data-result-count]");
  if (count) count.textContent = `Найдено: ${modelCountLabel(matches.length)}`;
}

function updateRangeDisplay(group) {
  const metric = catalogMetrics[group.dataset.rangeFilter];
  const minInput = group.querySelector("[data-range-min-input]");
  const maxInput = group.querySelector("[data-range-max-input]");
  const minValue = Number(minInput.value);
  const maxValue = Number(maxInput.value);
  const range = group.querySelector(".range-slider");
  const domainMin = Number(group.dataset.domainMin);
  const domainMax = Number(group.dataset.domainMax);
  const start = ((minValue - domainMin) / (domainMax - domainMin)) * 100;
  const end = ((maxValue - domainMin) / (domainMax - domainMin)) * 100;
  range.style.setProperty("--range-start", `${start}%`);
  range.style.setProperty("--range-end", `${end}%`);
  group.querySelector("[data-range-min-label]").textContent = formatMetric(minValue, metric.unit);
  group.querySelector("[data-range-max-label]").textContent = formatMetric(maxValue, metric.unit);
}

document.addEventListener("change", (event) => {
  if (event.target.matches(".filter-panel input, #manufacturer-filter")) filterProducts();
});
document.addEventListener("input", (event) => {
  if (event.target.matches("#product-search")) filterProducts();
  if (event.target.matches("[data-range-min-input], [data-range-max-input]")) {
    const group = event.target.closest("[data-range-filter]");
    const minInput = group.querySelector("[data-range-min-input]");
    const maxInput = group.querySelector("[data-range-max-input]");
    if (event.target.matches("[data-range-min-input]") && Number(minInput.value) > Number(maxInput.value)) minInput.value = maxInput.value;
    if (event.target.matches("[data-range-max-input]") && Number(maxInput.value) < Number(minInput.value)) maxInput.value = minInput.value;
    updateRangeDisplay(group);
    filterProducts();
  }
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
if (["catalog", "category"].includes(document.body.dataset.page)) filterProducts();

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
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    cursor.classList.add("is-visible");
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
intro.innerHTML = `<img class="intro-logo" src="assets/products/logo.png" alt=""><span class="intro-readout">PRESSURE / FLOW / PRECISION</span>`;
document.body.append(intro);
window.setTimeout(() => {
  intro.classList.add("is-done");
  window.setTimeout(() => intro.remove(), motionPreference.matches ? 40 : 420);
}, motionPreference.matches ? 80 : 470);
