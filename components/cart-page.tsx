"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { ACCESSORIES_AND_SPARES } from "@/lib/spares-catalog";
import { formatPrice, productImage } from "@/lib/product-utils";
import { useStore } from "@/components/store-context";

function spareToProduct(spareId: string): Product | undefined {
  const s = ACCESSORIES_AND_SPARES.find((i) => i.id === spareId);
  if (!s) return undefined;
  return {
    id: s.id,
    name: s.name,
    slug: s.id,
    short_name: s.sku,
    description: s.specSummary,
    category_slug: "spares_accessories",
    category_name: s.subCategoryLabel,
    manufacturer: "NORD",
    model: s.sku,
    images: [{ src: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg", alt: s.name }],
    characteristics: [{ name: "Совместимость", value: s.compatibility }],
    materials: s.compatibility,
    purchase_price: s.priceRub,
    rental_price_daily: null,
    rental_min_days: 1,
    stock_quantity: 20,
    purchase_enabled: true,
    rental_enabled: false,
    published: true,
    badge: s.badge || "ЗИП NORD",
    source_url: null,
    flow_lpm: null,
    drive: "Оригинальный ЗИП",
    features: [s.specSummary],
  };
}

export function CartPage({ products }: { products: Product[] }) {
  const { mode, setMode, cart, addToCart, updateQuantity, removeFromCart, clearCart } = useStore();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [rentalStart, setRentalStart] = useState("");
  const [rentalEnd, setRentalEnd] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"invoice" | "online">("invoice");
  const [agreed, setAgreed] = useState(true);

  const lines = useMemo(
    () =>
      cart
        .filter((line) => line.mode === mode)
        .map((line) => ({
          ...line,
          product:
            products.find((product) => product.id === line.productId) ||
            spareToProduct(line.productId),
        }))
        .filter((line): line is typeof line & { product: Product } => Boolean(line.product)),
    [cart, mode, products],
  );

  const otherModeCount = useMemo(
    () => cart.filter((line) => line.mode !== mode).reduce((sum, l) => sum + l.quantity, 0),
    [cart, mode],
  );

  const rentalDays = useMemo(() => {
    if (mode !== "rent" || !rentalStart || !rentalEnd || rentalEnd < rentalStart) return 1;
    const startMs = Date.parse(`${rentalStart}T00:00:00Z`);
    const endMs = Date.parse(`${rentalEnd}T00:00:00Z`);
    return Math.max(1, Math.floor((endMs - startMs) / 86_400_000) + 1);
  }, [mode, rentalStart, rentalEnd]);

  const minRentalRequired = useMemo(() => {
    if (mode !== "rent") return 1;
    return Math.max(1, ...lines.map((l) => l.product.rental_min_days || 1));
  }, [mode, lines]);

  const rentalBelowMin = mode === "rent" && Boolean(rentalStart && rentalEnd) && rentalDays < minRentalRequired;
  const datesValid = mode === "buy" || (Boolean(rentalStart && rentalEnd) && rentalEnd >= rentalStart && !rentalBelowMin);

  const totalAmount = useMemo(() => {
    return lines.reduce((sum, { product, quantity }) => {
      const unitPrice = mode === "rent" ? product.rental_price_daily : product.purchase_price;
      if (!unitPrice) return sum;
      return sum + unitPrice * quantity * (mode === "rent" ? rentalDays : 1);
    }, 0);
  }, [lines, mode, rentalDays]);

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setMessage("Необходимо подтвердить согласие на обработку персональных данных.");
      return;
    }
    setBusy(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          paymentMethod,
          items: lines.map(({ productId, quantity }) => ({ productId, quantity })),
          customer: {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email") || null,
            address: formData.get("address") || null,
          },
          rentalStart: mode === "rent" ? rentalStart : null,
          rentalEnd: mode === "rent" ? rentalEnd : null,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось оформить заказ.");
      clearCart(mode);
      setCheckoutUrl(result.confirmationUrl);
      window.location.assign(result.confirmationUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка оформления заказа.");
      setBusy(false);
    }
  }

  if (!lines.length) {
    return (
      <div className="empty-state">
        <h2>В корзине ({mode === "buy" ? "Покупка" : "Аренда"}) пока нет позиций</h2>
        {otherModeCount > 0 ? (
          <p>
            Обратите внимание: в режиме «{mode === "buy" ? "Аренда" : "Покупка"}» у вас сохранено{" "}
            <strong>{otherModeCount} ед.</strong> оборудования.
          </p>
        ) : (
          <p>Выберите оборудование в каталоге для расчёта стоимости поставки или проката.</p>
        )}
        <div className="hero-actions" style={{ justifyContent: "center", marginTop: 18 }}>
          {otherModeCount > 0 && (
            <button
              type="button"
              className="button button-outline"
              onClick={() => setMode(mode === "buy" ? "rent" : "buy")}
            >
              Переключить в режим «{mode === "buy" ? "Аренда" : "Покупка"}» ({otherModeCount})
            </button>
          )}
          <Link className="button button-primary" href={mode === "rent" ? "/rent" : "/catalog"}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-list">
        <div className="cart-list-header">
          <span>Спецификация заказа // Режим: {mode === "buy" ? "ПОКУПКА В СОБСТВЕННОСТЬ" : "АРЕНДА НА ОБЪЕКТ"}</span>
          <button type="button" className="text-button" onClick={() => clearCart(mode)}>
            Очистить список
          </button>
        </div>
        {lines.map(({ product, quantity }) => {
          const unitPrice = mode === "rent" ? product.rental_price_daily : product.purchase_price;
          const lineTotal = unitPrice ? unitPrice * quantity * (mode === "rent" ? rentalDays : 1) : null;
          return (
            <article className="cart-row" key={product.id}>
              <Link href={`/product/${encodeURIComponent(product.id)}`}>
                <img src={productImage(product)} alt={product.images[0]?.alt || product.name} />
              </Link>
              <div className="cart-row-info">
                <span className="product-code">
                  {product.manufacturer} // {product.model}
                </span>
                <h3>
                  <Link href={`/product/${encodeURIComponent(product.id)}`}>{product.name}</Link>
                </h3>
                <p>
                  Ставка: <strong>{formatPrice(unitPrice)}</strong> {mode === "rent" ? `/ сутки (мин. ${product.rental_min_days} дн.)` : "за ед."}
                </p>
                {lineTotal !== null && (
                  <p className="cart-line-subtotal">
                    Сумма по позиции: <strong>{formatPrice(lineTotal)}</strong>
                  </p>
                )}
              </div>
              <div className="cart-row-actions">
                <div className="quantity">
                  <button
                    type="button"
                    aria-label="Уменьшить количество"
                    onClick={() => updateQuantity(product.id, mode, quantity - 1)}
                  >
                    −
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    aria-label="Добавить единицу"
                    onClick={() => addToCart(product.id, mode)}
                  >
                    +
                  </button>
                </div>
                <button className="remove-button" type="button" onClick={() => removeFromCart(product.id, mode)}>
                  Удалить
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <form className="summary-card checkout-form" onSubmit={checkout}>
        <h2>Оформление {mode === "rent" ? "бронирования аренды" : "заказа на поставку"}</h2>

        <div className="summary-table">
          <div className="summary-line">
            <span>Позиций в спецификации</span>
            <strong>{lines.reduce((s, l) => s + l.quantity, 0)} ед.</strong>
          </div>
          {mode === "rent" && (
            <div className="summary-line">
              <span>Расчётный период проката</span>
              <strong>{rentalStart && rentalEnd ? `${rentalDays} сут.` : "Укажите даты"}</strong>
            </div>
          )}
          <div className="summary-total">
            <span>ИТОГО К ОПЛАТЕ</span>
            <strong>{totalAmount > 0 ? formatPrice(totalAmount) : "По запросу"}</strong>
          </div>
        </div>

        {mode === "rent" && (
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="rental-start">Дата выдачи</label>
              <input
                className="form-control"
                id="rental-start"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                required
                value={rentalStart}
                onChange={(event) => setRentalStart(event.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="rental-end">Дата возврата</label>
              <input
                className="form-control"
                id="rental-end"
                type="date"
                min={rentalStart || new Date().toISOString().slice(0, 10)}
                required
                value={rentalEnd}
                onChange={(event) => setRentalEnd(event.target.value)}
              />
            </div>
          </div>
        )}
        {rentalBelowMin && (
          <p className="form-status is-error" role="alert">
            Минимальный срок аренды для выбранного оборудования — {minRentalRequired} сут. (выбрано: {rentalDays} сут.).
          </p>
        )}

        <div className="form-field">
          <label>Способ оплаты и оформления</label>
          <div className="payment-method-selector">
            <label className={`method-option${paymentMethod === "invoice" ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="invoice"
                checked={paymentMethod === "invoice"}
                onChange={() => setPaymentMethod("invoice")}
              />
              <div>
                <strong>Счёт для ИП/ООО или оплата при получении</strong>
                <span>Инженер подтвердит наличие, выставит счёт или подготовит выдачу со склада</span>
              </div>
            </label>
            <label className={`method-option${paymentMethod === "online" ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <div>
                <strong>Онлайн-оплата картой / СБП (ЮKassa)</strong>
                <span>Мгновенное резервирование техники и электронный кассовый чек 54-ФЗ</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="checkout-name">Контактное лицо или организация *</label>
          <input
            className="form-control"
            id="checkout-name"
            name="name"
            autoComplete="name"
            placeholder="Иванов Сергей / ООО «СтройПодряд»"
            minLength={2}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="checkout-phone">Контактный телефон *</label>
          <input
            className="form-control"
            id="checkout-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="checkout-email">Email (для счёта и чека)</label>
          <input
            className="form-control"
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="snab@company.ru"
          />
        </div>
        <div className="form-field">
          <label htmlFor="checkout-address">Адрес доставки, ИНН компании или комментарий</label>
          <textarea
            className="form-control"
            id="checkout-address"
            name="address"
            rows={3}
            placeholder="Самовывоз с Окружного пр. 34Ас6 / Доставка на объект / ИНН для выставления счёта"
          />
        </div>

        <label className="consent-checkbox">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
          <span>
            Согласен с <Link href="/privacy">Политикой обработки персональных данных</Link> и{" "}
            <Link href="/terms">Условиями поставки и проката</Link>
          </span>
        </label>

        {message && (
          <p className="form-status is-error" role="alert">
            {message}
          </p>
        )}
        {checkoutUrl && (
          <p>
            <a href={checkoutUrl}>Перейти к подтверждению заказа ↗</a>
          </p>
        )}
        <button className="button button-primary button-full" type="submit" disabled={busy || !datesValid || !agreed}>
          {busy
            ? "Регистрируем заказ…"
            : paymentMethod === "invoice"
              ? "Подтвердить заказ / Запросить счёт"
              : `Перейти к оплате (${formatPrice(totalAmount)})`}
        </button>
      </form>
    </div>
  );
}
