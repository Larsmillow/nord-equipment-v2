import type { Product } from "@/lib/catalog";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-catalog";
import { SITE_CONFIG } from "@/lib/site-config";

export const MANAGER_USERNAME = "LarsenMl";
export const AVITO_URL =
  "https://www.avito.ru/user/97e78f53ed149f817e370ee0a1e86923/profile?src=sharing";

export const COMPANY = {
  phone: SITE_CONFIG.phone,
  phoneHref: SITE_CONFIG.phoneHref,
  hours: SITE_CONFIG.workHours,
  address: SITE_CONFIG.address,
  mapUrl:
    "https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9E%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B5%D0%B7%D0%B4%2C%2034%D0%90%D1%816",
};

export type TaskId = "paint" | "putty" | "fire" | "waterproof" | "texture" | "spares";

export const TASKS: Array<{ id: TaskId; title: string; hint: string }> = [
  {
    id: "paint",
    title: "Окрасочные аппараты (3)",
    hint: "NORD-2500 · 3300 · 4500 (2,5–4,2 л/мин)",
  },
  {
    id: "putty",
    title: "Шпаклёвочные станции HD (5)",
    hint: "NORD-6000 · 8000 PRO · 9200 · 9900 · 18X",
  },
  {
    id: "fire",
    title: "350 бар · Мастики и ОГЗ",
    hint: "Сверхвысокое давление и огнезащита",
  },
  {
    id: "texture",
    title: "Шнековые аппараты",
    hint: "Бункерные шпаклёвочные станции",
  },
  {
    id: "spares",
    title: "Запчасти и ЗИП",
    hint: "Сопла, шланги ВД, пистолеты, фильтры, ЦПГ",
  },
];

export const KIT_ITEMS: Array<{ title: string; note: string }> = [
  {
    title: "Станция NORD на раме",
    note: "Предпродажная опрессовка на стенде 230–350 бар",
  },
  {
    title: "Шланг высокого давления 15 м",
    note: "В комплекте (1/4″ под краску или 3/8″ под шпаклёвку)",
  },
  {
    title: "Безвоздушный пистолет ВД",
    note: "В комплекте с соплодержателем",
  },
  {
    title: "Удочка 50 см и реверсивное сопло",
    note: "Калибр сопла подбираем под ваш материал",
  },
];

export type ShowSpec = { label: string; value: string; unit: string };

export type ShowStation = {
  id: string;
  slug: string;
  model: string;
  fullName: string;
  codeStamp: string;
  tier: string;
  shiftScope: string;
  shiftMetric: string;
  crewMetric: string;
  podiumTone: "light" | "cobalt" | "flagship";
  jetRatio: number;
  isHeavyChapter: boolean;
  tagline: string;
  description: string;
  materials: string;
  materialTags: string[];
  price: number | null;
  rentDaily: number | null;
  rentMinDays: number;
  inStock: boolean;
  featured: boolean;
  images: Array<{ src: string; alt: string }>;
  fallback: string;
  keySpecs: ShowSpec[];
  allSpecs: Array<{ name: string; value: string }>;
  tasks: TaskId[];
};

type OverlayMeta = {
  codeStamp: string;
  tier: string;
  shiftScope: string;
  shiftMetric: string;
  crewMetric: string;
  podiumTone: "light" | "cobalt" | "flagship";
  jetRatio: number;
  isHeavyChapter: boolean;
  tagline: string;
  materialTags: string[];
  keySpecs: ShowSpec[];
  tasks: TaskId[];
};

