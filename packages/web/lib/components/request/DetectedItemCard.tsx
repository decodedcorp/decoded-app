"use client";

import { memo, forwardRef } from "react";
import Image from "next/image";
import { type DetectedSpot } from "@/lib/stores/requestStore";

interface DetectedItemCardProps {
  spot: DetectedSpot;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * DetectedItemCard - 컴팩트한 아이템 카드 (썸네일 포함)
 */
export const DetectedItemCard = memo(
  forwardRef<HTMLButtonElement, DetectedItemCardProps>(
    ({ spot, isSelected, onClick }, ref) => {
      return (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          className={`
            w-full text-left p-2 rounded-lg
            bg-card border transition-all duration-200
            ${
              isSelected
                ? "border-primary shadow-[0_0_8px_oklch(0.9519_0.1739_115.8446_/_0.5)]"
                : "border-border hover:border-primary/50"
            }
          `}
          aria-pressed={isSelected}
        >
          <div className="flex gap-3 items-center">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-muted">
              {spot.imageUrl ? (
                <Image
                  src={spot.imageUrl}
                  alt={spot.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No img
                </div>
              )}
              {/* Index badge overlay */}
              <div
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5
                  flex items-center justify-center
                  rounded-full text-[10px] font-bold
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/80 text-foreground border border-primary"
                  }
                `}
              >
                {spot.index}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Label + Brand */}
              <div className="flex items-center gap-1.5 mb-0.5">
                {spot.label && (
                  <span className="text-[10px] font-medium text-primary">
                    {spot.label}
                  </span>
                )}
                {spot.brand && (
                  <span className="text-[10px] text-muted-foreground">
                    {spot.brand}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium text-foreground truncate">
                {spot.title}
              </h3>

              {/* Price */}
              {spot.priceRange && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {spot.priceRange}
                </p>
              )}
            </div>
          </div>
        </button>
      );
    }
  )
);

DetectedItemCard.displayName = "DetectedItemCard";
