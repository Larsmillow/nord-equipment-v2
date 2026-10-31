"use client";

import { useEffect, useState } from "react";

const favoritesKey = "nord-v2-favorites";

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    return Array.isArray(stored) ? stored.filter((value): value is string => typeof value === "string") : [];
  } catch (error) {
    console.error("Unable to read saved favorites.", error);
    return [];
  }
}

export function FavoriteToggle({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(readFavorites().includes(productId)), [productId]);

  function toggle() {
    const favorites = readFavorites();
    const next = saved ? favorites.filter((id) => id !== productId) : [...favorites, productId];
    localStorage.setItem(favoritesKey, JSON.stringify(next));
    setSaved(!saved);
    window.dispatchEvent(new Event("nord-favorites-change"));
  }

  return (
    <button
      className={`icon-button${saved ? " is-active" : ""}`}
      type="button"
      aria-label={saved ? "Убрать из избранного" : "В избранное"}
      aria-pressed={saved}
      title={saved ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5 4.8 13.4a4.8 4.8 0 0 1 6.8-6.8l.4.4.4-.4a4.8 4.8 0 0 1 6.8 6.8L12 20.5z" />
      </svg>
    </button>
  );
}
