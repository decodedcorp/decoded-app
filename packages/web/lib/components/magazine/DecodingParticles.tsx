"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface DecodingParticlesProps {
  isActive: boolean;
  imageUrls?: string[];
}

/** Number of particles to render */
const PARTICLE_COUNT = 10;

/** Generate a random edge position (top, bottom, left, or right of viewport) */
function randomEdgePosition(): { x: number; y: number } {
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: // top
      return { x: Math.random() * 100, y: -8 };
    case 1: // bottom
      return { x: Math.random() * 100, y: 108 };
    case 2: // left
      return { x: -8, y: Math.random() * 100 };
    case 3: // right
    default:
      return { x: 108, y: Math.random() * 100 };
  }
}

/**
 * Animated particles that converge from screen edges toward the center.
 * Uses GSAP for centripetal motion with staggered timing.
 */
export function DecodingParticles({
  isActive,
  imageUrls,
}: DecodingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isActive) {
      // Clean up and hide
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      return;
    }

    ctxRef.current = gsap.context(() => {
      function animateParticles() {
        const particles = particleRefs.current.filter(Boolean);

        particles.forEach((el, i) => {
          if (!el) return;
          const edge = randomEdgePosition();

          // Set initial position at random edge
          gsap.set(el, {
            xPercent: 0,
            yPercent: 0,
            left: `${edge.x}%`,
            top: `${edge.y}%`,
            scale: 1,
            opacity: 0.8,
          });

          const staggerDelay = i * (0.2 + Math.random() * 0.3);
          const duration = 2 + Math.random() * 2;

          gsap.to(el, {
            left: "50%",
            top: "50%",
            scale: 0,
            opacity: 0,
            duration,
            delay: staggerDelay,
            ease: "power2.inOut",
            onComplete: () => {
              // Check if last particle finished
              if (i === particles.length - 1) {
                // Restart loop
                gsap.delayedCall(0.3, animateParticles);
              }
            },
          });
        });
      }

      animateParticles();
    }, container);

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const hasImage = imageUrls && imageUrls[i % imageUrls.length];

        return (
          <div
            key={i}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className="absolute w-[60px] h-[60px] rounded-full overflow-hidden"
            style={{ opacity: 0 }}
          >
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrls![i % imageUrls!.length]}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-mag-accent/40" />
            )}
          </div>
        );
      })}
    </div>
  );
}
