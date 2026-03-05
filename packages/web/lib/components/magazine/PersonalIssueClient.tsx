"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { DecodingRitual } from "./DecodingRitual";
import { MagazineRenderer } from "./MagazineRenderer";

interface PersonalIssueClientProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalIssueClient({ isOpen, onClose }: PersonalIssueClientProps) {
  const {
    personalStatus,
    personalIssue,
    setPersonalStatus,
    loadPersonalIssue,
    error,
    clearError,
  } = useMagazineStore();

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  const handleClose = useCallback(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;

    if (!backdrop || !panel) {
      setPersonalStatus("idle");
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setPersonalStatus("idle");
        onClose();
      },
    });
    tl.to(panel, { y: 40, opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
    tl.to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0.05);
  }, [onClose, setPersonalStatus]);

  // Entrance animation
  useEffect(() => {
    if (!isOpen) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(
      panel,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.05 },
    );
  }, [isOpen]);

  // Crossfade: ritual out -> renderer in
  useEffect(() => {
    if (personalStatus !== "ready") return;
    const ritual = ritualRef.current;
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (ctxRef.current) ctxRef.current.revert();

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline();
      if (ritual) {
        tl.to(ritual, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
      }
      gsap.set(renderer, { opacity: 0 });
      tl.to(renderer, { opacity: 1, duration: 0.6, ease: "power2.inOut" }, ritual ? "-=0.2" : 0);
    });

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [personalStatus]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        style={{ opacity: 0 }}
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <div
          ref={panelRef}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-mag-accent/20 bg-mag-bg text-mag-text shadow-2xl pointer-events-auto"
          style={{ opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-mag-bg/90 backdrop-blur-sm border-b border-mag-text/10 rounded-t-2xl">
            <span className="text-xs text-mag-text/50 uppercase tracking-widest">
              Personal Edition
            </span>
            <button
              onClick={handleClose}
              className="text-mag-text/60 hover:text-mag-text transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {/* State: idle */}
            {personalStatus === "idle" && (
              <div className="flex flex-col items-center gap-5 py-10">
                <h2 className="text-2xl md:text-3xl font-bold text-mag-accent text-center">
                  Generate My Edition
                </h2>
                <p className="text-mag-text/60 text-center max-w-xs text-sm">
                  Your personalized magazine crafted from your taste DNA
                </p>
                <p className="text-xs text-mag-text/40">Credits: 5 remaining</p>
                <button
                  onClick={handleGenerate}
                  className="bg-mag-accent text-mag-bg font-bold px-7 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Generate
                </button>
              </div>
            )}

            {/* State: generating */}
            {personalStatus === "generating" && (
              <div ref={ritualRef} className="min-h-[400px] relative">
                <DecodingRitual isActive={true} onComplete={handleRitualComplete} />
              </div>
            )}

            {/* State: ready */}
            {personalStatus === "ready" && personalIssue && (
              <div ref={rendererRef} style={{ opacity: 0 }}>
                <MagazineRenderer issue={personalIssue} />

                <div className="flex items-center justify-center gap-3 pt-6 pb-2">
                  <button
                    onClick={handleRegenerate}
                    className="border border-mag-accent text-mag-accent px-5 py-2 rounded-full text-sm hover:bg-mag-accent/10 transition-colors"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-mag-accent text-mag-bg font-bold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    Save to Collection
                  </button>
                </div>
              </div>
            )}

            {/* State: error */}
            {personalStatus === "error" && (
              <div className="flex flex-col items-center gap-4 py-10">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 max-w-sm text-center">
                  <p className="text-red-400 text-sm mb-3">
                    {error || "Something went wrong during generation"}
                  </p>
                  <button
                    onClick={() => {
                      clearError();
                      setPersonalStatus("idle");
                    }}
                    className="bg-mag-accent text-mag-bg font-bold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
