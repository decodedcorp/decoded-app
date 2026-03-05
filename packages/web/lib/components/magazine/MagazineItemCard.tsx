"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

interface MagazineItemCardProps {
  data: Record<string, unknown>;
  className?: string;
}

const MagazineItemCard = forwardRef<HTMLDivElement, MagazineItemCardProps>(
  ({ data, className }, ref) => {
    const imageUrl = data.image_url as string;
    const name = data.name as string;
    const brand = data.brand as string;
    const price = data.price as string;
    const discountRate = data.discount_rate as number | undefined;

    return (
      <div
        ref={ref}
        className={`group cursor-pointer overflow-hidden rounded-lg bg-mag-bg/50 transition-shadow duration-300 hover:shadow-[0_0_20px_var(--mag-accent)] ${className ?? ""}`}
        onClick={() => {
          console.log("Navigate to product:", data.product_id || name);
        }}
      >
        {/* Product image */}
        {imageUrl && (
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={name || "Product"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        )}

        {/* Product info */}
        <div className="space-y-1 p-3">
          {brand && (
            <p className="text-xs uppercase tracking-wider text-mag-text/60">
              {brand}
            </p>
          )}
          {name && (
            <p className="truncate text-sm font-medium text-mag-text">
              {name}
            </p>
          )}
          <div className="flex items-center gap-2">
            {price && (
              <p className="text-sm font-semibold text-mag-accent">{price}</p>
            )}
            {discountRate != null && discountRate > 0 && (
              <span className="rounded bg-mag-accent/20 px-1.5 py-0.5 text-xs font-medium text-mag-accent">
                -{discountRate}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

MagazineItemCard.displayName = "MagazineItemCard";

export { MagazineItemCard };
