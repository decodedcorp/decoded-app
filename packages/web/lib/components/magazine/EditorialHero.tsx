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
 * EditorialHero - Two-column cinematic hero.
 * Left: oversized title + metadata. Right: cover image with accent glow.
 * Clean separation — no confusing overlap.
 */
export function EditorialHero({
  title,
  subtitle,
  coverImageUrl,
  images,
}: EditorialHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imageRef.current;
    if (!section || !img) return;

    const ctx = gsap.context(() => {
      gsap.to(img, {
        y: -30,
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
      className="relative px-6 pb-10 pt-16 md:px-10 md:pt-24"
    >
      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end md:gap-12">
        {/* Left: Text content */}
        <div className="flex flex-col justify-end">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-mag-accent/70">
            Featured Narrative
          </p>

          <h1
            className="mb-5 font-bold uppercase leading-[0.9] text-mag-text"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            {title}
          </h1>

          {subtitle && (
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-mag-text/50">
              {subtitle}
            </p>
          )}

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-mag-accent/60">
              View Editorial
            </span>
            <div className="h-px flex-1 bg-mag-accent/20" />
          </div>
        </div>

        {/* Right: Cover image with accent glow */}
        <div
          ref={imageRef}
          className="relative overflow-hidden rounded-sm"
          style={{
            boxShadow: "0 0 40px rgba(234,253,103,0.08), -4px 4px 0 rgba(234,253,103,0.15)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            className="w-full object-cover"
            style={{ aspectRatio: "4/5" }}
          />
          {/* Bottom gradient fade */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-mag-bg to-transparent" />
          {/* Accent line */}
          <div
            className="absolute bottom-0 left-0 h-[2px] w-1/2"
            style={{ background: "linear-gradient(to right, #eafd67, transparent)" }}
          />
        </div>
      </div>
    </section>
  );
}
