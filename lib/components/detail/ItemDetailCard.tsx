"use client";

import { useRef } from "react";
import type { NormalizedItem } from "./types";

type Props = {
  item: NormalizedItem;
  index: number;
  onActivate: () => void;
  onDeactivate: () => void;
};

/**
 * ItemDetailCard - Magazine-style item card
 *
 * Design:
 * - Serif font for title (magazine feel)
 * - Sans-Serif for body text (technical info)
 * - Clean, minimal layout
 * - ScrollTrigger integration via data attributes
 */
export function ItemDetailCard({
  item,
  index,
  onActivate,
  onDeactivate,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      data-item-index={index}
      className="mb-32 lg:mb-40 min-h-[60vh] lg:min-h-[80vh] flex flex-col justify-center"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      {/* Product Name (Serif) */}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
        {item.product_name || `Item ${index + 1}`}
      </h2>

      {/* Brand (Sans-Serif, smaller) */}
      {item.brand && (
        <p className="font-sans text-lg md:text-xl text-muted-foreground mb-4 uppercase tracking-wider">
          {item.brand}
        </p>
      )}

      {/* Price (Sans-Serif, accent color) */}
      {item.price && (
        <p className="font-sans text-2xl md:text-3xl font-semibold text-scanner-green mb-8">
          {item.price}
        </p>
      )}

      {/* Divider */}
      <div className="w-20 h-px bg-border mb-8" />

      {/* Additional Info */}
      <div className="font-sans text-sm text-muted-foreground space-y-2">
        {item.id && (
          <p>
            <span className="uppercase tracking-wide">ID:</span>{" "}
            <code className="text-xs">{item.id}</code>
          </p>
        )}
        {item.created_at && (
          <p>
            <span className="uppercase tracking-wide">Added:</span>{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

