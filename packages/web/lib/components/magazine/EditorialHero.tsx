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
 * EditorialHero - Cinematic hero section with text-behind-image depth layering.
 *
 * Creates a depth illusion where oversized title text appears both behind
 * and in front of overlapping celebrity/editorial images.
 * Uses GSAP ScrollTrigger for parallax and staggered fade-up animations.
 */
export function EditorialHero({
  title,
  subtitle,
  coverImageUrl,
  images,
}: EditorialHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleBackRef = useRef<HTMLHeadingElement>(null);
  const titleFrontRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaLineRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split title into words for the front layer (show only first half on top)
  const titleWords = title.split(" ");
  const frontWords = titleWords.slice(0, Math.ceil(titleWords.length / 2));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(
        [labelRef.current, titleBackRef.current, subtitleRef.current, ctaLineRef.current],
        { opacity: 0, y: 30 },
      );
      gsap.set(titleFrontRef.current, { opacity: 0, y: 20 });

      // Staggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(titleBackRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to(titleFrontRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .to(ctaLineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

      // Parallax on images
      imageRefs.current.forEach((img) => {
        if (!img) return;
        gsap.to(img, {
          y: -60,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Image positioning configs for depth layering
  const imageConfigs = [
    { className: "left-[10%] top-[15%] w-[50%]", zIndex: 20 },
    { className: "right-[5%] top-[30%] w-[40%]", zIndex: 20 },
    { className: "left-[25%] top-[10%] w-[35%]", zIndex: 20, glitch: true },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20"
    >
      {/* Label */}
      <p
        ref={labelRef}
        className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-mag-text/50"
      >
        Featured Narrative
      </p>

      {/* Title + Image depth layering container */}
      <div className="relative mb-8" style={{ minHeight: "40vh" }}>
        {/* Back title layer (z-10) */}
        <h1
          ref={titleBackRef}
          className="relative z-10 font-bold uppercase text-mag-text"
          style={{ fontSize: "clamp(3rem, 12vw, 6rem)", lineHeight: 0.95 }}
        >
          {title}
        </h1>

        {/* Images layer (z-20) - overlapping on title */}
        {images.slice(0, 3).map((src, i) => {
          const config = imageConfigs[i] || imageConfigs[0];
          return (
            <div
              key={i}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className={`absolute ${config.className}`}
              style={{
                zIndex: config.zIndex,
                ...(config.glitch
                  ? {
                      transform: "translate(4px, -2px)",
                      boxShadow: "-4px 2px 0 #eafd67",
                    }
                  : {}),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-auto w-full rounded-sm object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
          );
        })}

        {/* If no external images, use cover image */}
        {images.length === 0 && (
          <div
            ref={(el) => {
              imageRefs.current[0] = el;
            }}
            className="absolute left-[15%] top-[10%] w-[55%]"
            style={{ zIndex: 20 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt=""
              className="h-auto w-full rounded-sm object-cover"
              style={{ aspectRatio: "4/5" }}
            />
          </div>
        )}

        {/* Front title layer (z-30) - selected words on top of images */}
        <h1
          ref={titleFrontRef}
          aria-hidden="true"
          className="absolute left-0 top-0 z-30 font-bold uppercase text-mag-text"
          style={{
            fontSize: "clamp(3rem, 12vw, 6rem)",
            lineHeight: 0.95,
            WebkitTextStroke: "1px rgba(234,253,103,0.3)",
          }}
        >
          {frontWords.join(" ")}
        </h1>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          ref={subtitleRef}
          className="mb-10 max-w-md text-sm leading-relaxed text-mag-text/60"
        >
          {subtitle}
        </p>
      )}

      {/* View Editorial CTA line */}
      <div ref={ctaLineRef} className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-widest text-mag-text/40">
          View Editorial
        </span>
        <div className="h-px flex-1 bg-mag-text/20" />
      </div>
    </section>
  );
}
