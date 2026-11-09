import type { Product } from "@/lib/catalog";

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  piston_paint: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
  piston_putty: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
  screw_putty: "/assets/machines/nord-9900/NORD-18X-view-front-3q-a.jpg",
  spares_accessories: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg",
  default: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
};

export function getProductFallbackImage(productOrText?: Product | string): string {
  const raw =
    typeof productOrText === "string"
      ? productOrText
      : productOrText
        ? `${productOrText.id} ${productOrText.model || ""} ${productOrText.name || ""} ${productOrText.short_name || ""}`
        : "";
  const s = raw.toLowerCase();

  if (s.includes("2500")) return "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg";
  if (s.includes("3300") || s.includes("3200")) return "/assets/machines/nord-3300/NORD-3200-view-front-side-nord-edit-2k.jpg";
  if (s.includes("4500")) return "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg";
  if (s.includes("6000")) return "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg";
  if (s.includes("8000")) return "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg";
  if (s.includes("9200")) return "/assets/machines/nord-9200/NORD-8000-view-front-3q-source.jpg";
  if (s.includes("9900")) return "/assets/machines/nord-9900/NORD-18X-view-front-3q-a.jpg";
  if (s.includes("18x")) return "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg";
  return CATEGORY_PLACEHOLDERS.default;
}

export function productImage(product: Product) {
  const image = product.images?.[0];
  if (!image?.src || image.src.includes("logo.png")) {
    return getProductFallbackImage(product);
  }
  return image.src;
}

export function formatPrice(price: number | null | undefined) {
  return price === null || price === undefined
    ? "Цена по запросу"
    : `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function formatMoney(value: number | null | undefined, suffix = ""): string {
  if (!value) return "По запросу";
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽${suffix}`;
}
