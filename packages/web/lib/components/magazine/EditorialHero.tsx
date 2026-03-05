"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface EditorialHeroProps {
  title: string;
  subtitle?: string;
  coverImageUrl: string;
  images: string[];
}

/**
 * EditorialHero - Cinematic hero with text-behind-image depth layering.
 * No entry animations — hero content is immediately visible.
 * Only parallax scroll effect on images.
 */
export function EditorialHero({
  title,
  subtitle,
  coverImageUrl,
  images,
}: EditorialHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const titleWords = title.split(" ");
  const frontWords = titleWords.slice(0, Math.ceil(titleWords.length / 2));

  // Parallax only — no entry animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((img) => {
        if (!img) return;
        gsap.to(img, {
          y: -30,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const heroImages = images.length > 0 ? images : [coverImageUrl];

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center overflow-hidden px-5 py-16"
      style={{ minHeight: "70vh" }}
    >
      {/* Label */}
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-mag-accent/70">
        Featured Narrative
      </p>

      {/* Title + Image depth layering container */}
      <div className="relative mb-6">
        {/* Back title layer (z-10) */}
        <h1
          className="relative z-10 font-bold uppercase leading-[0.9] text-mag-text"
          style={{ fontSize: "clamp(2.5rem, 10vw, 4.5rem)" }}
        >
          {title}
        </h1>

        {/* Primary image (z-20) - overlapping title on right */}
        {heroImages[0] && (
          <div
            ref={(el) => { imageRefs.current[0] = el; }}
            className="absolute -right-2 top-1/2 w-[38%] max-w-[170px] -translate-y-[55%]"
            style={{ zIndex: 20 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages[0]}
              alt=""
              className="w-full rounded-sm object-cover"
              style={{ aspectRatio: "3/4" }}
            />
          </div>
        )}

        {/* Secondary image - small, top-left area with glitch offset */}
        {heroImages[1] && (
          <div
            ref={(el) => { imageRefs.current[1] = el; }}
            className="absolute left-[5%] top-[5%] w-[25%] max-w-[100px]"
            style={{
              zIndex: 20,
              transform: "translate(3px, -2px)",
              boxShadow: "-3px 2px 0 rgba(234,253,103,0.35)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages[1]}
              alt=""
              className="w-full rounded-sm object-cover"
              style={{ aspectRatio: "1/1" }}
            />
          </div>
        )}

        {/* Tertiary image - small, bottom-right */}
        {heroImages[2] && (
          <div
            ref={(el) => { imageRefs.current[2] = el; }}
            className="absolute -bottom-6 right-[25%] w-[18%] max-w-[75px]"
            style={{ zIndex: 20 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages[2]}
              alt=""
              className="w-full rounded-sm object-cover opacity-70"
              style={{ aspectRatio: "3/4" }}
            />
          </div>
        )}

        {/* Front title layer (z-30) - partial words ON TOP of images for depth */}
        <h1
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-30 font-bold uppercase leading-[0.9] text-mag-text/90"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
            WebkitTextStroke: "1px rgba(234,253,103,0.15)",
          }}
        >
          {frontWords.join(" ")}
        </h1>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mb-8 max-w-xs text-xs leading-relaxed text-mag-text/50">
          {subtitle}
        </p>
      )}

      {/* View Editorial CTA line */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-mag-accent/60">
          View Editorial
        </span>
        <div className="h-px flex-1 bg-mag-accent/20" />
      </div>
    </section>
  );
}
