"use client";

import React from "react";

interface ProgressGlowProps {
  progress: number; // 0-100
}

/**
 * Horizontal progress bar with accent glow.
 * Progress is driven by parent via props (GSAP in parent animates the value).
 */
export function ProgressGlow({ progress }: ProgressGlowProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-4/5 mx-auto">
      {/* Bar track */}
      <div className="relative h-[3px] w-full bg-mag-text/10 rounded-full overflow-hidden">
        {/* Bar fill */}
        <div
          className="absolute inset-y-0 left-0 bg-mag-accent rounded-full"
          style={{
            transform: `scaleX(${clampedProgress / 100})`,
            transformOrigin: "left",
            boxShadow: "0 0 15px var(--mag-accent)",
          }}
        />
      </div>

      {/* Percentage text */}
      <p className="text-mag-accent text-xs text-center mt-2 tabular-nums">
        {Math.round(clampedProgress)}%
      </p>
    </div>
  );
}
