"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import "./lab.css";

// ============================================================================
// ВЕКТОРНЫЕ ИКОНКИ ИНЖЕНЕРНОЙ КОНСОЛИ NORD (БЕЗ ВНЕШНИХ ЗАВИСИМОСТЕЙ)
// ============================================================================

function IconGauge({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg width="16" height="16" style={{ width: "16px", height: "16px", flexShrink: 0 }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function IconZap({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="14" style={{ width: "14px", height: "14px", flexShrink: 0, ...style }} className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconFlame({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg width="16" height="16" style={{ width: "16px", height: "16px", flexShrink: 0 }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function IconDroplets({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg width="16" height="16" style={{ width: "16px", height: "16px", flexShrink: 0 }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}

function IconWrench({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg width="16" height="16" style={{ width: "16px", height: "16px", flexShrink: 0 }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconAward({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg width="16" height="16" style={{ width: "16px", height: "16px", flexShrink: 0 }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function IconLayers({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg width="16" height="16" style={{ width: "16px", height: "16px", flexShrink: 0 }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconVolume({ muted = false }: { muted?: boolean }) {
  return muted ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function IconRotate({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" style={{ flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IconShieldAlert({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" style={{ flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconFileText({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" style={{ flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

// ============================================================================
// 1. СПРАВОЧНИКИ ОБОРУДОВАНИЯ, МАТЕРИАЛОВ И СОПЕЛ NORD
// ============================================================================

interface MachineConfig {
  id: string;
  name: string;
  subtitle: string;
  maxFlowLpm: number;
  maxTipInch: number;
  maxPressureBar: number;
  motorKw: number;
  weightKg: number;
  maxViscosityPas: number;
  priceRub: number;
  badge: string;
  badgeType: "blue" | "amber" | "orange";
  dropletMicrons: number;
  finishClass: string;
  signatureDesc: string;
  photoSrc: string;
}

const MACHINES: Record<string, MachineConfig> = {
  "nord-2500": {
    id: "nord-2500",
    name: "NORD-2500",
    subtitle: "1 класс · Компактный малярный пост (1.6 кВт)",
    maxFlowLpm: 2.5,
    maxTipInch: 0.023,
    maxPressureBar: 230,
    motorKw: 1.6,
    weightKg: 15,
    maxViscosityPas: 3.5,
    priceRub: 35000,
    badge: "1 КЛАСС · Финиш Q4",
    badgeType: "blue",
    dropletMicrons: 22,
    finishClass: "Эталон Q4 · Зеркальный сатин",
    signatureDesc: "Ультра-тонкая атомизация (капля 22 мкм): 0% шагрени на интерьерных красках и лаках.",
    photoSrc: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
  },
  "nord-3300": {
    id: "nord-3300",
    name: "NORD-3300",
    subtitle: "2 класс · Усиленный малярный аппарат (2.5 кВт)",
    maxFlowLpm: 3.3,
    maxTipInch: 0.033,
    maxPressureBar: 230,
    motorKw: 2.5,
    weightKg: 18,
    maxViscosityPas: 6.5,
    priceRub: 45000,
    badge: "2 КЛАСС · 3.3 л/мин",
    badgeType: "blue",
    dropletMicrons: 25,
    finishClass: "Скоростной Q4 · Плотный факел",
    signatureDesc: "Повышенная подача 3.3 л/мин и сопло до 0.033″ для больших площадей и плотных эмалей.",
    photoSrc: "/assets/machines/nord-3300/NORD-3200-view-front-side-nord-edit-2k.jpg",
  },
  "nord-4500": {
    id: "nord-4500",
    name: "NORD-4500",
    subtitle: "3 класс · Фасады и металлоконструкции (2.8 кВт)",
    maxFlowLpm: 4.2,
    maxTipInch: 0.037,
    maxPressureBar: 230,
    motorKw: 2.8,
    weightKg: 19,
    maxViscosityPas: 10.5,
    priceRub: 55000,
    badge: "3 КЛАСС · Фасады",
    badgeType: "blue",
    dropletMicrons: 28,
    finishClass: "Фасадный Q3/Q4 · Антикор",
    signatureDesc: "Подача 4.2 л/мин (2.8 кВт): легко тянет фасадные краски, антикор и жидкие пасты.",
    photoSrc: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
  },
  "nord-6000": {
    id: "nord-6000",
    name: "NORD-6000",
    subtitle: "4 класс · Хит продаж: Краска + Шпаклёвка (3.5 кВт)",
    maxFlowLpm: 6.5,
    maxTipInch: 0.043,
    maxPressureBar: 230,
    motorKw: 3.5,
    weightKg: 40,
    maxViscosityPas: 16.5,
    priceRub: 95000,
    badge: "4 КЛАСС · ХИТ HD",
    badgeType: "amber",
    dropletMicrons: 34,
    finishClass: "Универсал HD · Пасты + 2 поста",
    signatureDesc: "Производительность 6.5 л/мин: свободно раскрывает сопло 535/543 на финишной шпаклёвке.",
    photoSrc: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
  },
  "nord-8000-pro": {
    id: "nord-8000-pro",
    name: "NORD-8000 PRO",
    subtitle: "5 класс · Сверхвысокое давление 350 бар (4.0 кВт)",
    maxFlowLpm: 7.5,
    maxTipInch: 0.045,
    maxPressureBar: 350,
    motorKw: 4.0,
    weightKg: 50,
    maxViscosityPas: 28.0,
    priceRub: 150000,
    badge: "5 КЛАСС · 350 БАР",
    badgeType: "orange",
    dropletMicrons: 36,
    finishClass: "Экстремальный 350 бар · Мастики",
    signatureDesc: "Баровая станция 350 бар (7.5 л/мин): продавливает самые вязкие мастики, антикор и шпаклёвки.",
    photoSrc: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg",
  },
  "nord-9200": {
    id: "nord-9200",
    name: "NORD-9200",
    subtitle: "5 класс · Скоростная шпаклёвка 9 л/мин (4.0 кВт)",
    maxFlowLpm: 9.0,
    maxTipInch: 0.049,
    maxPressureBar: 230,
    motorKw: 4.0,
    weightKg: 50,
    maxViscosityPas: 24.0,
    priceRub: 125000,
    badge: "5 КЛАСС · 9.0 л/мин",
    badgeType: "amber",
    dropletMicrons: 40,
    finishClass: "Скоростной HD · Шпаклёвка ЖК",
    signatureDesc: "Увеличенная поршневая группа 9.0 л/мин (сопло до 0.049″) для нанесения паст без разбавления.",
    photoSrc: "/assets/machines/nord-9200/NORD-8000-view-front-3q-source.jpg",
  },
  "nord-9900": {
    id: "nord-9900",
    name: "NORD-9900",
    subtitle: "6 класс · Тяжёлый промышленный 11 л/мин (5.0 кВт)",
    maxFlowLpm: 11.0,
    maxTipInch: 0.053,
    maxPressureBar: 230,
    motorKw: 5.0,
    weightKg: 50,
    maxViscosityPas: 32.0,
    priceRub: 170000,
    badge: "6 КЛАСС · 11 л/мин",
    badgeType: "orange",
    dropletMicrons: 44,
    finishClass: "Тяжёлый пром HD · ОГЗ и пасты",
    signatureDesc: "Сверхмощный 5-киловаттный привод (11.0 л/мин, сопло до 0.053″) для тяжёлых паст и огнезащиты.",
    photoSrc: "/assets/machines/nord-9900/NORD-18X-view-front-3q-a.jpg",
  },
  "nord-18x": {
    id: "nord-18x",
    name: "NORD-18X",
    subtitle: "Флагман · Экстремальный поток 18 л/мин (5.5 кВт)",
    maxFlowLpm: 18.0,
    maxTipInch: 0.065,
    maxPressureBar: 230,
    motorKw: 5.5,
    weightKg: 55,
    maxViscosityPas: 45.0,
    priceRub: 155000,
    badge: "ФЛАГМАН · 18 Л/МИН",
    badgeType: "orange",
    dropletMicrons: 48,
    finishClass: "Флагман HD · 2–3 поста · до 0.065″",
    signatureDesc: "Максимальная подача 18.0 л/мин (5.5 кВт): скоростная укладка тяжёлых шпаклёвок и мастик.",
    photoSrc: "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg",
  },
};

interface MaterialConfig {
  id: string;
  name: string;
  brand: string;
  viscosityPas: number;
  recommendedTip: string;
  minPressureBar: number;
  targetWftMicrons: number;
  fullHideMicrons: number;
  sagThresholdMicrons: number;
  manualSpeedM2PerHour: number;
  colorHex: string;
  rgb: [number, number, number];
  wetHighlightHex: string;
  textureType: "smooth_gloss" | "putty_shagreen" | "heavy_mastic" | "road_reflective";
  description: string;
}

const MATERIALS: Record<string, MaterialConfig> = {
  paint: {
    id: "paint",
    name: "Интерьерная латексная краска",
    brand: "Tikkurila Euro Power / Dulux Pro",
    viscosityPas: 1.8,
    recommendedTip: "517",
    minPressureBar: 110,
    targetWftMicrons: 140,
    fullHideMicrons: 130,
    sagThresholdMicrons: 750,
    manualSpeedM2PerHour: 18,
    colorHex: "#f8fafc",
    rgb: [248, 250, 252],
    wetHighlightHex: "#ffffff",
    textureType: "smooth_gloss",
    description: "Белоснежный состав. Требует мягкого распыления с перехлестом 50%.",
  },
  putty: {
    id: "putty",
    name: "Финишная полимерная шпаклёвка",
    brand: "Danogips SuperFinish / Sheetrock",
    viscosityPas: 14.5,
    recommendedTip: "535",
    minPressureBar: 175,
    targetWftMicrons: 650,
    fullHideMicrons: 420,
    sagThresholdMicrons: 1550,
    manualSpeedM2PerHour: 6.5,
    colorHex: "#fbf9f4",
    rgb: [251, 249, 244],
    wetHighlightHex: "#ffffff",
    textureType: "putty_shagreen",
    description: "Плотная паста цвета слоновой кости. Ложится микрошагренью под шпатель 60 см.",
  },
  fireproof: {
    id: "fireproof",
    name: "Битумная гидроизоляция / Огнезащита",
    brand: "Технониколь Мастика / ПЛАМКОР",
    viscosityPas: 25.0,
    recommendedTip: "527",
    minPressureBar: 195,
    targetWftMicrons: 950,
    fullHideMicrons: 350,
    sagThresholdMicrons: 2200,
    manualSpeedM2PerHour: 5.0,
    colorHex: "#1f1a17",
    rgb: [31, 26, 23],
    wetHighlightHex: "#3d342f",
    textureType: "heavy_mastic",
    description: "Густая смолисто-чёрная мастика. Требует максимальной тяги гидропоршня.",
  },
};

interface TipConfig {
  code: string;
  angleDeg: number;
  fanWidthAt30cm: number;
  orificeInch: number;
  orificeMm: number;
  baseFlowLpmAt150Bar: number;
  usage: string;
}

const NOZZLE_TIPS: Record<string, TipConfig> = {
  "211": {
    code: "211",
    angleDeg: 20,
    fanWidthAt30cm: 10,
    orificeInch: 0.011,
    orificeMm: 0.28,
    baseFlowLpmAt150Bar: 0.55,
    usage: "Узкий факел 10 см (0.011″): откосы, узкий металлопрофиль, финишные эмали",
  },
  "313": {
    code: "313",
    angleDeg: 30,
    fanWidthAt30cm: 15,
    orificeInch: 0.013,
    orificeMm: 0.33,
    baseFlowLpmAt150Bar: 0.75,
    usage: "Факел 15 см (0.013″): радиаторы, двери, металлоконструкции, финишные лаки",
  },
  "517": {
    code: "517",
    angleDeg: 50,
    fanWidthAt30cm: 25,
    orificeInch: 0.017,
    orificeMm: 0.43,
    baseFlowLpmAt150Bar: 1.25,
    usage: "Стандарт 25 см (0.017″): интерьерные и фасадные краски, грунты",
  },
  "527": {
    code: "527",
    angleDeg: 50,
    fanWidthAt30cm: 25,
    orificeInch: 0.027,
    orificeMm: 0.69,
    baseFlowLpmAt150Bar: 2.85,
    usage: "Широкий факел 25 см (0.027″): густые краски, огнезащита, грунты",
  },
  "535": {
    code: "535",
    angleDeg: 50,
    fanWidthAt30cm: 25,
    orificeInch: 0.035,
    orificeMm: 0.89,
    baseFlowLpmAt150Bar: 4.35,
    usage: "Тяжёлый факел 25 см (0.035″): финишные полимерные шпаклёвки Danogips/Sheetrock",
  },
  "643": {
    code: "643",
    angleDeg: 60,
    fanWidthAt30cm: 30,
    orificeInch: 0.043,
    orificeMm: 1.09,
    baseFlowLpmAt150Bar: 6.2,
    usage: "Экстра-широкий 30 см (0.043″): огнезащита, битумные мастики, гидроизоляция",
  },
};

const WALL_WIDTH_M = 3.0;
const WALL_HEIGHT_M = 1.8;
const WALL_AREA_M2 = WALL_WIDTH_M * WALL_HEIGHT_M; // 5.4 м² (крупный план перед маляром)
const SIM_W = 480;
const SIM_H = 288;
const TOTAL_SIM_CELLS = SIM_W * SIM_H;
const CELL_AREA_M2 = WALL_AREA_M2 / TOTAL_SIM_CELLS; // ~0.000039 м² на ячейку WFT

// ============================================================================
// 2. ПРОЦЕДУРНЫЙ АУДИО-СИНТЕЗАТОР (WEB AUDIO API SYNTHESIZER)
// ============================================================================

class AirlessAudioEngine {
  ctx: AudioContext | null = null;
  isMuted = false;
  isSpraying = false;
  noiseNode: AudioBufferSourceNode | null = null;
  filterNode: BiquadFilterNode | null = null;
  gainNode: GainNode | null = null;
  pistonTimer: ReturnType<typeof setTimeout> | null = null;
  noiseBuffer: AudioBuffer | null = null;
  currentPressure = 190;
  currentFlowLpm = 3.0;
  isStarved = false;
  isPrimeMode = false;

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
    }
    this.noiseBuffer = buffer;
  }

  playTriggerClick(isDown = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(isDown ? 1400 : 950, now);
    osc.frequency.exponentialRampToValueAtTime(isDown ? 280 : 180, now + 0.035);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  playPurgeSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const now = this.ctx.currentTime;
    if (this.noiseBuffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3400, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.2);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);
      src.stop(now + 0.24);
    }
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playClogSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.16);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.17);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playPistonThump() {
    if (this.isMuted || !this.ctx || !this.isSpraying) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const baseFreq = this.isStarved ? 42 : 68;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 0.11);

    gain.gain.setValueAtTime(this.isStarved ? 0.26 : 0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  startSpray(pressureBar: number, flowLpm: number, isStarved: boolean, isPrimeMode: boolean) {
    this.currentPressure = pressureBar;
    this.currentFlowLpm = flowLpm;
    this.isStarved = isStarved;
    this.isPrimeMode = isPrimeMode;

    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    if (this.isSpraying) {
      this.updateSprayParams(pressureBar, flowLpm, isStarved, isPrimeMode);
      return;
    }

    this.isSpraying = true;
    this.playTriggerClick(true);

    const now = this.ctx.currentTime;
    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = this.noiseBuffer;
    this.noiseNode.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = isPrimeMode ? "lowpass" : "bandpass";
    this.filterNode.frequency.setValueAtTime(isPrimeMode ? 420 : 1100 + pressureBar * 9, now);
    this.filterNode.Q.setValueAtTime(isStarved ? 3.2 : 1.3, now);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, now);
    this.gainNode.gain.linearRampToValueAtTime(isPrimeMode ? 0.1 : 0.22, now + 0.05);

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.noiseNode.start(now);

    const schedulePiston = () => {
      if (!this.isSpraying) return;
      this.playPistonThump();
      const intervalMs = Math.max(140, Math.min(750, 950 / Math.max(0.6, this.currentFlowLpm)));
      this.pistonTimer = setTimeout(schedulePiston, intervalMs);
    };
    schedulePiston();
  }

  updateSprayParams(pressureBar: number, flowLpm: number, isStarved: boolean, isPrimeMode: boolean) {
    this.currentPressure = pressureBar;
    this.currentFlowLpm = flowLpm;
    this.isStarved = isStarved;
    this.isPrimeMode = isPrimeMode;

    if (!this.ctx || !this.filterNode || !this.gainNode || !this.isSpraying) return;
    const now = this.ctx.currentTime;

    if (isPrimeMode) {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(420, now, 0.05);
      this.gainNode.gain.setTargetAtTime(0.1, now, 0.05);
    } else {
      this.filterNode.type = "bandpass";
      const jitter = isStarved ? (Math.random() - 0.5) * 650 : 0;
      const targetFreq = Math.max(600, 900 + pressureBar * 9 + jitter);
      this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.04);
      const targetGain = isStarved ? 0.12 + Math.random() * 0.14 : 0.22;
      this.gainNode.gain.setTargetAtTime(targetGain, now, 0.04);
    }
  }

  playTone(freq = 740, duration = 0.25) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  stopSpray() {
    if (!this.isSpraying) return;
    this.isSpraying = false;
    if (this.pistonTimer) {
      clearTimeout(this.pistonTimer);
      this.pistonTimer = null;
    }
    if (this.noiseNode && this.gainNode && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.gainNode.gain.setTargetAtTime(0.0001, now, 0.02);
        this.noiseNode.stop(now + 0.05);
      } catch {
        // no-op
      }
    }
    this.playTriggerClick(false);
  }
}

// ============================================================================
// ФОТОРЕАЛИСТИЧНЫЙ PBR-ДВИЖОК СТЕНЫ И РАСПЫЛЕНИЯ (BODYCAM LEVEL)
// ============================================================================

// ШАГ 2. Генерация фотореалистичной подложки (бетон / ГКЛ / металл)
function initSubstrateBuffer(
  type: "concrete" | "gkl" | "metal",
  SIM_W: number,
  SIM_H: number,
  baseHeightMap: Float32Array,
  baseColorMap: Uint8ClampedArray
) {
  const hash = (x: number, y: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return h - Math.floor(h);
  };

  const smoothNoise = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy), b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  };

  const fbm = (x: number, y: number) =>
    smoothNoise(x, y) * 0.55 +
    smoothNoise(x * 2.3, y * 2.3) * 0.3 +
    smoothNoise(x * 6.1, y * 6.1) * 0.15;

  for (let y = 0; y < SIM_H; y++) {
    for (let x = 0; x < SIM_W; x++) {
      const idx = y * SIM_W + x;
      const cIdx = idx * 3;
      const nMacro = fbm(x * 0.025, y * 0.025);
      const nMicro = hash(x, y);

      if (type === "concrete") {
        let h = (nMacro - 0.5) * 18 + (nMicro - 0.5) * 6;
        let shade = 102 + (nMacro - 0.5) * 26 + (nMicro - 0.5) * 12;

        const seamX = Math.min(Math.abs(x - 160), Math.abs(x - 320));
        const seamY = Math.abs(y - 144);
        if (seamX < 2.2) { h -= (2.2 - seamX) * 14; shade -= 22; }
        if (seamY < 1.8) { h -= (1.8 - seamY) * 12; shade -= 18; }

        const pore = smoothNoise(x * 0.45, y * 0.45);
        if (pore > 0.83) {
          h -= (pore - 0.83) * 140;
          shade -= (pore - 0.83) * 180;
        }

        const tieX = ((x - 80 + 160) % 160) - 80;
        const tieY = ((y - 72 + 144) % 144) - 72;
        const distTie = Math.hypot(tieX, tieY);
        if (distTie < 5.5) {
          h -= Math.cos((distTie / 5.5) * Math.PI * 0.5) * 45;
          shade *= distTie < 3.2 ? 0.32 : 0.72;
        }

        baseHeightMap[idx] = h;
        baseColorMap[cIdx] = Math.max(10, Math.min(255, shade * 0.96));
        baseColorMap[cIdx + 1] = Math.max(10, Math.min(255, shade * 0.99));
        baseColorMap[cIdx + 2] = Math.max(10, Math.min(255, shade * 1.03));

      } else if (type === "gkl") {
        let h = (nMicro - 0.5) * 2.5;
        let r = 132 + (nMacro - 0.5) * 12;
        let g = 144 + (nMacro - 0.5) * 12;
        let b = 136 + (nMacro - 0.5) * 12;

        const jointDist = Math.min(Math.abs(x - 160), Math.abs(x - 320));
        if (jointDist < 14) {
          h -= Math.cos((jointDist / 14) * Math.PI * 0.5) * 8;
          if ((x % 3 === 0 || y % 3 === 0) && jointDist < 10) {
            h += 4.5;
            r = 185; g = 188; b = 190;
          } else {
            r -= 20; g -= 22; b -= 20;
          }
        }
        if (jointDist < 1.2) { h -= 18; r = 55; g = 58; b = 56; }

        const screwDistX = Math.min(Math.abs(x - 148), Math.abs(x - 172), Math.abs(x - 308), Math.abs(x - 332));
        const screwDistY = (y % 28) - 14;
        const dScrew = Math.hypot(screwDistX, screwDistY);
        if (dScrew < 2.6) {
          h -= 12;
          r = 28; g = 30; b = 33;
        }

        baseHeightMap[idx] = h;
        baseColorMap[cIdx] = Math.max(0, Math.min(255, r));
        baseColorMap[cIdx + 1] = Math.max(0, Math.min(255, g));
        baseColorMap[cIdx + 2] = Math.max(0, Math.min(255, b));

      } else {
        let h = (nMacro - 0.5) * 6 + (nMicro - 0.5) * 3;
        let base = 64 + (nMacro - 0.5) * 18;
        if (Math.abs(y - 70) < 4 || Math.abs(y - 218) < 4) {
          h += 22;
          base += 25;
        }
        baseHeightMap[idx] = h;
        baseColorMap[cIdx] = Math.max(0, Math.min(255, base * 0.95));
        baseColorMap[cIdx + 1] = Math.max(0, Math.min(255, base * 1.0));
        baseColorMap[cIdx + 2] = Math.max(0, Math.min(255, base * 1.08));
      }
    }
  }
}

// ============================================================================
// 1. КОНФИГУРАЦИЯ МУЛЬТИ-МАТЕРИАЛЬНОГО БУФЕРА И ОПТИКИ PBR-ШЕЙДЕРА
// ============================================================================

const MATERIAL_CODE_MAP: Record<string, number> = {
  paint: 1,
  putty: 2,
  fireproof: 3,
  road: 4,
};

interface MaterialPBRConfig {
  rgb: [number, number, number];
  heightScale: number;
  macroFade: number;
  hideRef: number;
  specPower: number;
  specIntensity: number;
  specColor: [number, number, number];
  wetDepth: number;
  shagreenScale: number;
}

const MAT_PBR_CONFIGS: Record<number, MaterialPBRConfig> = {
  // 1: Интерьерная латексная краска — шелковисто-матовая белая, мягкий сатиновый блик
  1: {
    rgb: [246, 248, 252],
    heightScale: 1.0,
    macroFade: 170.0,
    hideRef: 130,
    specPower: 26,
    specIntensity: 0.34,
    specColor: [255, 255, 255],
    wetDepth: 0.045,
    shagreenScale: 1.2,
  },
  // 2: Финишная полимерная шпаклёвка — теплая слоновая кость, 2.8x объем, закрывает бетон, рельефная шагрень
  2: {
    rgb: [248, 244, 234],
    heightScale: 2.8,
    macroFade: 85.0,
    hideRef: 240,
    specPower: 14,
    specIntensity: 0.22,
    specColor: [255, 252, 245],
    wetDepth: 0.02,
    shagreenScale: 3.8,
  },
  // 3: Битумная мастика / Огнезащита — глубокая жидкая смола, экстремальный зеркальный блик!
  3: {
    rgb: [18, 16, 15],
    heightScale: 1.6,
    macroFade: 120.0,
    hideRef: 140,
    specPower: 64,
    specIntensity: 1.65,
    specColor: [255, 242, 210],
    wetDepth: 0.08,
    shagreenScale: 0.8,
  },
  // 4: Дорожная разметка АК-511 — ярко-сигнальная желтая эмаль
  4: {
    rgb: [250, 204, 21],
    heightScale: 1.2,
    macroFade: 150.0,
    hideRef: 180,
    specPower: 32,
    specIntensity: 0.55,
    specColor: [255, 255, 240],
    wetDepth: 0.03,
    shagreenScale: 1.5,
  },
};

// ============================================================================
// 1. ИСТИННАЯ ГИДРОДИНАМИКА ФАКЕЛА (ЭЛЛИПТИЧЕСКАЯ ГАУССОВА КАПСУЛА БЕЗ УГЛОВ)
// ============================================================================
function applyRealisticSpray(
  normX: number,
  normY: number,
  stepDt: number,
  fanHeightMeters: number,
  flowLpm: number,
  pressureBar: number,
  minRequiredBar: number,
  targetWftMicrons: number,
  oversprayLossPercent: number,
  isClogged: boolean,
  SIM_W: number,
  SIM_H: number,
  wftBuffer: Float32Array,
  wetnessBuffer: Float32Array,
  microTextureBuffer: Float32Array,
  materialIdBuffer: Uint8Array,
  currentMatId = 1,
  minAllowedNormX = 0.0,
  machineMaxFlowLpm = 6.0
) {
  const cx = normX * SIM_W;
  const cy = normY * SIM_H;

  const ry = Math.max(18, (fanHeightMeters / WALL_HEIGHT_M) * SIM_H * 0.52);
  const rx = Math.max(9, ry * 0.34);

  const atomizationQuality = Math.min(1.0, Math.max(0.2, pressureBar / Math.max(80, minRequiredBar)));

  // СТРОГИЙ ФИЗИЧЕСКИЙ БАЛАНС МАССЫ 1:1 С РЕАЛЬНОСТЬЮ:
  // За время stepDt (сек) насос выбрасывает (flowLpm / 60) * stepDt литров.
  // С учетом КПД переноса на стену попадает exactLitersOnWall литров.
  // 1 литр на 1 м² дает 1000 мкм. Значит сумма микрон по всем ячейкам SIM_W*SIM_H за stepDt равна:
  const transferEff = Math.max(0.55, 1.0 - oversprayLossPercent / 100.0);
  const litersOnWallThisStep = (flowLpm / 60.0) * stepDt * transferEff * (isClogged ? 0.04 : 1.0);
  const totalMicronCellsToAdd = (litersOnWallThisStep * 1000.0) / CELL_AREA_M2;

  // Калибровка плотного ядра факела: 1 плавный проход с рабочей скоростью 50-65 см/с сразу дает паспортные 135-145 мкм краски (или 600-650 мкм шпаклевки на сопле 535),
  // но при резком взмахе мышкой за 2-3 секунды успевает вылиться только малая доля литража по времени stepDt!
  const viscosityBoost = targetWftMicrons > 400 ? 1.85 : 1.35;
  const effectiveEllipseCells = Math.max(20.0, 1.45 * rx * ry);
  const centerDeltaMicrons = (totalMicronCellsToAdd / effectiveEllipseCells) * viscosityBoost;

  const boundY = Math.ceil(ry * 1.15);
  const boundX = Math.ceil(rx * 1.15);
  const minY = Math.max(1, Math.floor(cy - boundY));
  const maxY = Math.min(SIM_H - 2, Math.ceil(cy + boundY));
  const minAllowedX = Math.floor(minAllowedNormX * SIM_W);
  const minX = Math.max(minAllowedX, Math.max(1, Math.floor(cx - boundX)));
  const maxX = Math.min(SIM_W - 2, Math.ceil(cx + boundX));

  const fineAtomizationFactor =
    machineMaxFlowLpm <= 3.6 && currentMatId === 1
      ? 0.22
      : machineMaxFlowLpm >= 7.0 && currentMatId >= 2
      ? 1.35
      : 0.85;

  for (let y = minY; y <= maxY; y++) {
    const ny = (y - cy) / ry;
    const ny2 = ny * ny;
    if (ny2 > 1.28) continue;

    const rowOffset = y * SIM_W;
    for (let x = minX; x <= maxX; x++) {
      const nx = (x - cx) / rx;
      const r2 = nx * nx + ny2;
      if (r2 > 1.25) continue;

      const r = Math.sqrt(r2);
      const hash = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
      const grain = hash - Math.floor(hash);

      const wave = Math.sin(x * 0.35 + y * 0.25) * 0.025;
      const rMod = Math.max(0, r + wave);

      let envelope = 0;
      if (atomizationQuality >= 0.82) {
        if (rMod <= 0.74) {
          envelope = 1.0 - 0.06 * (rMod / 0.74) * (rMod / 0.74);
        } else if (rMod < 1.10) {
          const t = (rMod - 0.74) / 0.36;
          const smoothFeather = 1.0 - t * t * (3.0 - 2.0 * t);
          envelope = 0.94 * smoothFeather * smoothFeather;
        }
      } else {
        const absNy = Math.abs(ny);
        const centerStarved = Math.exp(-r2 * 2.8) * (0.18 + grain * 0.16);
        const tailHorns = Math.exp(-Math.pow((absNy - 0.85) / 0.09, 2) * 4.5) * Math.exp(-nx * nx * 1.8) * 1.75;
        envelope = centerStarved + tailHorns;
      }

      if (envelope <= 0.004) continue;

      const addWft = centerDeltaMicrons * envelope * (0.98 + (grain - 0.5) * 0.04);
      if (addWft > 0.005) {
        const idx = rowOffset + x;
        materialIdBuffer[idx] = currentMatId;
        const prevWft = wftBuffer[idx];

        // После набора 105% паспортной толщины (например, 150 мкм для краски) дальнейшее наслоение плавно демпфируется,
        // если только пользователь специально не держит пистолет на одном месте для теста подтёков:
        const targetCap = targetWftMicrons * 1.08;
        const damp = prevWft < targetCap
          ? 1.0
          : Math.max(0.08, Math.exp(-(prevWft - targetCap) / (targetWftMicrons * 0.25)));

        wftBuffer[idx] = Math.min(targetWftMicrons * 2.4, prevWft + addWft * damp);
        wetnessBuffer[idx] = Math.min(1.0, Math.max(wetnessBuffer[idx], Math.min(1.0, envelope * 1.15)));

        const targetRoughness =
          currentMatId === 2
            ? 0.35 + (grain - 0.5) * 0.15 // Мелкая бархатная шагрень напыленной шпаклёвки до шпателя
            : atomizationQuality >= 0.82
            ? (grain - 0.5) * 0.06
            : (grain - 0.5) * 0.85;
        microTextureBuffer[idx] = microTextureBuffer[idx] * 0.72 + targetRoughness * 0.28;
      }
    }
  }
}

// ============================================================================
// 2. РАЗГЛАЖИВАНИЕ МЕХАНИЗИРОВАННЫМ ШПАТЕЛЕМ 60 СМ (БЕЗ СТУПЕНЕК)
// ============================================================================
function applySpatulaPass(
  normX: number,
  normY: number,
  SIM_W: number,
  SIM_H: number,
  wftBuffer: Float32Array,
  wetnessBuffer: Float32Array,
  microTextureBuffer: Float32Array
) {
  const cx = Math.floor(normX * SIM_W);
  const cy = Math.floor(normY * SIM_H);
  const bladeHalfH = Math.floor((0.60 / WALL_HEIGHT_M) * SIM_H * 0.5);
  const bladeHalfW = 6;

  for (let y = Math.max(2, cy - bladeHalfH); y <= Math.min(SIM_H - 3, cy + bladeHalfH); y++) {
    const dyNorm = Math.abs(y - cy) / bladeHalfH;
    const rowOffset = y * SIM_W;
    for (let x = Math.max(2, cx - bladeHalfW); x <= Math.min(SIM_W - 3, cx + bladeHalfW); x++) {
      const idx = rowOffset + x;
      if (wftBuffer[idx] < 20) continue;

      // Плавное выравнивание слоя шпателем в идеальное зеркало
      const neighborsAvg = (
        wftBuffer[idx - 1] +
        wftBuffer[idx + 1] +
        wftBuffer[idx - SIM_W] +
        wftBuffer[idx + SIM_W]
      ) * 0.25;

      const smoothFactor = dyNorm < 0.92 ? 0.55 : 0.15;
      wftBuffer[idx] = wftBuffer[idx] * (1 - smoothFactor) + neighborsAvg * smoothFactor;
      // Край лезвия оставляет микро-валик толщины (spatula blade burr)
      if (dyNorm > 0.92 && wftBuffer[idx] > 30) {
        wftBuffer[idx] += 8;
      }
      // Проход 60-сантиметровым шпателем полностью срезает шагрень в отрицательную зону (-0.45),
      // включая в шейдере 100% гладкое глянцевое зеркало Q4 со следами широкого лезвия!
      microTextureBuffer[idx] = -0.45;
      wetnessBuffer[idx] = Math.max(wetnessBuffer[idx], 0.92);
    }
  }
}

// ============================================================================
// 3. ЧЕСТНАЯ ГРАВИТАЦИЯ КАПЛЕВИДНЫХ ПОДТЁКОВ (ТОЛЬКО ПРИ ПЕРЕЛИВЕ В ТОЧКЕ ФАКЕЛА!)
// ============================================================================
function applyGravitySags(
  SIM_W: number,
  SIM_H: number,
  wftBuffer: Float32Array,
  wetnessBuffer: Float32Array,
  microTextureBuffer: Float32Array,
  sagThresholdMicrons: number,
  dt: number,
  isTriggerPressed: boolean,
  gunNormX: number,
  gunNormY: number
) {
  // КРИТИЧЕСКОЕ ПРАВИЛО: Если курок НЕ нажат, стена НЕ ползет сама по себе!
  if (!isTriggerPressed) return;

  const threshold = Math.max(480, sagThresholdMicrons || 520);
  const gx = Math.floor(gunNormX * SIM_W);
  const gy = Math.floor(gunNormY * SIM_H);
  const radiusX = 28;
  const radiusY = 55;

  const minY = Math.max(2, gy - radiusY);
  const maxY = Math.min(SIM_H - 4, gy + radiusY);
  const minX = Math.max(2, gx - radiusX);
  const maxX = Math.min(SIM_W - 3, gx + radiusX);

  // Идем снизу вверх только в зоне перелива под факелом, формируя узкие каплевидные ручейки (а не квадратные заборы!)
  for (let y = maxY; y >= minY; y--) {
    const row = y * SIM_W;
    const rowDown = (y + 1) * SIM_W;
    for (let x = minX; x <= maxX; x++) {
      // Узкие каналы стекания (капли образуются локальными струйками, а не всей шириной стены)
      const dripChannel = Math.sin(x * 1.7) > 0.55;
      if (!dripChannel) continue;

      const idx = row + x;
      const w = wftBuffer[idx];
      if (w > threshold && wetnessBuffer[idx] > 0.6) {
        const excess = (w - threshold) * Math.min(0.18, dt * 3.5);
        wftBuffer[idx] -= excess;
        wftBuffer[rowDown + x] = Math.min(threshold * 1.45, wftBuffer[rowDown + x] + excess * 0.92);
        wetnessBuffer[rowDown + x] = 0.98;
      }
    }
  }
}



// ============================================================================
// ВЕКТОРНЫЙ РЕНДЕР ПРОФЕССИОНАЛЬНОГО КРАСКОПУЛЬТА NORD PRO GUN (ПО КРИВЫМ БЕЗЬЕ)
// ============================================================================

function drawNordProGun(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  distanceCm: number,
  isTriggerPressed: boolean,
  isNozzleClogged: boolean,
  tipRotationDeg: number,
  tipCode: string,
  isDanger: boolean,
  barrelAngleRad = -0.58
) {
  ctx.save();
  ctx.translate(tipX, tipY);
  ctx.rotate(barrelAngleRad);

  // 1. СИНИЙ СОПЛОДЕРЖАТЕЛЬ-БАБОЧКА RAC X (АЭРОДИНАМИЧЕСКИЕ КРЫЛЬЯ ПО КРИВЫМ БЕЗЬЕ)
  const guardGrad = ctx.createLinearGradient(0, -22, 28, 22);
  const guardColor = isNozzleClogged ? "#e11d48" : isDanger ? "#dc2626" : "#0284c7";
  const guardDark = isNozzleClogged ? "#881337" : isDanger ? "#7f1d1d" : "#03487c";
  guardGrad.addColorStop(0, "#38bdf8");
  guardGrad.addColorStop(0.35, guardColor);
  guardGrad.addColorStop(1, guardDark);

  ctx.fillStyle = guardGrad;
  ctx.strokeStyle = "#08152e";
  ctx.lineWidth = 1.4;

  // Верхнее и нижнее аэродинамические крылья бабочки
  ctx.beginPath();
  ctx.moveTo(2, -3);
  ctx.bezierCurveTo(4, -14, 10, -22, 20, -24);
  ctx.bezierCurveTo(26, -24, 28, -16, 26, -8);
  ctx.lineTo(26, 8);
  ctx.bezierCurveTo(28, 16, 26, 24, 20, 24);
  ctx.bezierCurveTo(10, 22, 4, 14, 2, 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Карбидное сопло в центре
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(6, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.arc(6, 0, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 2. РЕВЕРСИВНЫЙ ПОВОРОТНЫЙ ФЛАЖОК СОПЛА RAC X
  ctx.save();
  ctx.translate(14, -18);
  if (tipRotationDeg > 0) {
    ctx.rotate((tipRotationDeg * Math.PI) / 180);
  }
  const tipGrad = ctx.createLinearGradient(-10, -15, 10, 0);
  tipGrad.addColorStop(0, isNozzleClogged ? "#f43f5e" : "#0284c7");
  tipGrad.addColorStop(1, "#091322");
  ctx.fillStyle = tipGrad;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(-12, -2);
  ctx.lineTo(-8, -16);
  ctx.bezierCurveTo(-2, -20, 4, -20, 10, -16);
  ctx.lineTo(14, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tipCode, 1, -6);
  ctx.restore();

  // 3. СТОПОРНАЯ ШЕСТИГРАННАЯ ГАЙКА
  const nutGrad = ctx.createLinearGradient(25, -12, 33, 12);
  nutGrad.addColorStop(0, "#f8fafc");
  nutGrad.addColorStop(0.5, "#94a3b8");
  nutGrad.addColorStop(1, "#475569");
  ctx.fillStyle = nutGrad;
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(26, -10, 8, 20, 2);
  ctx.fill();
  ctx.stroke();

  // 4. КОВАНЫЙ АЛЮМИНИЕВЫЙ СТВОЛ С МЕТАЛЛИЧЕСКИМ БЛИКОМ
  const barrelGrad = ctx.createLinearGradient(34, -13, 96, 13);
  barrelGrad.addColorStop(0, "#f8fafc");
  barrelGrad.addColorStop(0.2, "#e2e8f0");
  barrelGrad.addColorStop(0.5, "#cbd5e1");
  barrelGrad.addColorStop(0.8, "#64748b");
  barrelGrad.addColorStop(1, "#334155");
  ctx.fillStyle = barrelGrad;
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(34, -10);
  ctx.lineTo(92, -10);
  ctx.bezierCurveTo(98, -10, 102, -6, 102, 0);
  ctx.bezierCurveTo(102, 6, 98, 10, 92, 10);
  ctx.lineTo(34, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Хромированный верхний блик ствола
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, -8);
  ctx.lineTo(90, -8);
  ctx.stroke();

  // Лазерная гравировка NORD PRO GUN
  ctx.fillStyle = "#0284c7";
  ctx.font = "900 8px sans-serif";
  ctx.fillText("NORD PRO GUN", 44, 1);
  ctx.fillStyle = "#475569";
  ctx.font = "700 6px monospace";
  ctx.fillText("250 BAR · HEAVY DUTY", 44, 7);

  // 5. ЧЕТЫРЁХПАЛЬЦЕВЫЙ СТАЛЬНОЙ КУРОК (ПРИЖИМАЕТСЯ ПРИ ВЫСТРЕЛЕ НА 10px!)
  const triggerPullX = isTriggerPressed ? 10 : 0;
  const trigGrad = ctx.createLinearGradient(50 + triggerPullX, 8, 64 + triggerPullX, 74);
  trigGrad.addColorStop(0, "#ffffff");
  trigGrad.addColorStop(0.4, "#cbd5e1");
  trigGrad.addColorStop(1, "#475569");
  ctx.fillStyle = trigGrad;
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.3;

  ctx.beginPath();
  ctx.moveTo(50 + triggerPullX, 9);
  ctx.lineTo(57 + triggerPullX, 9);
  // Анатомические углубления под 4 пальца
  ctx.bezierCurveTo(62 + triggerPullX, 22, 59 + triggerPullX, 32, 64 + triggerPullX, 42);
  ctx.bezierCurveTo(68 + triggerPullX, 52, 65 + triggerPullX, 62, 70 + triggerPullX, 72);
  ctx.lineTo(62 + triggerPullX, 74);
  ctx.bezierCurveTo(56 + triggerPullX, 60, 56 + triggerPullX, 42, 52 + triggerPullX, 24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Латунный осевой штифт курка
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.arc(53 + triggerPullX, 10, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 6. ПЛАВНАЯ ПРЕДОХРАНИТЕЛЬНАЯ СКОБА
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.bezierCurveTo(38, 48, 42, 78, 86, 84);
  ctx.stroke();
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 7. АНАТОМИЧЕСКАЯ ЛИТАЯ РУКОЯТЬ С НАКЛАДКОЙ NORD BLUE
  const handleGrad = ctx.createLinearGradient(84, 10, 116, 90);
  handleGrad.addColorStop(0, "#1e293b");
  handleGrad.addColorStop(0.3, "#0f172a");
  handleGrad.addColorStop(1, "#020617");
  ctx.fillStyle = handleGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.6;

  ctx.beginPath();
  ctx.moveTo(86, 10);
  ctx.bezierCurveTo(104, 10, 106, 18, 106, 24);
  ctx.bezierCurveTo(112, 45, 118, 70, 114, 90);
  ctx.lineTo(94, 90);
  ctx.bezierCurveTo(90, 68, 86, 42, 86, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Резиновая противоскользящая вставка
  const gripGrad = ctx.createLinearGradient(96, 28, 106, 76);
  gripGrad.addColorStop(0, "#0284c7");
  gripGrad.addColorStop(0.5, "#0369a1");
  gripGrad.addColorStop(1, "#0c4a6e");
  ctx.fillStyle = gripGrad;
  ctx.beginPath();
  ctx.roundRect(96, 28, 9, 44, 4);
  ctx.fill();

  // 8. ЛАТУННЫЙ ВЕРТЛЮГ В ОСНОВАНИИ
  const brassGrad = ctx.createLinearGradient(94, 90, 110, 102);
  brassGrad.addColorStop(0, "#fde047");
  brassGrad.addColorStop(0.5, "#d97706");
  brassGrad.addColorStop(1, "#78350f");
  ctx.fillStyle = brassGrad;
  ctx.strokeStyle = "#451a03";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(96, 90, 16, 12, 2.5);
  ctx.fill();
  ctx.stroke();

  // 9. ПРУЖИНА АНТИИЗЛОМА И СИНИЙ ШЛАНГ ВД ПО КРИВЫМ БЕЗЬЕ
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  for (let sp = 0; sp < 7; sp++) {
    ctx.beginPath();
    ctx.arc(104 + sp * 2.2, 104 + sp * 5.5, 6, 0, Math.PI);
    ctx.stroke();
  }

  ctx.strokeStyle = "#08152e";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(104, 102);
  ctx.bezierCurveTo(126, 170, 130, 230, 75, 310);
  ctx.stroke();

  const hoseGrad = ctx.createLinearGradient(98, 102, 114, 102);
  hoseGrad.addColorStop(0, "#0284c7");
  hoseGrad.addColorStop(0.4, "#38bdf8");
  hoseGrad.addColorStop(1, "#03487c");
  ctx.strokeStyle = hoseGrad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(104, 102);
  ctx.bezierCurveTo(126, 170, 130, 230, 75, 310);
  ctx.stroke();

  ctx.restore();
}

// Рендер строительного малярного валика для режима Дуэли
function drawPaintRoller(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  paintColorRgb: [number, number, number]
) {
  ctx.save();
  ctx.translate(x, y);

  // Изогнутый стальной бугель валика
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(24, 0);
  ctx.bezierCurveTo(34, 0, 36, 12, 36, 20);
  ctx.lineTo(36, 42);
  ctx.bezierCurveTo(36, 52, 28, 56, 18, 56);
  ctx.lineTo(18, 125);
  ctx.stroke();

  // Двухкомпонентная пластиковая рукоять
  const handleGrad = ctx.createLinearGradient(12, 110, 24, 155);
  handleGrad.addColorStop(0, "#334155");
  handleGrad.addColorStop(0.5, "#0f172a");
  handleGrad.addColorStop(1, "#020617");
  ctx.fillStyle = handleGrad;
  ctx.beginPath();
  ctx.roundRect(10, 110, 16, 48, 4);
  ctx.fill();

  // Шубка валика с мокрым составом
  const [r, g, b] = paintColorRgb;
  const sleeveGrad = ctx.createLinearGradient(-35, -14, -35, 14);
  sleeveGrad.addColorStop(0, `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)})`);
  sleeveGrad.addColorStop(0.5, `rgb(${r}, ${g}, ${b})`);
  sleeveGrad.addColorStop(1, `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`);
  ctx.fillStyle = sleeveGrad;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-38, -12, 62, 24, 5);
  ctx.fill();
  ctx.stroke();

  // Ворс шубки и следы краски
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-30 + i * 14, -8, 7, 3);
  }

  ctx.restore();
}

// ============================================================================
// НАСТОЯЩИЙ GPU WEBGL PBR-ДВИЖОК (FULL HD GLSL SHADER — УРОВЕНЬ UNREAL / AVATAR)
// ============================================================================
class WebGLWallEngine {
  gl: WebGLRenderingContext | null = null;
  program: WebGLProgram | null = null;
  stateTex: WebGLTexture | null = null;
  baseTex: WebGLTexture | null = null;
  colorTex: WebGLTexture | null = null;

  // 5 фото-слоёв Texture Splatting (Google Flow 8K)
  roomPhotoTex: WebGLTexture | null = null;    // Слой 0: Базовый бетон
  paintPhotoTex: WebGLTexture | null = null;   // Слой 1: Латексная интерьерная краска
  puttyPhotoTex: WebGLTexture | null = null;   // Слой 2: Фактурная шпаклёвка (шуба)
  bitumenPhotoTex: WebGLTexture | null = null; // Слой 3: Чёрная битумная гидроизоляция
  smoothPhotoTex: WebGLTexture | null = null;  // Слой 4: Заглаженная шпаклёвка Q4

  hasRoomPhoto = false;
  hasPaintPhoto = false;
  hasPuttyPhoto = false;
  hasBitumenPhoto = false;
  hasSmoothPhoto = false;

  texData = new Uint8Array(SIM_W * SIM_H * 4);
  baseTexData = new Uint8Array(SIM_W * SIM_H * 4);
  colorTexData = new Uint8Array(SIM_W * SIM_H * 4);

  init(canvas: HTMLCanvasElement) {
    if (this.gl) return true;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true });
    if (!gl) return false;
    this.gl = gl;

    const vsSource = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_stateTex;     // R = wftNorm, G = wetness, B = microTex, A = materialCode/4.0
      uniform sampler2D u_baseTex;      // Procedural fallback
      uniform sampler2D u_colorTex;     // RGB fallback
      uniform sampler2D u_roomPhotoTex;   // Слой 0: Базовый бетон комнаты
      uniform sampler2D u_paintPhotoTex;  // Слой 1: Реальное фото краски
      uniform sampler2D u_puttyPhotoTex;  // Слой 2: Реальное фото фактурной шпаклёвки
      uniform sampler2D u_bitumenPhotoTex;// Слой 3: Реальное фото чёрного битума
      uniform sampler2D u_smoothPhotoTex; // Слой 4: Реальное фото заглаженной стены Q4
      uniform float u_hasRoomPhoto;
      uniform float u_hasSplatting;
      uniform vec2 u_res;
      uniform vec2 u_simRes;
      uniform vec2 u_gunPos;
      uniform float u_losevOn;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        return noise(p) * 0.62 + noise(p * 2.1) * 0.38;
      }

      float getSurfaceHeight(vec2 uv) {
        vec4 st = texture2D(u_stateTex, uv);
        vec4 bs = texture2D(u_baseTex, uv);
        float wft = st.r * 1600.0;
        float wet = st.g;
        float shagreen = (st.b - 0.5) * 2.0;

        vec3 photoRGB = texture2D(u_roomPhotoTex, uv).rgb;
        float photoLum = dot(photoRGB, vec3(0.299, 0.587, 0.114));
        float baseH = u_hasRoomPhoto > 0.5 ? (photoLum - 0.5) * 55.0 : (bs.a - 0.5) * 75.0;
        float macroDamp = exp(-wft / 240.0);
        float coatMeniscus = wft > 1.0 ? pow(wft, 0.55) * 0.42 + wet * 1.9 : 0.0;
        float smoothWaves = (fbm(uv * 85.0) - 0.5) * 1.6;
        float peelH = wft > 5.0 ? (shagreen * 1.9 + smoothWaves * 0.4) * (1.0 - wet * 0.35) : 0.0;
        return baseH * macroDamp + coatMeniscus + peelH;
      }

      void main() {
        vec2 px = 1.0 / u_simRes;
        vec4 st = texture2D(u_stateTex, v_uv);
        vec4 bs = texture2D(u_baseTex, v_uv);
        vec4 matCol = texture2D(u_colorTex, v_uv);

        float wft = st.r * 1600.0;
        float wet = st.g;
        float mCode = st.a * 4.0; // 1 = paint, 2 = putty, 3 = fireproof/bitumen, 4 = road

        float hC = getSurfaceHeight(v_uv);
        float hR = getSurfaceHeight(v_uv + vec2(px.x, 0.0));
        float hL = getSurfaceHeight(v_uv - vec2(px.x, 0.0));
        float hT = getSurfaceHeight(v_uv + vec2(0.0, px.y));
        float hB = getSurfaceHeight(v_uv - vec2(0.0, px.y));

        vec3 N = normalize(vec3((hL - hR) * 0.045, (hB - hT) * 0.045, 1.0));
        vec3 lightPos1 = vec3(-0.15, 0.45, 0.55);
        vec3 L1 = normalize(lightPos1 - vec3(v_uv, 0.0));
        vec3 lightPos2 = vec3(u_gunPos.x, u_gunPos.y, 0.35);
        vec3 L2 = normalize(lightPos2 - vec3(v_uv, 0.0));
        vec3 V = normalize(vec3(0.5, 0.5, 1.2) - vec3(v_uv, 0.0));

        // 1. СЭМПЛИРУЕМ РЕАЛЬНЫЕ ФОТОГРАФИИ КОМНАТЫ В РАЗНЫХ СОСТОЯНИЯХ
        vec3 concretePhoto = texture2D(u_roomPhotoTex, v_uv).rgb;
        vec3 paintPhoto    = texture2D(u_paintPhotoTex, v_uv).rgb;
        vec3 puttyPhoto    = texture2D(u_puttyPhotoTex, v_uv).rgb;
        vec3 bitumenPhoto  = texture2D(u_bitumenPhotoTex, v_uv).rgb;
        vec3 smoothPhoto   = texture2D(u_smoothPhotoTex, v_uv).rgb;

        float concreteLum = dot(concretePhoto, vec3(0.299, 0.587, 0.114));

        // Порог полного перекрытия бетона (fullHideMicrons) строго по паспорту материала:
        vec3 targetPhoto;
        float fullHideMicrons = 115.0;

        if (mCode > 3.5) {
          fullHideMicrons = 220.0;
          targetPhoto = vec3(0.98, 0.79, 0.08) * clamp(concreteLum * 1.55, 0.55, 1.15);
        } else if (mCode > 2.5) {
          fullHideMicrons = 480.0;
          targetPhoto = bitumenPhoto;
        } else if (mCode > 1.5) {
          // 2: Финишная полимерная шпаклёвка Danogips SuperFinish / Sheetrock:
          // Густая сливочно-белая паста с мелкой деликатной микро-шагренью (а не грубая фасадная штукатурка!).
          fullHideMicrons = 440.0;

          // Сглаживаем грубую текстуру puttyPhoto на 78%, оставляя только нежную бархатную микро-шагрень из-под сопла 535:
          vec3 creamyPuttyBase = vec3(0.965, 0.96, 0.94) * clamp(concreteLum * 1.48, 0.72, 1.06);
          float microPeel = (fbm(v_uv * u_res * 0.22) - 0.5) * 0.032;
          vec3 fineSprayedPutty = mix(creamyPuttyBase, puttyPhoto * 1.08, 0.22) + vec3(microPeel);

          // Когда маляр проводит инструментом «Шпатель 60 см» (st.b уменьшается к 0),
          // мелкая шагрень полностью срезается в идеальное белоснежное зеркало Q4!
          vec3 skimmedMirrorPutty = mix(smoothPhoto, vec3(0.98, 0.98, 0.97) * clamp(concreteLum * 1.52, 0.76, 1.08), 0.65);
          float smoothFactor = clamp((0.46 - st.b) * 3.2, 0.0, 1.0);
          targetPhoto = mix(fineSprayedPutty, skimmedMirrorPutty, smoothFactor);
        } else {
          fullHideMicrons = 105.0;
          targetPhoto = mix(smoothPhoto, vec3(0.96, 0.975, 0.99) * clamp(concreteLum * 1.52, 0.68, 1.08), 0.55);
        }

        // На 30-40 мкм (слишком быстрый взмах) виден полупрозрачный недокрас (hide ~ 0.35),
        // а на паспортных 125-140 мкм краски (или 520-650 мкм шпаклевки) покрытие выходит на 96-100% плотный цвет!
        float hideRatio = clamp(wft / fullHideMicrons, 0.0, 1.25);
        float hide = wft <= 0.5 ? 0.0 : clamp(1.0 - exp(-pow(hideRatio, 1.55) * 2.65), 0.0, 1.0);

        // Процедурный fallback на случай отсутствия фото
        float diffBase = max(0.26, dot(N, L1));
        vec3 proceduralBase = bs.rgb * diffBase;
        vec3 proceduralWet = matCol.rgb * diffBase;

        // Если 5 фоток загружены — СКВОЗЬ БЕТОН ПРОЯВЛЯЕТСЯ РЕАЛЬНОЕ ФОТО ВЫБРАННОГО МАТЕРИАЛА!
        vec3 compositeColor = (u_hasRoomPhoto > 0.5 && u_hasSplatting > 0.5)
          ? mix(concretePhoto, targetPhoto, hide)
          : (u_hasRoomPhoto > 0.5 ? mix(concretePhoto, matCol.rgb * (0.8 + 0.2 * dot(concretePhoto, vec3(0.333))), hide) : mix(proceduralBase, proceduralWet, hide));

        // 3. ТОНКИЙ ОПТИЧЕСКИЙ БЛИК ТОЛЬКО НА СВЕЖЕНАНЕСЁННОМ МОКРОМ СЛОЕ
        if (wft > 2.0 && wet > 0.05) {
          vec3 H1 = normalize(L1 + V);
          float ndh1 = max(0.0, dot(N, H1));
          float isDarkBitumen = step(2.5, mCode);
          float specPow = mix(36.0, 48.0, isDarkBitumen);
          float specInt = mix(0.12, 0.22, isDarkBitumen);
          float s1 = pow(ndh1, specPow) * specInt * wet;
          compositeColor += vec3(1.0, 0.99, 0.95) * s1 * hide;
        }

        gl_FragColor = vec4(clamp(compositeColor, 0.0, 1.0), 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    this.program = prog;

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const createTex = () => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    this.stateTex = createTex();
    this.baseTex = createTex();
    this.colorTex = createTex();
    this.roomPhotoTex = createTex();
    this.paintPhotoTex = createTex();
    this.puttyPhotoTex = createTex();
    this.bitumenPhotoTex = createTex();
    this.smoothPhotoTex = createTex();

    // Заглушки 1x1 до загрузки фото
    const dummy = new Uint8Array([120, 120, 120, 255]);
    [this.roomPhotoTex, this.paintPhotoTex, this.puttyPhotoTex, this.bitumenPhotoTex, this.smoothPhotoTex].forEach(t => {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, dummy);
    });

    return true;
  }

  uploadSplattingTexture(key: "base" | "paint" | "putty" | "bitumen" | "smooth", img: HTMLImageElement) {
    if (!this.gl || !img || !img.complete || img.naturalWidth === 0) return;
    const gl = this.gl;
    const texMap: Record<string, WebGLTexture | null> = {
      base: this.roomPhotoTex,
      paint: this.paintPhotoTex,
      putty: this.puttyPhotoTex,
      bitumen: this.bitumenPhotoTex,
      smooth: this.smoothPhotoTex,
    };
    const target = texMap[key];
    if (!target) return;
    gl.bindTexture(gl.TEXTURE_2D, target);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    if (key === "base") this.hasRoomPhoto = true;
    if (key === "paint") this.hasPaintPhoto = true;
    if (key === "putty") this.hasPuttyPhoto = true;
    if (key === "bitumen") this.hasBitumenPhoto = true;
    if (key === "smooth") this.hasSmoothPhoto = true;
  }

  uploadRoomPhoto(img: HTMLImageElement) {
    this.uploadSplattingTexture("base", img);
  }

  updateBaseTexture(baseColorMap: Uint8ClampedArray, baseHeightMap: Float32Array) {
    if (!this.gl || !this.baseTex) return;
    for (let i = 0; i < TOTAL_SIM_CELLS; i++) {
      const cIdx = i * 3;
      const pIdx = i * 4;
      this.baseTexData[pIdx]     = baseColorMap[cIdx];
      this.baseTexData[pIdx + 1] = baseColorMap[cIdx + 1];
      this.baseTexData[pIdx + 2] = baseColorMap[cIdx + 2];
      this.baseTexData[pIdx + 3] = Math.max(0, Math.min(255, Math.round((baseHeightMap[i] / 80.0 + 0.5) * 255)));
    }
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.baseTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_W, SIM_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.baseTexData);
  }

  render(
    canvas: HTMLCanvasElement,
    wftBuffer: Float32Array,
    wetnessBuffer: Float32Array,
    microTextureBuffer: Float32Array,
    materialIdBuffer: Uint8Array,
    activeMatCode: number,
    losevLightOn: boolean,
    gunNormX: number,
    gunNormY: number,
    timeSec: number,
    usePhotoRoom: boolean
  ) {
    if (!this.init(canvas) || !this.gl || !this.program) return false;
    const gl = this.gl;

    const GLOSS_CODE: Record<number, number> = { 1: 90, 2: 42, 3: 255, 4: 180 };

    for (let i = 0; i < TOTAL_SIM_CELLS; i++) {
      const pIdx = i * 4;
      this.texData[pIdx]     = Math.min(255, Math.round((wftBuffer[i] / 1600.0) * 255));
      this.texData[pIdx + 1] = Math.min(255, Math.round(wetnessBuffer[i] * 255));
      this.texData[pIdx + 2] = Math.max(0, Math.min(255, Math.round((microTextureBuffer[i] * 0.5 + 0.5) * 255)));
      const mId = materialIdBuffer[i] || activeMatCode;
      this.texData[pIdx + 3] = Math.round((mId / 4.0) * 255);

      const cfg = MAT_PBR_CONFIGS[mId] || MAT_PBR_CONFIGS[1];
      this.colorTexData[pIdx]     = cfg.rgb[0];
      this.colorTexData[pIdx + 1] = cfg.rgb[1];
      this.colorTexData[pIdx + 2] = cfg.rgb[2];
      this.colorTexData[pIdx + 3] = GLOSS_CODE[mId] || 90;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(this.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stateTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_W, SIM_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.texData);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_stateTex"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.baseTex);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_baseTex"), 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_W, SIM_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.colorTexData);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_colorTex"), 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.roomPhotoTex);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_roomPhotoTex"), 3);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, this.paintPhotoTex);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_paintPhotoTex"), 4);

    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, this.puttyPhotoTex);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_puttyPhotoTex"), 5);

    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, this.bitumenPhotoTex);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_bitumenPhotoTex"), 6);

    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, this.smoothPhotoTex);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_smoothPhotoTex"), 7);

    gl.uniform1f(gl.getUniformLocation(this.program, "u_hasRoomPhoto"), this.hasRoomPhoto && usePhotoRoom ? 1.0 : 0.0);
    const hasSplatting = this.hasPaintPhoto && this.hasPuttyPhoto && this.hasBitumenPhoto ? 1.0 : 0.0;
    gl.uniform1f(gl.getUniformLocation(this.program, "u_hasSplatting"), hasSplatting);

    gl.uniform2f(gl.getUniformLocation(this.program, "u_res"), canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_simRes"), SIM_W, SIM_H);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_gunPos"), gunNormX, gunNormY);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_losevOn"), losevLightOn ? 1.0 : 0.0);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_time"), timeSec);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return true;
  }
}
// ============================================================================
// 3. ОСНОВНОЙ КОМПОНЕНТ NORD LAB
// ============================================================================

// ============================================================================
// 3D-МАСТЕР В ЭКИПИРОВКЕ (180 СМ, INVERSE KINEMATICS) + СТАНЦИЯ NORD НА ПОЛУ
// ============================================================================
// Функция автоматического вырезания черного студийного фона у нового фото маляра с логотипом NORD:
function createTransparentCutoutCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth || 1024;
  c.height = img.naturalHeight || 576;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  try {
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const d = imgData.data;
    const w = c.width, h = c.height;
    if (d[3] < 10 && d[(w - 1) * 4 + 3] < 10) return c;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const pIdx = i / 4;
      const x = pIdx % w, y = Math.floor(pIdx / w);
      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      const sat = Math.max(r, g, b) - Math.min(r, g, b);

      // 1. Стираем статичный нарисованный синий шланг ниже рукояти пистолета (y > h * 0.36),
      // так как мы рисуем живой динамический шланг по кривой Безье от рукояти пистолета к аппарату!
      const isStaticLowerBlueHose = b > r + 18 && y > h * 0.35 && (x < w * 0.48 || x > w * 0.72);
      if (isStaticLowerBlueHose) {
        d[i + 3] = 0;
        continue;
      }

      // 2. Защищаем синюю бабочку сопла RAC X (y <= h * 0.35), наушники, розовый фильтр и ботинки
      const isNozzleOrEarmuff = b > r + 20 && b > 45 && y <= h * 0.35;
      const isPinkFilter = r > g + 25 && r > 60;
      const isBootsZone = y > h * 0.86 && x > w * 0.44 && x < w * 0.80;

      if (!isNozzleOrEarmuff && !isPinkFilter && !isBootsZone) {
        if (lum < 44 && sat < 26) {
          const alpha = Math.max(0, Math.min(1, (lum - 24) / 18));
          d[i + 3] = Math.round(alpha * 255);
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // ignore CORS
  }
  return c;
}

function drawMasterOperatorAndStation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  aimX: number,
  aimY: number,
  tipX: number,
  tipY: number,
  isTriggerPressed: boolean,
  hasExtensionPole: boolean,
  machine: MachineConfig,
  material: MaterialConfig,
  avgWftMicrons: number,
  isCrashTest: boolean,
  now: number,
  painterDrawable: HTMLCanvasElement | HTMLImageElement | null,
  stationImg: HTMLImageElement | null
) {
  const isCompactCanvas = width < 580;
  // На смартфоне поднимаем уровень пола выше кнопки «НАЖАТЬ КУРОК», чтобы станция NORD и ведро были видны на 100%!
  const floorY = isCompactCanvas ? height - 54 : height - 24;
  const ceilingY = 20;
  const wallHeightPx = Math.max(160, floorY - ceilingY);
  const ppm = wallHeightPx / 2.80;

  // --------------------------------------------------------------------------
  // 1. КРУПНЫЙ АППАРАТ NORD НА СТРОИТЕЛЬНОМ ПОЛУ (СЛЕВА ПО ЦЕНТРУ — МАЛЯР ЕГО НЕ ЗАКРЫВАЕТ!)
  // --------------------------------------------------------------------------
  const stationH = Math.round((isCompactCanvas ? 1.26 : 1.15) * ppm);
  const stationAspect = stationImg && stationImg.naturalWidth > 0
    ? stationImg.naturalWidth / stationImg.naturalHeight
    : 0.95;
  const stationW = Math.round(stationH * stationAspect);
  const stationX = isCompactCanvas
    ? Math.max(42, Math.round(width * 0.14))
    : Math.max(68, Math.round(width * 0.15));
  const stationY = floorY - stationH + 6;
  const motorVib = isTriggerPressed ? Math.sin(now * 0.14) * 1.4 : 0;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Студийный контрастный ореол позади станции NORD, чтобы синий корпус и хром ярко выделялись на фоне бетона
  const haloCX = stationX + stationW * 0.5;
  const haloCY = stationY + stationH * 0.52;
  const haloR = Math.max(stationW, stationH) * 0.68;
  const haloGrad = ctx.createRadialGradient(haloCX, haloCY, haloR * 0.1, haloCX, haloCY, haloR);
  haloGrad.addColorStop(0, "rgba(255, 255, 255, 0.34)");
  haloGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.22)");
  haloGrad.addColorStop(1, "rgba(14, 165, 233, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(haloCX, haloCY, haloR, 0, Math.PI * 2);
  ctx.fill();

  // Контактная тень под колёсами станции NORD
  ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
  ctx.beginPath();
  ctx.ellipse(stationX + stationW * 0.5, floorY + 2, stationW * 0.48, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ведро 30 л рядом со станцией (под заборным патрубком)
  const bucketW = isCompactCanvas ? 30 : 38;
  const bucketH = isCompactCanvas ? 36 : 44;
  const bucketX = stationX + stationW - (isCompactCanvas ? 4 : 2);
  const bucketY = floorY - bucketH;
  const bGrad = ctx.createLinearGradient(bucketX, bucketY, bucketX + bucketW, bucketY);
  bGrad.addColorStop(0, "#cbd5e1");
  bGrad.addColorStop(0.45, "#ffffff");
  bGrad.addColorStop(1, "#64748b");
  ctx.fillStyle = bGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(bucketX, bucketY);
  ctx.lineTo(bucketX + bucketW, bucketY);
  ctx.lineTo(bucketX + bucketW - 4, floorY);
  ctx.lineTo(bucketX + 4, floorY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(bucketX - 1, bucketY, bucketW + 2, 5);

  if (stationImg && stationImg.complete && stationImg.naturalWidth > 0) {
    ctx.drawImage(stationImg, stationX, stationY + motorVib, stationW, stationH);
  }

  // Чёткий шильдик над аппаратом прямо на полу («⚡ NORD 9536 PRO»)
  const tagW = isCompactCanvas ? 104 : 126;
  const tagH = isCompactCanvas ? 18 : 20;
  const tagX = Math.max(6, stationX + (stationW - tagW) * 0.5);
  const tagY = stationY - tagH - 2;
  ctx.fillStyle = "rgba(7, 15, 30, 0.92)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = isCompactCanvas
    ? "800 8.5px 'Manrope', -apple-system, sans-serif"
    : "800 9.5px 'Manrope', -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`⚡ ${machine.name}`, tagX + tagW * 0.5, tagY + (isCompactCanvas ? 12 : 13.5));
  ctx.restore();

  // --------------------------------------------------------------------------
  // 2. БЕСШОВНЫЙ АНАТОМИЧЕСКИЙ 3D-МАЛЯР (БЕЗ РАЗРЫВА РУКАВА + ЖИВОЙ ШЛАНГ ОТ АППАРАТА!)
  // --------------------------------------------------------------------------
  const baseMasterH = Math.round(1.78 * ppm);
  const srcW = painterDrawable instanceof HTMLCanvasElement ? painterDrawable.width : (painterDrawable?.naturalWidth || 1024);
  const srcH = painterDrawable instanceof HTMLCanvasElement ? painterDrawable.height : (painterDrawable?.naturalHeight || 576);
  const masterW = Math.round(baseMasterH * (srcW / srcH));

  // Нормализованная высота прицела (0.0 = потолок, 0.5 = грудь, 1.0 = пол)
  const aimNormY = Math.max(0, Math.min(1, (aimY - ceilingY) / Math.max(1, wallHeightPx)));

  // При покраске нижней половины стены маляр сгибает колени (приседает до 22%), ботинки плотно стоят на полу!
  const crouchCompress = aimNormY > 0.48 ? (aimNormY - 0.48) * 0.42 : 0;
  const activeMasterH = Math.round(baseMasterH * (1.0 - crouchCompress));

  // Опорные точки на спрайте маляра:
  // Сопло RAC X: (0.220, 0.278), Поясничный шарнир (Waist Pivot): (0.580, 0.500), Рукоять пистолета: (0.375, 0.355)
  const nozzleRelX = 0.220;
  const nozzleRelY = 0.278;
  const waistRelX = 0.580;
  const waistRelY = 0.500;

  const poleOffsetPx = hasExtensionPole ? 55 : 0;
  const desiredMasterX = aimX + poleOffsetPx - masterW * nozzleRelX;
  const masterX = Math.max(20, Math.min(width - masterW * 0.68, desiredMasterX));
  const walkBobY = Math.abs(Math.sin(masterX * 0.045)) * 4.0;
  const masterY = floorY - activeMasterH + 10 + walkBobY;

  // Координаты поясничного шарнира, вокруг которого плавно наклоняется весь верхний корпус ВМЕСТЕ С РУКОЙ
  const waistX = masterX + masterW * waistRelX;
  const waistY = masterY + activeMasterH * waistRelY;

  const unrotatedNozzleX = masterX + masterW * nozzleRelX - poleOffsetPx;
  const unrotatedNozzleY = masterY + activeMasterH * nozzleRelY;
  const spanFromWaistX = Math.max(70, waistX - unrotatedNozzleX);

  const dyFromNeutral = unrotatedNozzleY - aimY;
  const torsoArmAngleRad = Math.max(-0.42, Math.min(0.45, Math.atan2(dyFromNeutral, spanFromWaistX)));

  const recoilKickPx = isTriggerPressed ? 4.2 + Math.sin(now * 0.09) * 1.4 : 0;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Тень под ботинками на полу
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.beginPath();
  ctx.ellipse(masterX + masterW * 0.60, floorY + 3, masterW * 0.23, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  if (painterDrawable) {
    // ЧАСТЬ 1: НОГИ И ТАЗ (от пояса до ботинок, Y = 47%..100%)
    ctx.save();
    ctx.beginPath();
    ctx.rect(masterX, masterY + activeMasterH * 0.47, masterW, activeMasterH * 0.56);
    ctx.clip();
    ctx.drawImage(painterDrawable, masterX, masterY, masterW, activeMasterH);
    ctx.restore();

    // ЧАСТЬ 2: ВЕСЬ ВЕРХНИЙ КОРПУС С ЛОГОТИПОМ NORD + ПЛЕЧО + ВСЯ РУКА + ПИСТОЛЕТ
    ctx.save();
    ctx.translate(waistX + recoilKickPx, waistY);
    ctx.rotate(torsoArmAngleRad);
    ctx.translate(-waistX, -waistY);

    ctx.beginPath();
    ctx.rect(masterX - 50, masterY - 80, masterW + 80, activeMasterH * 0.54 + 80);
    ctx.clip();
    ctx.drawImage(painterDrawable, masterX, masterY, masterW, activeMasterH);
    ctx.restore();
  }

  // Вычисляем точное положение рукояти пистолета и кончика сопла после поворота корпуса:
  const gunGripUnrotX = masterX + masterW * 0.372;
  const gunGripUnrotY = masterY + activeMasterH * 0.345;
  const gx0 = gunGripUnrotX - waistX;
  const gy0 = gunGripUnrotY - waistY;
  const gunGripX = waistX + recoilKickPx + gx0 * Math.cos(torsoArmAngleRad) - gy0 * Math.sin(torsoArmAngleRad);
  const gunGripY = waistY + gx0 * Math.sin(torsoArmAngleRad) + gy0 * Math.cos(torsoArmAngleRad);

  if (hasExtensionPole) {
    const nx0 = (masterX + masterW * nozzleRelX) - waistX;
    const ny0 = unrotatedNozzleY - waistY;
    const pStartX = waistX + recoilKickPx + nx0 * Math.cos(torsoArmAngleRad) - ny0 * Math.sin(torsoArmAngleRad);
    const pStartY = waistY + nx0 * Math.sin(torsoArmAngleRad) + ny0 * Math.cos(torsoArmAngleRad);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(pStartX, pStartY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(tipX, tipY, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ЦЕЛЬНЫЙ ЖИВОЙ СИНИЙ ШЛАНГ ВЫСОКОГО ДАВЛЕНИЯ NORD:
  // Идет плавной физичной петлей по полу от станции NORD к рукояти пистолета маляра!
  const hoseStartX = stationX + stationW * 0.55;
  const hoseStartY = stationY + stationH * 0.62;
  const hoseMidX = (gunGripX + hoseStartX) * 0.5;

  // Контактная тень от шланга
  ctx.strokeStyle = "rgba(8, 15, 30, 0.45)";
  ctx.lineWidth = 5.0;
  ctx.beginPath();
  ctx.moveTo(gunGripX, gunGripY + 2);
  ctx.bezierCurveTo(
    gunGripX - 18,
    floorY + 2,
    hoseMidX,
    floorY + 6,
    hoseStartX,
    hoseStartY
  );
  ctx.stroke();

  // Основная синяя оплетка шланга 270 bar
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(gunGripX, gunGripY);
  ctx.bezierCurveTo(
    gunGripX - 18,
    floorY,
    hoseMidX,
    floorY + 4,
    hoseStartX,
    hoseStartY
  );
  ctx.stroke();

  // Глянцевый блик на шланге
  ctx.strokeStyle = "#7dd3fc";
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 3. ЧЕТКАЯ КАРТОЧКА АКТИВНОЙ СТАНЦИИ В ПРАВОМ ВЕРХНЕМ УГЛУ (С ФОТО АППАРАТА И НА ПК, И НА СМАРТФОНЕ!)
  // --------------------------------------------------------------------------
  ctx.save();
  const cardW = isCompactCanvas ? Math.min(182, Math.floor(width * 0.48)) : 234;
  const cardH = isCompactCanvas ? 58 : 70;
  const cardX = width - cardW - (isCompactCanvas ? 6 : 14);
  const cardY = isCompactCanvas ? 36 : 46;

  ctx.fillStyle = "rgba(7, 14, 28, 0.94)";
  ctx.strokeStyle = isCrashTest ? "#ef4444" : "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 7);
  ctx.fill();
  ctx.stroke();

  // Белый студийный подиум с фотографией аппарата NORD (ВСЕГДА ВИДЕН — И НА МОБИЛЬНОМ, И НА ПК!)
  const thumbW = isCompactCanvas ? 40 : 52;
  const thumbH = isCompactCanvas ? 46 : 58;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(cardX + 5, cardY + 6, thumbW, thumbH, 5);
  ctx.fill();
  if (stationImg && stationImg.complete && stationImg.naturalWidth > 0) {
    ctx.drawImage(stationImg, cardX + 6, cardY + 7, thumbW - 2, thumbH - 2);
  }

  const cTextX = cardX + thumbW + (isCompactCanvas ? 10 : 13);
  ctx.textAlign = "left";
  ctx.fillStyle = "#38bdf8";
  ctx.font = isCompactCanvas
    ? "800 8.5px 'Manrope', -apple-system, sans-serif"
    : "800 9.5px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(`● ${machine.badge}`, cTextX, cardY + (isCompactCanvas ? 14 : 16));

  ctx.fillStyle = "#ffffff";
  ctx.font = isCompactCanvas
    ? "800 10.5px 'Manrope', -apple-system, sans-serif"
    : "800 12.5px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(machine.name, cTextX, cardY + (isCompactCanvas ? 27 : 31));

  ctx.fillStyle = "#cbd5e1";
  ctx.font = isCompactCanvas
    ? "700 9px 'Manrope', -apple-system, sans-serif"
    : "700 10px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(`${machine.maxFlowLpm} л/м · ${machine.maxPressureBar} бар`, cTextX, cardY + (isCompactCanvas ? 39 : 45));

  ctx.fillStyle = "#34d399";
  ctx.font = isCompactCanvas
    ? "800 10.5px 'Manrope', -apple-system, sans-serif"
    : "800 11.5px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(`${machine.priceRub.toLocaleString("ru-RU")} ₽`, cTextX, cardY + (isCompactCanvas ? 51 : 59));
  ctx.restore();

  // --------------------------------------------------------------------------
  // 4. ОПТИЧЕСКИЙ 10x МАКРО-СКОП СЛЕВА ВВЕРХУ (ЧЁТКИЙ ШРИФТ MANROPE БЕЗ МЫЛА)
  // --------------------------------------------------------------------------
  ctx.save();
  const scopeW = isCompactCanvas ? Math.min(176, Math.floor(width * 0.47)) : 264;
  const scopeH = isCompactCanvas ? 58 : 96;
  const scopeX = isCompactCanvas ? 6 : 14;
  const scopeY = isCompactCanvas ? 36 : 46;
  ctx.fillStyle = "rgba(7, 14, 28, 0.94)";
  ctx.strokeStyle = isCrashTest ? "rgba(239, 68, 68, 0.85)" : "rgba(16, 185, 129, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(scopeX, scopeY, scopeW, scopeH, 7);
  ctx.fill();
  ctx.stroke();

  const lensCX = scopeX + (isCompactCanvas ? 22 : 34);
  const lensCY = scopeY + (isCompactCanvas ? 24 : 42);
  const lensR = isCompactCanvas ? 14 : 23;
  ctx.save();
  ctx.beginPath();
  ctx.arc(lensCX, lensCY, lensR, 0, Math.PI * 2);
  ctx.clip();

  const [mr, mg, mb] = material.rgb;
  ctx.fillStyle = avgWftMicrons > 10 ? `rgb(${mr}, ${mg}, ${mb})` : "#475569";
  ctx.fillRect(lensCX - lensR, lensCY - lensR, lensR * 2, lensR * 2);

  const grainCount = machine.id === "nord-2500" ? 6 : machine.id === "nord-18x" ? 22 : 12;
  for (let g = 0; g < grainCount; g++) {
    const gx = lensCX - 17 + ((g * 13) % 34);
    const gy = lensCY - 17 + ((g * 19) % 34);
    const gr = machine.id === "nord-2500" ? 1.2 : machine.id === "nord-18x" ? 3.2 : 2.1;
    ctx.fillStyle = isCrashTest ? "rgba(15, 23, 42, 0.55)" : "rgba(255, 255, 255, 0.55)";
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = isCrashTest ? "#f87171" : "#34d399";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(lensCX, lensCY, lensR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#34d399";
  ctx.font = "800 7px 'Manrope', -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("10x MACRO", lensCX, lensCY + lensR + (isCompactCanvas ? 10 : 12));

  const textX = scopeX + (isCompactCanvas ? 42 : 68);
  ctx.textAlign = "left";
  ctx.fillStyle = isCrashTest ? "#fca5a5" : "#6ee7b7";
  ctx.font = isCompactCanvas
    ? "800 8.5px 'Manrope', -apple-system, sans-serif"
    : "800 9.5px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(
    isCrashTest ? "⚠️ ПЕРЕГРУЗКА" : isCompactCanvas ? "✓ ФИНИШ Q4" : `✓ ${machine.finishClass}`,
    textX,
    scopeY + (isCompactCanvas ? 15 : 17)
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = isCompactCanvas
    ? "800 9.5px 'Manrope', -apple-system, sans-serif"
    : "800 10.5px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(
    isCompactCanvas ? `Ø ${machine.dropletMicrons} мкм · ${machine.maxFlowLpm} л/м` : `Капля: Ø ${machine.dropletMicrons} мкм · Поток: ${machine.maxFlowLpm} л/м`,
    textX,
    scopeY + (isCompactCanvas ? 30 : 32)
  );

  if (!isCompactCanvas) {
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "600 8.5px 'Manrope', -apple-system, sans-serif";
    const words = (isCrashTest
      ? `Состав ${material.viscosityPas} Па·с гуще предела ${machine.name}. Нужен класс HD!`
      : machine.signatureDesc
    ).split(" ");
    let line1 = "", line2 = "";
    for (const w of words) {
      if ((line1 + w).length < 32) line1 += (line1 ? " " : "") + w;
      else if ((line2 + w).length < 34) line2 += (line2 ? " " : "") + w;
    }
    ctx.fillText(line1, textX, scopeY + 47);
    ctx.fillText(line2, textX, scopeY + 59);
  }

  const coatStatus = avgWftMicrons < 20
    ? (isCompactCanvas ? "Слой: 0 мкм" : "Ожидание 1-го слоя...")
    : avgWftMicrons < material.targetWftMicrons * 0.95
    ? (isCompactCanvas ? `Слой: ${avgWftMicrons} мкм` : `Слой 1 (${avgWftMicrons} мкм) — проведите 2-й раз`)
    : (isCompactCanvas ? `Монолит: ${avgWftMicrons} мкм` : `Слой 2 (Монолит 100%: ${avgWftMicrons} мкм)`);
  ctx.fillStyle = "#38bdf8";
  ctx.font = isCompactCanvas
    ? "800 9px 'Manrope', -apple-system, sans-serif"
    : "800 9.5px 'Manrope', -apple-system, sans-serif";
  ctx.fillText(coatStatus, textX, scopeY + (isCompactCanvas ? 45 : 84));
  ctx.restore();
}

function drawFirstPersonBodycamGun(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  aimX: number,
  aimY: number,
  distanceCm: number,
  isTriggerPressed: boolean,
  isNozzleClogged: boolean,
  tipCode: string,
  targetPressureBar: number,
  isDanger: boolean,
  hasExtensionPole: boolean,
  selectedMaterialRgb: [number, number, number],
  realGunImg: HTMLImageElement | null,
  now: number
): { tipX: number; tipY: number } {
  ctx.save();

  // 1. ДЫХАНИЕ И ПАРАЛЛАКС ОПЕРАТОРА (IDLE BREATHING & PARALLAX TRACKING)
  const idleSwayX = Math.sin(now * 0.0018) * 2.5;
  const idleSwayY = Math.cos(now * 0.0014) * 2.0;

  // Базовая точка захвата рукояти оператором в правом нижнем секторе экрана
  const gripTargetX = width * 0.88 + (aimX - width * 0.5) * 0.08 + idleSwayX;
  const gripTargetY = height * 0.98 + (aimY - height * 0.5) * 0.05 + idleSwayY;

  // Вектор наведения на стену
  const aimDx = aimX - gripTargetX;
  const aimDy = aimY - gripTargetY;
  const aimDist = Math.hypot(aimDx, aimDy) || 1;
  const aimDirX = aimDx / aimDist;
  const aimDirY = aimDy / aimDist;

  // 2. ГИДРАВЛИЧЕСКАЯ ОТДАЧА 230 БАР (230 BAR HYDRAULIC RECOIL & PUMP PULSE)
  // При зажатом курке — резкий откат назад на 6.8px + гидропульсация в такт поршню
  const recoilPx = isTriggerPressed
    ? 6.8 + Math.sin(now * 0.08) * 1.6
    : 0;

  const gripDrawX = gripTargetX - aimDirX * recoilPx;
  const gripDrawY = gripTargetY - aimDirY * recoilPx;

  // Масштабирование по дистанции к стене (15–50 см)
  const distScale = Math.max(0.68, Math.min(1.02, 1.02 - (distanceCm - 15) / 80));
  const theta = Math.atan2(aimDy, aimDx);

  // Координаты опорных точек в исходной фотографии (1024 x 571)
  const GRIP_SRC_X = 490;
  const GRIP_SRC_Y = 410;
  const TIP_SRC_X = 256;
  const TIP_SRC_Y = 178;
  const relX = TIP_SRC_X - GRIP_SRC_X; // -234
  const relY = TIP_SRC_Y - GRIP_SRC_Y; // -232
  const alpha0 = -2.36082; // Угол ствола на оригинальном фото (-135.25 град)
  const deltaTheta = theta - alpha0;

  // Вычисление точной точки сопла RAC X в координатах холста
  const rotRelX = (relX * Math.cos(deltaTheta) - relY * Math.sin(deltaTheta)) * distScale;
  const rotRelY = (relX * Math.sin(deltaTheta) + relY * Math.cos(deltaTheta)) * distScale;
  let activeTipX = gripDrawX + rotRelX;
  let activeTipY = gripDrawY + rotRelY;

  // ЕСЛИ РЕАЛЬНОЕ ФОТО ЗАГРУЖЕНО — РЕНДЕРИМ ЖИВОЙ ПИСТОЛЕТ NORD AIRLESS PRO!
  if (realGunImg && realGunImg.complete && realGunImg.naturalWidth > 0) {
    // А. Мягкая динамическая тень от руки и пистолета на стене под прожектором
    ctx.save();
    ctx.translate(gripDrawX + 18, gripDrawY + 22);
    ctx.rotate(deltaTheta);
    ctx.scale(distScale, distScale);
    ctx.globalAlpha = 0.38;
    ctx.filter = "brightness(0) blur(16px)";
    ctx.drawImage(realGunImg, -GRIP_SRC_X, -GRIP_SRC_Y);
    ctx.restore();

    // Б. Живой фотореалистичный слой: перчатка, спецовка Tyvek, металл NORD AIRLESS PRO
    ctx.save();
    ctx.translate(gripDrawX, gripDrawY);
    ctx.rotate(deltaTheta);
    ctx.scale(distScale, distScale);

    ctx.drawImage(realGunImg, -GRIP_SRC_X, -GRIP_SRC_Y);

    // В. Цифровой неоновый OLED-манометр на тыльной крышке ресивера пистолета
    ctx.save();
    ctx.fillStyle = "rgba(2, 18, 14, 0.92)";
    ctx.strokeStyle = isDanger ? "#ef4444" : "#10b981";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-86, -192, 30, 21, 3);
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = isDanger ? "rgba(239, 68, 68, 0.95)" : "rgba(16, 185, 129, 0.95)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = isDanger ? "#fca5a5" : "#34d399";
    ctx.font = "900 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${targetPressureBar}`, -71, -180);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "700 6px monospace";
    ctx.fillText("BAR", -71, -174);
    ctx.restore();

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // Г. ЕСЛИ ВКЛЮЧЕНА УДОЧКА 60 СМ — АЛЮМИНИЕВАЯ ШТАНГА ВЫДВИГАЕТСЯ ИЗ СОПЛА
  // --------------------------------------------------------------------------
  if (hasExtensionPole) {
    const poleLen = 125;
    const poleTipX = activeTipX + aimDirX * poleLen;
    const poleTipY = activeTipY + aimDirY * poleLen;

    ctx.save();
    ctx.strokeStyle = "#090d16";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(activeTipX, activeTipY);
    ctx.lineTo(poleTipX, poleTipY);
    ctx.stroke();

    const poleGrad = ctx.createLinearGradient(activeTipX, activeTipY, poleTipX, poleTipY);
    poleGrad.addColorStop(0, "#cbd5e1");
    poleGrad.addColorStop(0.3, "#f8fafc");
    poleGrad.addColorStop(0.7, "#38bdf8");
    poleGrad.addColorStop(1, "#94a3b8");
    ctx.strokeStyle = poleGrad;
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(activeTipX, activeTipY);
    ctx.lineTo(poleTipX, poleTipY);
    ctx.stroke();

    // Синий соплодержатель на конце удочки
    ctx.save();
    ctx.translate(poleTipX, poleTipY);
    ctx.rotate(theta);
    ctx.fillStyle = "#0284c7";
    ctx.strokeStyle = "#082f49";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-4, -12, 16, 24, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 6.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tipCode, 4, 3);
    ctx.restore();

    // Плашка удочки
    ctx.fillStyle = "rgba(6, 78, 59, 0.94)";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect((activeTipX + poleTipX) * 0.5 - 65, (activeTipY + poleTipY) * 0.5 - 22, 130, 16, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a7f3d0";
    ctx.font = "800 8.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("📏 УДОЧКА 60 СМ · ПОТОЛКИ С ПОЛА", (activeTipX + poleTipX) * 0.5, (activeTipY + poleTipY) * 0.5 - 11);
    ctx.restore();

    activeTipX = poleTipX;
    activeTipY = poleTipY;
  }

  ctx.restore();

  return { tipX: activeTipX, tipY: activeTipY };
}

// ============================================================================
// 2. ТАКТИЧЕСКИЙ ЭКРАН ВИДЕОНАБЛЮДЕНИЯ «CAM-02: ОБЪЕКТ» (CCTV ROOM OVERVIEW PIP)
// ============================================================================
function drawCCTVSurveillanceCam(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  machineName: string,
  maxFlowLpm: number,
  isTriggerPressed: boolean,
  now: number
) {
  const pipW = 224;
  const pipH = 136;
  const pipX = width - pipW - 14;
  const pipY = 14;

  ctx.save();

  // 1. Корпус монитора и затемненная подложка
  ctx.fillStyle = "rgba(8, 14, 26, 0.94)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(pipX, pipY, pipW, pipH, 6);
  ctx.fill();
  ctx.stroke();

  // Клиппинг для камеры внутри рамки
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pipX + 2, pipY + 2, pipW - 4, pipH - 4, 5);
  ctx.clip();

  // 2. Перспективный пол комнаты стройки (бетонная стяжка с разметкой)
  const floorY = pipY + pipH - 24;
  const floorGrad = ctx.createLinearGradient(pipX, floorY - 30, pipX, pipY + pipH);
  floorGrad.addColorStop(0, "#1e293b");
  floorGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = floorGrad;
  ctx.fillRect(pipX, floorY - 30, pipW, pipH);

  // Линии перспективы пола
  ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
  ctx.lineWidth = 1;
  for (let l = -2; l <= 4; l++) {
    ctx.beginPath();
    ctx.moveTo(pipX + pipW * 0.5 + l * 20, floorY - 30);
    ctx.lineTo(pipX + pipW * 0.5 + l * 45, pipY + pipH);
    ctx.stroke();
  }

  // 3. Стоящая на полу станция NORD + ведро 30 л
  const stX = pipX + 48;
  const stY = floorY;
  const motorVib = isTriggerPressed ? Math.sin(now * 0.12) * 1.5 : 0;

  // Ведро со шпаклевкой / краской
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(stX - 26, stY - 26);
  ctx.lineTo(stX - 10, stY - 26);
  ctx.lineTo(stX - 12, stY);
  ctx.lineTo(stX - 24, stY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Аппарат NORD на колесах
  ctx.save();
  ctx.translate(stX + motorVib, stY);

  // Колеса
  ctx.fillStyle = "#020617";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-4, -6, 6, 0, Math.PI * 2);
  ctx.arc(16, -6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Хромированная рама
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-4, -6);
  ctx.lineTo(-4, -42);
  ctx.lineTo(16, -42);
  ctx.lineTo(16, -6);
  ctx.stroke();

  // Синий корпус двигателя NORD
  ctx.fillStyle = "#0284c7";
  ctx.strokeStyle = "#082f49";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-2, -36, 16, 24, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 5px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NORD", 6, -26);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "700 4.5px monospace";
  ctx.fillText(`${maxFlowLpm}L`, 6, -18);
  ctx.restore();

  // Шланг, идущий от аппарата к маляру
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(stX + 16, stY - 14);
  ctx.bezierCurveTo(stX + 45, stY + 6, pipX + 115, stY + 4, pipX + 138, stY - 20);
  ctx.stroke();

  // 4. Фигура мастера (масштаб 1.80 м) у стены
  const mX = pipX + 144;
  const mY = floorY;
  const mH = 68; // Высота мастера на мини-карте
  const mHeadY = mY - mH;

  // Белый комбинезон Tyvek с синей жилеткой
  ctx.fillStyle = "#f8fafc";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(mX - 7, mY - 44, 14, 44, 2);
  ctx.fill();
  ctx.stroke();

  // Синий жилет
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(mX - 6, mY - 42, 12, 18);

  // Голова в капюшоне и респиратор
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(mX, mHeadY + 6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Розовый патрон 3M
  ctx.fillStyle = "#e11d48";
  ctx.fillRect(mX - 6, mHeadY + 5, 3, 3);

  // Правая рука с пистолетом направлена на стену
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(mX - 4, mY - 38);
  ctx.lineTo(mX - 16, mY - 34);
  ctx.stroke();

  // Факел распыла в стену (при нажатом курке)
  if (isTriggerPressed) {
    ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
    ctx.beginPath();
    ctx.moveTo(mX - 16, mY - 34);
    ctx.lineTo(pipX + pipW * 0.48, mY - 46);
    ctx.lineTo(pipX + pipW * 0.48, mY - 22);
    ctx.closePath();
    ctx.fill();
  }

  // Размерная плашка «Рост 1.80 м»
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(mX + 11, mHeadY);
  ctx.lineTo(mX + 14, mHeadY);
  ctx.lineTo(mX + 14, mY);
  ctx.lineTo(mX + 11, mY);
  ctx.stroke();

  ctx.fillStyle = "#7dd3fc";
  ctx.font = "700 6.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText("1.80м", mX + 16, mHeadY + mH * 0.55);

  // 5. Эффект развертки ЭЛТ/CCTV (сканлинии и легкий шум)
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  for (let s = pipY; s < pipY + pipH; s += 3) {
    ctx.fillRect(pipX, s, pipW, 1.2);
  }

  ctx.restore(); // Снятие клиппинга

  // 6. Хедер камеры с мигающим красным индикатором REC
  const isRecBlink = Math.floor(now * 0.002) % 2 === 0;
  ctx.fillStyle = isRecBlink ? "#ef4444" : "#991b1b";
  ctx.beginPath();
  ctx.arc(pipX + 12, pipY + 12, 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 7px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("CAM-02 · СТРОЙПЛОЩАДКА", pipX + 19, pipY + 14.5);

  // Живой таймкод
  const sec = Math.floor(now * 0.001) % 60;
  const ms = Math.floor((now % 1000) / 16);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "700 7px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`00:${sec < 10 ? "0" + sec : sec}:${ms < 10 ? "0" + ms : ms}`, pipX + pipW - 8, pipY + 14.5);

  // Подпись оборудования внизу рамки
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(pipX + 4, pipY + pipH - 18, pipW - 8, 14);
  ctx.fillStyle = "#7dd3fc";
  ctx.font = "700 6.5px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Аппарат: ${machineName} · Сопло: 517`, pipX + pipW * 0.5, pipY + pipH - 8);

  ctx.restore();
}


// ============================================================================
// 1. СТРОИТЕЛЬНАЯ ЛОКАЦИЯ И РЕАЛЬНЫЕ МАСШТАБНЫЕ ЯКОРЯ (БЕЗ ЧТЕНИЯ ЦИФР!)
// ============================================================================
function drawRoomEnvironmentAndScaleAnchors(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  substrate: "concrete" | "drywall" | "steel",
  hasExtensionPole: boolean,
  now: number
) {
  // Вычисляем масштаб: высота стены в кадре = ровно 2.80 м (стандарт высоты этажа)
  const floorY = height - 44;
  const ceilingY = 24;
  const wallHeightPx = floorY - ceilingY;
  const ppm = wallHeightPx / 2.80; // Пикселей на 1 метр в реальном мире

  ctx.save();

  // --------------------------------------------------------------------------
  // А. ПОТОЛОЧНАЯ ПЛИТА ПЕРЕКРЫТИЯ (h = 2.80 м)
  // --------------------------------------------------------------------------
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, width, ceilingY);

  // Тень от плиты перекрытия на верх стены
  const ceilShadow = ctx.createLinearGradient(0, ceilingY, 0, ceilingY + 16);
  ceilShadow.addColorStop(0, "rgba(0, 0, 0, 0.75)");
  ceilShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = ceilShadow;
  ctx.fillRect(0, ceilingY, width, 16);

  // Шов плиты перекрытия
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, ceilingY);
  ctx.lineTo(width, ceilingY);
  ctx.stroke();

  // --------------------------------------------------------------------------
  // Б. РЕАЛЬНАЯ СТРОИТЕЛЬНАЯ СЕТКА МАТЕРИАЛОВ (ГКЛ 1200 ММ / ОПАЛУБКА БЕТОНА)
  // --------------------------------------------------------------------------
  if (substrate === "drywall") {
    // Листы гипсокартона Knauf 1200 мм (1.20 м)
    const sheetWPx = 1.20 * ppm;
    const screwSpacingPx = 0.25 * ppm; // Саморезы через каждые 25 см

    ctx.save();
    for (let x = sheetWPx * 0.7; x < width - 120; x += sheetWPx) {
      // Заводская утонённая кромка (ПЛУК фаска 50 мм)
      const seamGrad = ctx.createLinearGradient(x - 12, 0, x + 12, 0);
      seamGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      seamGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.45)");
      seamGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = seamGrad;
      ctx.fillRect(x - 12, ceilingY, 24, wallHeightPx);

      // Стык двух листов ГКЛ
      ctx.strokeStyle = "rgba(30, 41, 59, 0.85)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, ceilingY);
      ctx.lineTo(x, floorY);
      ctx.stroke();

      // Точки черных саморезов по краю листа через каждые 25 см
      for (let y = ceilingY + 25; y < floorY - 15; y += screwSpacingPx) {
        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.arc(x - 6, y, 1.8, 0, Math.PI * 2);
        ctx.arc(x + 6, y + screwSpacingPx * 0.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Маркировка листа
      ctx.fillStyle = "rgba(100, 116, 139, 0.4)";
      ctx.font = "800 9px monospace";
      ctx.fillText("KNAUF ГКЛ 1200×2500 мм", x + 14, ceilingY + 45);
    }
    ctx.restore();
  } else if (substrate === "concrete") {
    // Щитовая опалубка монолита (1.5 × 1.0 м) и конусы от стяжек
    const panelWPx = 1.50 * ppm;
    const tieSpacingPx = 1.00 * ppm;

    ctx.save();
    for (let x = panelWPx * 0.6; x < width - 80; x += panelWPx) {
      ctx.strokeStyle = "rgba(15, 23, 42, 0.6)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, ceilingY);
      ctx.lineTo(x, floorY);
      ctx.stroke();

      // Технологические пластиковые конусы от стяжных винтов опалубки
      for (let y = ceilingY + 50; y < floorY - 30; y += tieSpacingPx) {
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

// [Чистая рабочая стена без чертежных рамок]

  // --------------------------------------------------------------------------
  // Г. БЕТОННЫЙ ПОЛ С ЗАЩИТНОЙ ПЛЕНКОЙ И ЯКОРЯМИ МАСШТАБА (ВЕДРО 30Л + ВАЛИК 25 СМ)
  // --------------------------------------------------------------------------
  // Пол внизу кадра
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
  floorGrad.addColorStop(0, "#0f172a");
  floorGrad.addColorStop(0.2, "#1e293b");
  floorGrad.addColorStop(1, "#090d16");
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, width, height - floorY);

  // Линия стыка стена-пол (демпферный шов)
  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(width, floorY);
  ctx.stroke();

  // Защитная малярная пленка/крафт-бумага на полу, приклеенная синим скотчем
  ctx.fillStyle = "rgba(146, 64, 14, 0.28)"; // Коричневая крафт-бумага
  ctx.fillRect(0, floorY + 4, width, height - floorY - 4);

  // Синий малярный скотч 3M вдоль плинтуса
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(0, floorY, width, 5);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(0, floorY, width, 1.2);

  // ЯКОРЬ МАСШТАБА 1: РУЧНОЙ ВАЛИК 25 СМ НА ПОЛУ (КОНТРАСТ С БЕЗВОЗДУШКОЙ!)
  const rollerX = width * 0.38;
  const rollerY = floorY + 12;
  ctx.save();
  // Бюгель валика
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rollerX, rollerY);
  ctx.lineTo(rollerX + 18, rollerY + 10);
  ctx.lineTo(rollerX + 18, rollerY + 22);
  ctx.stroke();
  // Жёлтая шубка валика 25 см (0.25 * ppm)
  const rollerWPx = 0.25 * ppm;
  ctx.fillStyle = "#eab308";
  ctx.strokeStyle = "#854d0e";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(rollerX - rollerWPx * 0.5, rollerY - 5, rollerWPx, 10, 2);
  ctx.fill();
  ctx.stroke();
  // Подпись
  ctx.fillStyle = "rgba(253, 224, 71, 0.75)";
  ctx.font = "700 7px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Ручной валик (25 см)", rollerX, rollerY + 18);
  ctx.restore();

  ctx.restore();
}


export default function NordLabPage() {
  const [selectedMachineId, setSelectedMachineId] = useState("nord-6000");
  const [selectedMaterialId, setSelectedMaterialId] = useState("paint");
  const [selectedTipCode, setSelectedTipCode] = useState("517");
  const [targetPressureBar, setTargetPressureBar] = useState(190);
  const [distanceCm, setDistanceCm] = useState(30);
  const [gunAngleDeg, setGunAngleDeg] = useState(0);
  const [valveMode, setValveMode] = useState<"spray" | "prime">("spray");
  const [toolMode, setToolMode] = useState<"gun" | "spatula">("gun");
  const [hasExtensionPole, setHasExtensionPole] = useState(false); // Удочка 60 см для работы с пола без стремянки
  const [showMasterOperator, setShowMasterOperator] = useState(true); // 3D-фигура мастера (масштаб 1.80 м) и станция в кадре
  const [cameraViewMode, setCameraViewMode] = useState<"bodycam" | "third_person">("third_person"); // Кинематографичный вид от 1-го лица (Bodycam)
  const [showCctvPip, setShowCctvPip] = useState(false); // Тактический монитор наружного наблюдения CAM-02
  const realGunImgRef = useRef<HTMLImageElement | null>(null);
  const painterImgRef = useRef<HTMLCanvasElement | HTMLImageElement | null>(null);
  const roomPhotoImgRef = useRef<HTMLImageElement | null>(null);
  const splattingImagesRef = useRef<{
    base: HTMLImageElement | null;
    paint: HTMLImageElement | null;
    putty: HTMLImageElement | null;
    bitumen: HTMLImageElement | null;
    smooth: HTMLImageElement | null;
  }>({ base: null, paint: null, putty: null, bitumen: null, smooth: null });
  const stationImagesMapRef = useRef<Record<string, HTMLImageElement | null>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Авто-выбор аппарата при переходе из каталога (/lab?machine=nord-18x)
      const params = new URLSearchParams(window.location.search);
      const rawParam = params.get("machine")?.toLowerCase();
      const legacyMap: Record<string, string> = {
        nord595: "nord-2500",
        nord890: "nord-3300",
        nord1095: "nord-6000",
        nord1895: "nord-9200",
        nord9536: "nord-18x",
      };
      const machineParam = rawParam ? legacyMap[rawParam] || rawParam : undefined;
      if (machineParam && MACHINES[machineParam]) {
        setSelectedMachineId(machineParam);
      }
      const materialParam = params.get("material")?.toLowerCase();
      if (materialParam && MATERIALS[materialParam]) {
        setSelectedMaterialId(materialParam);
      }

      // 2. Загрузка всех 5 фото-слоев комнаты (Multi-Layer Texture Splatting):
      const loadSplatPlate = (key: 'base' | 'paint' | 'putty' | 'bitumen' | 'smooth', url: string) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          splattingImagesRef.current[key] = img;
          if (key === 'base') roomPhotoImgRef.current = img;
          if (webglEngineRef.current) {
            webglEngineRef.current.uploadSplattingTexture(key, img);
          }
        };
      };
      loadSplatPlate('base', '/assets/site/splatting/wall-concrete-base.png');
      loadSplatPlate('paint', '/assets/site/splatting/wall-paint-latex.png');
      loadSplatPlate('putty', '/assets/site/splatting/wall-putty-spray.png');
      loadSplatPlate('bitumen', '/assets/site/splatting/wall-bitumen-mastic.png');
      loadSplatPlate('smooth', '/assets/site/splatting/wall-putty-smooth.png');
      
      // 3. Загрузка нового фото маляра с логотипом NORD и удочкой 35 см + авто-удаление черного студийного фона
      const pImg = new Image();
      pImg.src = "/assets/site/nord-painter-master-fullbody.png";
      pImg.onload = () => {
        painterImgRef.current = createTransparentCutoutCanvas(pImg);
      };

      // 4. Загрузка фотографий всех 8 станций NORD
      const stationFiles: Record<string, string> = {
        "nord-2500": "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
        "nord-3300": "/assets/machines/nord-3300/NORD-3200-view-front-side-nord-edit-2k.jpg",
        "nord-4500": "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
        "nord-6000": "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
        "nord-8000-pro": "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg",
        "nord-9200": "/assets/machines/nord-9200/NORD-8000-view-front-3q-source.jpg",
        "nord-9900": "/assets/machines/nord-9900/NORD-18X-view-front-3q-a.jpg",
        "nord-18x": "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg",
      };
      Object.entries(stationFiles).forEach(([id, src]) => {
        const sImg = new Image();
        sImg.src = src;
        sImg.onload = () => {
          stationImagesMapRef.current[id] = sImg;
        };
      });
    }
  }, []);
  const [substrate, setSubstrate] = useState<"concrete" | "drywall" | "steel">("concrete");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const strip = document.querySelector(".nord-lab-machine-strip") as HTMLElement | null;
    const activeCard = strip?.querySelector(".nord-lab-strip-card.active") as HTMLElement | null;
    if (strip && activeCard) {
      const targetLeft = activeCard.offsetLeft - strip.clientWidth * 0.5 + activeCard.clientWidth * 0.5;
      strip.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }
  }, [selectedMachineId]);
  const [laserMode, setLaserMode] = useState<"green" | "red" | "off">("green");
  const [isRakingLightOn, setIsRakingLightOn] = useState(true);
  const [isNozzleClogged, setIsNozzleClogged] = useState(false);
  const [tipRotationDeg, setTipRotationDeg] = useState(0);
  const [isPurging, setIsPurging] = useState(false);
  const [clogSuccessToast, setClogSuccessToast] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [projectAreaInput, setProjectAreaInput] = useState(500);

  // Интерактивная дуэль: Валик (Бот) vs NORD (Пользователь)
  const [isDuelActive, setIsDuelActive] = useState(false);
  const [duelState, setDuelState] = useState<"idle" | "ready" | "racing" | "finished">("idle");
  const [duelTimer, setDuelTimer] = useState(0);
  const [duelFinished, setDuelFinished] = useState(false);
  const [duelBotDipping, setDuelBotDipping] = useState(false);
  const [duelStats, setDuelStats] = useState({
    rollerAreaM2: 0,
    nordAreaM2: 0,
    rollerProgress: 0,
    nordProgress: 0,
    timesFaster: 10,
  });
  const duelRef = useRef({
    active: false,
    state: "idle" as "idle" | "ready" | "racing" | "finished",
    startTime: 0,
    elapsed: 0,
    finished: false,
    rollerAreaM2: 0,
    nordAreaM2: 0,
    userProgress: 0,
    botLane: 0,
    botY: 50,
    botDirection: 1,
    botDipping: false,
    botDipTimer: 0,
  });

  const [isTriggerPressed, setIsTriggerPressed] = useState(false);
  const [livePressureBar, setLivePressureBar] = useState(190);

  // Телеметрия
  const [telemetry, setTelemetry] = useState({
    coveredAreaM2: 0,
    avgWftMicrons: 0,
    uniformityPercent: 0,
    sagCount: 0,
    oversprayPercent: 4,
    activeSeconds: 0,
    litersUsed: 0,
    instantSpeedCmPerSec: 0,
  });

  const [activeTab, setActiveTab] = useState<"simulator" | "architecture">("simulator");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [challengeUnlocked, setChallengeUnlocked] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", comment: "", submitted: false });

  // Рефы холстов
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const webglEngineRef = useRef<WebGLWallEngine | null>(null);

  // Сетка микрон и PBR-буферы высокого разрешения (480x288)
  const wftBufferRef = useRef(new Float32Array(TOTAL_SIM_CELLS));
  const wetnessBufferRef = useRef(new Float32Array(TOTAL_SIM_CELLS));
  const microTextureBufferRef = useRef(new Float32Array(TOTAL_SIM_CELLS));
  // Мульти-материальный буфер (ID 1..4): сохраняет цвета и оптику всех составов на одной стене
  const materialIdBufferRef = useRef(new Uint8Array(TOTAL_SIM_CELLS));
  const floorSplashesRef = useRef<Array<{ x: number; y: number; r: number; color: string }>>([]);
  const cameraImpulseRef = useRef(0);
  const baseHeightMapRef = useRef(new Float32Array(TOTAL_SIM_CELLS));
  const baseColorMapRef = useRef(new Uint8ClampedArray(TOTAL_SIM_CELLS * 3));
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenImgDataRef = useRef<ImageData | null>(null);
  const clogTimerRef = useRef(0);
  const recoilRef = useRef({ kick: 0, wasTriggerPressed: false });
  const glassBeadsRef = useRef<Array<{ x: number; y: number; r: number }>>([]);
  const pointerRef = useRef({
    x: 450,
    y: 260,
    targetX: 450,
    targetY: 260,
    prevX: 450,
    prevY: 260,
  });
  const statsRef = useRef({
    activeSprayTimeSec: 0,
    litersConsumed: 0,
    sagCellsTriggered: new Set<number>(),
  });

  const audioEngineRef = useRef<AirlessAudioEngine | null>(null);
  useEffect(() => {
    audioEngineRef.current = new AirlessAudioEngine();
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stopSpray();
      }
    };
  }, []);

  const machine = MACHINES[selectedMachineId];
  const material = MATERIALS[selectedMaterialId];
  const tip = NOZZLE_TIPS[selectedTipCode];

  // Гидродинамические расчёты
  const hydroPhysics = useMemo(() => {
    const isTipOversized = tip.orificeInch > machine.maxTipInch;
    const viscosityRatio = material.viscosityPas / machine.maxViscosityPas;
    const isViscosityOverload = viscosityRatio > 1.05;
    const isCrashTestActive = isViscosityOverload || isTipOversized;

    const clampedSetPressure = Math.min(targetPressureBar, machine.maxPressureBar);
    let workingPressureBar = clampedSetPressure;

    if (valveMode === "prime") {
      workingPressureBar = 18;
    } else if (isCrashTestActive) {
      const overloadSeverity = Math.max(viscosityRatio, tip.orificeInch / machine.maxTipInch);
      workingPressureBar = Math.max(55, Math.min(85, Math.round(clampedSetPressure / (overloadSeverity * 1.6))));
    } else {
      // У мощных станций (мотор >= 3.5 кВт) просадка давления на сопле минимальна
      const dropFactor = machine.motorKw >= 3.5 ? 110 : 220;
      workingPressureBar = Math.max(70, clampedSetPressure - Math.round(tip.orificeInch * dropFactor));
    }

    const isUnderAtomized = workingPressureBar < material.minPressureBar;
    // Если тяга станции с запасом перекрывает вязкость смеси — гидропоршень продавливает пасту без потери литража!
    const powerReserve = machine.maxViscosityPas / Math.max(1, material.viscosityPas);
    const viscosityDrag = powerReserve >= 1.5
      ? 1.04
      : Math.pow(Math.max(1, material.viscosityPas / 2.5), 0.18);
    const theoreticalFlowLpm = (tip.baseFlowLpmAt150Bar * Math.sqrt(workingPressureBar / 150)) / viscosityDrag;
    const actualFlowLpm = valveMode === "prime" ? machine.maxFlowLpm * 0.6 : Math.min(machine.maxFlowLpm, theoreticalFlowLpm);

    const halfAngleRad = ((tip.angleDeg / 2) * Math.PI) / 180;
    let fanWidthCm = 2 * distanceCm * Math.tan(halfAngleRad);
    if (isUnderAtomized || isCrashTestActive) {
      fanWidthCm *= 0.65;
    }

    let oversprayLossPercent = 4.0;
    if (distanceCm > 35) {
      oversprayLossPercent += Math.pow((distanceCm - 35) / 5, 1.65) * 4.0;
    }
    if (workingPressureBar > material.minPressureBar + 55) {
      oversprayLossPercent += 6.0;
    }
    oversprayLossPercent = Math.min(48, Math.round(oversprayLossPercent));

    return {
      clampedSetPressure,
      workingPressureBar,
      actualFlowLpm: Number(actualFlowLpm.toFixed(2)),
      fanWidthCm: Number(fanWidthCm.toFixed(1)),
      isTipOversized,
      isViscosityOverload,
      isCrashTestActive,
      isUnderAtomized,
      oversprayLossPercent,
    };
  }, [machine, material, tip, targetPressureBar, distanceCm, valveMode]);

  // Инженерная сборка под выбранный материал и аппарат
  const bundleInfo = useMemo(() => {
    const recommendedTip = material.recommendedTip;
    const recTipObj = NOZZLE_TIPS[recommendedTip] || tip;

    let hoseName = 'Шланг ВД NORD 1/4" × 15 м (250 bar, синий с антиизломом)';
    let hosePrice = 6900;
    if (selectedMaterialId === "putty" || selectedMaterialId === "fireproof") {
      hoseName = 'Шланг ВД NORD 3/8" × 15 м (270 bar) + гибкий поводок 1/4" × 1.5 м';
      hosePrice = 12400;
    } else if (selectedMaterialId === "road") {
      hoseName = 'Шланг ВД NORD 1/4" × 15 м (растворителестойкий)';
      hosePrice = 7200;
    }

    let filterName = "Фильтр в рукоять 60 mesh (тонкая очистка эмалей)";
    let filterPrice = 750;
    if (selectedMaterialId === "putty") {
      filterName = "Прямой проход 0 mesh (фильтры снять для густых паст)";
      filterPrice = 0;
    } else if (selectedMaterialId === "fireproof") {
      filterName = "Фильтр коллектора 30 mesh (грубая очистка)";
      filterPrice = 950;
    }

    const tipPrice = 3850;
    const totalPrice = machine.priceRub + tipPrice + hosePrice + filterPrice;

    return {
      recommendedTip,
      recTipObj,
      hoseName,
      hosePrice,
      filterName,
      filterPrice,
      tipPrice,
      totalPrice,
    };
  }, [machine, material, tip, selectedMaterialId]);

  // ============================================================================
  // ИНИЦИАЛИЗАЦИЯ ФОТОРЕАЛИСТИЧНОЙ ПОДЛОЖКИ СТЕНЫ (БЕТОН / ГКЛ / МЕТАЛЛ)
  // ============================================================================
  const initSubstrate = useCallback(() => {
    const subType = substrate === "drywall" ? "gkl" : substrate === "steel" ? "metal" : "concrete";
    initSubstrateBuffer(subType, SIM_W, SIM_H, baseHeightMapRef.current, baseColorMapRef.current);
    const canvas = baseCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (!webglEngineRef.current) webglEngineRef.current = new WebGLWallEngine();
    if (paintCanvasRef.current) {
      webglEngineRef.current.init(paintCanvasRef.current);
      webglEngineRef.current.updateBaseTexture(baseColorMapRef.current, baseHeightMapRef.current);
    }
  }, [substrate]);

  useEffect(() => {
    initSubstrate();
  }, [initSubstrate]);

  const renderBaseWall = initSubstrate;


  // Ресайз холстов
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !baseCanvasRef.current || !paintCanvasRef.current || !overlayCanvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 0 || h <= 0) return;

      const dpr = Math.min(2.5, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
      baseCanvasRef.current.width = w;
      baseCanvasRef.current.height = h;
      paintCanvasRef.current.width = w;
      paintCanvasRef.current.height = h;
      overlayCanvasRef.current.width = Math.round(w * dpr);
      overlayCanvasRef.current.height = Math.round(h * dpr);

      renderBaseWall();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderBaseWall]);

  useEffect(() => {
    renderBaseWall();
  }, [renderBaseWall]);

  // Очистка стены
  const handleResetWall = useCallback(() => {
    wftBufferRef.current.fill(0);
    wetnessBufferRef.current.fill(0);
    microTextureBufferRef.current.fill(0);
    materialIdBufferRef.current.fill(0);
    floorSplashesRef.current = [];
    cameraImpulseRef.current = 0;
    glassBeadsRef.current = [];
    clogTimerRef.current = 0;
    setIsNozzleClogged(false);
    statsRef.current = {
      activeSprayTimeSec: 0,
      litersConsumed: 0,
      sagCellsTriggered: new Set(),
    };
    initSubstrate();
    setTelemetry({
      coveredAreaM2: 0,
      avgWftMicrons: 0,
      uniformityPercent: 0,
      sagCount: 0,
      oversprayPercent: hydroPhysics.oversprayLossPercent,
      activeSeconds: 0,
      litersUsed: 0,
      instantSpeedCmPerSec: 0,
    });
  }, [initSubstrate, hydroPhysics.oversprayLossPercent]);

  // Интерактивная дуэль: Валик (Бот) vs NORD (Пользователь)
  const handleStartDuel = useCallback(() => {
    handleResetWall();
    setIsDuelActive(true);
    setDuelState("ready");
    setDuelFinished(false);
    setDuelTimer(0);
    setDuelBotDipping(false);
    setDuelStats({
      rollerAreaM2: 0,
      nordAreaM2: 0,
      rollerProgress: 0,
      nordProgress: 0,
      timesFaster: 10,
    });
    duelRef.current = {
      active: true,
      state: "ready",
      startTime: 0,
      elapsed: 0,
      finished: false,
      rollerAreaM2: 0,
      nordAreaM2: 0,
      userProgress: 0,
      botLane: 0,
      botY: 50,
      botDirection: 1,
      botDipping: false,
      botDipTimer: 0,
    };
  }, [handleResetWall]);

  const handleStopDuel = useCallback(() => {
    setIsDuelActive(false);
    setDuelState("idle");
    setDuelFinished(false);
    setDuelBotDipping(false);
    duelRef.current.active = false;
    duelRef.current.state = "idle";
    audioEngineRef.current?.stopSpray();
  }, []);

  const handleFinishDuelManual = useCallback(() => {
    if (!duelRef.current.active || duelRef.current.finished) return;
    duelRef.current.state = "finished";
    duelRef.current.finished = true;
    const finalElapsed = Math.max(1.2, duelRef.current.elapsed);
    const botArea = duelRef.current.rollerAreaM2;
    const userArea = Math.max(0.5, duelRef.current.nordAreaM2);
    const timesFaster = Math.max(4, Math.round((userArea / Math.max(0.12, botArea)) * 5));
    setDuelTimer(Number(finalElapsed.toFixed(1)));
    setDuelStats((s) => ({
      ...s,
      nordAreaM2: userArea,
      rollerAreaM2: botArea,
      timesFaster,
    }));
    setDuelFinished(true);
    setDuelState("finished");
    audioEngineRef.current?.playTone(740, 0.25);
  }, []);

  const handleFinishDuelManualRef = useRef(handleFinishDuelManual);
  useEffect(() => {
    handleFinishDuelManualRef.current = handleFinishDuelManual;
  }, [handleFinishDuelManual]);

  // Устранение засора: поворот на 180°, продувка и установка правильного сопла
  const handlePurgeAndFixTip = useCallback(() => {
    setIsPurging(true);
    audioEngineRef.current?.playPurgeSound();
    setTipRotationDeg(180);
    setTimeout(() => {
      const recTip = material.recommendedTip;
      setSelectedTipCode(recTip);
      setIsNozzleClogged(false);
      setTipRotationDeg(0);
      setIsPurging(false);
      clogTimerRef.current = 0;
      setClogSuccessToast(`Сопло X-HD ${recTip} установлено! Поток восстановлен.`);
      setTimeout(() => setClogSuccessToast(null), 3500);
    }, 450);
  }, [material.recommendedTip]);

  // Краш-тест на вязкость
  const triggerViscosityCrashTest = () => {
    setSelectedMachineId("nord-2500");
    setSelectedMaterialId("putty");
    setSelectedTipCode("535");
    setTargetPressureBar(200);
    setValveMode("spray");
    setToolMode("gun");
  };

  const upgradeToHeavyDuty = () => {
    setSelectedMachineId("nord-18x");
    if (selectedMaterialId === "fireproof") {
      setSelectedTipCode("527");
    } else if (selectedMaterialId === "putty") {
      setSelectedTipCode("535");
    }
    setTargetPressureBar(225);
    setValveMode("spray");
  };

  const handleSelectMaterial = (matId: string) => {
    if (selectedMaterialId !== matId) {
      // Сохраняем слой только при переходе со шпаклёвки (putty) на краску (paint),
      // чтобы красить поверх заглаженной шпаклёвки. В остальных случаях очищаем стену,
      // чтобы не искажать среднюю толщину avgWftMicrons и оптику нового состава.
      const isPuttyToPaint = selectedMaterialId === "putty" && matId === "paint";
      if (!isPuttyToPaint) {
        let hasPaintOnWall = false;
        const grid = wftBufferRef.current;
        for (let i = 0; i < TOTAL_SIM_CELLS; i += 32) {
          if (grid[i] > 10) {
            hasPaintOnWall = true;
            break;
          }
        }
        if (hasPaintOnWall || telemetry.coveredAreaM2 > 0) {
          handleResetWall();
        }
      }
    }

    setSelectedMaterialId(matId);
    const mat = MATERIALS[matId];
    setSelectedTipCode(mat.recommendedTip);
    setTargetPressureBar(Math.min(machine.maxPressureBar, Math.max(190, mat.minPressureBar + 22)));
    setIsNozzleClogged(false);
    clogTimerRef.current = 0;
    if (matId !== "putty" && toolMode === "spatula") {
      setToolMode("gun");
    }
  };

  // Звук
  useEffect(() => {
    const audio = audioEngineRef.current;
    if (!audio) return;
    audio.isMuted = isAudioMuted;

    if (isTriggerPressed && toolMode === "gun") {
      audio.startSpray(
        hydroPhysics.workingPressureBar,
        hydroPhysics.actualFlowLpm,
        hydroPhysics.isCrashTestActive || hydroPhysics.isUnderAtomized,
        valveMode === "prime"
      );
    } else {
      audio.stopSpray();
    }
  }, [isTriggerPressed, toolMode, hydroPhysics, valveMode, isAudioMuted]);

  // ============================================================================
  // 4. ГЛАВНЫЙ ЦИКЛ РЕНДЕРА И ФИЗИКИ (60 FPS С ТОЧНОЙ ТЕЛЕМЕТРИЕЙ И 2.5D ПИСТОЛЕТОМ)
  // ============================================================================
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let telemetryAccumulator = 0;

    const renderLoop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      telemetryAccumulator += dt;

      const paintCanvas = paintCanvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      if (!paintCanvas || !overlayCanvas) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      const oCtx = overlayCanvas.getContext("2d");
      if (!oCtx) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      const width = paintCanvas.width;
      const height = paintCanvas.height;
      const dpr = overlayCanvas.width / Math.max(1, width);
      oCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1. ЧЕСТНАЯ ИНЕРЦИЯ РУКИ МАЛЯРА СО ШЛАНГОМ ВД (БЕЗ «ЖЕСТКОЙ СТЕНЫ» И БЕЗ ЧИТЕРСКИХ ТЕЛЕПОРТОВ)
      const ptr = pointerRef.current;
      const cmPerPx = (WALL_WIDTH_M * 100) / Math.max(1, width);

      const toTargetX = ptr.targetX - ptr.x;
      const toTargetY = ptr.targetY - ptr.y;
      const distToTargetPx = Math.hypot(toTargetX, toTargetY);

      if (isTriggerPressed && toolMode === "gun" && valveMode === "spray") {
        // До 85 см/с рука идет 1:1 за мышкой, а при резком рывке включается мягкое гидравлическое сопротивление шланга (до 165 см/с)
        const desiredSpeedCmS = (distToTargetPx * cmPerPx) / Math.max(0.001, dt);
        const effectiveSpeedCmS = desiredSpeedCmS <= 85.0
          ? desiredSpeedCmS
          : Math.min(165.0, 85.0 + Math.sqrt(desiredSpeedCmS - 85.0) * 4.5);
        const maxStepPx = (effectiveSpeedCmS / cmPerPx) * dt;

        if (distToTargetPx > maxStepPx && distToTargetPx > 0.1) {
          ptr.x += (toTargetX / distToTargetPx) * maxStepPx;
          ptr.y += (toTargetY / distToTargetPx) * maxStepPx;
        } else {
          ptr.x = ptr.targetX;
          ptr.y = ptr.targetY;
        }
      } else {
        ptr.x += toTargetX * 0.72;
        ptr.y += toTargetY * 0.72;
      }

      // ВАЖНО: Вычисляем пройденный путь ДО того, как перезапишем ptr.prevX в конце кадра!
      const dxPx = ptr.x - ptr.prevX;
      const dyPx = ptr.y - ptr.prevY;
      const distPx = Math.hypot(dxPx, dyPx);
      const rawSpeedCmPerSec = (distPx * cmPerPx) / Math.max(0.001, dt);
      const prevSmoothSpeed = (ptr as any).smoothSpeed || 0;
      const speedCmPerSec = rawSpeedCmPerSec > 0.5
        ? prevSmoothSpeed * 0.65 + rawSpeedCmPerSec * 0.35
        : prevSmoothSpeed * 0.82;
      (ptr as any).smoothSpeed = speedCmPerSec;

      const currentMatCode = MATERIAL_CODE_MAP[material.id] || 1;
      const currentMatCfg = MAT_PBR_CONFIGS[currentMatCode] || MAT_PBR_CONFIGS[1];
      const [mr, mg, mb] = currentMatCfg.rgb;
      const fanRadiusY = Math.max(22, ((hydroPhysics.fanWidthCm / 100) / WALL_HEIGHT_M) * height * 0.95);
      const fanRadiusX = Math.max(8, fanRadiusY * 0.28);
      const angleRad = (gunAngleDeg * Math.PI) / 180;

      // ======================================================================
      // А. ДЕТЕКЦИЯ ЗАСОРА И НАКОПЛЕНИЕ СЛОЯ WFT (БЕЗ ПРОЗРАЧНЫХ ОВАЛОВ)
      // ======================================================================
      const isMismatched =
        (selectedMaterialId === "putty" || selectedMaterialId === "fireproof") &&
        (selectedTipCode === "211" || selectedTipCode === "517");

      if (isTriggerPressed && isMismatched && !isNozzleClogged && !isPurging) {
        clogTimerRef.current += dt;
        if (clogTimerRef.current >= 1.5) {
          setIsNozzleClogged(true);
          audioEngineRef.current?.playClogSound();
        }
      } else if (!isTriggerPressed && !isNozzleClogged) {
        clogTimerRef.current = Math.max(0, clogTimerRef.current - dt * 0.5);
      }



      // 1. ИНТЕРАКТИВНАЯ ДУЭЛЬ: ВАЛИК (БОТ) VS NORD (ПОЛЬЗОВАТЕЛЬ КРАСИТ САМ)
      let duelRollerX = width * 0.22;
      let duelRollerY = height * 0.35;

      if (duelRef.current.active) {
        // Старт гонки: как только пользователь зажимает курок на правой половине
        if (duelRef.current.state === "ready") {
          if (isTriggerPressed && ptr.x >= width * 0.48) {
            duelRef.current.state = "racing";
            duelRef.current.startTime = performance.now();
            setDuelState("racing");
          }
        }

        // Ход гонки: бот с валиком катает левую стену (0.15 м²/мин)
        if (duelRef.current.state === "racing" && !duelRef.current.finished) {
          duelRef.current.elapsed += dt;

          const laneX = width * (0.07 + (duelRef.current.botLane % 4) * 0.10);

          if (duelRef.current.botDipping) {
            // Бот макает валик в ванночку (пауза 1.8 сек)
            duelRollerX = width * 0.12;
            duelRollerY = height * 0.86;
            duelRef.current.botDipTimer += dt;
            if (duelRef.current.botDipTimer >= 1.8) {
              duelRef.current.botDipping = false;
              duelRef.current.botLane = (duelRef.current.botLane + 1) % 4;
              duelRef.current.botY = 40;
              duelRef.current.botDirection = 1;
              setDuelBotDipping(false);
            }
          } else {
            duelRollerX = laneX;
            duelRef.current.botY += duelRef.current.botDirection * 92 * dt;
            duelRollerY = duelRef.current.botY;

            // Нанесение валиком на левой половине (с микро-проплешинами и ребрами)
            const rollerC = (duelRollerX / width) * SIM_W;
            const rollerR = (duelRollerY / height) * SIM_H;
            const rMin = Math.max(0, Math.floor(rollerR - 4));
            const rMax = Math.min(SIM_H - 1, Math.ceil(rollerR + 4));
            const cMin = Math.max(0, Math.floor(rollerC - 9));
            const cMax = Math.min(Math.floor(SIM_W * 0.48), Math.ceil(rollerC + 9));
            const wftBuf = wftBufferRef.current;
            const wetBuf = wetnessBufferRef.current;
            const texBuf = microTextureBufferRef.current;

            for (let r = rMin; r <= rMax; r++) {
              const rOff = r * SIM_W;
              for (let c = cMin; c <= cMax; c++) {
                const idx = rOff + c;
                const rib = (c === cMin || c === cMax) ? 8 : 0;
                const stipple = ((c * 17 + r * 31) % 7 === 0) ? 2 : 14 + rib;
                wftBuf[idx] = Math.min(85, wftBuf[idx] + stipple * dt * 4.5);
                wetBuf[idx] = 0.95;
                texBuf[idx] = 0.45;
                materialIdBufferRef.current[idx] = 1; // Латексная краска для валика
              }
            }

            // Проверка смены направления и макания в ванночку
            if (duelRef.current.botY >= height * 0.82 && duelRef.current.botDirection === 1) {
              duelRef.current.botDirection = -1;
            } else if (duelRef.current.botY <= height * 0.15 && duelRef.current.botDirection === -1) {
              duelRef.current.botDipping = true;
              duelRef.current.botDipTimer = 0;
              duelRef.current.botDirection = 1;
              setDuelBotDipping(true);
            }
          }

          // Скорость валика: медленные 0.15 м²/мин (0.08 м²/сек)
          const botArea = Number(Math.min(3.6, duelRef.current.elapsed * 0.082).toFixed(2));
          duelRef.current.rollerAreaM2 = botArea;
        }
      }

      // ======================================================================
      // 2. БЕЗВОЗДУШНОЕ НАНЕСЕНИЕ (ПОЛЬЗОВАТЕЛЬ КРАСИТ САМ) + ФОТОРЕАЛИСТИЧНЫЙ PBR
      // ======================================================================
      // Отдача пистолета (225 бар): толчок назад до 6.5px + дрожь 1.6px во время распыла
      if (isTriggerPressed && toolMode === "gun" && valveMode === "spray") {
        recoilRef.current.kick = Math.min(6.5, recoilRef.current.kick + dt * 45);
      } else {
        recoilRef.current.kick = Math.max(0, recoilRef.current.kick - dt * 25);
      }
      const recoilJitter = isTriggerPressed && toolMode === "gun" && valveMode === "spray"
        ? Math.sin(now * 0.055) * 1.6 + (Math.random() - 0.5) * 0.5
        : 0;
      const pistonIntervalMs = Math.max(140, Math.min(750, 950 / Math.max(0.6, hydroPhysics.actualFlowLpm)));
      const pistonPhase = (now % pistonIntervalMs) / pistonIntervalMs;
      const pistonPulse = isTriggerPressed && toolMode === "gun" && valveMode === "spray"
        ? Math.exp(-pistonPhase * 5.5) * 2.8
        : 0;
      const totalRecoilPx = recoilRef.current.kick + recoilJitter + pistonPulse;

      // Динамический Bodycam-импульс камеры (микро-сотрясение 1.006x при срыве курка гидростанции)
      if (isTriggerPressed && !recoilRef.current.wasTriggerPressed) {
        cameraImpulseRef.current = 1.0;
      }
      recoilRef.current.wasTriggerPressed = isTriggerPressed;

      if (cameraImpulseRef.current > 0.005) {
        cameraImpulseRef.current *= Math.exp(-dt * 18);
        const kick = cameraImpulseRef.current;
        const shakeX = Math.sin(now * 0.08) * 1.6 * kick;
        const shakeY = Math.cos(now * 0.09) * 2.0 * kick;
        const scale = 1.0 + kick * 0.006;
        if (containerRef.current) {
          containerRef.current.style.transform = `scale(${scale.toFixed(4)}) translate(${shakeX.toFixed(1)}px, ${shakeY.toFixed(1)}px)`;
        }
      } else if (containerRef.current && containerRef.current.style.transform !== "") {
        containerRef.current.style.transform = "";
      }

      if (isTriggerPressed && toolMode === "gun" && valveMode === "spray") {
        statsRef.current.activeSprayTimeSec += dt;
        statsRef.current.litersConsumed += (hydroPhysics.actualFlowLpm / 60) * dt;

        const prevNormX = ptr.prevX / width;
        const prevNormY = ptr.prevY / height;
        const curNormX = ptr.x / width;
        const curNormY = ptr.y / height;
        const dist = Math.hypot(curNormX - prevNormX, curNormY - prevNormY);

        const steps = Math.max(1, Math.min(40, Math.ceil(dist * 120)));
        const stepDt = dt / steps; // Точная доля времени кадра на каждый подшаг!

        const fanHeightMeters = hydroPhysics.fanWidthCm / 100;
        const minAllowedNormX = isDuelActive ? 0.50 : 0.0;

        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const normX = prevNormX + (curNormX - prevNormX) * t;
          const normY = prevNormY + (curNormY - prevNormY) * t;
          applyRealisticSpray(
            normX,
            normY,
            stepDt,
            fanHeightMeters,
            hydroPhysics.actualFlowLpm,
            hydroPhysics.workingPressureBar,
            material.minPressureBar,
            material.targetWftMicrons,
            hydroPhysics.oversprayLossPercent,
            isNozzleClogged,
            SIM_W,
            SIM_H,
            wftBufferRef.current,
            wetnessBufferRef.current,
            microTextureBufferRef.current,
            materialIdBufferRef.current,
            currentMatCode,
            minAllowedNormX,
            machine.maxFlowLpm
          );
        }

        // Капли оверспрея на пол строительной площадки
        if (!isNozzleClogged && Math.random() < 0.26 && floorSplashesRef.current.length < 90) {
          const splashX = ptr.x + (Math.random() - 0.5) * (fanRadiusX * 2.8);
          const splashY = height - 26 + Math.random() * 22;
          floorSplashesRef.current.push({
            x: splashX,
            y: splashY,
            r: 1.2 + Math.random() * 2.6,
            color: `rgba(${mr}, ${mg}, ${mb}, ${0.45 + Math.random() * 0.35})`,
          });
        }

        // Генерация светоотражающих стеклошариков при нанесении дорожной разметки
        if (material.textureType === "road_reflective" && glassBeadsRef.current.length < 900) {
          for (let b = 0; b < 5; b++) {
            glassBeadsRef.current.push({
              x: ptr.x + (Math.random() - 0.5) * fanRadiusX * 1.6,
              y: ptr.y + (Math.random() - 0.5) * fanRadiusY * 1.8,
              r: 1.1 + Math.random() * 1.4,
            });
          }
        }
      } else if (isTriggerPressed && toolMode === "spatula") {
        applySpatulaPass(
          ptr.x / width,
          ptr.y / height,
          SIM_W,
          SIM_H,
          wftBufferRef.current,
          wetnessBufferRef.current,
          microTextureBufferRef.current
        );
      }

      // ОБЯЗАТЕЛЬНО обновляем prevX / prevY в конце КАЖДОГО кадра renderLoop!
      ptr.prevX = ptr.x;
      ptr.prevY = ptr.y;

      // Вызываем гравитацию ТОЛЬКО когда зажат курок и рука почти стоит на месте
      applyGravitySags(
        SIM_W,
        SIM_H,
        wftBufferRef.current,
        wetnessBufferRef.current,
        microTextureBufferRef.current,
        material.sagThresholdMicrons,
        dt,
        isTriggerPressed && toolMode === "gun" && valveMode === "spray" && speedCmPerSec < 8,
        ptr.x / width,
        ptr.y / height
      );

      // Затухание мокрого слоя (подсыхание до полуматового за ~6-8 сек)
      const wetDecay = wetnessBufferRef.current;
      for (let i = 0; i < TOTAL_SIM_CELLS; i++) {
        if (wetDecay[i] > 0.02) {
          wetDecay[i] = Math.max(0.02, wetDecay[i] - dt * 0.12);
        }
      }

      // Настоящий аппаратный GPU WebGL PBR-рендер стены в Full HD
      if (!webglEngineRef.current) webglEngineRef.current = new WebGLWallEngine();
      if (webglEngineRef.current) {
        const plates = splattingImagesRef.current;
        if (!webglEngineRef.current.hasRoomPhoto && plates.base?.complete) webglEngineRef.current.uploadSplattingTexture('base', plates.base);
        if (!webglEngineRef.current.hasPaintPhoto && plates.paint?.complete) webglEngineRef.current.uploadSplattingTexture('paint', plates.paint);
        if (!webglEngineRef.current.hasPuttyPhoto && plates.putty?.complete) webglEngineRef.current.uploadSplattingTexture('putty', plates.putty);
        if (!webglEngineRef.current.hasBitumenPhoto && plates.bitumen?.complete) webglEngineRef.current.uploadSplattingTexture('bitumen', plates.bitumen);
        if (!webglEngineRef.current.hasSmoothPhoto && plates.smooth?.complete) webglEngineRef.current.uploadSplattingTexture('smooth', plates.smooth);
        if (typeof window !== "undefined") {
          (window as any).__splatInfo = {
            hasRoom: webglEngineRef.current.hasRoomPhoto,
            hasPaint: webglEngineRef.current.hasPaintPhoto,
            hasPutty: webglEngineRef.current.hasPuttyPhoto,
            hasBitumen: webglEngineRef.current.hasBitumenPhoto,
            hasSmooth: webglEngineRef.current.hasSmoothPhoto,
          };
        }
      }
      webglEngineRef.current.render(
        paintCanvas,
        wftBufferRef.current,
        wetnessBufferRef.current,
        microTextureBufferRef.current,
        materialIdBufferRef.current,
        currentMatCode,
        isRakingLightOn,
        ptr.x / width,
        ptr.y / height,
        now * 0.001,
        substrate === "concrete"
      );

      // ======================================================================
      // В. ОВЕРЛЕЙ: 3D ОКРУЖЕНИЕ, ДУЭЛЬ И 2.5D ВЕКТОРНЫЙ NORD PRO GUN
      // ======================================================================
      oCtx.clearRect(0, 0, width, height);

      if (!webglEngineRef.current?.hasRoomPhoto || substrate !== "concrete") {
        // 1. 3D СТРОИТЕЛЬНЫЙ ПОЛ СО ШВОМ И НАПЫЛОМ (FLOOR APRON)
      const floorH = 34;
      const floorY = height - floorH;
      oCtx.save();
      const floorGrad = oCtx.createLinearGradient(0, floorY, 0, height);
      floorGrad.addColorStop(0, "rgba(20, 24, 33, 0.96)");
      floorGrad.addColorStop(0.25, "rgba(28, 34, 46, 0.98)");
      floorGrad.addColorStop(1, "rgba(12, 16, 22, 1.0)");
      oCtx.fillStyle = floorGrad;
      oCtx.fillRect(0, floorY, width, floorH);

      // Деформационный шов пола (Expansion joint)
      oCtx.strokeStyle = "rgba(8, 11, 16, 0.98)";
      oCtx.lineWidth = 2.4;
      oCtx.beginPath();
      oCtx.moveTo(0, floorY + 1);
      oCtx.lineTo(width, floorY + 1);
      oCtx.stroke();

      oCtx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      oCtx.lineWidth = 1;
      oCtx.beginPath();
      oCtx.moveTo(0, floorY + 3);
      oCtx.lineTo(width, floorY + 3);
      oCtx.stroke();

      // Сигнальная разметка края зоны распыления (черно-желтая полоса на кромке пола)
      oCtx.save();
      oCtx.beginPath();
      oCtx.rect(0, height - 6, width, 6);
      oCtx.clip();
      const stripeW = 18;
      for (let sx = -height; sx < width + height; sx += stripeW * 2) {
        oCtx.fillStyle = "rgba(245, 158, 11, 0.35)";
        oCtx.beginPath();
        oCtx.moveTo(sx, height);
        oCtx.lineTo(sx + stripeW, height);
        oCtx.lineTo(sx + stripeW + 12, height - 6);
        oCtx.lineTo(sx + 12, height - 6);
        oCtx.closePath();
        oCtx.fill();
      }
      oCtx.restore();

      // Пятна оверспрея на строительном полу
      floorSplashesRef.current.forEach((sp) => {
        oCtx.fillStyle = sp.color;
        oCtx.beginPath();
        oCtx.ellipse(sp.x, sp.y, sp.r * 1.5, sp.r * 0.75, 0, 0, Math.PI * 2);
        oCtx.fill();
      });
      oCtx.restore();

      // 2. ПРОФЕССИОНАЛЬНЫЙ ПРОЖЕКТОР ЛОСЕВА НА ИНДУСТРИАЛЬНОМ ШТАТИВЕ (X = 0..38)
      oCtx.save();
      const tripodX = 22;
      const lampY = height * 0.44;

      // Ножки штатива (алюминиевый профиль)
      oCtx.strokeStyle = "#1e293b";
      oCtx.lineWidth = 3.5;
      oCtx.beginPath();
      oCtx.moveTo(tripodX, lampY + 45);
      oCtx.lineTo(6, height - 4);
      oCtx.moveTo(tripodX, lampY + 45);
      oCtx.lineTo(38, height - 4);
      oCtx.stroke();

      // Центральная телескопическая штанга
      oCtx.strokeStyle = "#334155";
      oCtx.lineWidth = 5;
      oCtx.beginPath();
      oCtx.moveTo(tripodX, lampY + 12);
      oCtx.lineTo(tripodX, lampY + 65);
      oCtx.stroke();

      // Желтые фиксирующие муфты (индустриальный стиль DeWalt/Festool/Nord)
      oCtx.fillStyle = "#f59e0b";
      oCtx.fillRect(tripodX - 4, lampY + 38, 8, 7);
      oCtx.fillRect(tripodX - 4, lampY + 62, 8, 6);

      // Радиатор охлаждения прожектора Лосева (алюминиевые ребра)
      oCtx.fillStyle = "#0f172a";
      oCtx.fillRect(tripodX - 14, lampY - 26, 12, 52);
      for (let fin = -22; fin <= 22; fin += 4) {
        oCtx.fillStyle = "#334155";
        oCtx.fillRect(tripodX - 16, lampY + fin, 3, 2);
      }

      // Корпус и линза лампы
      const lampActive = isRakingLightOn;
      oCtx.fillStyle = lampActive ? "#f8fafc" : "#1e293b";
      oCtx.strokeStyle = lampActive ? "#38bdf8" : "#475569";
      oCtx.lineWidth = 1.5;
      oCtx.beginPath();
      oCtx.roundRect(tripodX - 2, lampY - 24, 10, 48, 2);
      oCtx.fill();
      oCtx.stroke();

      // LED-матрица (4 сегмента COB)
      for (let led = -18; led <= 18; led += 11) {
        oCtx.fillStyle = lampActive ? "#ffffff" : "#475569";
        oCtx.shadowColor = lampActive ? "#38bdf8" : "transparent";
        oCtx.shadowBlur = lampActive ? 12 : 0;
        oCtx.beginPath();
        oCtx.arc(tripodX + 3, lampY + led, 2.5, 0, Math.PI * 2);
        oCtx.fill();
      }
      oCtx.shadowBlur = 0;

      // ОБЪЕМНЫЕ КОСЫЕ ЛУЧИ СВЕТА (GOD RAYS) И ПАРИЩИЕ ПЫЛИНКИ В ЛУЧЕ
      if (lampActive) {
        const rayGrad = oCtx.createRadialGradient(tripodX + 6, lampY, 10, tripodX + 6, lampY, width * 0.95);
        rayGrad.addColorStop(0, "rgba(255, 255, 250, 0.16)");
        rayGrad.addColorStop(0.35, "rgba(224, 242, 254, 0.07)");
        rayGrad.addColorStop(0.8, "rgba(186, 230, 253, 0.02)");
        rayGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        oCtx.fillStyle = rayGrad;
        oCtx.beginPath();
        oCtx.moveTo(tripodX + 6, lampY - 22);
        oCtx.lineTo(width, 0);
        oCtx.lineTo(width, height - 36);
        oCtx.lineTo(tripodX + 6, lampY + 22);
        oCtx.closePath();
        oCtx.fill();

        // Парящие частицы пыли в луче прожектора Лосева
        for (let d = 0; d < 18; d++) {
          const dustPhase = ((now * 0.0003 + d * 0.055) % 1.0);
          const dx = (tripodX + 25) + dustPhase * (width * 0.75);
          const dy = lampY + (Math.sin(now * 0.0012 + d * 1.7) * (30 + dustPhase * 110));
          const dAlpha = Math.sin(dustPhase * Math.PI) * 0.45;
          oCtx.fillStyle = `rgba(255, 255, 255, ${dAlpha})`;
          oCtx.beginPath();
          oCtx.arc(dx, dy, 0.8 + (d % 3) * 0.4, 0, Math.PI * 2);
          oCtx.fill();
        }
      }
      oCtx.restore();


      }
      // ОТРИСОВКА ЛАЗЕРНОГО НИВЕЛИРА 1x1 М (ЗЕЛЕНЫЙ / КРАСНЫЙ ЛУЧ)
      if (laserMode !== "off") {
        oCtx.save();
        const laserColor = laserMode === "green" ? "#10b981" : "#ef4444";
        const laserGlow = laserMode === "green" ? "rgba(16, 185, 129, 0.65)" : "rgba(239, 68, 68, 0.65)";
        oCtx.strokeStyle = laserColor;
        oCtx.lineWidth = 1.2;
        oCtx.shadowColor = laserGlow;
        oCtx.shadowBlur = 8;

        // Шаг сетки 1.0 метр (при стене 3.0 x 1.8 м)
        for (let xm = 1; xm < WALL_WIDTH_M; xm++) {
          const lx = (xm / WALL_WIDTH_M) * width;
          oCtx.beginPath();
          oCtx.moveTo(lx, 0);
          oCtx.lineTo(lx, height);
          oCtx.stroke();
          oCtx.fillStyle = laserColor;
          oCtx.font = "800 9.5px 'Manrope', -apple-system, sans-serif";
          oCtx.fillText(`${xm}.0 м`, lx + 5, 16);
        }

        const ly = (1.0 / WALL_HEIGHT_M) * height;
        oCtx.beginPath();
        oCtx.moveTo(0, ly);
        oCtx.lineTo(width, ly);
        oCtx.stroke();
        oCtx.fillStyle = laserColor;
        oCtx.font = "800 9.5px 'Manrope', -apple-system, sans-serif";
        oCtx.fillText("1.0 м", 8, ly - 5);
        oCtx.restore();
      }

      if (isDuelActive) {
        // РАЗДЕЛИТЕЛЬНАЯ ЛАЗЕРНАЯ ЛИНИЯ ДУЭЛИ
        const midX = width * 0.5;
        oCtx.save();
        oCtx.strokeStyle = "#38bdf8";
        oCtx.lineWidth = 2.5;
        oCtx.shadowColor = "#0284c7";
        oCtx.shadowBlur = 10;
        oCtx.setLineDash([8, 6]);
        oCtx.beginPath();
        oCtx.moveTo(midX, 0);
        oCtx.lineTo(midX, height);
        oCtx.stroke();
        oCtx.setLineDash([]);
        oCtx.restore();

        // ШИЛЬДИКИ НАД СЕКТОРАМИ
        oCtx.save();
        oCtx.font = "800 11px sans-serif";
        oCtx.textAlign = "center";

        // Левый сектор (Бот)
        oCtx.fillStyle = "rgba(15, 23, 42, 0.90)";
        oCtx.beginPath();
        oCtx.roundRect(width * 0.04, 12, width * 0.42, 28, 6);
        oCtx.fill();
        oCtx.strokeStyle = duelBotDipping ? "#f59e0b" : "#ef4444";
        oCtx.lineWidth = 1;
        oCtx.stroke();
        oCtx.fillStyle = duelBotDipping ? "#fde68a" : "#fca5a5";
        const botPct = Math.min(100, Math.round((duelRef.current.rollerAreaM2 / 2.7) * 100));
        const botStatus = duelBotDipping
          ? "⏸️ Макает валик в ванночку (2 сек)..."
          : "12 м²/ч · 180 ₽/м²";
        oCtx.fillText(`🪣 ВАЛИК (БОТ): ${duelRef.current.rollerAreaM2} м² (${botPct}%) · ${botStatus}`, width * 0.25, 30);

        // Правый сектор (Пользователь)
        oCtx.fillStyle = "rgba(15, 23, 42, 0.90)";
        oCtx.beginPath();
        oCtx.roundRect(width * 0.54, 12, width * 0.42, 28, 6);
        oCtx.fill();
        oCtx.strokeStyle = "#10b981";
        oCtx.lineWidth = 1;
        oCtx.stroke();
        oCtx.fillStyle = "#6ee7b7";
        const nordPct = Math.min(100, Math.round(duelRef.current.userProgress * 100));
        oCtx.fillText(`⚡ ВАШ NORD: ${duelRef.current.nordAreaM2} м² (${nordPct}%) · 120 м²/ч · 25 ₽/м²`, width * 0.75, 30);
        oCtx.restore();

        // Отрисовка валика бота слева
        drawPaintRoller(oCtx, duelRollerX, duelRollerY, material.rgb);

        // Ванночка для краски внизу слева
        oCtx.save();
        oCtx.fillStyle = "#1e293b";
        oCtx.strokeStyle = "#475569";
        oCtx.lineWidth = 1.5;
        oCtx.beginPath();
        oCtx.roundRect(width * 0.05, height * 0.85, 75, 26, 4);
        oCtx.fill();
        oCtx.stroke();
        oCtx.fillStyle = material.colorHex;
        oCtx.beginPath();
        oCtx.roundRect(width * 0.05 + 5, height * 0.85 + 4, 65, 18, 2);
        oCtx.fill();
        oCtx.font = "700 8.5px sans-serif";
        oCtx.fillStyle = "#94a3b8";
        oCtx.fillText("Ванночка", width * 0.05 + 16, height * 0.85 + 38);
        oCtx.restore();

        // Отрисовка NORD Pro Gun пользователя справа (управляется пользователем!)
        const isUserSpraying = isTriggerPressed && ptr.x >= width * 0.48;
        const duelTipX = ptr.x + 25 + totalRecoilPx;
        const duelTipY = ptr.y - totalRecoilPx * 0.4;
        if (isUserSpraying && !duelFinished) {
          oCtx.save();
          const coneGrad = oCtx.createLinearGradient(duelTipX, duelTipY, ptr.x - 25, ptr.y);
          coneGrad.addColorStop(0, `rgba(${mr}, ${mg}, ${mb}, 0.85)`);
          coneGrad.addColorStop(1, `rgba(${mr}, ${mg}, ${mb}, 0.08)`);
          oCtx.fillStyle = coneGrad;
          oCtx.beginPath();
          oCtx.moveTo(duelTipX, duelTipY);
          oCtx.lineTo(ptr.x - 20, ptr.y - 45);
          oCtx.lineTo(ptr.x - 20, ptr.y + 45);
          oCtx.closePath();
          oCtx.fill();
          oCtx.restore();
        }
        drawNordProGun(
          oCtx,
          ptr.x + totalRecoilPx,
          ptr.y - totalRecoilPx * 0.4,
          distanceCm,
          isUserSpraying,
          isNozzleClogged,
          tipRotationDeg,
          selectedTipCode,
          valveMode === "prime"
        );
      } else {
        // ОБЫЧНЫЙ РЕЖИМ СВОБОДНОГО РАСПЫЛЕНИЯ
        // 0. СТРОИТЕЛЬНАЯ ЛОКАЦИЯ И МАСШТАБНЫЕ ЯКОРЯ (ПОЛ, ПОТОЛОК 2.8м, ПРОЁМ 2.05м, ВЕДРО 30Л, ВАЛИК 25см)
        drawRoomEnvironmentAndScaleAnchors(oCtx, width, height, substrate, hasExtensionPole, now);
        if (material.textureType === "road_reflective" && glassBeadsRef.current.length > 0) {
          glassBeadsRef.current.forEach((bead) => {
            const distToLight = Math.hypot(bead.x - ptr.x, bead.y - ptr.y);
            if (distToLight < 220) {
              const sparkleAlpha = Math.max(0.1, (1 - distToLight / 220) * 0.95);
              oCtx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
              oCtx.beginPath();
              oCtx.arc(bead.x, bead.y, bead.r, 0, Math.PI * 2);
              oCtx.fill();
            }
          });
        }

        // Расчёт кинематики tipX, tipY ВСЕГДА (и для gun, и для spatula):
        const distRatio = Math.max(0, Math.min(1, (distanceCm - 15) / 35));
        let tipX: number;
        let tipY: number;

          if (cameraViewMode === "bodycam") {
            const idleSwayX = Math.sin(now * 0.0018) * 2.5;
            const idleSwayY = Math.cos(now * 0.0014) * 2.0;
            const gripTargetX = width * 0.88 + (ptr.x - width * 0.5) * 0.08 + idleSwayX;
            const gripTargetY = height * 0.98 + (ptr.y - height * 0.5) * 0.05 + idleSwayY;
            const aimDx = ptr.x - gripTargetX;
            const aimDy = ptr.y - gripTargetY;
            const aimDist = Math.hypot(aimDx, aimDy) || 1;
            const aimDirX = aimDx / aimDist;
            const aimDirY = aimDy / aimDist;
            const recoilPx = isTriggerPressed ? 6.8 + Math.sin(now * 0.08) * 1.6 : 0;
            const gripDrawX = gripTargetX - aimDirX * recoilPx;
            const gripDrawY = gripTargetY - aimDirY * recoilPx;
            const distScale = Math.max(0.68, Math.min(1.02, 1.02 - (distanceCm - 15) / 80));
            const theta = Math.atan2(aimDy, aimDx);
            const relX = -234;
            const relY = -232;
            const alpha0 = -2.36082;
            const deltaTheta = theta - alpha0;
            const rotRelX = (relX * Math.cos(deltaTheta) - relY * Math.sin(deltaTheta)) * distScale;
            const rotRelY = (relX * Math.sin(deltaTheta) + relY * Math.cos(deltaTheta)) * distScale;
            let activeTipX = gripDrawX + rotRelX;
            let activeTipY = gripDrawY + rotRelY;
            if (hasExtensionPole) {
              activeTipX += aimDirX * 125;
              activeTipY += aimDirY * 125;
            }
            tipX = activeTipX;
            tipY = activeTipY;
          } else {
            const floorY = width < 580 ? height - 54 : height - 24;
            const ceilingY = 20;
            const wallHeightPx = Math.max(160, floorY - ceilingY);
            const ppm = wallHeightPx / 2.80;
            const baseMasterH = Math.round(1.78 * ppm);
            const pDrawable = painterImgRef.current;
            const srcW = pDrawable instanceof HTMLCanvasElement ? pDrawable.width : (pDrawable?.naturalWidth || 1024);
            const srcH = pDrawable instanceof HTMLCanvasElement ? pDrawable.height : (pDrawable?.naturalHeight || 576);
            const masterW = Math.round(baseMasterH * (srcW / srcH));

            const aimNormY = Math.max(0, Math.min(1, (ptr.y - ceilingY) / Math.max(1, wallHeightPx)));
            const crouchCompress = aimNormY > 0.48 ? (aimNormY - 0.48) * 0.42 : 0;
            const activeMasterH = Math.round(baseMasterH * (1.0 - crouchCompress));

            const nozzleRelX = 0.220;
            const nozzleRelY = 0.278;
            const waistRelX = 0.580;
            const waistRelY = 0.500;

            const poleOffsetPx = hasExtensionPole ? 55 : 0;
            const desiredMasterX = ptr.x + poleOffsetPx - masterW * nozzleRelX;
            const masterX = Math.max(20, Math.min(width - masterW * 0.68, desiredMasterX));
            const walkBobY = Math.abs(Math.sin(masterX * 0.045)) * 4.0;
            const masterY = floorY - activeMasterH + 10 + walkBobY;

            const waistX = masterX + masterW * waistRelX;
            const waistY = masterY + activeMasterH * waistRelY;
            const unrotatedNozzleX = masterX + masterW * nozzleRelX - poleOffsetPx;
            const unrotatedNozzleY = masterY + activeMasterH * nozzleRelY;
            const spanFromWaistX = Math.max(70, waistX - unrotatedNozzleX);

            const dyFromNeutral = unrotatedNozzleY - ptr.y;
            const torsoArmAngleRad = Math.max(-0.42, Math.min(0.45, Math.atan2(dyFromNeutral, spanFromWaistX)));
            const recoilKickPx = isTriggerPressed ? 4.2 + Math.sin(now * 0.09) * 1.4 : 0;

            const dxN = unrotatedNozzleX - waistX;
            const dyN = unrotatedNozzleY - waistY;

            tipX = waistX + recoilKickPx + dxN * Math.cos(torsoArmAngleRad) - dyN * Math.sin(torsoArmAngleRad);
            tipY = waistY + dxN * Math.sin(torsoArmAngleRad) + dyN * Math.cos(torsoArmAngleRad);
          }

          // Если выбран пистолет — отрисовываем лазерный прицел и струю
          if (toolMode === "gun") {
            // 1. АКТИВНЫЙ ЛАЗЕРНЫЙ ИНДИКАТОР ЗОНЫ ВПРЫСКА (ЯРКО-СИНИЙ -> ЗЕЛЕНЫЙ ПО МЕРЕ ПРОКРАСКИ ОБЛАСТИ!)
          // Считываем реальную набранную толщину микрон прямо в текущей области под факелом:
          const simCX = Math.max(2, Math.min(SIM_W - 3, Math.floor((ptr.x / width) * SIM_W)));
          const simCY = Math.max(2, Math.min(SIM_H - 3, Math.floor((ptr.y / height) * SIM_H)));
          const wBuf = wftBufferRef.current;
          const cIdx = simCY * SIM_W + simCX;
          const localWft = (
            wBuf[cIdx] * 2.0 +
            wBuf[cIdx - 2] +
            wBuf[cIdx + 2] +
            wBuf[cIdx - SIM_W * 2] +
            wBuf[cIdx + SIM_W * 2]
          ) / 6.0;

          const fillProgress = Math.min(1.0, localWft / Math.max(30, material.targetWftMicrons * 0.85));
          const isAreaPainted = fillProgress >= 0.96; // Область под факелом полностью прокрашена до нормы!
          const isAreaOverfilled = localWft > material.sagThresholdMicrons;
          const isDanger = hydroPhysics.isCrashTestActive || hydroPhysics.isUnderAtomized || isNozzleClogged || isAreaOverfilled;

          // Выбираем яркий, идеально заметный на белой стене цвет активного кольца:
          // ЯРКО-СИНИЙ (#00d8ff) когда идет спрыск по непрокрашенному -> ЯРКО-ЗЕЛЕНЫЙ (#10b981) как только область покрасилась!
          const activeRingColor = isDanger
            ? "#ef4444"
            : isAreaPainted
            ? "#10b981"
            : "#00d8ff";

          const activeGlowColor = isDanger
            ? "rgba(239, 68, 68, 0.35)"
            : isAreaPainted
            ? "rgba(16, 185, 129, 0.32)"
            : "rgba(0, 216, 255, 0.32)";

          oCtx.save();
          oCtx.translate(ptr.x, ptr.y);
          oCtx.rotate(angleRad);

          // А. Внутренняя полупрозрачная подсветка пятна контакта (чтобы кружок спрыска было четко видно на любом фоне!)
          const spotGrad = oCtx.createRadialGradient(0, 0, 2, 0, 0, Math.max(fanRadiusX, fanRadiusY));
          spotGrad.addColorStop(0, activeGlowColor);
          spotGrad.addColorStop(0.75, isAreaPainted ? "rgba(16, 185, 129, 0.14)" : "rgba(0, 180, 255, 0.14)");
          spotGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          oCtx.fillStyle = spotGrad;
          oCtx.beginPath();
          oCtx.ellipse(0, 0, fanRadiusX, fanRadiusY, 0, 0, Math.PI * 2);
          oCtx.fill();

          // Б. Темная контрастная подложка-контур (гарантирует 100% видимость поверх ярко-белой краски и шпаклевки!)
          oCtx.strokeStyle = "rgba(6, 12, 24, 0.85)";
          oCtx.lineWidth = 4.2;
          oCtx.beginPath();
          oCtx.ellipse(0, 0, fanRadiusX, fanRadiusY, 0, 0, Math.PI * 2);
          oCtx.stroke();

          // В. Фоновое кольцо (ярко-синее на старте)
          oCtx.strokeStyle = isAreaPainted ? "#10b981" : "rgba(0, 216, 255, 0.88)";
          oCtx.lineWidth = 2.4;
          oCtx.setLineDash(isTriggerPressed || isAreaPainted ? [] : [6, 4]);
          oCtx.beginPath();
          oCtx.ellipse(0, 0, fanRadiusX, fanRadiusY, 0, 0, Math.PI * 2);
          oCtx.stroke();
          oCtx.setLineDash([]);

          // Г. Динамическая зеленая дуга прогресса прокраски (заполняет синий овал зеленым по мере набора микрон!)
          if (fillProgress > 0.05 && !isDanger) {
            oCtx.strokeStyle = "#10b981";
            oCtx.lineWidth = 3.0;
            oCtx.beginPath();
            oCtx.ellipse(0, 0, fanRadiusX, fanRadiusY, 0, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * fillProgress);
            oCtx.stroke();
          }

          // Д. Центральное перекрестие с контрастной обводкой
          oCtx.strokeStyle = "rgba(6, 12, 24, 0.9)";
          oCtx.lineWidth = 3;
          oCtx.beginPath();
          oCtx.moveTo(-7, 0); oCtx.lineTo(7, 0);
          oCtx.moveTo(0, -7); oCtx.lineTo(0, 7);
          oCtx.stroke();

          oCtx.strokeStyle = activeRingColor;
          oCtx.lineWidth = 1.6;
          oCtx.beginPath();
          oCtx.moveTo(-7, 0); oCtx.lineTo(7, 0);
          oCtx.moveTo(0, -7); oCtx.lineTo(0, 7);
          oCtx.stroke();

          // Е. Контрастная плашка статуса прямо у факела (Синяя «СПРЫСК...» -> Зеленая «✓ ГОТОВО 100%»)
          const badgeW = 148, badgeH = 30;
          const badgeX = fanRadiusX + 10, badgeY = -fanRadiusY - 4;
          oCtx.fillStyle = "rgba(6, 12, 24, 0.90)";
          oCtx.strokeStyle = activeRingColor;
          oCtx.lineWidth = 1.4;
          oCtx.beginPath();
          oCtx.roundRect(badgeX, badgeY, badgeW, badgeH, 5);
          oCtx.fill();
          oCtx.stroke();

          oCtx.fillStyle = activeRingColor;
          oCtx.font = "800 9.5px 'Manrope', -apple-system, sans-serif";
          const statusTitle = isAreaOverfilled
            ? `⚠️ ПЕРЕЛИВ: ${Math.round(localWft)} мкм`
            : isAreaPainted
            ? `✓ ОКРАШЕНО: ${Math.round(localWft)} мкм`
            : `● ВПРЫСК: ${Math.round(fillProgress * 100)}% (${Math.round(localWft)} мкм)`;
          oCtx.fillText(statusTitle, badgeX + 7, badgeY + 12);

          oCtx.fillStyle = "#cbd5e1";
          oCtx.font = "700 8.5px 'Manrope', -apple-system, sans-serif";
          oCtx.fillText(`Факел ${hydroPhysics.fanWidthCm}см · Сопло ${selectedTipCode}`, badgeX + 7, badgeY + 24);
          oCtx.restore();

          // 3. 3D-КОНУС, СВЕРХЗВУКОВОЙ ЛИКВИД-ДЖЕТ И КИНЕМАТОГРАФИЧНЫЙ УДАР В СТЕНУ
          if (isTriggerPressed && valveMode === "spray") {
            oCtx.save();
            if (isNozzleClogged) {
              oCtx.strokeStyle = "rgba(244, 63, 94, 0.85)";
              oCtx.lineWidth = 3.5;
              oCtx.beginPath();
              oCtx.moveTo(tipX, tipY);
              oCtx.quadraticCurveTo(ptr.x + 30, ptr.y - 15, ptr.x, ptr.y);
              oCtx.stroke();

              for (let b = 0; b < 6; b++) {
                const bx = ptr.x + Math.sin(now * 0.02 + b) * 16;
                const by = ptr.y + Math.cos(now * 0.03 + b) * 14;
                oCtx.fillStyle = "rgba(244, 63, 94, 0.9)";
                oCtx.beginPath();
                oCtx.arc(bx, by, 3 + Math.random() * 3, 0, Math.PI * 2);
                oCtx.fill();
              }
            } else {
              // 1. СВЕРХЗВУКОВОЙ ЛИКВИД-ДЖЕТ (CORE JET): плотная нераспадающаяся жидкостная струя 42px от сопла
              const jetDx = ptr.x - tipX;
              const jetDy = ptr.y - tipY;
              const jetLen = Math.hypot(jetDx, jetDy);
              if (jetLen > 10) {
                const coreLen = Math.min(42, jetLen * 0.38);
                const coreEndX = tipX + (jetDx / jetLen) * coreLen;
                const coreEndY = tipY + (jetDy / jetLen) * coreLen;

                const coreGrad = oCtx.createLinearGradient(tipX, tipY, coreEndX, coreEndY);
                coreGrad.addColorStop(0, `rgba(${mr}, ${mg}, ${mb}, 1.0)`);
                coreGrad.addColorStop(0.7, `rgba(${mr}, ${mg}, ${mb}, 0.95)`);
                coreGrad.addColorStop(1, `rgba(${mr}, ${mg}, ${mb}, 0.45)`);

                oCtx.strokeStyle = coreGrad;
                oCtx.lineWidth = 3.2;
                oCtx.beginPath();
                oCtx.moveTo(tipX, tipY);
                oCtx.lineTo(coreEndX, coreEndY);
                oCtx.stroke();

                // Светящийся микро-ореол вокруг сопла от колоссального давления 150-250 бар
                oCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
                oCtx.beginPath();
                oCtx.arc(tipX, tipY, 2.2, 0, Math.PI * 2);
                oCtx.fill();
              }

              // 2. 24 ВЫСОКОСКОРОСТНЫЕ СТРУНЫ-ФИЛАМЕНТЫ (HIGH-VELOCITY FILAMENTS)
              for (let f = 0; f < 24; f++) {
                const fNorm = (f / 23) * 2 - 1; // -1 .. 1
                const targetY = ptr.y + fNorm * fanRadiusY * (0.88 + Math.sin(now * 0.03 + f) * 0.06);
                const fPhase = ((now * 0.0055 + f * 0.041) % 1.0);
                const fx = tipX + (ptr.x - tipX) * fPhase;
                const fy = tipY + (targetY - tipY) * fPhase;

                // Тонкая нить струны
                oCtx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${(1 - Math.abs(fNorm) * 0.5) * 0.18})`;
                oCtx.lineWidth = 0.8;
                oCtx.beginPath();
                oCtx.moveTo(tipX, tipY);
                oCtx.lineTo(ptr.x, targetY);
                oCtx.stroke();

                // Летящая микро-капля вдоль филамента
                const dropAlpha = (1.0 - fPhase * 0.6) * 0.85;
                oCtx.fillStyle = `rgba(255, 255, 255, ${dropAlpha})`;
                oCtx.beginPath();
                oCtx.arc(fx, fy, 0.9 + Math.sin(f * 1.7) * 0.5, 0, Math.PI * 2);
                oCtx.fill();
              }

              // 3. ОСНОВНОЙ ГАЗО-АЭРОЗОЛЬНЫЙ ФАКЕЛ (ЭЛЛИПТИЧЕСКАЯ ОБЛАСТЬ)
              const coneGrad = oCtx.createLinearGradient(tipX, tipY, ptr.x, ptr.y);
              coneGrad.addColorStop(0, `rgba(${mr}, ${mg}, ${mb}, 0.88)`);
              coneGrad.addColorStop(0.3, `rgba(${mr}, ${mg}, ${mb}, 0.45)`);
              coneGrad.addColorStop(1, `rgba(${mr}, ${mg}, ${mb}, 0.08)`);
              oCtx.fillStyle = coneGrad;
              oCtx.beginPath();
              oCtx.moveTo(tipX, tipY);
              oCtx.lineTo(ptr.x, ptr.y - fanRadiusY);
              oCtx.lineTo(ptr.x, ptr.y + fanRadiusY);
              oCtx.closePath();
              oCtx.fill();

              // 4. ДИНАМИЧЕСКОЕ КОЛЬЦО УДАРА В СТЕНУ (IMPACT SPLASH RING)
              const splashPulse = 1.0 + Math.sin(now * 0.035) * 0.08;
              oCtx.strokeStyle = "rgba(255, 255, 255, 0.72)";
              oCtx.lineWidth = 1.6;
              oCtx.beginPath();
              oCtx.ellipse(ptr.x, ptr.y, fanRadiusX * 0.72 * splashPulse, fanRadiusY * 0.92 * splashPulse, angleRad, 0, Math.PI * 2);
              oCtx.stroke();

              // Рикошетные микро-брызги вокруг точки удара
              for (let s = 0; s < 12; s++) {
                const sAngle = (s / 12) * Math.PI * 2 + now * 0.02;
                const sDistX = Math.cos(sAngle) * (fanRadiusX * (0.85 + ((now * 0.02 + s) % 1) * 0.6));
                const sDistY = Math.sin(sAngle) * (fanRadiusY * (0.85 + ((now * 0.02 + s) % 1) * 0.6));
                oCtx.fillStyle = `rgba(255, 255, 255, ${0.45 - (((now * 0.02 + s) % 1) * 0.4)})`;
                oCtx.beginPath();
                oCtx.arc(ptr.x + sDistX, ptr.y + sDistY, 1.2, 0, Math.PI * 2);
                oCtx.fill();
              }

              // 5. ОБЛАКО ОБРАТНОГО РАСПЫЛА (ROLLBACK MIST) В ЗОНЕ УДАРА ФАКЕЛА О СТЕНУ (12 вихрей)
              for (let m = 0; m < 12; m++) {
                const mPhase = ((now * 0.0022 + m * 0.083) % 1.0);
                const side = m % 2 === 0 ? 1 : -1;
                const mistX = ptr.x + (Math.sin(now * 0.004 + m * 1.3) * 14) + mPhase * 24;
                const mistY = ptr.y + side * (fanRadiusY * (0.35 + mPhase * 0.85));
                const mistR = 16 + mPhase * 32;
                const mistAlpha = (1.0 - mPhase) * 0.16;
                const mistGrad = oCtx.createRadialGradient(mistX, mistY, 2, mistX, mistY, mistR);
                mistGrad.addColorStop(0, `rgba(${mr}, ${mg}, ${mb}, ${mistAlpha})`);
                mistGrad.addColorStop(1, `rgba(${mr}, ${mg}, ${mb}, 0)`);
                oCtx.fillStyle = mistGrad;
                oCtx.beginPath();
                oCtx.arc(mistX, mistY, mistR, 0, Math.PI * 2);
                oCtx.fill();
              }

              if (isDanger) {
                oCtx.strokeStyle = "rgba(239, 68, 68, 0.85)";
                oCtx.lineWidth = 2.2;
                oCtx.beginPath();
                oCtx.moveTo(tipX, tipY);
                oCtx.lineTo(ptr.x, ptr.y - fanRadiusY * 0.92);
                oCtx.moveTo(tipX, tipY);
                oCtx.lineTo(ptr.x, ptr.y + fanRadiusY * 0.92);
                oCtx.stroke();
              }
            }
            oCtx.restore();
          }
        }

        // Если выбран шпатель 60 см: дополнительно рисуем шпатель поверх точки (ptr.x, ptr.y)
        if (toolMode === "spatula") {
          const spatH = height * 0.28;
          oCtx.save();
          oCtx.translate(ptr.x, ptr.y);
          oCtx.rotate(angleRad);
          oCtx.shadowColor = "rgba(0, 0, 0, 0.45)";
          oCtx.shadowBlur = 12;
          oCtx.shadowOffsetX = 12;
          oCtx.shadowOffsetY = 12;
          oCtx.fillStyle = "rgba(226, 232, 240, 0.95)";
          oCtx.fillRect(-4, -spatH / 2, 8, spatH);
          oCtx.shadowColor = "transparent";
          oCtx.fillStyle = "#1e4fa3";
          oCtx.fillRect(4, -spatH / 2 + 6, 14, spatH - 12);
          oCtx.fillStyle = "#091322";
          oCtx.fillRect(18, -16, 32, 32);
          oCtx.restore();
        }

        // 4. РЕНДЕР ОПЕРАТОРА / СТАНЦИИ / BODYCAM — ВСЕГДА ВЫПОЛНЯЕТСЯ (И ДЛЯ GUN, И ДЛЯ SPATULA)
        const isGunDanger = hydroPhysics.isCrashTestActive || hydroPhysics.isUnderAtomized || isNozzleClogged;
        if (cameraViewMode === "bodycam") {
          drawFirstPersonBodycamGun(
            oCtx,
            width,
            height,
            ptr.x,
            ptr.y,
            distanceCm,
            isTriggerPressed,
            isNozzleClogged,
            selectedTipCode,
            targetPressureBar,
            isGunDanger,
            hasExtensionPole,
            material.rgb,
            realGunImgRef.current,
            now
          );

          if (showCctvPip) {
            drawCCTVSurveillanceCam(
              oCtx,
              width,
              height,
              machine.name,
              machine.maxFlowLpm,
              isTriggerPressed,
              now
            );
          }
        } else {
          if (showMasterOperator) {
            const currentStationImg =
              stationImagesMapRef.current[machine.id] ||
              stationImagesMapRef.current["nord-6000"] ||
              null;

            drawMasterOperatorAndStation(
              oCtx,
              width,
              height,
              ptr.x,
              ptr.y,
              tipX,
              tipY,
              isTriggerPressed,
              hasExtensionPole,
              machine,
              material,
              telemetry.avgWftMicrons,
              hydroPhysics.isCrashTestActive,
              now,
              painterImgRef.current,
              currentStationImg
            );
          }
        }

        // 5. КИНЕМАТОГРАФИЧЕСКОЕ ВИНЬЕТИРОВАНИЕ КАМЕРЫ (BODYCAM VIGNETTE)
        oCtx.save();
        const vigGrad = oCtx.createRadialGradient(
          width * 0.5,
          height * 0.5,
          Math.min(width, height) * 0.42,
          width * 0.5,
          height * 0.5,
          Math.hypot(width, height) * 0.56
        );
        vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        vigGrad.addColorStop(1, "rgba(4, 7, 14, 0.42)");
        oCtx.fillStyle = vigGrad;
        oCtx.fillRect(0, 0, width, height);
        oCtx.restore();
      }

      // ======================================================================
      // В. ПЕРЕСЧЁТ ТЕЛЕМЕТРИИ В РЕАЛЬНОМ ВРЕМЕНИ (480x288 = 138 240 ЯЧЕЕК)
      // Однопроходный цикл (Single-pass): устранен второй пробег по 138 240 ячейкам.
      // Троттлинг манометра до 10 Гц устраняет паразитные перерисовки React.
      // ======================================================================
      if (telemetryAccumulator >= 0.1) {
        telemetryAccumulator = 0;

        // Обновляем манометр на частоте 10 Гц вместо 60 Гц (ноль лишних ре-рендеров React!)
        if (isTriggerPressed && toolMode === "gun") {
          const jitter = hydroPhysics.isCrashTestActive ? (Math.random() - 0.5) * 18 : (Math.random() - 0.5) * 3;
          setLivePressureBar(Math.max(0, Math.round(hydroPhysics.workingPressureBar + jitter)));
        } else {
          setLivePressureBar(hydroPhysics.clampedSetPressure);
        }

        const grid = wftBufferRef.current;
        const matGrid = materialIdBufferRef.current;
        let coveredCells = 0;
        let sumMicrons = 0;
        let saggedCells = 0;
        let relErrorSum = 0;

        const SAG_LIMITS_BY_ID: Record<number, number> = { 1: 750, 2: 1550, 3: 2200, 4: 720 };
        const HIDE_THRESH_BY_ID: Record<number, number> = { 1: 35, 2: 120, 3: 150, 4: 60 };
        const TARGET_WFT_BY_ID: Record<number, number> = { 1: 140, 2: 650, 3: 950, 4: 320 };

        // ЕДИНЫЙ ОДНОПРОХОДНЫЙ ЦИКЛ ПО 138 240 ЯЧЕЙКАМ (В 2 РАЗА БЫСТРЕЕ НА CPU!):
        for (let i = 0; i < TOTAL_SIM_CELLS; i++) {
          const w = grid[i];
          if (w <= 5) continue;
          const mId = matGrid[i] || currentMatCode;
          const cellThresh = HIDE_THRESH_BY_ID[mId] || 40;
          const cellSagLimit = SAG_LIMITS_BY_ID[mId] || 750;

          if (w >= cellThresh) {
            coveredCells++;
            sumMicrons += w;
            const targetForCell = TARGET_WFT_BY_ID[mId] || 140;
            const relDiff = Math.abs(w - targetForCell) / targetForCell;
            relErrorSum += relDiff < 0.6 ? relDiff : 0.6;
          }
          if (w > cellSagLimit) {
            saggedCells++;
          }
        }

        const sagClustersCount = Math.min(15, Math.floor(saggedCells / 600));
        const coveredAreaM2 = Number((coveredCells * CELL_AREA_M2).toFixed(2));
        const avgWftMicrons = coveredCells > 0 ? Math.round(sumMicrons / coveredCells) : 0;

        const volumeOnWallLiters = (sumMicrons * CELL_AREA_M2) / 1000;
        const transferEfficiency = Math.max(0.5, 1.0 - hydroPhysics.oversprayLossPercent / 100);
        const exactLitersUsed = Number((volumeOnWallLiters / transferEfficiency).toFixed(2));
        statsRef.current.litersConsumed = exactLitersUsed;

        let uniformityPercent = 0;
        if (coveredCells > 12) {
          const avgRelError = relErrorSum / coveredCells;
          const crashPenalty = hydroPhysics.isCrashTestActive ? 24 : isNozzleClogged ? 35 : 0;
          const sagPenalty = sagClustersCount * 4.0;
          uniformityPercent = Math.max(45, Math.min(98, Math.round((1 - avgRelError * 0.45) * 100 - crashPenalty - sagPenalty)));
        }

        if (duelRef.current.active) {
          const midC = Math.floor(SIM_W * 0.50);
          let userCoveredCells = 0;
          for (let r = 0; r < SIM_H; r++) {
            const rowOffset = r * SIM_W;
            for (let c = midC; c < SIM_W; c++) {
              if (grid[rowOffset + c] >= 40) {
                userCoveredCells++;
              }
            }
          }
          const rightHalfTotal = (SIM_W - midC) * SIM_H;
          const userProgress = Math.min(1.0, userCoveredCells / rightHalfTotal);
          const userAreaM2 = Number((userProgress * 2.7).toFixed(2));
          duelRef.current.userProgress = userProgress;
          duelRef.current.nordAreaM2 = userAreaM2;

          if (duelRef.current.state === "racing" && !duelRef.current.finished) {
            setDuelTimer(Number(duelRef.current.elapsed.toFixed(1)));
            setDuelStats({
              nordAreaM2: userAreaM2,
              rollerAreaM2: duelRef.current.rollerAreaM2,
              nordProgress: Math.round(userProgress * 100),
              rollerProgress: Math.round(Math.min(100, (duelRef.current.rollerAreaM2 / 2.7) * 100)),
              timesFaster: Math.max(4, Math.round((userAreaM2 / Math.max(0.12, duelRef.current.rollerAreaM2)) * 5)),
            });

            // Победа NORD: когда сам пользователь закрасил свою правую половину стены минимум на 85%
            if (userProgress >= 0.85) {
              handleFinishDuelManualRef.current();
            }
          }
        }

        setTelemetry({
          coveredAreaM2,
          avgWftMicrons,
          uniformityPercent,
          sagCount: sagClustersCount,
          oversprayPercent: hydroPhysics.oversprayLossPercent,
          activeSeconds: Number(statsRef.current.activeSprayTimeSec.toFixed(1)),
          litersUsed: exactLitersUsed,
          instantSpeedCmPerSec: Math.round(speedCmPerSec),
        });

        if (coveredAreaM2 >= 4.0 && uniformityPercent >= 88 && sagClustersCount === 0) {
          setChallengeUnlocked(true);
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isTriggerPressed,
    toolMode,
    valveMode,
    material,
    distanceCm,
    gunAngleDeg,
    hydroPhysics,
    isRakingLightOn,
    isNozzleClogged,
    tipRotationDeg,
    selectedTipCode,
    selectedMaterialId,
    isDuelActive,
    laserMode,
    hasExtensionPole,
    showMasterOperator,
    cameraViewMode,
    showCctvPip,
    targetPressureBar,
    machine,
  ]);

  // Обработчики мыши и тача
  const updatePointerCoords = (clientX: number, clientY: number) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current.targetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    pointerRef.current.targetY = Math.max(0, Math.min(rect.height, clientY - rect.top));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    updatePointerCoords(e.clientX, e.clientY);
    pointerRef.current.x = pointerRef.current.targetX;
    pointerRef.current.y = pointerRef.current.targetY;
    pointerRef.current.prevX = pointerRef.current.targetX;
    pointerRef.current.prevY = pointerRef.current.targetY;
    setIsTriggerPressed(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updatePointerCoords(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsTriggerPressed(false);
  };

  const handleWheelDistance = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 2 : -2;
    setDistanceCm((prev) => Math.max(20, Math.min(45, prev + delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsTriggerPressed(true);
      } else if (e.key === "w" || e.key === "W" || e.key === "ц" || e.key === "Ц") {
        setDistanceCm((prev) => Math.max(20, prev - 2));
      } else if (e.key === "s" || e.key === "S" || e.key === "ы" || e.key === "Ы") {
        setDistanceCm((prev) => Math.min(45, prev + 2));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsTriggerPressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const roiMetrics = useMemo(() => {
    // Реальная норма выработки маляра вручную (валик с маканием в ванночку / ручной шпатель по бетону, м²/час):
    const manualSpeedM2PerHour = material.manualSpeedM2PerHour; // 18 м²/ч краска, 6.5 м²/ч шпаклевка, 5.0 м²/ч мастика

    // Сколько минут уйдет у маляра ВРУЧНУЮ валиком/шпателем на укрытую сейчас площадь:
    const manualMinutesForCurrentWall =
      telemetry.coveredAreaM2 > 0
        ? Number(((telemetry.coveredAreaM2 / manualSpeedM2PerHour) * 60).toFixed(1))
        : 0;

    // Технологическое время с аппаратом NORD на этот же участок:
    const airlessTechSeconds = Math.max(1, Math.round(telemetry.activeSeconds * 1.35));
    const speedUpMultiplier =
      telemetry.activeSeconds > 0 && telemetry.coveredAreaM2 > 0.2
        ? Math.max(4, Math.min(12, Math.round((manualMinutesForCurrentWall * 60) / airlessTechSeconds)))
        : 6;

    const airlessProductivityM2PerHour = Math.max(
      45,
      Math.round(hydroPhysics.actualFlowLpm * 42 * ((100 - hydroPhysics.oversprayLossPercent) / 100))
    );
    const manualHoursTotal = projectAreaInput / material.manualSpeedM2PerHour;
    const airlessHoursTotal = projectAreaInput / airlessProductivityM2PerHour;
    const savedHours = Math.max(1, Math.round(manualHoursTotal - airlessHoursTotal));
    const savedRublesFot = Math.round(savedHours * 1850);
    const manualFotRubles = Math.round(manualHoursTotal * 1850);
    const airlessFotRubles = Math.round(airlessHoursTotal * 1850);
    const paybackObjectsCount = Math.max(1, Math.ceil(machine.priceRub / Math.max(1, savedRublesFot)));

    return {
      manualMinutesForCurrentWall,
      airlessTechSeconds,
      speedUpMultiplier,
      airlessProductivityM2PerHour,
      manualHoursTotal: Math.round(manualHoursTotal),
      airlessHoursTotal: Number(airlessHoursTotal.toFixed(1)),
      savedHours,
      savedRublesFot,
      manualFotRubles,
      airlessFotRubles,
      paybackObjectsCount,
    };
  }, [telemetry.coveredAreaM2, telemetry.activeSeconds, selectedMaterialId, material, hydroPhysics, projectAreaInput, machine.priceRub]);

  const generatedLeadMessage = useMemo(() => {
    return (
      `Здравствуйте! Протестировал конфигурацию на тест-стенде NORD LAB:\n` +
      `• Аппарат: ${machine.name} (${machine.maxFlowLpm} л/мин, ${machine.maxPressureBar} бар)\n` +
      `• Материал: ${material.name}\n` +
      `• Сопло: X-HD ${tip.code} (факел ${hydroPhysics.fanWidthCm} см)\n` +
      `• Результат теста: укрыто ${telemetry.coveredAreaM2} м², равномерность ${telemetry.uniformityPercent}%, толщина ${telemetry.avgWftMicrons} мкм\n` +
      `• Объект: ${projectAreaInput} м² (экономия ФОТ: ${roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽)\n` +
      `${challengeUnlocked ? "🎁 Промокод мастера: NORD-PRO-TSL (комплект сопел X-HD + масло TSL)" : "Прошу проконсультировать по наличию и условиям поставки."}`
    );
  }, [machine, material, tip, hydroPhysics, telemetry, projectAreaInput, roiMetrics, challengeUnlocked]);

  const handleCopyPromo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("NORD-PRO-TSL");
      setCopiedPromo(true);
      setTimeout(() => setCopiedPromo(false), 2500);
    }
  };

  const handleExportTechCardPdf = () => {
    const docId = `TK-NORD-${Date.now().toString(36).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const matMeta: Record<string, { category: string; densityKgL: number; solidsVolumePercent: number; baseConsumptionKgM2: number }> = {
      paint: { category: "Водно-дисперсионная интерьерная краска", densityKgL: 1.35, solidsVolumePercent: 52, baseConsumptionKgM2: 0.19 },
      putty: { category: "Полимерная пастообразная шпаклёвка", densityKgL: 1.68, solidsVolumePercent: 70, baseConsumptionKgM2: 1.15 },
      fireproof: { category: "Огнезащитная вспучивающаяся / битумная мастика", densityKgL: 1.28, solidsVolumePercent: 68, baseConsumptionKgM2: 1.25 },
      road: { category: "Быстросохнущая разметочная эмаль АК", densityKgL: 1.50, solidsVolumePercent: 75, baseConsumptionKgM2: 0.55 },
    };
    const currentMeta = matMeta[material.id] || { category: "Защитно-отделочный состав", densityKgL: 1.4, solidsVolumePercent: 60, baseConsumptionKgM2: 0.5 };

    const printWin = window.open("", "_blank");
    if (!printWin) {
      alert("Пожалуйста, разрешите открытие всплывающего окна для генерации и печати PDF.");
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Техкарта и ТЭО ${docId} — NORD</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5px;
      line-height: 1.35;
      color: #1e293b;
      background: #ffffff;
      padding: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .brand-logo {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .brand-sub {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #059669;
      font-weight: 700;
    }
    .doc-meta {
      text-align: right;
      font-size: 9.5px;
      color: #64748b;
    }
    .doc-meta strong {
      color: #0f172a;
      font-size: 10.5px;
    }
    h1 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin-bottom: 2px;
      font-weight: 800;
    }
    .subtitle {
      font-size: 10.5px;
      color: #475569;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #f1f5f9;
      color: #0f172a;
      padding: 4px 8px;
      margin-top: 8px;
      margin-bottom: 5px;
      border-left: 3px solid #059669;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 10px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 4px 6px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
      color: #334155;
    }
    .highlight-row {
      background: #ecfdf5;
      font-weight: 700;
      color: #065f46;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 6px 8px;
      background: #fafafa;
    }
    .card-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 10px;
      margin-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .row span:first-child {
      color: #64748b;
    }
    .row span:last-child {
      font-weight: 600;
      color: #0f172a;
    }
    .kpi-banner {
      display: flex;
      justify-content: space-around;
      background: linear-gradient(135deg, #064e3b, #047857);
      color: #ffffff;
      padding: 8px 10px;
      border-radius: 6px;
      margin: 8px 0;
      text-align: center;
    }
    .kpi-item h3 {
      font-size: 16px;
      font-weight: 800;
      color: #a7f3d0;
    }
    .kpi-item p {
      font-size: 9px;
      color: #e2e8f0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px dashed #cbd5e1;
    }
    .sig-col {
      width: 45%;
    }
    .sig-line {
      border-bottom: 1px solid #0f172a;
      margin-top: 22px;
      margin-bottom: 3px;
    }
    .sig-sub {
      font-size: 8.5px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    .footer {
      margin-top: 10px;
      text-align: center;
      font-size: 8.5px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 5px;
    }
    .print-bar {
      margin-bottom: 10px;
      padding: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #059669;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span>Официальная Техкарта NORD LAB готова к печати или сохранению в PDF (Ctrl+P / Cmd+P)</span>
    <button class="print-btn" onclick="window.print()">Распечатать / Сохранить в PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand-logo">NORD INDUSTRIAL AIRLESS</div>
      <div class="brand-sub">Инженерный центр гидродинамических систем · nord-airless.ru</div>
    </div>
    <div class="doc-meta">
      <div>Документ: <strong>${docId}</strong></div>
      <div>Дата формирования: <strong>${dateStr}</strong></div>
      <div>Статус: <strong>УТВЕРЖДЕНО К ПРОИЗВОДСТВУ</strong></div>
    </div>
  </div>

  <h1>ТЕХНОЛОГИЧЕСКАЯ КАРТА И ТЕХНИКО-ЭКОНОМИЧЕСКОЕ ОБОСНОВАНИЕ (ТЭО)</h1>
  <div class="subtitle">Механизированное безвоздушное нанесение защитно-декоративных составов на объекте ${projectAreaInput} м²</div>

  <div class="kpi-banner">
    <div class="kpi-item">
      <h3>${roiMetrics.speedUpMultiplier}x</h3>
      <p>Ускорение работ</p>
    </div>
    <div class="kpi-item">
      <h3>${roiMetrics.savedHours} ч</h3>
      <p>Экономия времени</p>
    </div>
    <div class="kpi-item">
      <h3>${roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽</h3>
      <p>Чистая экономия ФОТ</p>
    </div>
    <div class="kpi-item">
      <h3>${roiMetrics.paybackObjectsCount <= 1 ? "1 объект" : roiMetrics.paybackObjectsCount + " объекта"}</h3>
      <p>Срок окупаемости</p>
    </div>
  </div>

  <div class="section-title">1. Параметры объекта и технологического материала</div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Параметры объекта</div>
      <div class="row"><span>Общая проектная площадь:</span><span>${projectAreaInput} м²</span></div>
      <div class="row"><span>Тип основания:</span><span>Бетонное монолитное / ГКЛ</span></div>
      <div class="row"><span>Тестовый участок лаборатории:</span><span>${telemetry.coveredAreaM2} м²</span></div>
      <div class="row"><span>Фактическое время распыления:</span><span>${telemetry.activeSeconds} сек</span></div>
    </div>
    <div class="card">
      <div class="card-title">Характеристики состава</div>
      <div class="row"><span>Наименование состава:</span><span>${material.name}</span></div>
      <div class="row"><span>Категория материала:</span><span>${currentMeta.category}</span></div>
      <div class="row"><span>Плотность состава:</span><span>${currentMeta.densityKgL} кг/л</span></div>
      <div class="row"><span>Сухой остаток:</span><span>${currentMeta.solidsVolumePercent}%</span></div>
    </div>
  </div>

  <div class="section-title">2. Технологические параметры безвоздушного оборудования NORD</div>
  <table>
    <thead>
      <tr>
        <th>Оборудование и узел</th>
        <th>Параметр / Артикул</th>
        <th>Нормативный режим</th>
        <th>Фактическое значение в тесте</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Базовый аппарат</strong></td>
        <td>${machine.name} (${machine.motorKw} кВт)</td>
        <td>Макс. ${machine.maxPressureBar} бар · ${machine.maxFlowLpm} л/мин</td>
        <td>Рабочее давление: ${livePressureBar || targetPressureBar} бар</td>
      </tr>
      <tr>
        <td><strong>Реверсивное сопло</strong></td>
        <td>RAC X-HD ${bundleInfo.recommendedTip}</td>
        <td>Отверстие Ø ${bundleInfo.recTipObj.orificeMm} мм (0.0${bundleInfo.recTipObj.code.slice(1)}")</td>
        <td>Ширина факела: ${bundleInfo.recTipObj.fanWidthAt30cm} см</td>
      </tr>
      <tr>
        <td><strong>Шланг высокого давления</strong></td>
        <td>${bundleInfo.hoseName}</td>
        <td>Рабочее давление до 270 бар</td>
        <td>15 м (минимальные потери давления)</td>
      </tr>
      <tr>
        <td><strong>Фильтрация системы</strong></td>
        <td>${bundleInfo.filterName}</td>
        <td>Без риска кавитации и коагуляции</td>
        <td>Фильтр рукояти + всасывающий фильтр</td>
      </tr>
      <tr>
        <td><strong>Дистанция и проводка</strong></td>
        <td>Малярный угол 90° к поверхности</td>
        <td>Дистанция: ${distanceCm} см (норма 25-35 см)</td>
        <td>Скорость проводки: ${telemetry.instantSpeedCmPerSec || 50} см/с</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3. Результаты натурных испытаний (NORD LAB Hydro-Telemetry)</div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Контроль слоя и качества</div>
      <div class="row"><span>Нормативная толщина WFT:</span><span>${material.targetWftMicrons} мкм</span></div>
      <div class="row"><span>Фактическая средняя толщина WFT:</span><span>${telemetry.avgWftMicrons} мкм</span></div>
      <div class="row"><span>Расчетная сухая толщина DFT:</span><span>~${Math.round((telemetry.avgWftMicrons * currentMeta.solidsVolumePercent) / 100)} мкм</span></div>
      <div class="row"><span>Равномерность распределения:</span><span><strong>${telemetry.uniformityPercent}%</strong> (класс Q3-Q4)</span></div>
      <div class="row"><span>Очаги критических подтёков:</span><span>${telemetry.sagCount === 0 ? "Отсутствуют (0)" : telemetry.sagCount + " шт."}</span></div>
    </div>
    <div class="card">
      <div class="card-title">Эффективность гидродинамики</div>
      <div class="row"><span>Коэффициент переноса на стену:</span><span>${100 - hydroPhysics.oversprayLossPercent}%</span></div>
      <div class="row"><span>Потери на туманообразование:</span><span>${hydroPhysics.oversprayLossPercent}% (минимальный оверспрей)</span></div>
      <div class="row"><span>Фактический расход материала:</span><span>${telemetry.litersUsed} л (на тестовый участок)</span></div>
      <div class="row"><span>Проектный объем на объект:</span><span>~${Math.round((projectAreaInput * (currentMeta.baseConsumptionKgM2 / currentMeta.densityKgL)) * 1.05)} л</span></div>
      <div class="row"><span>Производительность гидронасоса:</span><span>${hydroPhysics.actualFlowLpm} л/мин</span></div>
    </div>
  </div>

  <div class="section-title">4. Технико-экономическое сравнение (ТЭО): Ручной способ vs NORD ${machine.name}</div>
  <table>
    <thead>
      <tr>
        <th>Показатель эффективности</th>
        <th>Ручной метод (валик / шпатель)</th>
        <th>Безвоздушный метод NORD</th>
        <th>Экономический эффект</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Скорость нанесения состава</strong></td>
        <td>${material.manualSpeedM2PerHour} м²/час</td>
        <td>${roiMetrics.airlessProductivityM2PerHour} м²/час</td>
        <td><strong>Ускорение в ${roiMetrics.speedUpMultiplier} раз</strong></td>
      </tr>
      <tr>
        <td><strong>Трудозатраты на объект (${projectAreaInput} м²)</strong></td>
        <td>${roiMetrics.manualHoursTotal} человеко-часов</td>
        <td>${roiMetrics.airlessHoursTotal} человеко-часов</td>
        <td><strong>Экономия ${roiMetrics.savedHours} часов</strong></td>
      </tr>
      <tr>
        <td><strong>Срок выполнения работ (смены по 8ч)</strong></td>
        <td>~${Math.ceil(roiMetrics.manualHoursTotal / 8)} рабочих смен</td>
        <td>~${Math.max(1, Math.ceil(roiMetrics.airlessHoursTotal / 8))} рабочих смен</td>
        <td>Сдача объекта раньше на ${Math.max(1, Math.ceil(roiMetrics.savedHours / 8))} дн.</td>
      </tr>
      <tr>
        <td><strong>Фонд оплаты труда (ФОТ, 1850 ₽/ч)</strong></td>
        <td>${roiMetrics.manualFotRubles.toLocaleString("ru-RU")} ₽</td>
        <td>${roiMetrics.airlessFotRubles.toLocaleString("ru-RU")} ₽</td>
        <td><strong>Снижение затрат на ФОТ</strong></td>
      </tr>
      <tr class="highlight-row">
        <td><strong>ИТОГОВАЯ ЧИСТАЯ ЭКОНОМИЯ ФОТ</strong></td>
        <td colspan="2" style="text-align: center; font-size: 11px;">Стоимость комплекта NORD: ${bundleInfo.totalPrice.toLocaleString("ru-RU")} ₽</td>
        <td style="font-size: 12px;">+${roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">5. Спецификация оборудования к закупке</div>
  <table>
    <thead>
      <tr>
        <th style="width: 5%;">№</th>
        <th style="width: 55%;">Наименование оборудования и оснастки</th>
        <th style="width: 20%;">Комплектация / Артикул</th>
        <th style="width: 20%;">Стоимость</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><strong>Аппарат окрасочный безвоздушный ${machine.name}</strong></td>
        <td>Комплект в сборе (${machine.motorKw} кВт)</td>
        <td>${machine.priceRub.toLocaleString("ru-RU")} ₽</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Шланг высокого давления NORD</td>
        <td>${bundleInfo.hoseName}</td>
        <td>${bundleInfo.hosePrice.toLocaleString("ru-RU")} ₽</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Пистолет безвоздушного распыления профессиональный</td>
        <td>NORD Contractor Pro (4 пальца, вертлюг)</td>
        <td>В комплекте аппарата</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Реверсивное сопло сверхстойкое</td>
        <td>RAC X-HD ${bundleInfo.recommendedTip} + соплодержатель 7/8"</td>
        <td>${bundleInfo.tipPrice.toLocaleString("ru-RU")} ₽</td>
      </tr>
      <tr>
        <td>5</td>
        <td>Система фильтрации</td>
        <td>${bundleInfo.filterName}</td>
        <td>${bundleInfo.filterPrice.toLocaleString("ru-RU")} ₽</td>
      </tr>
      <tr>
        <td>6</td>
        <td>Пластификатор-лубрикант для поршня</td>
        <td>Масло NORD TSL (125 мл)</td>
        <td>В комплекте поставки</td>
      </tr>
      <tr class="highlight-row">
        <td colspan="3" style="text-align: right;"><strong>ИТОГО ПО СПЕЦИФИКАЦИИ:</strong></td>
        <td><strong>${bundleInfo.totalPrice.toLocaleString("ru-RU")} ₽</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-col">
      <div><strong>Инженер-технолог NORD LAB:</strong></div>
      <div class="sig-line"></div>
      <div class="sig-sub"><span>Подпись / Личный штамп</span><span>/ Лаборатория NORD /</span></div>
    </div>
    <div class="sig-col">
      <div><strong>Утверждаю (Руководитель проекта / Заказчик):</strong></div>
      <div class="sig-line"></div>
      <div class="sig-sub"><span>Подпись / Печать организации</span><span>/ _________________ /</span></div>
    </div>
  </div>

  <div class="footer">
    Официальное представительство NORD AIRLESS в РФ · Тел: +7 (999) 600-23-18 · Email: larsmillow@nord-equip.ru · Санкт-Петербург / Москва · nord-airless.ru<br>
    Гарантия на цилиндро-поршневую группу — 12 месяцев. Склад оригинальных запчастей и ремкомплектов в наличии.
  </div>
</body>
</html>`;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 350);
  };

  return (
    <div className="nord-lab-page">
      {/* ХЕДЕР NORD LAB */}
      <header className="nord-lab-header">
        <div className="nord-lab-header-inner">
          <div className="nord-lab-brand">
            <Link href="/" className="nord-lab-logo-icon" title="На главную NORD">
              <IconZap className="w-5 h-5 text-white" />
            </Link>
            <div>
              <div className="nord-lab-title">
                <span>NORD</span>
                <span className="nord-lab-tag">LAB</span>
                <span className="nord-lab-status">
                  <span className="nord-lab-status-dot" />
                  230 BAR · HYDRO-SIM
                </span>
              </div>
            </div>
          </div>

          <div className="nord-lab-tabs">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`nord-lab-tab-btn ${activeTab === "simulator" ? "active" : ""}`}
            >
              <IconGauge className="w-3.5 h-3.5" />
              Тест-стенд
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`nord-lab-tab-btn ${activeTab === "architecture" ? "active" : ""}`}
            >
              <IconLayers className="w-3.5 h-3.5" />
              Мат. модель
            </button>
          </div>

          <div className="nord-lab-header-actions">
            <button onClick={triggerViscosityCrashTest} className="nord-lab-btn-crash" title="Смоделировать кавитацию на вязкой смеси">
              <IconFlame className="w-3.5 h-3.5" />
              <span>Краш-тест на вязкость</span>
            </button>

            <button
              onClick={() => setIsAudioMuted((p) => !p)}
              className="nord-lab-btn-icon"
              title={isAudioMuted ? "Включить звук" : "Выключить звук"}
            >
              <IconVolume muted={isAudioMuted} />
            </button>

            <button onClick={() => setIsLeadModalOpen(true)} className="nord-lab-btn-bonus">
              <IconAward className="w-3.5 h-3.5" />
              <span>{challengeUnlocked ? "Забрать бонус X-HD" : "Тест мастера"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      {activeTab === "simulator" ? (
        <main className="nord-lab-main">
          {/* ЛЕВАЯ КОЛОНКА (КОМПАКТНЫЙ ВНУТРЕННИЙ СКРОЛЛ БЕЗ ОБРЕЗАНИЙ) */}
          <section className="nord-lab-col-left">
            {/* 1. Аппараты NORD */}
            <div className="nord-lab-card">
              <div className="nord-lab-card-header">
                <span className="nord-lab-card-title">
                  <IconWrench className="w-3.5 h-3.5 text-blue-400" />
                  1. Аппарат NORD
                </span>
                <span className="nord-lab-card-sub">до {machine.maxPressureBar} бар</span>
              </div>

              <div className="nord-lab-machine-list">
                {Object.values(MACHINES).map((m) => {
                  const isSelected = m.id === selectedMachineId;
                  const isWeakForMaterial = material.viscosityPas > m.maxViscosityPas * 1.05;
                  const shortName = m.name.replace("NORD ", "");
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMachineId(m.id)}
                      className={`nord-lab-machine-item ${isSelected ? "active" : ""}`}
                    >
                      <div className="nord-lab-machine-top">
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <span className="nord-lab-machine-name">{shortName}</span>
                          <span className={`nord-lab-badge nord-lab-badge-${m.badgeType}`}>
                            {m.badge}
                          </span>
                        </div>
                        <span className="nord-lab-machine-flow">
                          {m.maxFlowLpm} л/м · <strong style={{ color: "#38bdf8" }}>{m.priceRub.toLocaleString("ru-RU")} ₽</strong>
                        </span>
                      </div>
                      {isWeakForMaterial && (
                        <div style={{ fontSize: "8px", color: "#f87171", fontWeight: 700, marginTop: "1px" }}>
                          ⚠️ Слабый аппарат для {material.name}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Рабочий состав */}
            <div className="nord-lab-card">
              <div className="nord-lab-card-header">
                <span className="nord-lab-card-title">
                  <IconDroplets className="w-3.5 h-3.5 text-sky-400" />
                  2. Рабочий состав
                </span>
                <span className="nord-lab-card-sub">{material.viscosityPas} Па·с</span>
              </div>

              <div className="nord-lab-material-list">
                {Object.values(MATERIALS).map((mat) => {
                  const isSelected = mat.id === selectedMaterialId;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => handleSelectMaterial(mat.id)}
                      className={`nord-lab-material-item ${isSelected ? "active" : ""}`}
                    >
                      <div className="nord-lab-material-top">
                        <div className="nord-lab-material-name-wrap">
                          <span className="nord-lab-material-dot" style={{ backgroundColor: mat.colorHex }} />
                          <span className="nord-lab-material-name">{mat.name}</span>
                        </div>
                        <span className="nord-lab-material-wft">{mat.targetWftMicrons} мкм</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Сопло NORD X-HD и Дистанция */}
            <div className="nord-lab-card">
              <div className="nord-lab-card-header">
                <span className="nord-lab-card-title">
                  <IconLayers className="w-3.5 h-3.5 text-emerald-400" />
                  3. Сопло NORD X-HD
                </span>
                <span className="nord-lab-card-sub">Ø {tip.orificeMm} мм ({tip.angleDeg}°)</span>
              </div>

              <div className="nord-lab-tip-grid">
                {Object.values(NOZZLE_TIPS).map((t) => {
                  const isSelected = t.code === selectedTipCode;
                  const isTooBig = t.orificeInch > machine.maxTipInch;
                  return (
                    <button
                      key={t.code}
                      onClick={() => setSelectedTipCode(t.code)}
                      className={`nord-lab-tip-btn ${isSelected ? "active" : ""} ${isTooBig ? "oversized" : ""}`}
                    >
                      <span>{t.code}</span>
                      <span className="nord-lab-tip-sub">{t.fanWidthAt30cm}см</span>
                    </button>
                  );
                })}
              </div>

              <div className="nord-lab-tip-info">
                <strong>Сопло {tip.code}:</strong> факел {hydroPhysics.fanWidthCm} см. {tip.usage}.
              </div>

              <div className="nord-lab-slider-row">
                <div className="nord-lab-slider-label">
                  <span>Дистанция до стены:</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", color: distanceCm === 30 ? "#34d399" : "#38bdf8" }}>
                    {distanceCm} см {distanceCm === 30 && "(Эталон)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={45}
                  step={1}
                  value={distanceCm}
                  onChange={(e) => setDistanceCm(Number(e.target.value))}
                  className="nord-lab-range"
                />
                <div className="nord-lab-slider-hints">
                  <span>20 см (Подтёки)</span>
                  <span>30 см (Эталон)</span>
                  <span>45 см (Перепыл)</span>
                </div>
              </div>
            </div>
          </section>

          {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: СТЕНА CANVAS, ТУЛБАР И ЧЕЛЛЕНДЖ */}
          <section className="nord-lab-center">
            {/* ВИЗУАЛЬНАЯ ЛЕНТА ВЫБОРА АППАРАТА NORD С ФОТО (1 -> 5 КЛАСС МОЩНОСТИ) ПРЯМО НАД 3D-СТЕНОЙ */}
            <div className="nord-lab-machine-strip" role="tablist" aria-label="Выбор станции NORD по классу мощности">
              {Object.values(MACHINES).map((m, idx) => {
                const isSelected = m.id === selectedMachineId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMachineId(m.id)}
                    className={`nord-lab-strip-card ${isSelected ? "active" : ""}`}
                  >
                    <div className="nord-lab-strip-thumb">
                      <img src={m.photoSrc} alt={m.name} />
                    </div>
                    <div className="nord-lab-strip-meta">
                      <span className="nord-lab-strip-class">{idx + 1} КЛАСС · {m.maxFlowLpm} Л/М</span>
                      <strong className="nord-lab-strip-name">{m.name}</strong>
                      <span className="nord-lab-strip-price">{m.priceRub.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Тулбар стены: инструмент, выбор подложки (бетон/ГКЛ/металл) и лазер */}
            <div className="nord-lab-toolbar">
              <div className="nord-lab-tool-group">
                <button
                  onClick={() => setToolMode("gun")}
                  className={`nord-lab-tool-btn ${toolMode === "gun" ? "active" : ""}`}
                >
                  <IconZap className="w-3.5 h-3.5" />
                  Пистолет NORD
                </button>

                {selectedMaterialId === "putty" && (
                  <button
                    onClick={() => setToolMode("spatula")}
                    className={`nord-lab-tool-btn ${toolMode === "spatula" ? "active" : ""}`}
                  >
                    <IconLayers className="w-3.5 h-3.5" />
                    Шпатель 60 см
                  </button>
                )}

                <button
                  onClick={() => setHasExtensionPole((v) => !v)}
                  className={`nord-lab-tool-btn ${hasExtensionPole ? "active" : ""}`}
                  title="Установить алюминиевую удочку-удлинитель 60 см на пистолет для окраски верха стены и потолков с пола без стремянки"
                >
                  📏 Удочка 60 см {hasExtensionPole ? "ВКЛ" : "ВЫКЛ"}
                </button>

                <button
                  onClick={() => setCameraViewMode((m) => (m === "bodycam" ? "third_person" : "bodycam"))}
                  className={`nord-lab-tool-btn ${cameraViewMode === "third_person" ? "active" : ""}`}
                  title="Переключить ракурс: Обзор со стороны стройплощадки или вид от 1-го лица"
                >
                  {cameraViewMode === "third_person" ? "👷 Вид со стороны (3D)" : "🎥 Bodycam (1-е лицо)"}
                </button>

                {cameraViewMode === "third_person" ? (
                  <button
                    onClick={() => setShowMasterOperator((v) => !v)}
                    className={`nord-lab-tool-btn ${showMasterOperator ? "active" : ""}`}
                    title="Показать или скрыть мастера и станцию NORD"
                  >
                    👷 Мастер и Станция {showMasterOperator ? "ВКЛ" : "ВЫКЛ"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCctvPip((v) => !v)}
                    className={`nord-lab-tool-btn ${showCctvPip ? "active" : ""}`}
                    title="Включить/выключить тактический монитор наружного наблюдения за стройплощадкой"
                  >
                    📹 CAM-02 {showCctvPip ? "ВКЛ" : "ВЫКЛ"}
                  </button>
                )}
              </div>

              {/* 2. ПЕРЕКЛЮЧАТЕЛЬ ПОДЛОЖКИ СТЕНЫ */}
              <div className="nord-lab-substrate-select" title="Выбор поверхности стены">
                <button
                  onClick={() => setSubstrate("concrete")}
                  className={`nord-lab-sub-btn ${substrate === "concrete" ? "active" : ""}`}
                >
                  🧱 Монолитный бетон
                </button>
                <button
                  onClick={() => setSubstrate("drywall")}
                  className={`nord-lab-sub-btn ${substrate === "drywall" ? "active" : ""}`}
                >
                  📄 Листы ГКЛ
                </button>
                <button
                  onClick={() => setSubstrate("steel")}
                  className={`nord-lab-sub-btn ${substrate === "steel" ? "active" : ""}`}
                >
                  🏗️ Металлоконструкция
                </button>
              </div>

              <div className="nord-lab-tool-group">
                {/* 1. Косой боковой проявочный свет (Лампа маляра Лосева) */}
                <button
                  onClick={() => setIsRakingLightOn((v) => !v)}
                  className={`nord-lab-raking-btn ${isRakingLightOn ? "active" : ""}`}
                  title="Косой боковой проявочный свет (Лампа маляра Лосева) — выявляет неровности, полосы факела и шагрень"
                >
                  <span>💡 Проявочный свет</span>
                  <span style={{ fontSize: "9px", opacity: 0.9, fontWeight: 900 }}>
                    {isRakingLightOn ? "ВКЛ" : "ВЫКЛ"}
                  </span>
                </button>

                {/* Лазерный нивелир */}
                <button
                  onClick={() => setLaserMode((m) => (m === "green" ? "red" : m === "red" ? "off" : "green"))}
                  className={`nord-lab-tool-btn ${laserMode !== "off" ? "active" : ""}`}
                  title="Лазерный нивелир 1х1 м"
                >
                  {laserMode === "green" ? "🟢 Лазер 1м" : laserMode === "red" ? "🔴 Лазер 1м" : "⚪ Лазер выкл"}
                </button>

                {/* Кнопка Дуэль: Валик vs NORD */}
                <button
                  onClick={isDuelActive ? handleStopDuel : handleStartDuel}
                  className={`nord-lab-duel-btn ${isDuelActive ? "active" : ""}`}
                  title="Сравнение скорости и качества: ручной валик против безвоздушного аппарата NORD"
                >
                  {!isDuelActive && <IconZap style={{ width: "13px", height: "13px" }} className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isDuelActive ? "⏹ Стоп дуэль" : "Дуэль: Валик vs NORD"}</span>
                </button>

                {isDuelActive && duelState === "racing" && !duelFinished && (
                  <button
                    onClick={handleFinishDuelManual}
                    className="nord-lab-duel-finish-btn"
                    title="Завершить замер и открыть расчет выгоды"
                  >
                    <span>🏁 Завершить замер</span>
                  </button>
                )}

                <button onClick={handleResetWall} className="nord-lab-tool-btn" title="Очистить стену">
                  <IconRotate className="w-3.5 h-3.5" />
                  Очистить
                </button>
              </div>
            </div>

            {/* 6. ПЛАШКА КРАШ-ТЕСТА (ПЕРЕГРУЗКА И КАВИТАЦИЯ НАСОСА) */}
            {(hydroPhysics.isCrashTestActive || hydroPhysics.isUnderAtomized) && (
              <div className="nord-lab-crash-banner">
                <div className="nord-lab-crash-left">
                  <div className="nord-lab-crash-icon">
                    <IconShieldAlert className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="nord-lab-crash-badge">КАВИТАЦИЯ И ПЕРЕГРУЗКА</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#fca5a5", fontWeight: "bold" }}>
                        Давление упало до {hydroPhysics.workingPressureBar} бар!
                      </span>
                    </div>
                    <div className="nord-lab-crash-title">
                      {hydroPhysics.isViscosityOverload
                        ? `Вязкость состава (${material.viscosityPas} Па·с) превышает тягу ${machine.name} (макс. ${machine.maxViscosityPas} Па·с)!`
                        : hydroPhysics.isTipOversized
                        ? `Сопло ${tip.code} (Ø ${tip.orificeInch}″) слишком велико для насоса ${machine.name} (макс. ${machine.maxTipInch}″)!`
                        : `Давление ${hydroPhysics.workingPressureBar} бар ниже минимума (${material.minPressureBar} бар) для раскрытия факела!`}
                    </div>
                    <div className="nord-lab-crash-desc">
                      Факел рвётся на «усы» и плевки. Для монолитного слоя нужен класс <strong>Heavy Duty</strong>.
                    </div>
                  </div>
                </div>

                {machine.id === "nord-18x" ? (
                  <button onClick={() => setTargetPressureBar(225)} className="nord-lab-btn-upgrade">
                    <IconZap className="w-4 h-4" />
                    <span>⚡ Поднять давление до 225 бар</span>
                  </button>
                ) : (
                  <button onClick={upgradeToHeavyDuty} className="nord-lab-btn-upgrade">
                    <IconZap className="w-4 h-4" />
                    <span>Установить NORD-18X (18.0 л/мин)</span>
                  </button>
                )}
              </div>
            )}

            {/* ИНТЕРАКТИВНЫЙ ХОЛСТ СТЕНЫ (3 СЛОЯ) */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheelDistance}
              className="nord-lab-viewport"
              style={{ touchAction: "none" }}
            >
              <canvas ref={baseCanvasRef} className="nord-lab-canvas" />
              <canvas ref={paintCanvasRef} className="nord-lab-canvas" />
              <canvas ref={overlayCanvasRef} className="nord-lab-canvas" />

              {/* ПОДСКАЗКА СТАРТА ДУЭЛИ НА ПРАВОЙ ПОЛОВИНЕ */}
              {isDuelActive && duelState === "ready" && (
                <div className="nord-lab-duel-ready-banner">
                  <div className="nord-lab-duel-ready-badge">⚡ ДУЭЛЬ: ВАЛИК VS NORD</div>
                  <div className="nord-lab-duel-ready-title">ГОТОВЫ К ГОНКЕ?</div>
                  <div className="nord-lab-duel-ready-desc">
                    Зажмите <strong>ЛКМ</strong> на правой половине стены, чтобы запустить таймер и обогнать валик!
                  </div>
                  <div className="nord-lab-duel-ready-hint">
                    👉 Ваша зона: правые 2.7 м² · Бот с валиком красит слева
                  </div>
                </div>
              )}

              {/* ФИНИШ ДУЭЛИ: ПОБЕДА NORD С РАСЧЁТОМ ВЫГОДЫ */}
              {isDuelActive && duelFinished && (
                <div className="nord-lab-duel-card-floating">
                  <div className="nord-lab-duel-card-badge">🏆 ПОБЕДА СТАНЦИИ NORD</div>
                  <div className="nord-lab-duel-card-title">В {duelStats.timesFaster || 10} РАЗ БЫСТРЕЕ ВАЛИКА!</div>
                  <div className="nord-lab-duel-card-grid">
                    <div className="nord-lab-duel-side-box nord">
                      <div className="nord-lab-duel-side-title">⚡ Станция NORD:</div>
                      <div className="nord-lab-duel-side-val">{duelStats.nordAreaM2 || 2.7} м² за {duelTimer} сек</div>
                      <div className="nord-lab-duel-side-sub">120 м²/ч · 25 ₽/м² ФОТ (Монолитный слой)</div>
                    </div>
                    <div className="nord-lab-duel-side-box roller">
                      <div className="nord-lab-duel-side-title">🪣 Ручной валик:</div>
                      <div className="nord-lab-duel-side-val">{duelStats.rollerAreaM2} м² за {duelTimer} сек</div>
                      <div className="nord-lab-duel-side-sub">12 м²/ч · 180 ₽/м² ФОТ (Полосы и просветы)</div>
                    </div>
                  </div>
                  <div className="nord-lab-duel-saving-banner">
                    💰 Экономия на объекте {projectAreaInput} м²: <strong>{roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽</strong> на зарплатах бригады!
                  </div>
                  <div className="nord-lab-duel-card-actions">
                    <button
                      onClick={() => {
                        setLeadForm((f) => ({
                          ...f,
                          comment: `Заказ после победы в Дуэли: аппарат ${machine.name} для объекта ${projectAreaInput} м². Экономия ФОТ: ${roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽. Комплект: ${bundleInfo.totalPrice.toLocaleString("ru-RU")} ₽`,
                        }));
                        setIsLeadModalOpen(true);
                      }}
                      className="nord-lab-duel-cta-btn"
                    >
                      <IconZap className="w-4 h-4 text-amber-300" />
                      <span>Заказать комплект NORD ({bundleInfo.totalPrice.toLocaleString("ru-RU")} ₽)</span>
                    </button>
                    <div className="nord-lab-duel-actions-row">
                      <button onClick={handleStartDuel} className="nord-lab-duel-btn-sec">
                        <IconRotate className="w-3 h-3" />
                        <span>Повторить дуэль</span>
                      </button>
                      <button onClick={handleStopDuel} className="nord-lab-duel-btn-close">
                        Свободный режим
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ИНТЕРАКТИВНОЕ УВЕДОМЛЕНИЕ: ЗАСОР СОПЛА (КЛИН) */}
              {isNozzleClogged && (
                <div
                  className="nord-lab-clog-floating"
                  style={{
                    left: Math.min(
                      (baseCanvasRef.current?.width || 800) - 330,
                      Math.max(20, pointerRef.current.x - 110)
                    ),
                    top: Math.max(20, pointerRef.current.y - 110),
                  }}
                >
                  <div className="nord-lab-clog-header">
                    <IconShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Сопло {selectedTipCode} забилось!</span>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#fecdd3", lineHeight: 1.35 }}>
                    Вязкая смесь забила отверстие Ø {tip.orificeMm} мм. Требуется продувка и переход на сопло{" "}
                    <strong>{material.recommendedTip}</strong>.
                  </div>
                  <button onClick={handlePurgeAndFixTip} className="nord-lab-clog-btn">
                    <IconRotate className="w-3.5 h-3.5" />
                    <span>Повернуть на 180° и поставить сопло {material.recommendedTip}</span>
                  </button>
                </div>
              )}

              {clogSuccessToast && (
                <div
                  style={{
                    position: "absolute",
                    top: 55,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(6, 78, 59, 0.95)",
                    border: "1px solid #10b981",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#d1fae5",
                    zIndex: 35,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }}
                >
                  ✅ {clogSuccessToast}
                </div>
              )}

              {/* Верхний HUD */}
              <div className="nord-lab-hud-top">
                <div className="nord-lab-hud-pill">
                  <strong>3.0 × 1.8 м (5.4 м²)</strong> · {substrate === "concrete" ? "Бетон" : substrate === "drywall" ? "ГКЛ" : "Металл"}
                </div>
                <div className="nord-lab-hud-pill">
                  Скорость: <strong>{telemetry.instantSpeedCmPerSec} см/с</strong>
                </div>
              </div>

              {/* Предупреждение о режиме промывки */}
              {valveMode === "prime" && isTriggerPressed && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(6, 12, 24, 0.75)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ background: "#091322", border: "1px solid #d97706", padding: "14px", borderRadius: "8px", textAlign: "center", maxWidth: "360px" }}>
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "12px" }}>Открыт кран «ДРЕНАЖ / ПРОМЫВКА»</div>
                    <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "3px" }}>
                      Материал циркулирует по обратке. Переключите тумблер справа в режим <strong>«РАСПЫЛЕНИЕ»</strong>.
                    </div>
                  </div>
                </div>
              )}

              {/* Нижний HUD */}
              <div className="nord-lab-hud-bottom">
                <div className="nord-lab-hud-pill" style={{ opacity: 0.9 }}>
                  🖱️ Зажмите ЛКМ / Пробел — курок · Колесо мыши — дистанция ({distanceCm} см)
                </div>
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setIsTriggerPressed(true);
                    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([30, 20, 40]);
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    setIsTriggerPressed(false);
                  }}
                  className="nord-lab-fire-mobile"
                >
                  {isTriggerPressed ? "🔥 Курок нажат" : "Нажать курок"}
                </button>
              </div>
            </div>

            {/* Челлендж-бар «Мастер безвоздушки» */}
            <div className="nord-lab-challenge-bar">
              <div className="nord-lab-challenge-left">
                <div className={`nord-lab-challenge-icon ${challengeUnlocked ? "unlocked" : ""}`}>
                  <IconAward className="w-5 h-5" />
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                    Квест «Мастер безвоздушки NORD»
                    {challengeUnlocked && (
                      <span style={{ fontSize: "9px", background: "#10b981", color: "#061324", padding: "1px 5px", borderRadius: "3px", fontWeight: "900" }}>
                        ПРОЙДЕНО!
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "10px", color: "#8da2c0" }}>
                    Укройте <strong>≥ 4.0 м²</strong> с равномерностью <strong>≥ 88%</strong> без подтёков — подарок: сопла X-HD + масло TSL.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#94a3b8" }}>
                  Прогресс: <strong style={{ color: "#34d399" }}>{Math.min(4.0, telemetry.coveredAreaM2)} / 4.0 м²</strong>
                </div>
                <button onClick={() => setIsLeadModalOpen(true)} className="nord-lab-btn-upgrade" style={{ padding: "5px 10px" }}>
                  <span>{challengeUnlocked ? "Забрать бонус" : "Получить расчёт"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* ПРАВАЯ КОЛОНКА (МАНОМЕТР, ТОЧНАЯ ТЕЛЕМЕТРИЯ И ROI-КАЛЬКУЛЯТОР) */}
          <section className="nord-lab-col-right">
            {/* 1. Глицериновый манометр NORD */}
            <div className="nord-lab-card">
              <div className="nord-lab-card-header">
                <span className="nord-lab-card-title">
                  <IconGauge className="w-3.5 h-3.5 text-blue-400" />
                  Манометр высокого давления
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: "bold",
                    color: hydroPhysics.isCrashTestActive ? "#f87171" : "#34d399",
                  }}
                >
                  {hydroPhysics.isCrashTestActive ? "ПЕРЕГРУЗКА" : "НОРМА"}
                </span>
              </div>

              <div className="nord-lab-gauge-wrap">
                <svg viewBox="0 0 200 95" style={{ width: "135px", height: "65px" }}>
                  <path d="M 22 84 A 74 74 0 0 1 178 84" fill="none" stroke="#122036" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 22 84 A 74 74 0 0 1 65 24" fill="none" stroke="#ef4444" strokeWidth="8" strokeOpacity="0.55" />
                  <path d="M 65 24 A 74 74 0 0 1 158 38" fill="none" stroke="#3b82f6" strokeWidth="8" strokeOpacity="0.75" />
                  <path d="M 158 38 A 74 74 0 0 1 178 84" fill="none" stroke="#f59e0b" strokeWidth="8" strokeOpacity="0.7" />

                  <text x="14" y="94" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">0</text>
                  <text x="48" y="20" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">100</text>
                  <text x="128" y="20" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">180</text>
                  <text x="174" y="94" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily="monospace">250</text>

                  {(() => {
                    const clampedP = Math.max(0, Math.min(250, livePressureBar));
                    const deg = -180 + (clampedP / 250) * 180;
                    const rad = (deg * Math.PI) / 180;
                    const nx = 100 + Math.cos(rad) * 58;
                    const ny = 84 + Math.sin(rad) * 58;
                    return (
                      <g>
                        <line
                          x1="100"
                          y1="84"
                          x2={nx}
                          y2={ny}
                          stroke={hydroPhysics.isCrashTestActive ? "#ef4444" : "#38bdf8"}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                        <circle cx="100" cy="84" r="5.5" fill="#e2e8f0" stroke="#060e1a" strokeWidth="2" />
                      </g>
                    );
                  })()}

                  <text x="100" y="68" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900" fontFamily="monospace">
                    {livePressureBar}
                  </text>
                  <text x="100" y="78" textAnchor="middle" fill="#8da2c0" fontSize="7" fontFamily="monospace">
                    BAR · GLYCERIN
                  </text>
                </svg>
              </div>

              <div className="nord-lab-slider-row">
                <div className="nord-lab-slider-label">
                  <span>Регулятор давления:</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "#38bdf8", fontWeight: "bold" }}>
                    {hydroPhysics.clampedSetPressure} бар ({hydroPhysics.actualFlowLpm} л/мин)
                  </span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={machine.maxPressureBar}
                  step={5}
                  value={hydroPhysics.clampedSetPressure}
                  onChange={(e) => setTargetPressureBar(Number(e.target.value))}
                  className="nord-lab-range"
                />
              </div>

              <div className="nord-lab-valve-toggle">
                <button
                  onClick={() => setValveMode("spray")}
                  className={`nord-lab-valve-btn ${valveMode === "spray" ? "active" : ""}`}
                >
                  🔫 РАСПЫЛЕНИЕ
                </button>
                <button
                  onClick={() => setValveMode("prime")}
                  className={`nord-lab-valve-btn ${valveMode === "prime" ? "active prime" : ""}`}
                >
                  🔄 ДРЕНАЖ
                </button>
              </div>
            </div>

            {/* 5. ИСПРАВЛЕННАЯ ТЕЛЕМЕТРИЯ СЛОЯ WFT (БЕЗ НУЛЕЙ!) */}
            <div className="nord-lab-card">
              <div className="nord-lab-card-header">
                <span className="nord-lab-card-title">
                  <IconGauge className="w-3.5 h-3.5 text-blue-400" />
                  Телеметрия слоя WFT
                </span>
                <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#34d399" }}>
                  Активно 60 Гц
                </span>
              </div>

              <div className="nord-lab-telemetry-grid">
                <div className="nord-lab-stat-box">
                  <span className="nord-lab-stat-label">Укрытая площадь</span>
                  <div className="nord-lab-stat-val">
                    {telemetry.coveredAreaM2}
                    <span className="nord-lab-stat-unit">/ 5.4 м²</span>
                  </div>
                </div>

                <div className="nord-lab-stat-box">
                  <span className="nord-lab-stat-label">Толщина WFT</span>
                  <div className="nord-lab-stat-val" style={{ color: telemetry.avgWftMicrons > material.sagThresholdMicrons ? "#f87171" : "#38bdf8" }}>
                    {telemetry.avgWftMicrons}
                    <span className="nord-lab-stat-unit">мкм</span>
                  </div>
                </div>

                <div className="nord-lab-stat-box">
                  <span className="nord-lab-stat-label">Равномерность</span>
                  <div className="nord-lab-stat-val" style={{ color: telemetry.uniformityPercent >= 88 ? "#34d399" : "#fbbf24" }}>
                    {telemetry.uniformityPercent}%
                  </div>
                </div>

                <div className="nord-lab-stat-box">
                  <span className="nord-lab-stat-label">Подтёки / Перепыл</span>
                  <div className="nord-lab-stat-val" style={{ color: telemetry.sagCount > 0 ? "#f87171" : "#34d399" }}>
                    {telemetry.sagCount} шт <span style={{ color: "#64748b" }}>/</span> {telemetry.oversprayPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Окупаемость и ФОТ */}
            <div className="nord-lab-roi-card">
              <div className="nord-lab-card-header">
                <span className="nord-lab-card-title" style={{ color: "#34d399" }}>
                  <IconZap className="w-3.5 h-3.5" />
                  Расчёт экономии ФОТ
                </span>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#8da2c0" }}>
                  Расход: {telemetry.litersUsed} л
                </span>
              </div>

              <div className="nord-lab-roi-summary" style={{ lineHeight: "1.45" }}>
                <div>
                  ⚡ Распыл NORD: <strong>{telemetry.activeSeconds} сек</strong>{" "}
                  <span style={{ color: "#8da2c0", fontSize: "10px" }}>
                    (чистый курок · техн. ~{Math.max(1, Math.round(roiMetrics.airlessTechSeconds / 60 * 10) / 10)} мин)
                  </span>
                </div>
                <div style={{ marginTop: "3px" }}>
                  🧱 Валиком вручную: <strong>~{roiMetrics.manualMinutesForCurrentWall} мин</strong>{" "}
                  <span style={{ color: "#34d399", fontWeight: "bold" }}>
                    ({roiMetrics.speedUpMultiplier}x быстрее)
                  </span>
                </div>
              </div>

              <div className="nord-lab-slider-row" style={{ marginBottom: "4px" }}>
                <div className="nord-lab-slider-label">
                  <span>Объект:</span>
                  <strong style={{ color: "#ffffff", fontFamily: "var(--font-mono)" }}>{projectAreaInput} м²</strong>
                </div>
                <input
                  type="range"
                  min={100}
                  max={3000}
                  step={100}
                  value={projectAreaInput}
                  onChange={(e) => setProjectAreaInput(Number(e.target.value))}
                  className="nord-lab-range"
                />
              </div>

              <div className="nord-lab-roi-row">
                <span style={{ color: "#8da2c0" }}>Сроки работ:</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  {roiMetrics.manualHoursTotal}ч → <strong style={{ color: "#34d399" }}>{roiMetrics.airlessHoursTotal}ч (быстрее на {roiMetrics.savedHours}ч)</strong>
                </span>
              </div>
              <div className="nord-lab-roi-row" style={{ marginTop: "3px", paddingTop: "3px", borderTop: "1px solid #142442", alignItems: "baseline" }}>
                <span style={{ color: "#ffffff", fontWeight: "bold" }}>Экономия ФОТ:</span>
                <span className="nord-lab-roi-accent">{roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽</span>
              </div>

              <button
                type="button"
                onClick={handleExportTechCardPdf}
                className="nord-lab-pdf-btn"
                style={{
                  marginTop: "8px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "7px 10px",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 95, 70, 0.25))",
                  border: "1px solid rgba(16, 185, 129, 0.45)",
                  borderRadius: "6px",
                  color: "#34d399",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title="Сформировать официальную технологическую карту и ТЭО в формате А4 (PDF) для руководства или инвестора"
              >
                <IconFileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>📄 Скачать Тех-карту и ТЭО (A4 PDF)</span>
              </button>
            </div>

            {/* 4. ГОТОВАЯ ИНЖЕНЕРНАЯ СБОРКА ПОД ВАШУ ЗАДАЧУ (КОНВЕРСИЯ В ПРОДАЖУ) */}
            <div className="nord-lab-bundle-card">
              <div className="nord-lab-bundle-header">
                <span className="nord-lab-bundle-title">
                  <IconZap className="w-3.5 h-3.5 text-amber-400" />
                  Инженерная сборка
                </span>
                <span className="nord-lab-bundle-badge">100% совместимо</span>
              </div>

              <div className="nord-lab-bundle-list">
                <div className="nord-lab-bundle-row">
                  <span className="nord-lab-bundle-label">Аппарат:</span>
                  <span className="nord-lab-bundle-val">{machine.name} ({machine.maxFlowLpm} л/мин)</span>
                </div>
                <div className="nord-lab-bundle-row">
                  <span className="nord-lab-bundle-label">Сопло:</span>
                  <span className="nord-lab-bundle-val">RAC X-HD {bundleInfo.recommendedTip} (Ø {bundleInfo.recTipObj.orificeMm} мм, {bundleInfo.recTipObj.fanWidthAt30cm} см)</span>
                </div>
                <div className="nord-lab-bundle-row">
                  <span className="nord-lab-bundle-label">Шланг ВД:</span>
                  <span className="nord-lab-bundle-val">{bundleInfo.hoseName}</span>
                </div>
                <div className="nord-lab-bundle-row">
                  <span className="nord-lab-bundle-label">Фильтрация:</span>
                  <span className="nord-lab-bundle-val">{bundleInfo.filterName}</span>
                </div>
              </div>

              <div className="nord-lab-bundle-footer">
                <div className="nord-lab-bundle-total-row">
                  <span className="nord-lab-bundle-total-label">Итого под ключ:</span>
                  <span className="nord-lab-bundle-total-price">{bundleInfo.totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <button
                  onClick={() => {
                    setLeadForm((f) => ({
                      ...f,
                      comment: `Инженерная сборка: ${machine.name} + Сопло X-HD ${bundleInfo.recommendedTip} + ${bundleInfo.hoseName} + ${bundleInfo.filterName}. Итого: ${bundleInfo.totalPrice.toLocaleString("ru-RU")} ₽`,
                    }));
                    setIsLeadModalOpen(true);
                  }}
                  className="nord-lab-bundle-btn-full"
                >
                  <IconZap className="w-4 h-4 text-amber-300" />
                  <span>Заказать готовую сборку</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* ВКЛАДКА 2: ИНЖЕНЕРНАЯ МАТЕМАТИЧЕСКАЯ МОДЕЛЬ */
        <section className="nord-lab-docs">
          <div className="nord-lab-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #162a50", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <span className="nord-lab-tag">MASTER BLUEPRINT</span>
                <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff", marginTop: "4px" }}>
                  Гидродинамическая модель безвоздушного распыления NORD
                </h1>
              </div>
              <button onClick={() => setActiveTab("simulator")} className="nord-lab-btn-upgrade">
                ← Назад к стенду
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="nord-lab-card">
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginBottom: "6px" }}>
                  1. Математика истечения смеси через сопло
                </h3>
                <div className="nord-lab-code-block">
                  {"// 1. Маркировка сопла X-HD 517 vs 535:\n"}
                  {"α_deg = Tip[0] * 10; // 5 -> 50° угол\n"}
                  {"d_inch = Tip.slice(1) / 1000; // 17 -> 0.017\"\n\n"}
                  {"// 2. Расход материала Q (л/мин):\n"}
                  {"Q = Q_base * sqrt(P / 150) / (μ_visc ^ 0.22);\n\n"}
                  {"// 3. Ширина факела на дистанции L (см):\n"}
                  {"W_fan = 2 * L * tan(α_deg / 2 * π / 180);\n\n"}
                  {"// 4. Распределение толщины мокрого слоя (Гаусс):\n"}
                  {"WFT(r) = (Q * 1000) / (W_fan * V_hand) * exp(-2.0 * (r/R)^2);"}
                </div>
              </div>

              <div className="nord-lab-card">
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginBottom: "6px" }}>
                  2. Архитектура симулятора
                </h3>
                <div className="nord-lab-code-block">
                  {"app/lab/\n"}
                  {"├── page.tsx          // React 19 Client Component\n"}
                  {"├── lab.css           // Swiss Blueprint & Cobalt Styles\n"}
                  {"└── WebAudioSynth     // Procedural pink noise + bandpass\n\n"}
                  {"Canvas Layers:\n"}
                  {"1. BaseWall:          // Архитектурный бетон, ГКЛ, металл\n"}
                  {"2. PaintPass:         // 6000 WFT-ячеек, подтёки, шпатель 60 см\n"}
                  {"3. Overlay:           // 2.5D пистолет, тень на стене, 3D-конус"}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* МОДАЛЬНОЕ ОКНО ЛИД-МАГНИТА */}
      {isLeadModalOpen && (
        <div className="nord-lab-modal-overlay">
          <div className="nord-lab-modal">
            <button onClick={() => setIsLeadModalOpen(false)} className="nord-lab-modal-close">✕</button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div className="nord-lab-challenge-icon unlocked" style={{ width: "40px", height: "40px" }}>
                <IconAward className="w-5 h-5" />
              </div>
              <div>
                <span className="nord-lab-tag">СЕРТИФИКАТ ИСПЫТАНИЙ</span>
                <div style={{ fontSize: "15px", fontWeight: "900", color: "#ffffff", marginTop: "2px" }}>
                  {challengeUnlocked ? "Поздравляем! Тест мастера пройден" : "Конфигурация стенда NORD LAB"}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "6px", padding: "10px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "11px", color: "#a7f3d0" }}>
                🎁 <strong>Подарок к заказу:</strong> Комплект сопел X-HD + разделительное масло NORD TSL
              </div>
              <button onClick={handleCopyPromo} className="nord-lab-btn-upgrade" style={{ padding: "5px 10px", fontSize: "10px", background: "#10b981" }}>
                {copiedPromo ? "СКОПИРОВАНО" : "NORD-PRO-TSL"}
              </button>
            </div>

            {leadForm.comment ? (
              <div style={{ background: "rgba(30, 79, 163, 0.18)", border: "1px solid #3b82f6", borderRadius: "6px", padding: "10px", fontSize: "11px", color: "#93c5fd", marginBottom: "12px", lineHeight: "1.4" }}>
                <strong>Выбранная инженерная сборка:</strong>
                <div style={{ marginTop: "4px", color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "10.5px" }}>{leadForm.comment}</div>
              </div>
            ) : (
              <div style={{ background: "#060e1a", border: "1px solid #111e33", borderRadius: "6px", padding: "10px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "#cbd5e1", marginBottom: "12px", lineHeight: "1.55" }}>
                <div>Аппарат: <strong style={{ color: "#38bdf8" }}>{machine.name}</strong> ({machine.maxFlowLpm} л/мин)</div>
                <div>Состав: <strong style={{ color: "#ffffff" }}>{material.name}</strong> · Сопло {tip.code}</div>
                <div>Результат: <strong style={{ color: "#34d399" }}>{telemetry.coveredAreaM2} м²</strong> · Равномерность {telemetry.uniformityPercent}%</div>
                <div>Экономия ФОТ на {projectAreaInput} м²: <strong style={{ color: "#34d399" }}>{roiMetrics.savedRublesFot.toLocaleString("ru-RU")} ₽</strong></div>
              </div>
            )}

            {leadForm.submitted ? (
              <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "6px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontWeight: "bold", color: "#34d399", fontSize: "12px" }}>Заявка передана инженеру NORD!</div>
                <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "3px" }}>
                  Мы свяжемся с вами в течение 10 минут и закрепим подарок по промокоду NORD-PRO-TSL.
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setLeadForm((p) => ({ ...p, submitted: true }));
                }}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя / Компания"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))}
                    style={{ background: "#060e1a", border: "1px solid #142442", borderRadius: "5px", padding: "7px 9px", fontSize: "11px", color: "#ffffff" }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm((p) => ({ ...p, phone: e.target.value }))}
                    style={{ background: "#060e1a", border: "1px solid #142442", borderRadius: "5px", padding: "7px 9px", fontSize: "11px", color: "#ffffff" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <button type="submit" className="nord-lab-btn-upgrade" style={{ flex: 1, justifyContent: "center" }}>
                    Закрепить бонус и получить КП
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(generatedLeadMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="nord-lab-btn-upgrade"
                    style={{ background: "#059669", textDecoration: "none" }}
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent("https://nord-airless.ru")}&text=${encodeURIComponent(generatedLeadMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="nord-lab-btn-upgrade"
                    style={{ background: "#0284c7", textDecoration: "none" }}
                  >
                    Telegram
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
