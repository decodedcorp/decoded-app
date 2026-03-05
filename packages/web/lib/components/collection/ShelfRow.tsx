"use client";

import { forwardRef } from "react";
import type { MagazineIssue } from "../magazine/types";
import { IssueSpine } from "./IssueSpine";

interface ShelfRowProps {
  issues: MagazineIssue[];
  activeIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
}

/**
 * A single shelf row displaying issue spines in a flex layout.
 * Styled with a bottom border as the shelf edge and drop shadow.
 * Uses forwardRef for GSAP ScrollTrigger targeting from BookshelfView.
 */
export const ShelfRow = forwardRef<HTMLDivElement, ShelfRowProps>(
  function ShelfRow({ issues, activeIssueId, onSelectIssue }, ref) {
    return (
      <div
        ref={ref}
        className="relative flex items-end justify-start gap-4 md:gap-6 min-h-[200px] md:min-h-[260px] px-6 md:px-10 pt-8 pb-0"
        style={{
          borderBottom: "6px solid #2a2a2a",
          boxShadow:
            "0 6px 12px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.3)",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(30,28,24,0.4) 100%)",
          transformStyle: "preserve-3d",
        }}
      >
        {issues.map((issue) => (
          <IssueSpine
            key={issue.id}
            issue={issue}
            isActive={activeIssueId === issue.id}
            onSelect={onSelectIssue}
          />
        ))}
      </div>
    );
  }
);
