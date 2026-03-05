"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface DecodingTextProps {
  phrases: string[];
  isActive: boolean;
}

/**
 * Cycles through phrases with fade transitions and variable font weight animation.
 * Font weight oscillates between 300 and 700 via GSAP.
 */
export function DecodingText({ phrases, isActive }: DecodingTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Cycle through phrases every 2.5s
  useEffect(() => {
    if (!isActive || phrases.length === 0) return;

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isActive, phrases.length]);

  // Fade transition on phrase change
  useEffect(() => {
    const el = textRef.current;
    if (!el || !isActive) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );
  }, [phraseIndex, isActive]);

  // Variable font weight animation
  useEffect(() => {
    const el = textRef.current;
    if (!el || !isActive) return;

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        el,
        { fontWeight: 300 },
        {
          fontWeight: 700,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          snap: { fontWeight: 100 },
        },
      );
    }, el);

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
      ref={textRef}
      className="text-2xl md:text-3xl text-mag-text text-center select-none"
      style={{ fontWeight: 300 }}
    >
      {phrases[phraseIndex]}
    </div>
  );
}
