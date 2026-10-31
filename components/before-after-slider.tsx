"use client";

import Image from "next/image";
import { useState, type KeyboardEvent, type PointerEvent } from "react";

export function BeforeAfterSlider() {
  const [split, setSplit] = useState(48);

  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextSplit = ((event.clientX - bounds.left) / bounds.width) * 100;
    setSplit(Math.round(Math.min(100, Math.max(0, nextSplit))));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        setSplit((value) => Math.max(0, value - step));
        break;
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        setSplit((value) => Math.min(100, value + step));
        break;
      case "Home":
        event.preventDefault();
        setSplit(0);
        break;
      case "End":
        event.preventDefault();
        setSplit(100);
        break;
    }
  }

  return (
    <section className="section before-after-section">
      <div className="container">
        <div className="before-after-heading">
          <div>
            <p className="eyebrow">02 // КОНТРОЛЬ УКРЫВИСТОСТИ И КАЧЕСТВА ФАКЕЛА</p>
            <h2>Механизированная выработка в один проход</h2>
          </div>
          <div className="before-after-controls" role="group" aria-label="Режим просмотра">
            <button
              type="button"
              className={split >= 85 ? "ba-chip is-active" : "ba-chip"}
              onClick={() => setSplit(92)}
            >
              До окраски
            </button>
            <button
              type="button"
              className={split > 15 && split < 85 ? "ba-chip is-active" : "ba-chip"}
              onClick={() => setSplit(48)}
            >
              50 / 50
            </button>
            <button
              type="button"
              className={split <= 15 ? "ba-chip is-active" : "ba-chip"}
              onClick={() => setSplit(8)}
            >
              После окраски
            </button>
          </div>
        </div>

        <div className="before-after-shell">
          <div className="before-after-telemetry-bar">
            <span>ОБЪЕКТ: ПРОМЫШЛЕННЫЙ ТЕРМИНАЛ (БЕТОН B25)</span>
            <span>СТАНЦИЯ: NORD 9536 PRO (230 БАР · 18 Л/МИН)</span>
            <span>ВЫРАБОТКА: ДО 1 200 М² / СМЕНА</span>
          </div>

          <div
            className="before-after-frame"
            role="slider"
            tabIndex={0}
            aria-label="Сравнение объекта до и после безвоздушной окраски"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={split}
            aria-valuetext={`${split}% изображения «до»`}
            onKeyDown={handleKeyDown}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                updateFromPointer(event);
              }
            }}
          >
            <Image
              className="before-after-image"
              src="/assets/site/nord-after.png?v=nord5"
              alt="Промышленный зал после безвоздушной окраски аппаратом NORD 9536"
              fill
              unoptimized
              priority
              sizes="(max-width: 760px) 100vw, 1280px"
            />
            <div
              className="before-after-before"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            >
              <Image
                className="before-after-image"
                src="/assets/site/nord-before.png?v=nord3"
                alt="Черновой бетонный зал до окраски"
                fill
                unoptimized
                priority
                sizes="(max-width: 760px) 100vw, 1280px"
              />
            </div>

            <span className="before-after-label before-after-label--before">
              01 / ДО: ЧЕРНОВОЙ БЕТОН
            </span>
            <span className="before-after-label before-after-label--after">
              02 / ПОСЛЕ: ПОКРЫТИЕ 230 БАР
            </span>

            <span
              className="before-after-divider"
              style={{ left: `${split}%` }}
              aria-hidden="true"
            >
              <span className="before-after-handle">‹ N ›</span>
            </span>
          </div>

          <div className="before-after-footer-grid">
            <div>
              <span>ИСХОДНОЕ ОСНОВАНИЕ</span>
              <strong>Монолитный железобетон без финишной отделки</strong>
            </div>
            <div>
              <span>ТЕХНОЛОГИЯ НАНЕСЕНИЯ</span>
              <strong>Безвоздушное распыление под давлением 230 бар</strong>
            </div>
            <div>
              <span>ТОЛЩИНА МОКРОГО СЛОЯ</span>
              <strong>180–220 мкм без полошения и шагрени валика</strong>
            </div>
            <div>
              <span>УПРАВЛЕНИЕ ШТОРКОЙ</span>
              <strong>Потяните разделитель ‹ N › мышью или клавишами ← →</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
