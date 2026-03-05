"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SpotMarker {
  id: string;
  x: number;
  y: number;
  label?: string;
  post_id?: string;
}

interface MagazineHeroProps {
  data: Record<string, unknown>;
  className?: string;
}

const MagazineHero = forwardRef<HTMLDivElement, MagazineHeroProps>(
  ({ data, className }, ref) => {
    const router = useRouter();

    const imageUrl = data.image_url as string;
    const headline = data.headline as string;
    const spots = data.spots as SpotMarker[] | undefined;

    return (
      <div
        ref={ref}
        className={`relative w-full overflow-hidden rounded-lg ${className ?? ""}`}
        style={{ minHeight: "60vh" }}
      >
        {/* Background image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={headline || "Magazine hero"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-mag-bg/80 via-transparent to-transparent" />

        {/* Spot markers */}
        {spots?.map((spot) => (
          <button
            key={spot.id}
            className="group absolute z-10 flex items-center justify-center"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => {
              if (spot.post_id) {
                router.push(`/posts/${spot.post_id}`);
              } else {
                console.log("Spot clicked:", spot.id, spot.label);
              }
            }}
            aria-label={spot.label || `Spot ${spot.id}`}
          >
            {/* Accent glow dot */}
            <span className="block h-3 w-3 rounded-full bg-mag-accent shadow-[0_0_8px_var(--mag-accent)] transition-transform group-hover:scale-150" />

            {/* Tooltip on hover */}
            {spot.label && (
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-mag-bg/90 px-2 py-1 text-xs text-mag-text opacity-0 transition-opacity group-hover:opacity-100">
                {spot.label}
              </span>
            )}
          </button>
        ))}

        {/* Headline overlay */}
        {headline && (
          <div className="absolute bottom-0 left-0 z-10 p-6 md:p-10">
            <h1
              className="font-bold text-mag-text"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
                lineHeight: 1.1,
              }}
            >
              {headline}
            </h1>
          </div>
        )}
      </div>
    );
  },
);

MagazineHero.displayName = "MagazineHero";

export { MagazineHero };
