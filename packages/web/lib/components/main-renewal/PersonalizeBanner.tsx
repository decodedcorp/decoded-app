"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { PersonalizeBannerData } from "./types";

gsap.registerPlugin(ScrollTrigger);

interface PersonalizeBannerProps {
  data: PersonalizeBannerData;
  className?: string;
}

/**
 * Predefined scattered positions for the 5 suction-animation images.
 * Each entry: [x%, y%, rotation] -- spread around the banner edges.
 */
const SCATTER_POSITIONS: [number, number, number][] = [
  [8, 12, -12],
  [78, 8, 10],
  [5, 70, 8],
  [82, 65, -15],
  [45, 5, 5],
];

/**
 * PersonalizeBanner -- Soft Wall CTA section.
 *
 * Images scattered around edges converge toward center on scroll (suction effect).
 * Headline + CTA encourage login through compelling animation rather than hard gates.
 */
export default function PersonalizeBanner({ data, className }: PersonalizeBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  /* ---- Suction animation: images converge to center on scroll ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animate each scattered image toward center
      imagesRef.current.forEach((img, i) => {
        if (!img) return;

        const pos = SCATTER_POSITIONS[i] ?? SCATTER_POSITIONS[0];
        // Starting position is the scattered position (set via CSS)
        // Target: center of the banner, scaled down
        gsap.to(img, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          scale: 0.3,
          rotation: pos[2] * 1.5,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "bottom 30%",
            scrub: 1,
          },
        });
      });

      // Text entry: fade up
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // CTA entry: slide up after text
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = () => {
    // Soft wall: log intent only in mock phase (no real auth gate)
    console.log("Soft wall: navigate to /magazine/personal");
  };

  // Take up to 5 images
  const displayImages = data.images.slice(0, 5);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[80vh] overflow-hidden bg-mag-bg ${className ?? ""}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-mag-bg via-transparent to-mag-bg" />

      {/* Scattered images (suction animation targets) */}
      {displayImages.map((src, i) => {
        const pos = SCATTER_POSITIONS[i] ?? SCATTER_POSITIONS[0];
        return (
          <div
            key={`suction-img-${i}`}
            ref={(el) => {
              imagesRef.current[i] = el;
            }}
            className="absolute h-32 w-24 overflow-hidden rounded-lg shadow-lg sm:h-44 sm:w-32"
            style={{
              left: `${pos[0]}%`,
              top: `${pos[1]}%`,
              transform: `rotate(${pos[2]}deg)`,
            }}
          >
            <Image
              src={src}
              alt={`Magazine image ${i + 1}`}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        );
      })}

      {/* Center content: headline + CTA */}
      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4">
        <div ref={textRef} className="text-center opacity-0">
          <h2 className="font-serif text-3xl font-bold leading-tight text-mag-text sm:text-4xl lg:text-5xl">
            {data.headline}
          </h2>
          {data.subtext && (
            <p className="mx-auto mt-4 max-w-md text-base text-mag-text/60">{data.subtext}</p>
          )}
        </div>

        <button
          ref={ctaRef}
          onClick={handleCtaClick}
          className="mt-8 rounded-full bg-mag-accent px-8 py-4 font-bold text-mag-bg opacity-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_var(--mag-accent)]"
        >
          {data.ctaLabel}
        </button>
      </div>
    </section>
  );
}
