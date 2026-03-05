"use client";

import { useState } from "react";
import Image from "next/image";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import type { MagazineIssue } from "../magazine/types";
import { MagazinePreviewModal } from "./MagazinePreviewModal";

interface IssueDetailPanelProps {
  issue: MagazineIssue;
  onClose: () => void;
}

export function IssueDetailPanel({ issue, onClose }: IssueDetailPanelProps) {
  const [showPreview, setShowPreview] = useState(false);
  const collectionIssues = useMagazineStore((s) => s.collectionIssues);
  const volumeLabel = `Vol.${String(issue.issue_number).padStart(2, "0")}`;
  const dateLabel = new Date(issue.generated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const issueIndex = collectionIssues.findIndex((i) => i.id === issue.id);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:w-[400px] z-40 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-t-2xl md:rounded-2xl p-4 space-y-3">
          <div className="flex gap-4">
            {/* Cover thumbnail */}
            <div className="relative w-[80px] h-[110px] flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
              {issue.cover_image_url ? (
                <Image
                  src={issue.cover_image_url}
                  alt={issue.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                  No Cover
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-[#eafd67] text-[10px] font-bold tracking-[0.15em] uppercase">
                {volumeLabel}
              </p>
              <h3 className="text-white text-base font-bold leading-tight truncate">
                {issue.title}
              </h3>
              <p className="text-white/40 text-xs">{dateLabel}</p>

              {issue.theme_keywords && issue.theme_keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {issue.theme_keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="px-1.5 py-0.5 text-[9px] rounded-full bg-[#eafd67]/10 text-[#eafd67]/80 border border-[#eafd67]/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 py-2.5 text-xs font-semibold rounded-lg bg-[#eafd67] text-black hover:bg-[#eafd67]/90 transition-colors"
            >
              Open Magazine
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Magazine slide viewer */}
      {showPreview && (
        <MagazinePreviewModal
          issues={collectionIssues}
          initialIndex={issueIndex >= 0 ? issueIndex : 0}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
