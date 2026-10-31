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
  const [minFlow, setMinFlow] = useState("");
  const [maxFlow, setMaxFlow] = useState("");
  const [minPower, setMinPower] = useState("");
  const [maxPower, setMaxPower] = useState("");
  const [minPressure, setMinPressure] = useState("");
  const [maxPressure, setMaxPressure] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [quickReel, setQuickReel] = useState(false);

  const manufacturers = useMemo(
    () => [...new Set(products.map((product) => product.manufacturer).filter(Boolean))].sort(),
    [products],
  );

  const visible = useMemo(
    () =>
      products.filter((product) => {
        const query = search.trim().toLocaleLowerCase("ru");
        const text = `${product.name} ${product.model} ${product.manufacturer} ${product.description}`.toLocaleLowerCase("ru");
        const flow = metricValues(product, "flow");
        const power = metricValues(product, "power");
        const pressure = metricValues(product, "pressure");
        const price = metricValues(product, "price");
        return (
          (!query || text.includes(query)) &&
          (!manufacturer || product.manufacturer === manufacturer) &&
          (!drive || product.drive === drive || (drive === "electric" && product.drive === "multi")) &&
          (!category || product.category_slug === category) &&
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
      }),
    [
      products,
      search,
      manufacturer,
      drive,
      category,
      minFlow,
      maxFlow,
      minPower,
      maxPower,
      minPressure,
      maxPressure,
      minPrice,
      maxPrice,
      quickReel,
    ],
  );

  const flow = bounds(products, "flow");
  const power = bounds(products, "power");
  const pressure = bounds(products, "pressure");
  const price = bounds(products, "price");

  function resetAll() {
    setSearch("");
    setManufacturer("");
    setDrive("");
    setCategory(categorySlug || "");
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
      {/* Quick task presets */}
      <div className="catalog-presets">
        <span className="preset-label">Быстрый фильтр по задаче:</span>
        <button
          type="button"
          className={`preset-chip${category === "" && !minFlow && !quickReel ? " is-active" : ""}`}
          onClick={resetAll}
        >
          Все модели ({products.length})
        </button>
        <button
          type="button"
          className={`preset-chip${category === "painting" && maxFlow === "5" ? " is-active" : ""}`}
          onClick={() => {
            resetAll();
            setCategory("painting");
            setMaxFlow("5");
          }}
        >
          Окраска до 5 л/мин
        </button>
        <button
          type="button"
          className={`preset-chip${minFlow === "6" && category === "" ? " is-active" : ""}`}
          onClick={() => {
            resetAll();
            setMinFlow("6");
          }}
        >
          Высокая подача (от 6 л/мин)
        </button>
        <button
          type="button"
          className={`preset-chip${category === "putty" ? " is-active" : ""}`}
          onClick={() => {
            resetAll();
            setCategory("putty");
          }}
        >
          Под шпаклёвку
        </button>
        <button
          type="button"
          className={`preset-chip${category === "fire" ? " is-active" : ""}`}
          onClick={() => {
            resetAll();
            setCategory("fire");
          }}
        >
          Под огнезащиту
        </button>
        <button
          type="button"
          className={`preset-chip${quickReel ? " is-active" : ""}`}
          onClick={() => {
            resetAll();
            setQuickReel(true);
          }}
        >
          С барабаном QuickReel
        </button>
      </div>

      <div className="catalog-toolbar">
        <label className="form-field">
          <span>Поиск по модели или артикулу</span>
          <input
            className="form-control"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Например: GTB-1095, PT-9528-X…"
          />
        </label>
        <label className="form-field">
          <span>Направление работ</span>
          <select className="form-control" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Все направления</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Завод-производитель</span>
          <select className="form-control" value={manufacturer} onChange={(event) => setManufacturer(event.target.value)}>
            <option value="">Все бренды</option>
            {manufacturers.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Тип привода</span>
          <select className="form-control" value={drive} onChange={(event) => setDrive(event.target.value)}>
            <option value="">Любой привод</option>
            <option value="electric">Электрический (220/380В)</option>
            <option value="pneumatic">Пневматический</option>
            <option value="multi">Автономный / ДВС</option>
          </select>
        </label>
      </div>

      <details className="filter-panel">
        <summary>Инженерный фильтр по ТТХ (Подача л/мин · Мощность Вт · Давление бар · Цена)</summary>
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
            <span>Только модели с интегрированным барабаном QuickReel</span>
          </label>
          <button className="button button-outline" type="button" onClick={resetAll}>
            Сбросить параметры
          </button>
        </div>
      </details>

      <div className="catalog-status-bar" aria-live="polite">
        <span>
          Отображено позиций: <strong>{visible.length}</strong> из {products.length}
        </span>
        {(search || manufacturer || drive || (category && category !== categorySlug) || minFlow || maxFlow || minPower || maxPower || minPressure || maxPressure || minPrice || maxPrice || quickReel) && (
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
          <h3>По заданным техническим параметрам аппараты не найдены</h3>
          <p>Сбросьте ограничения фильтра или поручите подбор инженеру NORD под ваш материал.</p>
          <button className="button button-primary" type="button" onClick={resetAll}>
            Показать все модели
          </button>
        </div>
      )}
    </div>
  );
}
