"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { DecodingParticles } from "./DecodingParticles";
import { StyleKeywordChip } from "./StyleKeywordChip";
import { DecodingText } from "./DecodingText";
import { ProgressGlow } from "./ProgressGlow";

interface DecodingRitualProps {
  isActive: boolean;
  onComplete: () => void;
}

const MOCK_KEYWORDS = [
  "Minimal",
  "Streetcore",
  "Cyberpunk",
  "Monochrome",
  "Avant-garde",
];

const DECODING_PHRASES = [
  "Analyzing your DNA...",
  "Decoding your style...",
  "Curating your layout...",
  "Almost there...",
];

/**
 * Full-screen Decoding Ritual animation orchestrator.
 *
 * Coordinates particles, keywords, cycling text, and a front-loaded
 * progress bar into a cinematic 6-second generation experience.
 */
export function DecodingRitual({ isActive, onComplete }: DecodingRitualProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const progressRef = useRef({ value: 0 });
  const [progress, setProgress] = useState(0);
  const [showKeywords, setShowKeywords] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const startRitual = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Fade in overlay
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );

      // 2. After 1s, show keywords
      tl.call(
        () => {
          setShowKeywords(true);
        },
        [],
        1,
      );

      // 3. Progress bar: front-loaded easing (fast 0-80%, slow 80-100%)
      progressRef.current.value = 0;
      tl.to(
        progressRef.current,
        {
          value: 100,
          duration: 6,
          ease: "power3.out",
          onUpdate: () => {
            setProgress(progressRef.current.value);
          },
        },
        0.3,
      );

      // 4. When progress reaches 100, call onComplete after 0.5s
      tl.call(
        () => {
          gsap.delayedCall(0.5, () => {
            onCompleteRef.current();
          });
        },
        [],
        6.8,
      );
    }, overlay);
  }, []);

  useEffect(() => {
    if (isActive) {
      setProgress(0);
      setShowKeywords(false);
      // Small delay to allow DOM to mount
      const id = requestAnimationFrame(() => {
        startRitual();
      });
      return () => cancelAnimationFrame(id);
    } else {
      // Fade out
      const overlay = overlayRef.current;
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    }
  }, [isActive, startRitual]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-mag-bg flex flex-col items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Particles */}
      <DecodingParticles isActive={isActive} />

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center gap-8 px-6 max-w-md w-full">
        {/* Decoding text */}
        <DecodingText phrases={DECODING_PHRASES} isActive={isActive} />

        {/* Keywords */}
        {showKeywords && (
          <div className="flex flex-wrap justify-center gap-2">
            {MOCK_KEYWORDS.map((kw, i) => (
              <StyleKeywordChip key={kw} keyword={kw} delay={i * 0.3} />
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="w-full mt-4">
          <ProgressGlow progress={progress} />
        </div>
      </div>
    </div>
  );
}
