import type { Product } from "@/lib/catalog";

export function productImage(product: Product) {
  const image = product.images[0];
  return image?.src || "/assets/products/logo.png";
}

export function formatPrice(price: number | null) {
  return price === null ? "Цена по запросу" : `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}
