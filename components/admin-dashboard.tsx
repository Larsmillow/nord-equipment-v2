"use client";

import { useCallback, useEffect, useState } from "react";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  short_name: string;
  description: string;
  category_slug: string;
  manufacturer: string;
  model: string;
  images: Array<{ src: string; alt: string }>;
  characteristics: Array<{ name: string; value: string }>;
  materials: string;
  purchase_price: number | null;
  rental_price_daily: number | null;
  rental_min_days: number;
  stock_quantity: number;
  purchase_enabled: boolean;
  rental_enabled: boolean;
  published: boolean;
  badge: string;
  source_url: string | null;
  flow_lpm: number | null;
  drive: string;
  features: string[];
};

type AdminOrder = {
  id: string;
  mode: "buy" | "rent";
  status: string;
  amount: number;
  currency: string;
  rental_start: string | null;
  rental_end: string | null;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  items: Array<{ productId: string; name: string; model: string; quantity: number; lineTotal: number }>;
};

type Stats = {
  today: { orders: number; revenue: number };
  week: { orders: number; revenue: number };
  products: number;
};

type ProductDraft = {
  id: string; name: string; slug: string; shortName: string; description: string; categorySlug: string;
  manufacturer: string; model: string; images: string; characteristics: string; materials: string;
  purchasePrice: string; rentalPriceDaily: string; rentalMinDays: string; stockQuantity: string;
  purchaseEnabled: boolean; rentalEnabled: boolean; published: boolean; badge: string;
  sourceUrl: string; flowLpm: string; drive: string; features: string;
};

const blankDraft: ProductDraft = {
  id: "", name: "", slug: "", shortName: "", description: "", categorySlug: "painting",
  manufacturer: "", model: "", images: "[]", characteristics: "[]", materials: "",
  purchasePrice: "", rentalPriceDaily: "", rentalMinDays: "1", stockQuantity: "0",
  purchaseEnabled: true, rentalEnabled: false, published: false, badge: "",
  sourceUrl: "", flowLpm: "", drive: "unknown", features: "[]",
};

const statusNames: Record<string, string> = {
  pending_payment: "Ожидает оплаты",
  paid: "Оплачен",
  processing: "В обработке",
  shipped: "Отправлен",
  completed: "Завершён",
  cancelled: "Отменён",
  payment_failed: "Ошибка оплаты",
  refund_pending: "Оформляется возврат",
  refunded: "Возврат",
};

const categoryOptions = [
  ["painting", "Окрасочное оборудование"],
  ["putty", "Шпаклёвочное оборудование"],
  ["fire", "Огнезащитное оборудование"],
  ["hydraulic", "Гидравлические распылители"],
  ["texture", "Текстурные распылители"],
  ["waterproof", "Гидроизоляция"],
  ["marking", "Дорожная разметка"],
  ["accessories", "Комплектующие и расходники"],
];

const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