const STATION_META: Record<string, OverlayMeta> = {
  "nord-2500": {
    codeStamp: "NORD-2500",
    tier: "1 КЛАСС · ИНТЕРЬЕРНЫЙ ФИНИШ Q4",
    shiftScope: "1 пост · 220 В · 15 кг",
    shiftMetric: "до 600 м²",
    crewMetric: "Вес нетто всего 15 кг — легко переносится одним мастером и даёт зеркальный финиш Q4",
    podiumTone: "light",
    jetRatio: 0.28,
    isHeavyChapter: false,
    tagline: "Компактный бесщёточный поршневой аппарат для малярных работ (1.6 кВт · 2.5 л/мин)",
    materialTags: ["Латексные и акриловые краски", "Водоэмульсионка", "Эмали и лаки", "Грунтовки Q4"],
    keySpecs: [
      { label: "Подача", value: "2,5", unit: "л/мин" },
      { label: "Двигатель", value: "1,6", unit: "кВт" },
      { label: "Сопло до", value: "0.023", unit: "дюйм" },
    ],
    tasks: ["paint"],
  },
  "nord-3300": {
    codeStamp: "NORD-3300",
    tier: "2 КЛАСС · УСИЛЕННЫЙ МАЛЯРНЫЙ",
    shiftScope: "1 пост · 220 В · 18 кг",
    shiftMetric: "до 850 м²",
    crewMetric: "Запас тяги 2.5 кВт и сопло до 0.033″ под густые интерьерные и фасадные краски",
    podiumTone: "light",
    jetRatio: 0.42,
    isHeavyChapter: false,
    tagline: "Скоростной бесщёточный аппарат повышенной подачи для больших площадей (2.5 кВт · 3.3 л/мин)",
    materialTags: ["Плотные фасадные краски", "Грунт-эмали 3-в-1", "Интерьерные ЛКМ", "Огнебиозащита"],
    keySpecs: [
      { label: "Подача", value: "3,3", unit: "л/мин" },
      { label: "Двигатель", value: "2,5", unit: "кВт" },
      { label: "Сопло до", value: "0.033", unit: "дюйм" },
    ],
    tasks: ["paint"],
  },
  "nord-4500": {
    codeStamp: "NORD-4500",
    tier: "3 КЛАСС · ФАСАДЫ И МЕТАЛЛОКОНСТРУКЦИИ",
    shiftScope: "1–2 поста · 220 В · 19 кг",
    shiftMetric: "до 1 100 м²",
    crewMetric: "Тянет вязкие фасадные акрилаты, эпоксидные грунты, антикор и клеи для стеклохолста",
    podiumTone: "cobalt",
    jetRatio: 0.56,
    isHeavyChapter: false,
    tagline: "Мощная станция для вязких красок, антикора и жидких шпаклёвок (2.8 кВт · 4.2 л/мин)",
    materialTags: ["Фасадные акрилаты", "Антикор и эпоксиды", "Клей для стеклохолста", "Жидкие пасты"],
    keySpecs: [
      { label: "Подача", value: "4,2", unit: "л/мин" },
      { label: "Двигатель", value: "2,8", unit: "кВт" },
      { label: "Сопло до", value: "0.037", unit: "дюйм" },
    ],
    tasks: ["paint", "fire"],
  },
  "nord-6000": {
    codeStamp: "NORD-6000",
    tier: "4 КЛАСС · ХИТ ПРОДАЖ (КРАСКА + ШПАКЛЁВКА)",
    shiftScope: "1–2 поста · 220 В · 40 кг",
    shiftMetric: "до 1 300 м²",
    crewMetric: "Универсальная станция на колёсной раме: полимерные шпаклёвки + работа на 2 малярных поста",
    podiumTone: "cobalt",
    jetRatio: 0.72,
    isHeavyChapter: true,
    tagline: "Промышленная станция на колёсной раме для финишных шпаклёвок и работы на 2 поста (3.5 кВт · 6.5 л/мин)",
    materialTags: ["Danogips / Sheetrock", "Финишные шпаклёвки", "Стеклохолст", "Краска в 2 поста"],
    keySpecs: [
      { label: "Подача", value: "6,5", unit: "л/мин" },
      { label: "Двигатель", value: "3,5", unit: "кВт" },
      { label: "Сопло до", value: "0.043", unit: "дюйм" },
    ],
    tasks: ["putty", "paint"],
  },
  "nord-8000-pro": {
    codeStamp: "8000 PRO",
    tier: "5 КЛАСС · СВЕРХВЫСОКОЕ ДАВЛЕНИЕ 350 БАР",
    shiftScope: "350 бар · 220 В · 50 кг",
    shiftMetric: "до 1 500 м²",
    crewMetric: "Единственная в классе баровая станция 350 бар для сверхвязких паст, мастик и огнезащиты",
    podiumTone: "flagship",
    jetRatio: 0.85,
    isHeavyChapter: true,
    tagline: "Экстремальная баровая станция (350 бар) для вязких мастик, антикора и шпаклёвок (4.0 кВт · 7.5 л/мин)",
    materialTags: ["Давление 350 бар", "Огнезащита (ОГЗ)", "Гидроизоляция и мастики", "Густые шпаклёвки"],
    keySpecs: [
      { label: "Подача", value: "7,5", unit: "л/мин" },
      { label: "Давление", value: "350", unit: "бар" },
      { label: "Сопло до", value: "0.045", unit: "дюйм" },
    ],
    tasks: ["putty", "fire", "waterproof"],
  },
  "nord-9200": {
    codeStamp: "NORD-9200",
    tier: "5 КЛАСС · СКОРОСТНАЯ ШПАКЛЁВКА 9 Л/МИН",
    shiftScope: "2 поста · 220 В · 50 кг",
    shiftMetric: "до 1 600 м²",
    crewMetric: "Увеличенная поршневая группа 9.0 л/мин наносит шпаклёвку без разбавления водой",
    podiumTone: "cobalt",
    jetRatio: 0.88,
    isHeavyChapter: true,
    tagline: "Высокопроизводительный агрегат с увеличенной поршневой группой (4.0 кВт · 9.0 л/мин · сопло до 0.049″)",
    materialTags: ["Полимерные и гипсовые пасты", "Выравнивающие шпаклёвки", "Огнезащита", "Работа в 2 поста"],
    keySpecs: [
      { label: "Подача", value: "9,0", unit: "л/мин" },
      { label: "Двигатель", value: "4,0", unit: "кВт" },
      { label: "Сопло до", value: "0.049", unit: "дюйм" },
    ],
    tasks: ["putty", "fire"],
  },
  "nord-9900": {
    codeStamp: "NORD-9900",
    tier: "6 КЛАСС · ТЯЖЁЛЫЙ ПРОМЫШЛЕННЫЙ 11 Л/МИН",
    shiftScope: "2 поста · 220 В · 50 кг",
    shiftMetric: "до 2 200 м²",
    crewMetric: "Сверхмощный привод 5.0 кВт (11 л/мин) с прямым погружным насосом для тяжёлых паст",
    podiumTone: "flagship",
    jetRatio: 0.94,
    isHeavyChapter: true,
    tagline: "Сверхмощная 5-киловаттная станция для тяжелых паст, мастик и огнезащиты (5.0 кВт · 11.0 л/мин)",
    materialTags: ["Тяжёлые шпаклёвки ЖК", "Конструктивная ОГЗ", "Битумная гидроизоляция", "2–3 поста"],
    keySpecs: [
      { label: "Подача", value: "11,0", unit: "л/мин" },
      { label: "Двигатель", value: "5,0", unit: "кВт" },
      { label: "Сопло до", value: "0.053", unit: "дюйм" },
    ],
    tasks: ["putty", "fire", "waterproof"],
  },
  "nord-18x": {
    codeStamp: "NORD-18X",
    tier: "ФЛАГМАН · ЭКСТРЕМАЛЬНЫЙ ПОТОК 18 Л/МИН",
    shiftScope: "2–3 поста · 18 л/мин · 55 кг",
    shiftMetric: "до 3 000 м²",
    crewMetric: "Самый мощный аппарат линейки (5.5 кВт, 18 л/мин, сопло до 0.065″) на 2–3 поста",
    podiumTone: "flagship",
    jetRatio: 1.0,
    isHeavyChapter: true,
    tagline: "Флагманская станция максимальной производительности (18 л/мин, 5.5 кВт, сопло до 0.065″)",
    materialTags: ["Все виды шпаклёвок (до 0.065″)", "Огнезащита и мастики", "Гидроизоляция", "2–3 поста одновременно"],
    keySpecs: [
      { label: "Подача", value: "18,0", unit: "л/мин" },
      { label: "Двигатель", value: "5,5", unit: "кВт" },
      { label: "Сопло до", value: "0.065", unit: "дюйм" },
    ],
    tasks: ["putty", "fire", "waterproof"],
  },
};

