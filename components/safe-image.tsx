"use client";

import React from "react";
import { getProductFallbackImage } from "@/lib/product-utils";

export function SafeImage({
  src,
  alt,
  fallbackHint,
  className,
}: {
  src: string;
  alt: string;
  fallbackHint?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const fallback = getProductFallbackImage(fallbackHint || alt || src);
        if (!e.currentTarget.src.endsWith(fallback)) {
          e.currentTarget.src = fallback;
        }
      }}
    />
  );
}
