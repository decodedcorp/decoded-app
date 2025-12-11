"use client";

import { useRef, useEffect } from "react";
import type { ImageRow } from "@/lib/supabase/types";
import type { UiItem } from "./types";
import { getHighlightStyle } from "./types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Props = {
  image: ImageRow;
  items: UiItem[];
  activeIndex: number | null;
};

/**
 * ImageCanvas - Main image display with spotlight effect
 *
 * Features:
 * - Spotlight effect: Active item stays in color, rest is grayscale
 * - Coordinate-based highlighting boxes
 * - Pan & Zoom effect (scale + translation, not transform-origin)
 */
export function ImageCanvas({ image, items, activeIndex }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom effect: Calculate scale and translation
  useGSAP(
    () => {
      if (!imageRef.current || activeIndex === null) {
        // Reset to default state
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        }
        return;
      }

      const activeItem = items[activeIndex];
      if (!activeItem?.normalizedCenter || !activeItem?.normalizedBox) {
        return;
      }

      const center = activeItem.normalizedCenter;
      const scale = 1.5; // Zoom level

      // Calculate translation to center the item
      // When scaled, we need to offset by (center - 0.5) * (scale - 1) * containerSize
      if (containerRef.current && imageRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        // Calculate offset needed to center the item
        const offsetX = (center.x - 0.5) * (scale - 1) * imageRect.width;
        const offsetY = (center.y - 0.5) * (scale - 1) * imageRect.height;

        gsap.to(imageRef.current, {
          scale,
          x: -offsetX,
          y: -offsetY,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    },
    { scope: containerRef, dependencies: [activeIndex] }
  );

  // Spotlight effect: Update overlay mask
  useEffect(() => {
    if (!overlayRef.current) return;

    if (activeIndex === null) {
      // No active item: remove spotlight
      overlayRef.current.style.filter = "none";
      overlayRef.current.style.opacity = "0";
      return;
    }

    const activeItem = items[activeIndex];
    if (!activeItem?.normalizedBox) {
      return;
    }

    // Create clip-path for spotlight effect
    const box = activeItem.normalizedBox;
    const clipPath = `polygon(
      0% 0%,
      0% 100%,
      ${box.left * 100}% 100%,
      ${box.left * 100}% ${box.top * 100}%,
      ${(box.left + box.width) * 100}% ${box.top * 100}%,
      ${(box.left + box.width) * 100}% ${(box.top + box.height) * 100}%,
      ${box.left * 100}% ${(box.top + box.height) * 100}%,
      ${box.left * 100}% 100%,
      100% 100%,
      100% 0%
    )`;

    overlayRef.current.style.clipPath = clipPath;
    // Softer spotlight effect
    overlayRef.current.style.filter = "grayscale(60%) brightness(0.6)";
    overlayRef.current.style.opacity = "1";
  }, [activeIndex, items]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {image.image_url && (
        <>
          {/* Main Image */}
          <img
            ref={imageRef}
            src={image.image_url}
            alt={`Image ${image.id}`}
            className="h-full w-full object-cover will-change-transform"
            style={{ transformOrigin: "center center" }}
            loading="lazy"
          />

          {/* Spotlight Overlay (grayscale mask) */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/40 transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          />

          {/* Highlight Boxes */}
          {items.map((item, index) => {
            if (!item.normalizedBox) return null;

            const isActive = index === activeIndex;
            const style = getHighlightStyle(item.normalizedBox);

            return (
              <div
                key={item.id}
                className={`absolute transition-all duration-300 pointer-events-none ${
                  isActive
                    ? "border border-white/90 shadow-sm opacity-100"
                    : "border-0 opacity-0"
                }`}
                style={style}
              >
                {/* Index Label */}
                {isActive && (
                  <div className="absolute -top-6 left-0 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
