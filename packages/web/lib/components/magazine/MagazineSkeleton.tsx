"use client";

import React from "react";

/**
 * Full-page magazine skeleton loader.
 * Matte black background with accent-color pulsing glow animation.
 */
export function MagazineSkeleton() {
  return (
    <div className="relative min-h-screen bg-mag-bg">
      <style jsx>{`
        @keyframes mag-pulse {
          0%,
          100% {
            box-shadow: 0 0 0px var(--mag-accent, #eafd67);
            opacity: 0.3;
          }
          50% {
            box-shadow: 0 0 20px var(--mag-accent, #eafd67);
            opacity: 0.6;
          }
        }
        .mag-skeleton-block {
          animation: mag-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Hero placeholder */}
      <div className="mag-skeleton-block mx-auto h-[60vh] w-full rounded-lg bg-mag-text/5" />

      {/* Content blocks */}
      <div className="mx-auto mt-8 max-w-3xl space-y-6 px-6">
        {/* Title block */}
        <div
          className="mag-skeleton-block h-8 w-3/4 rounded bg-mag-text/5"
          style={{ animationDelay: "0.3s" }}
        />

        {/* Body text block */}
        <div
          className="mag-skeleton-block h-24 w-full rounded bg-mag-text/5"
          style={{ animationDelay: "0.6s" }}
        />

        {/* Items row */}
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="mag-skeleton-block aspect-[3/4] rounded-lg bg-mag-text/5"
              style={{ animationDelay: `${0.9 + i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
