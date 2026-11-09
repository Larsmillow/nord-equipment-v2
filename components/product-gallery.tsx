"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/catalog";

export function ProductGallery({
  images,
  fallback,
  name,
}: {
  images: ProductImage[];
  fallback: string;
  name: string;
}) {
  const collection = images.length ? images : [{ src: fallback, alt: name }];
  const [selected, setSelected] = useState(collection[0]);
  return (
    <div>
      <div className="gallery-main">
        <img
          src={selected.src}
          alt={selected.alt || name}
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
        />
      </div>
      {collection.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label={`Фотографии ${name}`}>
          {collection.map((image, index) => (
            <button
              className="gallery-thumb"
              key={image.src}
              type="button"
              aria-label={`Фото ${index + 1}: ${image.alt}`}
              aria-pressed={selected.src === image.src}
              onClick={() => setSelected(image)}
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
