"use client";

import { memo } from "react";
import { type DetectedSpot } from "@/lib/stores/requestStore";

interface SpotMarkerProps {
  spot: DetectedSpot;
  isSelected?: boolean;
  onClick?: () => void;
  isRevealing?: boolean;
  revealDelay?: number; // Y 위치 기반 delay (ms)
}

/**
 * SpotMarker - AI 감지된 아이템 위치를 표시하는 마커
 *
 * - 원형 마커 (24px)
 * - 내부에 index 숫자 표시
 * - hover 시 확대 + 색상 변경
 * - 위치: absolute, left/top % 기반
 */
export const SpotMarker = memo(
  ({
    spot,
    isSelected = false,
    onClick,
    isRevealing = false,
    revealDelay = 0,
  }: SpotMarkerProps) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          absolute w-7 h-7
          flex items-center justify-center
          rounded-full text-xs font-bold
          ${isRevealing ? "" : "transition-all duration-200 ease-out"}
          ${isRevealing ? "animate-spot-reveal" : ""}
          ${
            isSelected
              ? "bg-primary text-primary-foreground scale-125"
              : "bg-primary/20 text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground hover:scale-110"
          }
        `}
        style={{
          left: `${spot.center.x * 100}%`,
          top: `${spot.center.y * 100}%`,
          animationDelay: isRevealing ? `${revealDelay}ms` : undefined,
          opacity: isRevealing ? 0 : 1,
          boxShadow: isSelected
            ? "0 0 12px oklch(0.9519 0.1739 115.8446), 0 0 24px oklch(0.9519 0.1739 115.8446 / 0.5)"
            : "0 0 8px oklch(0.9519 0.1739 115.8446 / 0.5)",
        }}
        aria-label={`Spot ${spot.index}${spot.label ? `: ${spot.label}` : ""}`}
      >
        {spot.index}
      </button>
    );
  }
);

SpotMarker.displayName = "SpotMarker";
