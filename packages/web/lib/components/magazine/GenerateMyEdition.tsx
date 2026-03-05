"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface GenerateMyEditionProps {
  onGenerate: () => void;
}

/**
 * GenerateMyEdition - CTA with pulsing neon chartreuse glow.
 *
 * Scroll-triggered fade-up on enter, then continuous GSAP box-shadow pulse
 * animation for the neon border glow effect.
 * Opens personal edition modal.
 */
export function GenerateMyEdition({ onGenerate }: GenerateMyEditionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return;

    const ctx = gsap.context(() => {
      // Initial hidden state
      gsap.set(container, { opacity: 0, y: 20 });

      // Scroll-triggered entrance
      ScrollTrigger.create({
        trigger: container,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });

      // Pulsing glow animation on the button
      gsap.to(button, {
        boxShadow: "0 0 30px rgba(234,253,103,0.5)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl px-6 py-16">
      <button
        ref={buttonRef}
        type="button"
        onClick={onGenerate}
        className="group flex w-full items-center justify-between rounded-lg border border-[#eafd67] bg-mag-bg px-6 py-5 transition-colors hover:bg-mag-accent/10"
        style={{ boxShadow: "0 0 10px rgba(234,253,103,0.3)" }}
      >
        <div className="text-left">
          <p className="text-lg font-bold text-mag-accent">
            Generate My Edition
          </p>
          <p className="mt-1 text-sm text-mag-text/50">
            AI가 큐레이션한 나만의 에디토리얼
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-mag-accent transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
