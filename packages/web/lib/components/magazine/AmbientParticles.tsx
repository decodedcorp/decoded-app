"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AmbientParticlesProps {
  isActive: boolean;
}

const PARTICLE_COUNT = 18;

/** Generate a random viewport position (percentage 0-100) */
function randomPos() {
  return { x: Math.random() * 100, y: Math.random() * 100 };
}

/**
 * AmbientParticles - Drifting chartreuse particles that float across the viewport.
 * Unlike DecodingParticles (converges to center), these drift in slow random arcs.
 */
export function AmbientParticles({ isActive }: AmbientParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      return;
    }

    ctxRef.current = gsap.context(() => {
      const particles = particleRefs.current.filter(Boolean);

      particles.forEach((el) => {
        if (!el) return;
        const start = randomPos();
        const size = 4 + Math.random() * 4;
        const opacity = 0.15 + Math.random() * 0.25;

        gsap.set(el, {
          left: `${start.x}%`,
          top: `${start.y}%`,
          width: size,
          height: size,
          opacity,
        });

        function drift() {
          const target = randomPos();
          const duration = 8 + Math.random() * 7;

          gsap.to(el!, {
            left: `${target.x}%`,
            top: `${target.y}%`,
            duration,
            ease: "sine.inOut",
            onComplete: drift,
          });
        }

        // Stagger the start
        gsap.delayedCall(Math.random() * 3, drift);
      });
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
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-20"
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
          className="absolute rounded-full"
          style={{ backgroundColor: "#eafd67", opacity: 0 }}
        />
      ))}
    </div>
  );
}
