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
        className="relative flex items-end justify-center gap-3 md:gap-5 min-h-[180px] md:min-h-[220px] px-4 pt-6 pb-0 border-b-4 border-[#2a2a2a]"
        style={{
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
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
