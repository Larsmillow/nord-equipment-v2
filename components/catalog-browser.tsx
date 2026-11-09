"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

const numberPattern = /\d+(?:[\s\u00a0]\d{3})*(?:[.,]\d+)?/g;

function parseCleanNumbers(raw: string): number[] {
  return [...raw.matchAll(numberPattern)]
    .map(([m]) => Number(m.replace(/[\s\u00a0]/g, "").replace(",", ".")))
    .filter(Number.isFinite);
}

function metricValues(product: Product, metric: "flow" | "power" | "pressure" | "price"): number[] {
  if (metric === "price") {
    return product.purchase_price !== null && product.purchase_price > 0 ? [product.purchase_price] : [];
  }
  if (metric === "flow" && product.flow_lpm !== null && Number.isFinite(Number(product.flow_lpm))) {
    return [Number(product.flow_lpm)];
  }

  const matchingSpecs = product.characteristics.filter((spec) => {
    const name = spec.name.toLocaleLowerCase("ru");
    if (metric === "flow") return name.includes("производительност") || name.includes("подач");
    if (metric === "power") return name.includes("мощност");
    return name.includes("давлен");
  });

  if (!matchingSpecs.length) return [];

  return matchingSpecs.flatMap((spec) => {
    const val = spec.value;
    const lower = val.toLocaleLowerCase("ru");
    if (metric === "power") {
      const wattsIdx = lower.lastIndexOf("вт");
      if (wattsIdx >= 0) {
        const hpIdx = lower.lastIndexOf("л.с.");
        const slice = val.slice(hpIdx < 0 ? 0 : hpIdx + 4, wattsIdx);
        return parseCleanNumbers(slice);
      }
      return parseCleanNumbers(val);
    }
    if (metric === "pressure") {
      const numbers = parseCleanNumbers(val);
      if (lower.includes("мпа")) {
        return numbers.map((n) => n * 10);
      }
      return numbers;
    }
    return parseCleanNumbers(val);
  });
}

function bounds(products: Product[], metric: "flow" | "power" | "pressure" | "price") {
  const values = products.flatMap((product) => metricValues(product, metric));
  return {
    min: values.length ? Math.floor(Math.min(...values)) : 0,
    max: values.length ? Math.ceil(Math.max(...values)) : 0,
  };
}

function getTierNumber(product: Product): number {
  const feats = product.features || [];
  if (feats.includes("Tier 1")) return 1;
  if (feats.includes("Tier 2")) return 2;
  if (feats.includes("Tier 3")) return 3;
  if (feats.includes("Tier 4")) return 4;
  if (feats.includes("Tier 5")) return 5;
  const f = product.flow_lpm ?? 4;
  if (f <= 3) return 1;
  if (f <= 4.8) return 2;
  if (f <= 8.2) return 3;
  if (f <= 13) return 4;
  return 5;
}

const TASK_PRESETS = [
  {
    tier: 1,
    badge: "ЗАДАЧА 01",
    title: "Квартиры и финиш Q4",
    spec: "2,5 л/мин · до 0.023″",
    color: "#0d9488",
    image: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
  },
  {
    tier: 2,
    badge: "ЗАДАЧА 02",
    title: "Фасады и металл",
    spec: "4,2 л/мин · до 0.033″",
    color: "#0284c7",
    image: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
  },
  {
    tier: 3,
    badge: "ЗАДАЧА 03",
    title: "Шпаклёвка + 2 поста",
    spec: "6,5 л/мин · до 0.041″",
    color: "#1d4ed8",
    image: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
  },
  {
    tier: 4,
    badge: "ЗАДАЧА 04",
    title: "Огнезащита 350 бар",
    spec: "7,5 л/мин · 350 бар",
    color: "#1e3a8a",
    image: "/assets/machines/nord-8000-pro/NORD-8000-view-front-3q-source.jpg",
  },
  {
    tier: 5,
    badge: "ЗАДАЧА 05",
    title: "Шнековый 18 л/мин",
    spec: "18,0 л/мин · бункер",
    color: "#b45309",
    image: "/assets/machines/nord-18x/NORD-18X-view-front-3q-a.jpg",
  },
];

