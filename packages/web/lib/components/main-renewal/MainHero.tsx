"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

import type { MainHeroData } from "./types";
import { NeonGlow } from "./NeonGlow";

interface MainHeroProps {
  data: MainHeroData;
  className?: string;
}

/**
 * MainHero -- "The Hook" section for the renewed main page.
 *
 * Cinematic entry sequence with GSAP timeline:
 * - Background image scales in
 * - NeonGlow fades up
 * - Text elements stagger in
 * - Celebrity name responds to mouse tilt on desktop
 */
export function MainHero({ data, className = "" }: MainHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Entry animation timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Background image: scale 1.15 -> 1.0, opacity 0 -> 0.3
      tl.fromTo(
        bgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 0.3, duration: 2 },
        0,
      );

      // NeonGlow: opacity 0 -> 1, scale 0.8 -> 1
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5 },
        0.2,
      );

      // Label: fade up
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.3,
      );

      // Celebrity name: fade up
      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        0.5,
      );

      // Title: fade up
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7,
      );

      // CTA button: fade up
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.9,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Tilt animation on mouse move (desktop only)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !nameRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Map mouse offset to -8deg to +8deg
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 8;

    gsap.to(nameRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!nameRef.current) return;
    gsap.to(nameRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Skip tilt on non-hover (touch) devices
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover) return;

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full min-h-[85vh] md:min-h-screen overflow-hidden bg-mag-bg flex items-center ${className}`}
    >
      {/* NeonGlow background layer */}
      <div ref={glowRef} className="absolute inset-0 z-[1] opacity-0">
        <NeonGlow color="#eafd67" intensity={0.6} />
      </div>

      {/* Background image -- grayscale, low opacity */}
      <div ref={bgRef} className="absolute inset-0 z-0 opacity-0">
        <Image
          src={data.heroImageUrl}
          alt={data.celebrityName}
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-[2]" />

      {/* Noise grain overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-[3] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-[10]">
        <div className="max-w-[1200px]">
          {/* Label */}
          <div ref={labelRef} className="opacity-0 mb-8">
            <div className="flex items-center gap-4">
              <span className="w-10 h-[1px] bg-mag-accent" />
              <span className="text-mag-accent font-sans font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase">
                Featured Narrative
              </span>
            </div>
          </div>

          {/* Celebrity name -- tilt target */}
          <h2
            ref={nameRef}
            className="opacity-0 text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[14rem] font-serif font-bold text-mag-accent leading-[0.8] tracking-tighter mb-12 italic drop-shadow-2xl will-change-transform"
            style={{
              perspective: "800px",
              transformStyle: "preserve-3d",
            }}
          >
            {data.celebrityName}
          </h2>

          {/* Editorial title */}
          <p
            ref={titleRef}
            className="opacity-0 text-2xl md:text-3xl lg:text-4xl text-mag-text/95 font-sans font-light leading-snug mb-4 tracking-tight max-w-2xl"
          >
            {data.editorialTitle}
          </p>

          {/* Subtitle */}
          {data.editorialSubtitle && (
            <p className="text-mag-text/50 text-sm md:text-base font-sans mb-14 max-w-xl">
              {data.editorialSubtitle}
            </p>
          )}

          {/* CTA button */}
          <div ref={ctaRef} className="opacity-0">
            <Link
              href={data.ctaLink}
              className="group relative inline-flex items-center gap-6 px-10 py-5 border border-mag-text/30 text-mag-text font-sans font-bold text-xs md:text-sm tracking-[0.25em] overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-mag-bg">
                {data.ctaLabel ?? "VIEW EDITORIAL"}
              </span>
              <svg
                className="relative z-10 w-5 h-5 transition-colors duration-500 group-hover:text-mag-bg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
              <div className="absolute top-0 left-0 w-0 h-full bg-mag-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full z-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
