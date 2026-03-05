"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { DecodingRitual } from "./DecodingRitual";
import { MagazineRenderer } from "./MagazineRenderer";

/**
 * Personal Issue generation page client component.
 *
 * Implements a 3-state machine:
 *   idle       -> Generate button visible
 *   generating -> Decoding Ritual animation plays
 *   ready      -> MagazineRenderer with personal issue + action buttons
 *   error      -> Error card with retry
 */
export function PersonalIssueClient() {
  const {
    personalStatus,
    personalIssue,
    setPersonalStatus,
    loadPersonalIssue,
    error,
    clearError,
  } = useMagazineStore();

  const ritualRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const handleGenerate = useCallback(() => {
    setPersonalStatus("generating");
  }, [setPersonalStatus]);

  const handleRitualComplete = useCallback(() => {
    loadPersonalIssue();
  }, [loadPersonalIssue]);

  const handleRegenerate = useCallback(() => {
    setPersonalStatus("idle");
  }, [setPersonalStatus]);

  const handleSave = useCallback(() => {
    console.log("[PersonalIssue] Save to Collection - intent logged");
  }, []);

  // Crossfade animation: ritual out, renderer in
  useEffect(() => {
    if (personalStatus !== "ready") return;

    const ritual = ritualRef.current;
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (ctxRef.current) {
      ctxRef.current.revert();
    }

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline();

      // Fade out ritual overlay if still in DOM
      if (ritual) {
        tl.to(ritual, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }

      // Fade in renderer with slight overlap
      gsap.set(renderer, { opacity: 0 });
      tl.to(
        renderer,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
        },
        ritual ? "-=0.3" : 0,
      );
    });

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [personalStatus]);

  return (
    <div className="min-h-screen bg-mag-bg text-mag-text">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-3 bg-mag-bg/80 backdrop-blur-sm">
        <a
          href="/magazine"
          className="text-mag-text hover:text-mag-accent transition-colors text-lg"
          aria-label="Back to magazine"
        >
          &larr;
        </a>
        <span className="text-sm text-mag-text/60 uppercase tracking-widest">
          Personal Edition
        </span>
        <a
          href="/magazine"
          className="text-mag-text hover:text-mag-accent transition-colors text-lg"
          aria-label="Close"
        >
          &times;
        </a>
      </nav>

      {/* State: idle */}
      {personalStatus === "idle" && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-mag-accent text-center">
            Generate My Edition
          </h1>
          <p className="text-mag-text/70 text-center max-w-sm">
            Your personalized magazine crafted from your taste DNA
          </p>
          <p className="text-sm text-mag-text/50">Credits: 5 remaining</p>
          <button
            onClick={handleGenerate}
            className="bg-mag-accent text-mag-bg font-bold px-8 py-3 rounded-full text-lg hover:opacity-90 transition-opacity"
          >
            Generate
          </button>
        </div>
      )}

      {/* State: generating */}
      {personalStatus === "generating" && (
        <div ref={ritualRef}>
          <DecodingRitual
            isActive={true}
            onComplete={handleRitualComplete}
          />
        </div>
      )}

      {/* State: ready */}
      {personalStatus === "ready" && personalIssue && (
        <div ref={rendererRef} style={{ opacity: 0 }}>
          <div className="pt-14">
            <MagazineRenderer issue={personalIssue} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 py-8 px-6">
            <button
              onClick={handleRegenerate}
              className="border border-mag-accent text-mag-accent px-6 py-2 rounded-full hover:bg-mag-accent/10 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={handleSave}
              className="bg-mag-accent text-mag-bg font-bold px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Save to Collection
            </button>
          </div>
        </div>
      )}

      {/* State: error */}
      {personalStatus === "error" && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 max-w-sm text-center">
            <p className="text-red-400 mb-4">
              {error || "Something went wrong during generation"}
            </p>
            <button
              onClick={() => {
                clearError();
                setPersonalStatus("idle");
              }}
              className="bg-mag-accent text-mag-bg font-bold px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
