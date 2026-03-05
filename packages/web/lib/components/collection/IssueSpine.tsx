"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import type { MagazineIssue } from "../magazine/types";
import { IssuePreviewCard } from "./IssuePreviewCard";

interface IssueSpineProps {
  issue: MagazineIssue;
  isActive: boolean;
  onSelect: (id: string | null) => void;
}

/**
 * 3D rotated spine with GSAP pop-out interaction.
 * Default pose: rotateY(-15deg), translateZ(0).
 * Active: translateZ(60px), rotateY(-5deg) with back.out easing.
 */
export function IssueSpine({ issue, isActive, onSelect }: IssueSpineProps) {
  const spineRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate pop-out / retract based on isActive
  useEffect(() => {
    if (!spineRef.current) return;

    if (isActive) {
      gsap.to(spineRef.current, {
        rotateY: -5,
        z: 60,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    } else {
      gsap.to(spineRef.current, {
        rotateY: -15,
        z: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isActive]);

  const handleClick = useCallback(() => {
    onSelect(isActive ? null : issue.id);
  }, [isActive, issue.id, onSelect]);

  const handleMouseEnter = useCallback(() => {
    // Desktop: 200ms hover delay before selecting
    hoverTimeoutRef.current = setTimeout(() => {
      onSelect(issue.id);
    }, 200);
  }, [issue.id, onSelect]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Extract volume label
  const volumeLabel = `Vol.${String(issue.issue_number).padStart(2, "0")}`;
  const dateLabel = new Date(issue.generated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
  });

  return (
    <div className="relative flex-shrink-0" style={{ perspective: "600px" }}>
      {/* Spine element */}
      <div
        ref={spineRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-[50px] md:w-[60px] h-[140px] md:h-[160px] rounded-sm cursor-pointer transition-shadow"
        style={{
          backgroundColor: issue.theme_palette.accent,
          transform: "rotateY(-15deg) translateZ(0px)",
          transformStyle: "preserve-3d",
          boxShadow: isActive
            ? `0 0 20px ${issue.theme_palette.accent}40`
            : "2px 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        {/* Vertical text on spine */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between py-3 px-1 overflow-hidden"
          style={{ color: issue.theme_palette.primary }}
        >
          <span
            className="text-[10px] md:text-xs font-bold tracking-wider"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {volumeLabel}
          </span>
          <span className="text-[8px] md:text-[10px] opacity-70">
            {dateLabel}
          </span>
        </div>
      </div>

      {/* Preview card when active */}
      {isActive && (
        <IssuePreviewCard
          issue={issue}
          onOpen={() => {
            console.log("[Collection] Open issue:", issue.id);
          }}
          onDelete={() => {
            console.log("[Collection] Delete issue:", issue.id);
          }}
        />
      )}
    </div>
  );
}
