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
 *
 * Uses a single large cover image overlapping the title to create
 * clean depth illusion without visual noise.
 */
export function EditorialHero({
  title,
  subtitle,
  coverImageUrl,
  images,
}: EditorialHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const titleWords = title.split(" ");
  const frontWords = titleWords.slice(0, Math.ceil(titleWords.length / 2));

  // Parallax scroll on cover image
  useEffect(() => {
    const section = sectionRef.current;
    const img = imageRef.current;
    if (!section || !img) return;

    const ctx = gsap.context(() => {
      gsap.to(img, {
        y: -40,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const heroImage = images[0] || coverImageUrl;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pb-10 pt-16 md:px-10 md:pt-24"
    >
      {/* Label */}
      <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-mag-accent/70">
        Featured Narrative
      </p>

      {/* Two-column layout: Title left, Image right */}
      <div className="relative mb-8">
        {/* Back title layer (z-10) — full width, overlaps into image zone */}
        <h1
          className="relative z-10 font-bold uppercase leading-[0.9] text-mag-text"
          style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
        >
          {title}
        </h1>

        {/* Cover image (z-20) — overlaps right portion of title */}
        <div
          ref={imageRef}
          className="absolute right-0 top-0 h-full w-[50%] md:w-[45%]"
          style={{ zIndex: 20 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            className="h-full w-full rounded-sm object-cover"
          />
          {/* Fade edge into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-mag-bg via-transparent to-transparent" />
          {/* Glitch accent line */}
          <div
            className="absolute bottom-4 left-0 h-px w-[60%]"
            style={{ background: "linear-gradient(to right, #eafd67, transparent)" }}
          />
        </div>

        {/* Front title layer (z-30) — first words appear ON TOP of image */}
        <h1
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-30 font-bold uppercase leading-[0.9]"
          style={{
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(245,245,245,0.7)",
          }}
        >
          {frontWords.join(" ")}
        </h1>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mb-8 max-w-md text-sm leading-relaxed text-mag-text/50">
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
