"use client";

import type { PipelineStatus } from "@/lib/api/admin/pipeline";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PipelineStatusFilterProps {
  value: PipelineStatus | undefined; // undefined = "All"
  onChange: (status: PipelineStatus | undefined) => void;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: {
  label: string;
  value: PipelineStatus | undefined;
  dotColor: string | null;
}[] = [
  { label: "전체", value: undefined, dotColor: null },
  { label: "완료", value: "completed", dotColor: "bg-emerald-400" },
  { label: "실행 중", value: "running", dotColor: "bg-blue-400" },
  { label: "실패", value: "failed", dotColor: "bg-red-400" },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Pill-shaped filter buttons for pipeline execution statuses.
 * Follows the same pattern as audit StatusFilter.tsx.
 */
export function PipelineStatusFilter({
  value,
  onChange,
}: PipelineStatusFilterProps) {
  return (
    <div
      className="flex gap-2 flex-wrap"
      role="group"
      aria-label="파이프라인 상태 필터"
    >
      {STATUS_OPTIONS.map(({ label, value: optionValue, dotColor }) => {
        const isActive = value === optionValue;

        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(optionValue)}
            aria-pressed={isActive}
            className={[
              "px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
            ].join(" ")}
          >
            {dotColor && (
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
                aria-hidden="true"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
