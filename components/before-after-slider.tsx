"use client";

import Image from "next/image";
import Link from "next/link";
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
            <p className="eyebrow">ТЕХНОЛОГИЧЕСКИЙ РЕЗУЛЬТАТ БЕЗВОЗДУШНОГО РАСПЫЛА 230 БАР</p>
            <h2>Монолитное укрытие бетона и стен с первого прохода</h2>
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
              После 230 бар
            </button>
          </div>
        </div>

        <div className="before-after-shell">
          {/* Structured Telemetry Header Pills (Exact Industrial Indices) */}
          <div className="before-after-telemetry-bar">
            <span className="ba-telemetry-pill">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "-2px" }}>
                <line x1="1" y1="8" x2="15" y2="8" />
                <path d="M8 8L4 14H12L8 8Z" fill="rgba(56,189,248,0.2)" />
              </svg>
              OBJ // ТЕРМИНАЛ 1 200 М² (БЕТОН B25)
            </span>
            <span className="ba-telemetry-pill ba-telemetry-pill--accent">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "-2px" }}>
                <line x1="1" y1="9" x2="17" y2="9" />
                <path d="M5 4C7.5 6.5 10.5 6.5 13 4" />
                <path d="M5 14C7.5 11.5 10.5 11.5 13 14" />
              </svg>
              SYS // СТАНЦИЯ NORD-18X (18 Л/МИН)
            </span>
            <span className="ba-telemetry-pill">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "-2px" }}>
                <path d="M3.5 13.5A7 7 0 1 1 14.5 13.5" />
                <line x1="9" y1="10" x2="13.5" y2="5.5" />
                <circle cx="9" cy="10" r="1.5" fill="currentColor" />
              </svg>
              P // 230 БАР · СОПЛО 0.035″
            </span>
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
              alt="Промышленный зал после безвоздушной окраски аппаратом NORD-18X"
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
              ДО: ЧЕРНОВОЙ БЕТОН
            </span>
            <span className="before-after-label before-after-label--after">
              ПОСЛЕ: ФАКЕЛ 230 БАР
            </span>

            <span
              className="before-after-divider"
              style={{ left: `${split}%` }}
              aria-hidden="true"
            >
              <span className="before-after-handle">‹ N ›</span>
            </span>
          </div>

          {/* High-Contrast 4-Metric Engineering Strip with Exact Glyphs */}
          <div className="before-after-metrics-grid">
            <div className="ba-metric-card">
              <span className="ba-metric-label">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 4, verticalAlign: "-2px" }}>
                  <path d="M3.5 13.5A7 7 0 1 1 14.5 13.5" />
                  <line x1="9" y1="10" x2="13.5" y2="5.5" />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                </svg>
                P // ДАВЛЕНИЕ РАСПЫЛА
              </span>
              <strong className="ba-metric-val">230 бар</strong>
              <small>Равномерная атомизация без полос</small>
            </div>
            <div className="ba-metric-card">
              <span className="ba-metric-label">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 4, verticalAlign: "-2px" }}>
                  <line x1="2" y1="14" x2="16" y2="14" />
                  <line x1="2" y1="6" x2="16" y2="6" strokeDasharray="2 2" />
                  <path d="M9 6V14M9 6L7 8M9 6L11 8M9 14L7 12M9 14L11 12" />
                </svg>
                WFT // МОКРЫЙ СЛОЙ
              </span>
              <strong className="ba-metric-val">180–220 мкм</strong>
              <small>Монолитный укрыв за 1 проход</small>
            </div>
            <div className="ba-metric-card">
              <span className="ba-metric-label">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 4, verticalAlign: "-2px" }}>
                  <rect x="3" y="3" width="12" height="12" />
                  <path d="M3 15L15 3" strokeDasharray="2 2" />
                </svg>
                OUT // ТЕМП ВЫРАБОТКИ
              </span>
              <strong className="ba-metric-val">до 1 200 м² / 8ч</strong>
              <small>В 6 раз быстрее ручных валиков</small>
            </div>
            <div className="ba-metric-card">
              <span className="ba-metric-label">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 4, verticalAlign: "-2px" }}>
                  <path d="M2 7H5V11H2V7Z" />
                  <path d="M5 9L15 3V15L5 9Z" />
                  <line x1="11" y1="5.5" x2="11" y2="12.5" strokeDasharray="1.5 1.5" />
                </svg>
                EFF // ЭКОНОМИЯ СОСТАВА
              </span>
              <strong className="ba-metric-val">до 22% ЛКМ</strong>
              <small>Точный факел без тумана и потерь</small>
            </div>
          </div>

          {/* Direct Conversion CTA into Interactive 3D Wall Simulator */}
          <div className="ba-lab-cta-bar">
            <div className="ba-lab-cta-copy">
              <span className="ba-lab-cta-kicker">ИНТЕРАКТИВНЫЙ 3D-СТЕНД NORD LAB</span>
              <strong>Хотите протестировать факел 230 бар и шпатель 60 см на стене?</strong>
              <p>Выберите любую станцию от NORD-2500 до NORD-18X, зажмите курок и проверьте толщину слоя в микронах.</p>
            </div>
            <div className="ba-lab-cta-actions">
              <Link className="button button-white ba-lab-btn-main" href="/lab?machine=nord-18x">
                <span>Запустить 3D-тест на стене</span>
                <span className="chevron-icon">&gt;&gt;</span>
              </Link>
              <Link className="button button-outline-light ba-lab-btn-sec" href="#power-grades">
                Регламент задач
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