export function CatalogBrowser({
  products,
  categories,
  categorySlug,
  initialQuery = "",
}: {
  products: Product[];
  categories: Category[];
  categorySlug?: string;
  initialQuery?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [manufacturer, setManufacturer] = useState("");
  const [drive, setDrive] = useState("");
  const [category, setCategory] = useState(categorySlug || "");
  const [tierFilter, setTierFilter] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"power-asc" | "power-desc" | "price-asc">("power-asc");
  const [minFlow, setMinFlow] = useState("");
  const [maxFlow, setMaxFlow] = useState("");
  const [minPower, setMinPower] = useState("");
  const [maxPower, setMaxPower] = useState("");
  const [minPressure, setMinPressure] = useState("");
  const [maxPressure, setMaxPressure] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [quickReel, setQuickReel] = useState(false);

  const visible = useMemo(() => {
    const filtered = products.filter((product) => {
      const query = search.trim().toLocaleLowerCase("ru");
      const text = `${product.name} ${product.model} ${product.manufacturer} ${product.description}`.toLocaleLowerCase("ru");
      const flow = metricValues(product, "flow");
      const power = metricValues(product, "power");
      const pressure = metricValues(product, "pressure");
      const price = metricValues(product, "price");
      const tNum = getTierNumber(product);
      return (
        (!query || text.includes(query)) &&
        (!manufacturer || product.manufacturer === manufacturer) &&
        (!drive || product.drive === drive || (drive === "electric" && product.drive === "multi")) &&
        (!category || product.category_slug === category) &&
        (!tierFilter || tNum === tierFilter) &&
        ((!minFlow && !maxFlow) ||
          flow.some((value) => (!minFlow || value >= Number(minFlow)) && (!maxFlow || value <= Number(maxFlow)))) &&
        ((!minPower && !maxPower) ||
          power.some((value) => (!minPower || value >= Number(minPower)) && (!maxPower || value <= Number(maxPower)))) &&
        ((!minPressure && !maxPressure) ||
          pressure.some(
            (value) => (!minPressure || value >= Number(minPressure)) && (!maxPressure || value <= Number(maxPressure)),
          )) &&
        ((!minPrice && !maxPrice) ||
          price.some((value) => (!minPrice || value >= Number(minPrice)) && (!maxPrice || value <= Number(maxPrice)))) &&
        (!quickReel || product.features.some((feature) => feature.toLocaleLowerCase("ru").includes("quickreel")))
      );
    });

    return [...filtered].sort((a, b) => {
      const tierA = getTierNumber(a);
      const tierB = getTierNumber(b);
      const priceA = a.purchase_price ?? 999999;
      const priceB = b.purchase_price ?? 999999;
      const flowA = a.flow_lpm ?? 0;
      const flowB = b.flow_lpm ?? 0;

      if (sortOrder === "power-asc") {
        if (tierA !== tierB) return tierA - tierB;
        if (flowA !== flowB) return flowA - flowB;
        return priceA - priceB;
      }
      if (sortOrder === "power-desc") {
        if (tierA !== tierB) return tierB - tierA;
        if (flowA !== flowB) return flowB - flowA;
        return priceB - priceA;
      }
      return priceA - priceB;
    });
  }, [
    products,
    search,
    manufacturer,
    drive,
    category,
    tierFilter,
    sortOrder,
    minFlow,
    maxFlow,
    minPower,
    maxPower,
    minPressure,
    maxPressure,
    minPrice,
    maxPrice,
    quickReel,
  ]);

  const flow = bounds(products, "flow");
  const power = bounds(products, "power");
  const pressure = bounds(products, "pressure");
  const price = bounds(products, "price");

  function resetAll() {
    setSearch("");
    setManufacturer("");
    setDrive("");
    setCategory(categorySlug || "");
    setTierFilter(0);
    setMinFlow("");
    setMaxFlow("");
    setMinPower("");
    setMaxPower("");
    setMinPressure("");
    setMaxPressure("");
    setMinPrice("");
    setMaxPrice("");
    setQuickReel(false);
  }

  return (
    <div className="catalog-engine">
      {/* Studio 5-Task Visual Filter Rail (Clean Industrial Design, Zero Cartoon Emojis) */}
      <div className="catalog-task-strip" role="group" aria-label="Быстрый фильтр по задаче">
        <button
          type="button"
          className={`catalog-task-card catalog-task-card--all${tierFilter === 0 && category === (categorySlug || "") && !minFlow && !quickReel ? " is-active" : ""}`}
          onClick={resetAll}
        >
          <span className="ctc-badge">ВЕСЬ ПАРК</span>
          <strong className="ctc-title">Все задачи ({products.length})</strong>
          <span className="ctc-spec">2,5 – 50 л/мин · 200–350 бар</span>
        </button>

        {TASK_PRESETS.map((preset) => {
          const isActive = tierFilter === preset.tier;
          return (
            <button
              key={preset.tier}
              type="button"
              className={`catalog-task-card${isActive ? " is-active" : ""}`}
              style={{ "--task-accent": preset.color } as React.CSSProperties}
              onClick={() => {
                if (isActive) {
                  setTierFilter(0);
                } else {
                  setTierFilter(preset.tier);
                }
              }}
            >
              <div className="ctc-head">
                <span className="ctc-badge" style={{ background: preset.color, color: "#fff" }}>
                  {preset.badge}
                </span>
                <div className="ctc-thumb">
                  <img
                    src={preset.image}
                    alt={preset.title}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/site/nord-station-1095-cutout.png";
                    }}
                  />
                </div>
              </div>
              <strong className="ctc-title">{preset.title}</strong>
              <span className="ctc-spec">{preset.spec}</span>
            </button>
          );
        })}
      </div>

      <div className="catalog-toolbar">
        <label className="form-field">
          <span>Поиск по модели или составу</span>
          <input
            className="form-control"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Например: NORD-2500, NORD-6000, 18X, шпаклёвка…"
          />
        </label>
        <label className="form-field">
          <span>Порядок ранжирования</span>
          <select
            className="form-control"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as "power-asc" | "power-desc" | "price-asc")}
          >
            <option value="power-asc">По возрастанию подачи (2,5 → 50 л/мин)</option>
            <option value="power-desc">От старших флагманов (50 → 2,5 л/мин)</option>
            <option value="price-asc">По возрастанию стоимости</option>
          </select>
        </label>
        <label className="form-field">
          <span>Раздел оборудования</span>
          <select className="form-control" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Все разделы каталога</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Тип силовой установки</span>
          <select className="form-control" value={drive} onChange={(event) => setDrive(event.target.value)}>
            <option value="">Любой привод</option>
            <option value="electric">Электрический (220 / 380 В)</option>
            <option value="pneumatic">Пневматический</option>
            <option value="multi">Автономный бензиновый ДВС</option>
          </select>
        </label>
      </div>

      <details className="filter-panel">
        <summary>Точный инженерный фильтр по ТТХ (Подача л/мин · Мощность Вт · Давление бар · Бюджет)</summary>
        <div className="filter-grid-advanced">
          <label className="form-field">
            <span>Подача от, л/мин (мин. {flow.min})</span>
            <input
              className="form-control"
              type="number"
              step="0.5"
              min={flow.min}
              max={flow.max || undefined}
              value={minFlow}
              placeholder={String(flow.min)}
              onChange={(event) => setMinFlow(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Подача до, л/мин (макс. {flow.max})</span>
            <input
              className="form-control"
              type="number"
              step="0.5"
              min={flow.min}
              max={flow.max || undefined}
              value={maxFlow}
              placeholder={String(flow.max)}
              onChange={(event) => setMaxFlow(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Мощность от, Вт</span>
            <input
              className="form-control"
              type="number"
              step="100"
              min={power.min}
              max={power.max || undefined}
              value={minPower}
              placeholder={String(power.min)}
              onChange={(event) => setMinPower(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Мощность до, Вт</span>
            <input
              className="form-control"
              type="number"
              step="100"
              min={power.min}
              max={power.max || undefined}
              value={maxPower}
              placeholder={String(power.max)}
              onChange={(event) => setMaxPower(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Давление от, бар</span>
            <input
              className="form-control"
              type="number"
              step="10"
              min={pressure.min}
              max={pressure.max || undefined}
              value={minPressure}
              placeholder={String(pressure.min)}
              onChange={(event) => setMinPressure(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Давление до, бар</span>
            <input
              className="form-control"
              type="number"
              step="10"
              min={pressure.min}
              max={pressure.max || undefined}
              value={maxPressure}
              placeholder={String(pressure.max)}
              onChange={(event) => setMaxPressure(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Цена от, ₽</span>
            <input
              className="form-control"
              type="number"
              step="5000"
              min={price.min}
              max={price.max || undefined}
              value={minPrice}
              placeholder={String(price.min)}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Цена до, ₽</span>
            <input
              className="form-control"
              type="number"
              step="5000"
              min={price.min}
              max={price.max || undefined}
              value={maxPrice}
              placeholder={String(price.max)}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </label>
        </div>
        <div className="filter-panel-footer">
          <label className="filter-checkbox">
            <input type="checkbox" checked={quickReel} onChange={(event) => setQuickReel(event.target.checked)} />
            <span>Только станции с интегрированным барабаном QuickReel</span>
          </label>
          <button className="button button-outline" type="button" onClick={resetAll}>
            Сбросить параметры
          </button>
        </div>
      </details>

      <div className="catalog-status-bar" aria-live="polite">
        <span>
          Найдено станций: <strong>{visible.length}</strong> из {products.length} · Сортировка:{" "}
          <strong>
            {sortOrder === "power-asc"
              ? "По возрастанию подачи (от 2,5 л/мин)"
              : sortOrder === "power-desc"
                ? "От старших флагманов"
                : "По стоимости"}
          </strong>
        </span>
        {(search ||
          manufacturer ||
          drive ||
          tierFilter !== 0 ||
          (category && category !== categorySlug) ||
          minFlow ||
          maxFlow ||
          minPower ||
          maxPower ||
          minPressure ||
          maxPressure ||
          minPrice ||
          maxPrice ||
          quickReel) && (
          <button type="button" className="text-button" onClick={resetAll}>
            Сбросить все фильтры ×
          </button>
        )}
      </div>

      {visible.length ? (
        <div className="product-grid catalog-products">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>По заданным техническим параметрам станции не найдены</h3>
          <p>Сбросьте ограничения фильтра или поручите подбор дежурному инженеру NORD под ваш состав.</p>
          <button className="button button-primary" type="button" onClick={resetAll}>
            Показать все станции
          </button>
        </div>
      )}
    </div>
  );
}