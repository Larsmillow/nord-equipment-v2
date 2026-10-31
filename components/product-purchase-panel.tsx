"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store-context";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/product-utils";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { SITE_CONFIG } from "@/lib/site-config";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { mode, setMode, addToCart } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();
  const rentAvailable = product.rental_enabled && product.rental_price_daily !== null && product.rental_price_daily > 0;
  const renting = mode === "rent";
  const price = renting ? (rentAvailable ? product.rental_price_daily : null) : product.purchase_price;
  const inStock = product.stock_quantity > 0;

  return (
    <div className="commerce-panel commerce-panel--detail">
      <div className="detail-panel-header">
        <div className="commerce-switch" data-mode={mode}>
          <button
            className="commerce-switch-option"
            type="button"
            aria-pressed={mode === "buy"}
            onClick={() => setMode("buy")}
          >
            Покупка в собственность
          </button>
          <button
            className="commerce-switch-option"
            type="button"
            aria-pressed={renting}
            aria-disabled={!rentAvailable}
            title={rentAvailable ? undefined : "Доступно по согласованию"}
            onClick={() => rentAvailable && setMode("rent")}
          >
            Аренда на объект
          </button>
        </div>
        <span className={`stock-pill${inStock ? " is-instock" : ""}`}>
          <i aria-hidden="true" />
          {inStock ? `Склад Москва: ${product.stock_quantity} ед.` : "Поставка под заказ"}
        </span>
      </div>

      <div className="commerce-price">
        <strong>
          {price === null
            ? renting
              ? "Тариф по запросу"
              : "Цена по запросу"
            : formatPrice(price)}
        </strong>
        {renting && rentAvailable && <span>/ сутки · мин. срок {product.rental_min_days} дн.</span>}
        {!renting && price !== null && <span>Безналичный расчёт (ИП / ООО) · Карта · Наличные</span>}
      </div>

      <div className="detail-actions-row">
        {renting && !rentAvailable ? (
          <Link
            className="button button-primary commerce-action"
            href={`/contacts?rent=${encodeURIComponent(product.id)}`}
          >
            Согласовать условия аренды
          </Link>
        ) : renting ? (
          <button
            className="button button-primary commerce-action"
            type="button"
            onClick={() => {
              setMode("rent");
              addToCart(product.id, "rent");
              router.push("/cart");
            }}
          >
            Выбрать даты аренды →
          </button>
        ) : product.purchase_price === null || !inStock || !product.purchase_enabled ? (
          <Link
            className="button button-primary commerce-action"
            href={`/contacts?product=${encodeURIComponent(product.id)}`}
          >
            Запросить счёт / КП
          </Link>
        ) : (
          <button
            className={`button ${justAdded ? "button-dark" : "button-primary"} commerce-action`}
            type="button"
            onClick={() => {
              addToCart(product.id, "buy");
              setJustAdded(true);
              setTimeout(() => setJustAdded(false), 2000);
            }}
          >
            {justAdded ? "✓ Добавлено в корзину" : "Добавить в корзину"}
          </button>
        )}

        <Link
          className="button button-outline"
          href={`/contacts?${renting ? "rent" : "product"}=${encodeURIComponent(product.id)}`}
        >
          Запросить счёт для юрлица
        </Link>
        <FavoriteToggle productId={product.id} />
      </div>

      <div className="detail-direct-call">
        <span>Консультация инженера и бронь со склада:</span>
        <a href={SITE_CONFIG.phoneHref}>{SITE_CONFIG.phone}</a>
      </div>
    </div>
  );
}
