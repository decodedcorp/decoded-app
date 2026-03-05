"use client";

import type { MagazineIssue } from "../magazine/types";

interface IssueDetailPanelProps {
  issue: MagazineIssue;
  onOpen: () => void;
  onClose: () => void;
}

export function IssueDetailPanel({
  issue,
  onOpen,
  onClose,
}: IssueDetailPanelProps) {
  const volumeLabel = `Vol.${String(issue.issue_number).padStart(2, "0")}`;
  const dateLabel = new Date(issue.generated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="absolute bottom-0 left-0 right-0 md:left-auto md:right-4 md:bottom-4 md:w-[280px] z-40 animate-in slide-in-from-bottom duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-t-2xl md:rounded-2xl p-5 space-y-3">
        {/* Volume label */}
        <p className="text-[#eafd67] text-xs font-bold tracking-[0.15em] uppercase">
          {volumeLabel}
        </p>

        {/* Title */}
        <h3 className="text-white text-lg font-bold leading-tight">
          {issue.title}
        </h3>

        {/* Date */}
        <p className="text-white/40 text-xs">{dateLabel}</p>

        {/* Keywords */}
        {issue.theme_keywords && issue.theme_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {issue.theme_keywords.slice(0, 4).map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 text-[10px] rounded-full bg-[#eafd67]/10 text-[#eafd67]/80 border border-[#eafd67]/20"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onOpen}
            className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#eafd67] text-black hover:bg-[#eafd67]/90 transition-colors"
          >
            Open Magazine
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
