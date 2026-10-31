"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_CONFIG } from "@/lib/site-config";

export function ContactRequestForm({ subject = "" }: { subject?: string }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setError("Подтвердите согласие на обработку персональных данных.");
      return;
    }
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          phone: values.get("phone"),
          email: values.get("email"),
          message: values.get("message"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось отправить заявку.");
      setStatus(result.message || "Заявка принята в работу.");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки. Позвоните нам напрямую.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form-card">
      <div className="form-card-header">
        <div>
          <p className="eyebrow">Инженерный отдел NORD</p>
          <h2>Запрос КП, счёта или подбора станции</h2>
        </div>
        <div className="form-direct-badge">
          <span>Прямая линия:</span>
          <a href={SITE_CONFIG.phoneHref}>{SITE_CONFIG.phone}</a>
        </div>
      </div>
      <p className="form-note">
        Укажите материал (краска, полимерная шпаклёвка, огнезащита), площадь работ или модель — инженер подготовит коммерческое предложение и проверит резерв на складе в Москве.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Ваше имя или организация *</span>
            <input
              className="form-control"
              name="name"
              autoComplete="name"
              placeholder="Алексей / ООО «СпецСтрой»"
              minLength={2}
              required
            />
          </label>
          <label className="form-field">
            <span>Телефон для связи *</span>
            <input
              className="form-control"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </label>
          <label className="form-field form-field-wide">
            <span>Email (для отправки счёта или коммерческого предложения)</span>
            <input
              className="form-control"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="snab@company.ru"
            />
          </label>
          <label className="form-field form-field-wide">
            <span>Задача, материал или модель оборудования *</span>
            <textarea
              className="form-control"
              name="message"
              defaultValue={subject}
              placeholder="Например: нужен счёт с НДС на PUTTER 9528-X или подбор станции под шпаклёвку Danogips на 3 000 м²"
              minLength={3}
              required
            />
          </label>
        </div>
        <label className="consent-checkbox" style={{ margin: "14px 0" }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
          <span>
            Согласен с <Link href="/privacy">Политикой обработки персональных данных</Link>
          </span>
        </label>
        <div className="hero-actions">
          <button className="button button-primary" type="submit" disabled={busy}>
            {busy ? "Отправляем заявку…" : "Отправить запрос инженеру"}
          </button>
          <a className="button button-outline" href={SITE_CONFIG.phoneHref}>
            Позвонить: {SITE_CONFIG.phone}
          </a>
        </div>
      </form>
      {status && (
        <p className="form-status is-success" role="status">
          ✓ {status}
        </p>
      )}
      {error && (
        <p className="form-status is-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
