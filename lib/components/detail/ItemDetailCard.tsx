"use client";

import { useRef } from "react";
import Image from "next/image";
import type { UiItem } from "./types";

type Props = {
  item: UiItem;
  index: number;
  onActivate: () => void;
  onDeactivate: () => void;
};

/**
 * ItemDetailCard - Magazine-style item card
 *
 * Design:
 * - Large decorative index number (01, 02...)
 * - Elegant serif typography
 * - Refined neutral colors
 * - Layered layout for editorial feel
 */
export function ItemDetailCard({
  item,
  index,
  onActivate,
  onDeactivate,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formattedIndex = String(index + 1).padStart(2, "0");

  // #region agent log
  if (index === 0) {
    fetch("http://127.0.0.1:7242/ingest/89712f27-6a22-414e-81e7-beea00d23671", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "ItemDetailCard.tsx:30",
        message: "Rendering first card",
        data: { itemId: item.id, index },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "H4",
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <div
      ref={cardRef}
      data-item-index={index}
      className="group relative mb-32 flex min-h-[60vh] flex-col justify-center py-10 lg:mb-40 lg:min-h-[80vh]"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      {/* Decorative Background Index */}
      <div
        className="absolute -left-12 -top-10 z-0 select-none font-serif text-[12rem] font-bold leading-none text-muted/20 md:-left-20 md:text-[16rem]"
        aria-hidden="true"
      >
        {formattedIndex}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Text Content */}
        <div className="flex-1">
          {/* Brand Label */}
          {item.brand && (
            <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {item.brand}
            </p>
          )}

          {/* Product Name */}
          <h2 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {item.product_name || `Item ${formattedIndex}`}
          </h2>

          {/* Price & Details Row */}
          <div className="flex items-center gap-6">
            {item.price && (
              <p className="font-sans text-2xl font-light text-foreground/90 md:text-3xl">
                {item.price}
              </p>
            )}

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Metadata / Specs (Optional expanded content could go here) */}
          {item.id && (
            <div className="mt-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <p className="font-mono text-xs text-muted-foreground/50">
                ID: {item.id.slice(0, 8)}
              </p>
            </div>
          )}
        </div>

        {/* Item Image */}
        {item.imageUrl && (
          <div className="relative w-full lg:w-80 lg:shrink-0 aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.product_name || `Item ${formattedIndex}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 320px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
