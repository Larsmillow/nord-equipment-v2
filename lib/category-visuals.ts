export interface CategoryVisualMeta {
  image: string;
  specBadge: string;
  priceFrom: string;
  wide?: boolean;
}

export const CATEGORY_VISUALS: Record<string, CategoryVisualMeta> = {
  piston_paint: {
    image: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
    specBadge: "230 БАР · 2,5–4,2 Л/МИН",
    priceFrom: "от 35 000 ₽",
    wide: true,
  },
  piston_putty: {
    image: "/assets/machines/nord-18x/NORD-18X-view-front-3q-a.jpg",
    specBadge: "6,5–18 Л/МИН · ДО 350 БАР",
    priceFrom: "от 95 000 ₽",
    wide: true,
  },
  screw_putty: {
    image: "/assets/machines/nord-9900/NORD-18X-view-front.jpg",
    specBadge: "ШНЕКОВАЯ ПОДАЧА · БУНКЕР",
    priceFrom: "По запросу",
  },
  spares_accessories: {
    image: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg",
    specBadge: "СОПЛА · РУКАВА ВД · ПИСТОЛЕТЫ · ЦПГ",
    priceFrom: "от 590 ₽",
  },
};