export function AdminDashboard({ initiallyAuthenticated }: { initiallyAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "rentals">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [busy, setBusy] = useState(false);

  const loadData = useCallback(async () => {
    const responses = await Promise.all([
      fetch("/api/admin/dashboard", { cache: "no-store" }),
      fetch("/api/admin/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
    ]);
    if (responses.some((response) => response.status === 401)) {
      setAuthenticated(false);
      return;
    }
    const [statsData, productsData, ordersData] = await Promise.all(responses.map((response) => response.json()));
    if (responses.some((response) => !response.ok)) throw new Error("Не удалось загрузить данные админ-панели.");
    setStats(statsData);
    setProducts(productsData.products);
    setOrders(ordersData.orders);
  }, []);

  useEffect(() => {
    if (authenticated) loadData().catch((error) => setMessage(error.message));
  }, [authenticated, loadData]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось войти.");
      setPassword("");
      setAuthenticated(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка входа.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setBusy(true);
    setMessage("");
    try {
      const toJson = (value: string) => JSON.parse(value);
      const payload = {
        ...draft,
        purchasePrice: draft.purchasePrice ? Number(draft.purchasePrice) : null,
        rentalPriceDaily: draft.rentalPriceDaily ? Number(draft.rentalPriceDaily) : null,
        rentalMinDays: Number(draft.rentalMinDays),
        stockQuantity: Number(draft.stockQuantity),
        sourceUrl: draft.sourceUrl || null,
        flowLpm: draft.flowLpm ? Number(draft.flowLpm) : null,
        images: toJson(draft.images),
        characteristics: toJson(draft.characteristics),
        features: toJson(draft.features),
      };
      const response = await fetch(
        draft.id && products.some((product) => product.id === draft.id)
          ? `/api/admin/products/${encodeURIComponent(draft.id)}`
          : "/api/admin/products",
        {
          method: draft.id && products.some((product) => product.id === draft.id) ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось сохранить товар.");
      setDraft(null);
      await loadData();
      setMessage("Товар сохранён.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Проверьте значения и JSON-поля.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file?: File) {
    if (!file || !draft) return;
    const form = new FormData();
    form.append("file", file);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/images", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось загрузить фото.");
      const images = JSON.parse(draft.images) as Array<{ src: string; alt: string }>;
      setDraft({ ...draft, images: JSON.stringify([...images, result.image], null, 2) });
      setMessage("Фото загружено. Сохраните товар, чтобы применить изменения.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка загрузки фото.");
    } finally {
      setBusy(false);
    }
  }

  async function changeOrderStatus(orderId: string, status: string) {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не удалось обновить заказ.");
    await loadData();
  }

  async function archiveProduct(id: string) {
    if (!window.confirm("Скрыть товар с сайта?")) return;
    const response = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не удалось скрыть товар.");
    await loadData();
  }

  if (!authenticated) {
    return (
      <section className="section">
        <div className="container">
          <div className="login-wrap">
            <form className="login-card" onSubmit={signIn}>
              <p className="eyebrow">NORD · Администрирование</p>
              <h2>Вход в панель управления</h2>
              <div className="form-field">
                <label htmlFor="admin-login">Логин</label>
                <input
                  className="form-control"
                  id="admin-login"
                  autoComplete="username"
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="admin-password">Пароль</label>
                <input
                  className="form-control"
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {message && (
                <p className="form-status is-error" role="alert">
                  {message}
                </p>
              )}
              <button className="button button-primary button-full" disabled={busy}>
                {busy ? "Проверяем…" : "Войти"}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  const shownOrders = tab === "rentals" ? orders.filter((order) => order.mode === "rent") : orders;
  return (
    <section className="section">
      <div className="container admin-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NORD · Управление</p>
            <h2>Панель управления</h2>
          </div>
          <button
            className="button button-outline"
            type="button"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              setAuthenticated(false);
            }}
          >
            Выйти
          </button>
        </div>
        <nav className="admin-tabs" aria-label="Разделы панели">
          {(
            [
              ["overview", "Обзор"],
              ["products", "Товары"],
              ["orders", "Заказы"],
              ["rentals", "Аренда"],
            ] as const
          ).map(([key, label]) => (
            <button
              className={tab === key ? "is-active" : ""}
              key={key}
              type="button"
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        {message && (
          <p className="form-status" role="status">
            {message}
          </p>
        )}
        {tab === "overview" && (
          <div className="info-grid admin-stats">
            <article className="info-card">
              <p className="eyebrow">Сегодня</p>
              <h2>{stats?.today.orders ?? "—"} заказов</h2>
              <p>Выручка: {stats ? money(stats.today.revenue) : "—"}</p>
            </article>
            <article className="info-card">
              <p className="eyebrow">7 дней</p>
              <h2>{stats?.week.orders ?? "—"} заказов</h2>
              <p>Выручка: {stats ? money(stats.week.revenue) : "—"}</p>
            </article>
            <article className="info-card">
              <p className="eyebrow">Каталог</p>
              <h2>{stats?.products ?? "—"} товаров</h2>
              <p>Добавление и редактирование доступны в разделе «Товары».</p>
            </article>
          </div>
        )}
        {tab === "products" && (
          <div className="admin-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Каталог</p>
                <h2>Товары ({products.length})</h2>
              </div>
              <button className="button button-primary" type="button" onClick={() => setDraft({ ...blankDraft })}>
                Добавить товар
              </button>
            </div>
            {draft && (
              <form className="form-card admin-product-form" onSubmit={saveProduct}>
                <h3>{products.some((product) => product.id === draft.id) ? "Редактирование товара" : "Новый товар"}</h3>
                <div className="form-grid">
                  {(
                    [
                      ["id", "ID товара"],
                      ["name", "Название"],
                      ["slug", "URL slug"],
                      ["shortName", "Короткое название"],
                      ["manufacturer", "Производитель"],
                      ["model", "Модель"],
                      ["purchasePrice", "Цена покупки, ₽"],
                      ["rentalPriceDaily", "Аренда за сутки, ₽"],
                      ["rentalMinDays", "Мин. дней аренды"],
                      ["stockQuantity", "Количество в наличии"],
                      ["badge", "Метка"],
                      ["sourceUrl", "Ссылка на производителя"],
                      ["flowLpm", "Подача, л/мин"],
                      ["drive", "Тип привода"],
                      ["materials", "Совместимые материалы"],
                    ] as const
                  ).map(([field, label]) => (
                    <div className="form-field" key={field}>
                      <label htmlFor={`product-${field}`}>{label}</label>
                      <input
                        className="form-control"
                        id={`product-${field}`}
                        value={draft[field]}
                        onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
                      />
                    </div>
                  ))}
                  <div className="form-field">
                    <label htmlFor="product-category">Категория</label>
                    <select
                      className="form-control"
                      id="product-category"
                      value={draft.categorySlug}
                      onChange={(event) => setDraft({ ...draft, categorySlug: event.target.value })}
                    >
                      {categoryOptions.map(([slug, label]) => (
                        <option key={slug} value={slug}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field form-field-wide">
                    <label htmlFor="product-description">Описание</label>
                    <textarea
                      className="form-control"
                      id="product-description"
                      rows={3}
                      value={draft.description}
                      onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="product-images">Фото (JSON)</label>
                    <textarea
                      className="form-control"
                      id="product-images"
                      rows={4}
                      value={draft.images}
                      onChange={(event) => setDraft({ ...draft, images: event.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={busy}
                      onChange={(event) => uploadImage(event.target.files?.[0])}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="product-specs">Характеристики (JSON)</label>
                    <textarea
                      className="form-control"
                      id="product-specs"
                      rows={4}
                      value={draft.characteristics}
                      onChange={(event) => setDraft({ ...draft, characteristics: event.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="product-features">Особенности (JSON-массив)</label>
                    <textarea
                      className="form-control"
                      id="product-features"
                      rows={2}
                      value={draft.features}
                      onChange={(event) => setDraft({ ...draft, features: event.target.value })}
                    />
                  </div>
                </div>
                <div className="admin-checks">
                  {(
                    [
                      ["purchaseEnabled", "Продавать"],
                      ["rentalEnabled", "Сдавать в аренду"],
                      ["published", "Опубликовать"],
                    ] as const
                  ).map(([field, label]) => (
                    <label key={field}>
                      <input
                        type="checkbox"
                        checked={draft[field]}
                        onChange={(event) => setDraft({ ...draft, [field]: event.target.checked })}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </div>
                <div className="hero-actions">
                  <button className="button button-primary" disabled={busy}>
                    {busy ? "Сохраняем…" : "Сохранить"}
                  </button>
                  <button className="button button-outline" type="button" onClick={() => setDraft(null)}>
                    Отмена
                  </button>
                </div>
              </form>
            )}
            <div className="admin-record-list">
              {products.map((product) => (
                <article className="info-card admin-record" key={product.id}>
                  <div>
                    <p className="eyebrow">
                      {product.category_slug} · {product.id}
                    </p>
                    <h3>{product.name}</h3>
                    <p>
                      {product.published ? "Опубликован" : "Черновик"} · Остаток: {product.stock_quantity} · Покупка:{" "}
                      {product.purchase_price === null ? "не задана" : money(product.purchase_price)} · Аренда:{" "}
                      {product.rental_price_daily === null ? "не задана" : `${money(product.rental_price_daily)}/сутки`}
                    </p>
                  </div>
                  <div className="hero-actions">
                    <button
                      className="button button-outline"
                      type="button"
                      onClick={() =>
                        setDraft({
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          shortName: product.short_name,
                          description: product.description,
                          categorySlug: product.category_slug,
                          manufacturer: product.manufacturer,
                          model: product.model,
                          images: JSON.stringify(product.images, null, 2),
                          characteristics: JSON.stringify(product.characteristics, null, 2),
                          materials: product.materials,
                          purchasePrice: product.purchase_price?.toString() || "",
                          rentalPriceDaily: product.rental_price_daily?.toString() || "",
                          rentalMinDays: String(product.rental_min_days),
                          stockQuantity: String(product.stock_quantity),
                          purchaseEnabled: product.purchase_enabled,
                          rentalEnabled: product.rental_enabled,
                          published: product.published,
                          badge: product.badge,
                          sourceUrl: product.source_url || "",
                          flowLpm: product.flow_lpm?.toString() || "",
                          drive: product.drive,
                          features: JSON.stringify(product.features, null, 2),
                        })
                      }
                    >
                      Изменить
                    </button>
                    <button
                      className="button button-outline"
                      type="button"
                      onClick={() => archiveProduct(product.id).catch((error) => setMessage(error.message))}
                    >
                      Скрыть
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        {(tab === "orders" || tab === "rentals") && (
          <div className="admin-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{tab === "rentals" ? "Бронирования" : "Продажи и заявки"}</p>
                <h2>
                  {tab === "rentals" ? "Аренда" : "Заказы"} ({shownOrders.length})
                </h2>
              </div>
              <button
                className="button button-outline"
                type="button"
                onClick={() => loadData().catch((error) => setMessage(error.message))}
              >
                Обновить
              </button>
            </div>
            <div className="admin-record-list">
              {shownOrders.map((order) => (
                <article className="info-card admin-record" key={order.id}>
                  <div>
                    <p className="eyebrow">
                      {order.mode === "rent" ? "Аренда" : "Покупка"} ·{" "}
                      {new Date(order.created_at).toLocaleString("ru-RU")}
                    </p>
                    <h3>
                      {order.customer_name} · {money(order.amount)}
                    </h3>
                    <p>
                      {order.phone}
                      {order.email ? ` · ${order.email}` : ""} · {statusNames[order.status] || order.status}
                    </p>
                    {order.address && <p><strong>Адрес / комментарий:</strong> {order.address}</p>}
                    {order.mode === "rent" && (
                      <p>
                        Период: {order.rental_start} — {order.rental_end}
                      </p>
                    )}
                    <ul>
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.productId}`}>
                          {item.name} · {item.quantity} шт.
                        </li>
                      ))}
                    </ul>
                  </div>
                  {["pending_payment", "paid", "processing", "shipped"].includes(order.status) && (
                    <select
                      className="form-control"
                      aria-label="Статус заказа"
                      value={order.status}
                      onChange={(event) =>
                        changeOrderStatus(order.id, event.target.value).catch((error) => setMessage(error.message))
                      }
                    >
                      <option value={order.status}>{statusNames[order.status]}</option>
                      {(order.status === "pending_payment"
                        ? ["cancelled"]
                        : order.status === "paid"
                          ? ["processing", "cancelled"]
                          : order.status === "processing"
                            ? ["shipped", "cancelled"]
                            : ["completed"]
                      ).map((status) => (
                        <option key={status} value={status}>
                          {statusNames[status]}
                        </option>
                      ))}
                    </select>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
