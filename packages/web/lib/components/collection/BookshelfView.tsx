"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MagazineIssue } from "../magazine/types";
import { ShelfRow } from "./ShelfRow";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

interface BookshelfViewProps {
  issues: MagazineIssue[];
  activeIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
}

/**
 * 3D perspective bookshelf container with CSS perspective and GSAP ScrollTrigger.
 * Groups issues into shelf rows (3-4 mobile, 5-6 desktop) and animates
 * each row into view on scroll.
 */
export function BookshelfView({
  issues,
  activeIssueId,
  onSelectIssue,
}: BookshelfViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Group issues into rows based on screen size
  // We use a fixed grouping of 4 for mobile-first, CSS handles visual adaptation
  const rows: MagazineIssue[][] = [];
  const perRow = 4; // base grouping; desktop shows wider with CSS flex-wrap
  for (let i = 0; i < issues.length; i += perRow) {
    rows.push(issues.slice(i, i + perRow));
  }

  useEffect(() => {
    if (!containerRef.current || rows.length === 0) return;

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((rowEl) => {
        if (!rowEl) return;

        gsap.fromTo(
          rowEl,
          { translateY: 30, opacity: 0 },
          {
            translateY: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rowEl,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [rows.length]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-mag-bg px-4 py-8 md:px-8"
      style={{
        perspective: isDesktop ? "1200px" : "800px",
        transformStyle: "preserve-3d",
      }}
      onClick={(e) => {
        // Click on bookshelf background clears selection
        if (e.target === e.currentTarget) {
          onSelectIssue(null);
        }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-2">
        {rows.map((rowIssues, idx) => (
          <ShelfRow
            key={idx}
            ref={(el) => {
              rowRefs.current[idx] = el;
            }}
            issues={rowIssues}
            activeIssueId={activeIssueId}
            onSelectIssue={onSelectIssue}
          />
        ))}
      </div>
    </div>
  );
}
