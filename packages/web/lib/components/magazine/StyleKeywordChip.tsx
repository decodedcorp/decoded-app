"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface StyleKeywordChipProps {
  keyword: string;
  delay?: number;
}

/**
 * Floating keyword chip with accent glow entry animation.
 * Pops in with scale + opacity via GSAP.
 */
export function StyleKeywordChip({ keyword, delay = 0 }: StyleKeywordChipProps) {
  const chipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = chipRef.current;
    if (!el) return;

    gsap.set(el, { scale: 0, opacity: 0 });

    const tween = gsap.to(el, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      delay,
      ease: "back.out(1.7)",
    });

    return () => {
      tween.kill();
    };
  }, [delay]);

  return (
    <span
      ref={chipRef}
      className="inline-block bg-transparent border border-mag-accent text-mag-accent px-3 py-1 rounded-full text-sm"
      style={{
        boxShadow: "0 0 12px var(--mag-accent)",
        opacity: 0,
      }}
    >
      #{keyword}
    </span>
  );
}
