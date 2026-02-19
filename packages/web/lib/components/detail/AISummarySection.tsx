"use client";

import { useEffect, useState } from "react";

type Props = {
  summary?: string | null;
  isModal?: boolean;
};

/**
 * AI Summary block with generating animation.
 * Shows animated "AI is generating summary" state, then displays summary when ready.
 */
export function AISummarySection({ summary, isModal = false }: Props) {
  const [showSummary, setShowSummary] = useState(false);
  const [dots, setDots] = useState("");

  // Simulate AI "thinking" - show summary after a delay if we have it
  useEffect(() => {
    if (!summary) return;

    const delay = 2200;
    const t = setTimeout(() => setShowSummary(true), delay);
    return () => clearTimeout(t);
  }, [summary]);

  // Typing dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold mb-6 block">
        AI Summary
      </span>

      {showSummary && summary ? (
        <div
          className={`relative overflow-hidden rounded-sm border border-border/40 bg-muted/5 p-6 md:p-8 w-full transition-opacity duration-500 ${isModal ? "" : ""}`}
        >
          <p
            className={`font-serif italic leading-relaxed text-foreground/90 ${isModal ? "text-base md:text-lg" : "text-lg md:text-xl"}`}
          >
            &ldquo;{summary}&rdquo;
          </p>
        </div>
      ) : (
        <div
          className={`relative overflow-hidden rounded-sm border border-border/40 bg-muted/5 p-6 md:p-8 w-full ${isModal ? "" : ""}`}
        >
          {/* Shimmer / generating animation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-foreground/60">
                Generating summary
              </span>
              <span className="font-mono text-foreground/40 tabular-nums w-6">
                {dots}
              </span>
            </div>
            <div className="space-y-3 overflow-hidden">
              <div className="h-3 w-full rounded bg-muted/40 overflow-hidden">
                <div
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-shimmer"
                  style={{ minWidth: "120px" }}
                />
              </div>
              <div className="h-3 w-[85%] rounded bg-muted/30 overflow-hidden">
                <div
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/12 to-transparent animate-shimmer"
                  style={{ minWidth: "100px", animationDelay: "0.2s" }}
                />
              </div>
              <div className="h-3 w-[70%] rounded bg-muted/20 overflow-hidden">
                <div
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"
                  style={{ minWidth: "80px", animationDelay: "0.4s" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                Analyzing look
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
