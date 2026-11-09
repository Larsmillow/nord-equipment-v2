import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "nord-db.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const INITIAL_DB = {
  pinCode: "2026",
  categories: [
    { id: "piston_paint", name: "Окрасочные аппараты", badge: "Интерьер и Фасад", order: 1, active: true },
    { id: "piston_putty", name: "Шпаклёвочные станции HD", badge: "Краска + Шпаклёвка", order: 2, active: true },
    { id: "screw_putty", name: "Шнековые шпаклёвочные аппараты", badge: "Тяжёлые смеси", order: 3, active: true },
    { id: "spares", name: "Запчасти и аксессуары (ЗИП)", badge: "Комплектующие", order: 4, active: true },
  ],
  products: [
    {
      id: "nord-2500",
      name: "NORD-2500",
      categoryId: "piston_paint",
      badge: "1 КЛАСС · ИНТЕРЬЕР Q4",
      subtitle: "Компактный бесщёточный поршневой аппарат для малярных работ",
      priceRub: 35000,
      costPriceRub: 22000,
      rentDayRub: 1500,
      inStock: true,
      powerW: "1600 W",
      flowLpm: "2.5 л/мин",
      pressureBar: "230 бар",
      maxTip: '0.023"',
      motorType: "Бесщёточный",
      weightKg: "15кг / 19кг",
      photoUrl: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
      description: "Создан для интерьерной окраски квартир и офисов. Равномерная атомизация красок, грунтовок и лаков.",
    },
    {
      id: "nord-3300",
      name: "NORD-3300",
      categoryId: "piston_paint",
      badge: "2 КЛАСС · УСИЛЕННЫЙ",
      subtitle: "Скоростной бесщёточный аппарат повышенной подачи",
      priceRub: 45000,
      costPriceRub: 29000,
      rentDayRub: 1700,
      inStock: true,
      powerW: "2200 W",
      flowLpm: "3.3 л/мин",
      pressureBar: "230 бар",
      maxTip: '0.033"',
      motorType: "Бесщёточный",
      weightKg: "17кг / 22кг",
      photoUrl: "/assets/machines/nord-3300/NORD-3200-view-front-side-nord-edit-2k.jpg",
      description: "Оптимальный выбор для фасадных и интерьерных красок, эпоксидных грунтов и эмалей по металлу.",
    },
    {
      id: "nord-4500",
      name: "NORD-4500",
      categoryId: "piston_paint",
      badge: "3 КЛАСС · ФАСАДЫ И МЕТАЛЛ",
      subtitle: "Мощная станция для вязких красок и антикора",
      priceRub: 55000,
      costPriceRub: 36000,
      rentDayRub: 2000,
      inStock: true,
      powerW: "3000 W",
      flowLpm: "4.2 л/мин",
      pressureBar: "230 бар",
      maxTip: '0.033"',
      motorType: "Бесщёточный",
      weightKg: "22кг / 28кг",
      photoUrl: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
      description: "Справляется с высоковязкими фасадными составами, эпоксидными эмалями и огнезащитой по металлу.",
    },
    {
      id: "nord-6000",
      name: "NORD-6000",
      categoryId: "piston_putty",
      badge: "4 КЛАСС · ХИТ (КРАСКА + ШПАКЛЁВКА)",
      subtitle: "Промышленная станция на колёсной раме для финишных шпаклёвок",
      priceRub: 95000,
      costPriceRub: 64000,
      rentDayRub: 2300,
      inStock: true,
      powerW: "4000 W",
      flowLpm: "6.5 л/мин",
      pressureBar: "230 бар",
      maxTip: '0.041"',
      motorType: "Бесщёточный",
      weightKg: "48кг / 65кг",
      photoUrl: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
      description: "Легко продавливает готовые полимерные финишные шпаклёвки (Danogips, Sheetrock) и работает на 2 поста.",
    },
    {
      id: "nord-8000-pro",
      name: "NORD-8000 PRO",
      categoryId: "piston_putty",
      badge: "5 КЛАСС · 350 БАР EXTREME",
      subtitle: "Экстремальная баровая станция (350 бар) для вязких мастик и шпаклёвок",
      priceRub: 150000,
      costPriceRub: 98000,
      rentDayRub: 2700,
      inStock: true,
      powerW: "4500 W",
      flowLpm: "7.5 л/мин",
      pressureBar: "350 бар",
      maxTip: '0.045"',
      motorType: "Бесщёточный",
      weightKg: "58кг / 78кг",
      photoUrl: "/assets/machines/nord-8000-pro/NORD-8000-view-front-3q-source.jpg",
      description: "Рабочее давление 350 бар для сверхвязких тиксотропных смесей, огнезащиты, антикора и шпаклёвки.",
    },
    {
      id: "nord-9200",
      name: "NORD-9200",
      categoryId: "piston_putty",
      badge: "5 КЛАСС · 9.2 Л/МИН",
      subtitle: "Высокопроизводительный агрегат с увеличенной поршневой группой",
      priceRub: 125000,
      costPriceRub: 82000,
      rentDayRub: 2500,
      inStock: true,
      powerW: "4200 W",
      flowLpm: "9.2 л/мин",
      pressureBar: "230 бар",
      maxTip: '0.049"',
      motorType: "Бесщёточный",
      weightKg: "62кг / 80кг",
      photoUrl: "/assets/machines/nord-9200/NORD-8000-view-front-3q-source.jpg",
      description: "Укладывает базовые и финишные полимерные шпаклёвки и густые огнезащитные пасты до 2000 м² в смену.",
    },
    {
      id: "nord-9900",
      name: "NORD-9900",
      categoryId: "piston_putty",
      badge: "6 КЛАСС · 10 Л/МИН ТЯЖЁЛЫЙ HD",
      subtitle: "Сверхмощная 5-киловаттная станция с нижним всасывающим клапаном",
      priceRub: 175000,
      costPriceRub: 112000,
      rentDayRub: 3200,
      inStock: true,
      powerW: "5000 W",
      flowLpm: "10.0 л/мин",
      pressureBar: "230 бар",
      maxTip: '0.053"',
      motorType: "Бесщёточный",
      weightKg: "75кг / 95кг",
      photoUrl: "/assets/machines/nord-9900/NORD-18X-view-front.jpg",
      description: "Раскрывает сопла до 0.053\", перекачивая неразбавленные базовые шпаклёвки, огнезащиту и мастики.",
    },
    {
      id: "nord-18x",
      name: "NORD-18X",
      categoryId: "screw_putty",
      badge: "ФЛАГМАН · 18 Л/МИН EXTREME",
      subtitle: "Флагманская шнековая станция с приёмным бункером для непрерывной подачи",
      priceRub: 155000,
      costPriceRub: 102000,
      rentDayRub: 2900,
      inStock: true,
      powerW: "3500 W",
      flowLpm: "18.0 л/мин",
      pressureBar: "20–30 бар",
      maxTip: '0.055"',
      motorType: "Шнековый (героторный)",
      weightKg: "85кг / 110кг",
      photoUrl: "/assets/machines/nord-18x/NORD-18X-view-front-3q-a.jpg",
      description: "Рекордная шнековая подача 18 л/мин с бункером для потоковой механизированной отделки этажей ЖК.",
    },
  ],
  spares: [
    {
      id: "spare-tip-xhd",
      name: "Сопло реверсивное NORD RAC X-HD (все размеры)",
      subCategory: "Сопла и базы",
      sku: "NRD-XHD-517",
      priceRub: 1950,
      costPriceRub: 750,
      inStock: true,
      photoUrl: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
      compatibility: "Все безвоздушные пистолеты 7/8\"",
    },
    {
      id: "spare-hose-15m",
      name: 'Шланг высокого давления NORD 1/4" × 15 м (250 бар)',
      subCategory: "Шланги и поводки",
      sku: "NRD-HS-1415",
      priceRub: 5900,
      costPriceRub: 2800,
      inStock: true,
      photoUrl: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
      compatibility: "NORD-2500 / 3300 / 4500 / 6000",
    },
    {
      id: "spare-gun-pro",
      name: "Пистолет безвоздушный NORD Contractor Pro (4 пальца + вертлюг)",
      subCategory: "Пистолеты и удочки",
      sku: "NRD-GN-250",
      priceRub: 6500,
      costPriceRub: 3100,
      inStock: true,
      photoUrl: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
      compatibility: "Все станции NORD / Graco / Aspro",
    },
  ],
  accounting: {
    transactions: [
      {
        id: "tx-101",
        date: "2026-11-09",
        type: "income",
        title: "Продажа станции NORD-6000 + 2 сопла",
        clientName: 'ООО «СпецСтройИнвест»',
        clientInn: "7810459210",
        amountRub: 98900,
        costPriceRub: 65500,
        extraCostRub: 0,
        profitRub: 33400,
        paymentMethod: "Безнал (Счёт с НДС)",
        status: "paid",
      },
      {
        id: "tx-102",
        date: "2026-11-09",
        type: "income",
        title: "Аренда станции NORD-8000 PRO (10 сут.)",
        clientName: "ИП Громов А.В.",
        clientInn: "772391048219",
        amountRub: 38000,
        costPriceRub: 3000,
        extraCostRub: 0,
        profitRub: 35000,
        paymentMethod: "СБП / Перевод",
        status: "paid",
      },
      {
        id: "tx-103",
        date: "2026-11-08",
        type: "expense",
        title: "Логистика и обрешётка груза (Деловые Линии)",
        clientName: "Терминал СПб",
        clientInn: "",
        amountRub: 4500,
        costPriceRub: 4500,
        extraCostRub: 0,
        profitRub: -4500,
        paymentMethod: "Карта компании",
        status: "paid",
      },
    ],
  },
  companyDocs: {
    companyName: 'ООО «НОРД ИНДАСТРИАЛ»',
    inn: "7811004590",
    kpp: "781101001",
    ogrn: "1247800019284",
    legalAddress: "г. Санкт-Петербург / г. Москва, Окружной проезд, 34Ас6",
    bankName: 'АО «ТБанк» (Тинькофф)',
    bik: "044525974",
    checkingAccount: "40702810910000849201",
    corrAccount: "30101810145250000974",
    directorName: "Курбанов Магомед Магомедович",
    phone: "+7 999 600-23-18",
    email: "larsmillow@nord-equip.ru",
    vatMode: "С НДС 20%",
    invoicePrefix: "НРД",
    warrantyMonths: 12,
  },
};

function readDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return INITIAL_DB;
  }
}

function writeDb(data: any) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const db = readDb();
  return NextResponse.json(db, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Если передана загрузка изображения в формате base64 с iPhone:
    if (body.action === "uploadImage" && body.base64Data) {
      if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      const matches = body.base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const fileName = `nord-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        fs.writeFileSync(filePath, buffer);
        return NextResponse.json({ ok: true, url: `/uploads/${fileName}` });
      }
      return NextResponse.json({ ok: false, error: "Invalid image format" }, { status: 400 });
    }

    // Сохранение обновлённой базы:
    if (body.db) {
      writeDb(body.db);
      return NextResponse.json({ ok: true, db: body.db });
    }

    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
