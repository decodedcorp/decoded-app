"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

interface MagazineGalleryProps {
  data: Record<string, unknown>;
  className?: string;
}

const MagazineGallery = forwardRef<HTMLDivElement, MagazineGalleryProps>(
  ({ data, className }, ref) => {
    const images = (data.images as string[]) || [];
    const scrollDirection =
      (data.scroll_direction as string) || "vertical";

    if (images.length === 0) return null;

    // Horizontal scroll variant
    if (scrollDirection === "horizontal") {
      return (
        <div
          ref={ref}
          className={`flex gap-3 overflow-x-auto pb-2 ${className ?? ""}`}
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square w-48 flex-shrink-0 overflow-hidden rounded-lg"
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          ))}
        </div>
      );
    }

    // Vertical grid variant (default)
    return (
      <div
        ref={ref}
        className={`grid gap-3 ${className ?? ""}`}
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    );
  },
);

MagazineGallery.displayName = "MagazineGallery";

export { MagazineGallery };