function toShowStation(p: Product): ShowStation {
  const m = STATION_META[p.id] ?? STATION_META["nord-2500"];
  const fallback = p.images[0]?.src ?? "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg";
  return {
    id: p.id,
    slug: p.slug,
    model: p.short_name || p.model,
    fullName: p.name,
    codeStamp: m.codeStamp,
    tier: m.tier,
    shiftScope: m.shiftScope,
    shiftMetric: m.shiftMetric,
    crewMetric: m.crewMetric,
    podiumTone: m.podiumTone,
    jetRatio: m.jetRatio,
    isHeavyChapter: m.isHeavyChapter,
    tagline: m.tagline,
    description: p.description,
    materials: p.materials,
    materialTags: m.materialTags,
    price: p.purchase_price,
    rentDaily: p.rental_price_daily,
    rentMinDays: p.rental_min_days || 1,
    inStock: p.stock_quantity > 0,
    featured: p.id === "nord-6000",
    images: p.images,
    fallback,
    keySpecs: m.keySpecs,
    allSpecs: p.characteristics,
    tasks: m.tasks,
  };
}

export const STATIONS: ShowStation[] = FALLBACK_PRODUCTS.map(toShowStation);

export function formatRub(value: number | null | undefined): string {
  if (value === null || value === undefined) return "По запросу";
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

export type MatchInput = { task: TaskId; area: number; power380?: boolean };

export function matchStation({
  task,
  area,
}: MatchInput): { primary: string; alt: string[]; reasons: string[] } {
  if (task === "paint") {
    if (area <= 500) {
      return {
        primary: "nord-2500",
        alt: ["nord-3300", "nord-4500"],
        reasons: [
          "Лёгкий вес 15 кг и мягкий факел 230 бар для интерьерного финиша Q4",
          "Производительность 2,5 л/мин и сопло до 0.023″ перекрывают квартиры и коттеджи",
          "Полный рабочий пост в сборе за 35 000 ₽",
        ],
      };
    }
    if (area <= 1100) {
      return {
        primary: "nord-3300",
        alt: ["nord-4500", "nord-2500"],
        reasons: [
          "Подача 3,3 л/мин и бесщёточный привод 2,5 кВт для больших площадей",
          "Поддержка сопел до 0.033″ без просадки давления на плотных красках",
          "Встроенный фильтр коллектора ВД для идеальной чистоты распыла",
        ],
      };
    }
    return {
      primary: "nord-4500",
      alt: ["nord-6000", "nord-3300"],
      reasons: [
        "Мощная станция 2,8 кВт (4,2 л/мин) с поддержкой сопел до 0.037″",
        "Уверенно прокачивает фасадные акрилаты, грунт-эмали и антикор",
        "Стабильная подача на трассах шлангов до 30–45 м",
      ],
    };
  }

  if (task === "putty" || task === "texture") {
    if (area <= 1200) {
      return {
        primary: "nord-6000",
        alt: ["nord-9200", "nord-8000-pro"],
        reasons: [
          "Хит продаж (6,5 л/мин, 3,5 кВт) на колёсной раме",
          "Уверенно наносит полимерные шпаклёвки (Danogips, Sheetrock) соплом до 0.043″",
          "Позволяет работать в 2 малярных поста одновременно на краске",
        ],
      };
    }
    if (area <= 2000) {
      return {
        primary: "nord-9200",
        alt: ["nord-9900", "nord-8000-pro"],
        reasons: [
          "Увеличенная поршневая группа 9,0 л/мин (сопло до 0.049″)",
          "Высокая скорость нанесения шпаклёвки без разбавления водой (до 1 500 м²/смена)",
          "Работа от стандартной сети 220 В (4,0 кВт)",
        ],
      };
    }
    return {
      primary: "nord-18x",
      alt: ["nord-9900", "nord-9200"],
      reasons: [
        "Флагманская производительность 18,0 л/мин (5,5 кВт, сопло до 0.065″)",
        "Одновременная работа 2–3 малярных постов без потери давления",
        "Максимальная выработка на крупных объектах до 3 000 м² в смену",
      ],
    };
  }

  return {
    primary: "nord-8000-pro",
    alt: ["nord-9900", "nord-18x"],
    reasons: [
      "Экстремальное рабочее давление 350 бар для сверхвязких мастик и антикора",
      "Прокачка высотных и длинных магистралей шлангов до 60–90 м",
      "Подача 7,5 л/мин (4,0 кВт) и сопло до 0.045″",
    ],
  };
}
