"use client";

/**
 * GrainOverlay - Fixed full-screen SVG noise grain texture overlay.
 * Uses <feTurbulence> for pure CSS/SVG noise with no external assets.
 * Renders at very low opacity for a subtle cinematic film grain effect.
 */
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30"
      style={{ opacity: 0.05 }}
    >
      <svg className="h-full w-full">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain-filter)"
          opacity="1"
        />
      </svg>
    </div>
  );
}
