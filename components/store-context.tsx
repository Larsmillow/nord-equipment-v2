"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CommerceMode = "buy" | "rent";
export type CartLine = { productId: string; quantity: number; mode: CommerceMode };

type StoreContextValue = {
  mode: CommerceMode;
  setMode: (mode: CommerceMode) => void;
  cart: CartLine[];
  addToCart: (productId: string, mode: CommerceMode) => void;
  updateQuantity: (productId: string, mode: CommerceMode, quantity: number) => void;
  removeFromCart: (productId: string, mode?: CommerceMode) => void;
  clearCart: (mode?: CommerceMode) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return typeof line.productId === "string"
    && typeof line.quantity === "number"
    && Number.isInteger(line.quantity)
    && line.quantity > 0
    && line.quantity <= 25
    && (line.mode === "buy" || line.mode === "rent");
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<CommerceMode>("buy");
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    const rawMode = localStorage.getItem("nord_mode");
    let savedMode = rawMode;
    if (rawMode) {
      try {
        const parsedMode: unknown = JSON.parse(rawMode);
        if (typeof parsedMode === "string") savedMode = parsedMode;
      } catch {
        savedMode = rawMode;
      }
    }
    if (savedMode === "buy" || savedMode === "rent") setModeState(savedMode);
    try {
      const rawCart = localStorage.getItem("nord-store-cart");
      if (rawCart !== null) {
        const savedCart: unknown = JSON.parse(rawCart);
        if (Array.isArray(savedCart)) setCart(savedCart.filter(isCartLine));
      } else {
        const legacyCart: unknown = JSON.parse(localStorage.getItem("nord-v2-cart") || "null");
        if (typeof legacyCart === "object" && legacyCart !== null && !Array.isArray(legacyCart)) {
          const migratedCart = Object.entries(legacyCart).flatMap(([productId, quantity]) =>
            typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0
              ? [{ productId, quantity: Math.min(quantity, 25), mode: "buy" as const }]
              : [],
          );
          setCart(migratedCart);
          localStorage.setItem("nord-store-cart", JSON.stringify(migratedCart));
        }
      }
    } catch (error) {
      console.error("Unable to restore the saved cart.", error);
    }
  }, []);

  const setMode = (nextMode: CommerceMode) => {
    setModeState(nextMode);
    localStorage.setItem("nord_mode", nextMode);
  };

  const persistCart = (nextCart: CartLine[]) => {
    setCart(nextCart);
    localStorage.setItem("nord-store-cart", JSON.stringify(nextCart));
  };

  const value = useMemo<StoreContextValue>(() => ({
    mode,
    setMode,
    cart,
    addToCart(productId, itemMode) {
      const existing = cart.find((item) => item.productId === productId && item.mode === itemMode);
      persistCart(existing
        ? cart.map((item) => item === existing ? { ...item, quantity: Math.min(item.quantity + 1, 25) } : item)
        : [...cart, { productId, quantity: 1, mode: itemMode }]);
    },
    updateQuantity(productId, itemMode, quantity) {
      if (quantity <= 0) {
        persistCart(cart.filter((item) => !(item.productId === productId && item.mode === itemMode)));
        return;
      }
      persistCart(cart.map((item) => item.productId === productId && item.mode === itemMode ? { ...item, quantity } : item));
    },
    removeFromCart(productId, itemMode) {
      persistCart(cart.filter((item) => itemMode ? !(item.productId === productId && item.mode === itemMode) : item.productId !== productId));
    },
    clearCart(itemMode) {
      persistCart(itemMode ? cart.filter((item) => item.mode !== itemMode) : []);
    },
  }), [mode, cart]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("Store components must be rendered inside StoreProvider.");
  return value;
}
