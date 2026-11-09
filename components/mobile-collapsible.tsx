"use client";

import { useEffect, useState, type ReactNode } from "react";

const MOBILE_QUERY = "(max-width: 768px)";

/**
 * На компьютере — обычный раскрытый раздел (выглядит как прежде).
 * На телефоне — сворачиваемый блок, открывается по нажатию на заголовок.
 */
export function MobileCollapsible({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const apply = () => {
      setIsMobile(media.matches);
      setOpen(!media.matches);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <div className={`detail-section${isMobile ? " m-collapsible" : ""}${open ? " is-open" : ""}`}>
      {isMobile ? (
        <button type="button" className="m-collapsible-head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <h3>{title}</h3>
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      ) : (
        <h3>{title}</h3>
      )}
      {open && children}
    </div>
  );
}
