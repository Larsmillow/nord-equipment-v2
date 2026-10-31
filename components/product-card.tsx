"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { formatPrice, productImage } from "@/lib/product-utils";
import { useStore } from "@/components/store-context";
import { FavoriteToggle } from "@/components/favorite-toggle";

export function ProductCard({ product }: { product: Product }) {
  const { mode, setMode, addToCart } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();
  const rentAvailable = product.rental_enabled && product.rental_price_daily !== null && product.rental_price_daily > 0;
  const price = mode === "rent" ? (rentAvailable ? product.rental_price_daily : null) : product.purchase_price;
  const inStock = product.stock_quantity > 0;

  function handleBuyClick() {
    addToCart(product.id, "buy");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <article className="product-card">
      <div className="product-card-topbar">
        <span className="product-code">
          {product.manufacturer || "NORD"} // {product.model || product.short_name}
        </span>
        <span className={`stock-pill${inStock ? " is-instock" : ""}`}>
          <i aria-hidden="true" />
          {inStock ? `В наличии (${product.stock_quantity} шт.)` : "Под заказ"}
        </span>
      </div>

      <Link className="product-card-image" href={`/product/${encodeURIComponent(product.id)}`}>
        {product.badge && <span className="badge">{product.badge}</span>}
        <img src={productImage(product)} alt={product.images[0]?.alt || product.name} loading="lazy" />
      </Link>

      <div className="product-card-info">
        <h3>
          <Link href={`/product/${encodeURIComponent(product.id)}`}>{product.name}</Link>
        </h3>
        <p>{product.description}</p>

        <div className="mini-specs" aria-label="Ключевые характеристики">
          {product.characteristics.slice(0, 4).map((spec) => (
            <div className="mini-spec-row" key={spec.name}>
              <span>{spec.name}</span>
              <strong>{spec.value}</strong>
            </div>
          ))}
        </div>

        <div className="product-card-bottom">
          <div className="commerce-panel">
            <div className="commerce-switch" data-mode={mode}>
              <button
                className="commerce-switch-option"
                type="button"
                aria-pressed={mode === "buy"}
                onClick={() => setMode("buy")}
              >
                Покупка
              </button>
              <button
                className="commerce-switch-option"
                type="button"
                aria-pressed={mode === "rent"}
                aria-disabled={!rentAvailable}
                title={rentAvailable ? undefined : "Доступно по запросу"}
                onClick={() => rentAvailable && setMode("rent")}
              >
                Аренда
              </button>
            </div>

            <div className="commerce-offer">
              <div className="commerce-price">
                <strong>
                  {price === null
                    ? mode === "rent"
                      ? "По запросу"
                      : "По запросу"
                    : formatPrice(price)}
                </strong>
                {mode === "rent" && rentAvailable && <span>/ сутки · от {product.rental_min_days} дн.</span>}
                {mode === "buy" && price !== null && <span>с НДС / безнал / карта</span>}
              </div>

              <div className="commerce-actions-row">
                {mode === "rent" && !rentAvailable ? (
                  <Link
                    className="button button-outline commerce-action"
                    href={`/contacts?rent=${encodeURIComponent(product.id)}`}
                  >
                    Запросить аренду
                  </Link>
                ) : mode === "rent" ? (
                  <button
                    className="button button-primary commerce-action"
                    type="button"
                    onClick={() => {
                      setMode("rent");
                      addToCart(product.id, "rent");
                      router.push("/cart");
                    }}
                  >
                    Оформить аренду
                  </button>
                ) : product.purchase_price === null ? (
                  <Link
                    className="button button-outline commerce-action"
                    href={`/contacts?product=${encodeURIComponent(product.id)}`}
                  >
                    Запросить КП
                  </Link>
                ) : !inStock || !product.purchase_enabled ? (
                  <Link
                    className="button button-outline commerce-action"
                    href={`/contacts?product=${encodeURIComponent(product.id)}`}
                  >
                    Под заказ
                  </Link>
                ) : (
                  <button
                    className={`button ${justAdded ? "button-dark" : "button-primary"} commerce-action`}
                    type="button"
                    onClick={handleBuyClick}
                  >
                    {justAdded ? "✓ В корзине" : "В корзину"}
                  </button>
                )}
                <FavoriteToggle productId={product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
