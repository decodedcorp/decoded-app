"use client";

import { useRef, useEffect, useState } from "react";
import type { MagazineIssue } from "../magazine/types";

interface IssuePreviewCardProps {
  issue: MagazineIssue;
  onOpen: () => void;
  onDelete: () => void;
}

/**
 * Expanded cover with metadata overlay, shown when a spine is popped out.
 * Positioned to the right of the spine, or flipped left if near viewport edge.
 */
export function IssuePreviewCard({
  issue,
  onOpen,
  onDelete,
}: IssuePreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipLeft, setFlipLeft] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.right > window.innerWidth - 16) {
      setFlipLeft(true);
    }
  }, []);

  const volumeLabel = `Vol.${String(issue.issue_number).padStart(2, "0")}`;
  const dateLabel = new Date(issue.generated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={cardRef}
      className={`absolute top-0 z-50 w-[220px] bg-[#111] border border-mag-accent/30 rounded-lg overflow-hidden shadow-2xl ${
        flipLeft ? "right-full mr-3" : "left-full ml-3"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cover image */}
      {issue.cover_image_url && (
        <div className="relative w-full h-[120px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.cover_image_url}
            alt={`${issue.title} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        </div>
      )}

      {/* Metadata */}
      <div className="p-3 space-y-2">
        <div>
          <p className="text-mag-accent text-xs font-semibold tracking-wider">
            {volumeLabel}
          </p>
          <h4 className="text-mag-text text-sm font-bold leading-tight mt-0.5">
            {issue.title}
          </h4>
          <p className="text-mag-text/50 text-[10px] mt-1">{dateLabel}</p>
        </div>

        {/* Theme keywords */}
        {issue.theme_keywords && issue.theme_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.theme_keywords.slice(0, 4).map((keyword) => (
              <span
                key={keyword}
                className="px-1.5 py-0.5 text-[9px] rounded-full bg-mag-accent/10 text-mag-accent/80"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onOpen}
            className="flex-1 py-1.5 text-xs font-semibold rounded-md text-mag-bg"
            style={{ backgroundColor: issue.theme_palette.accent }}
          >
            Open
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
