"use client";

import { CheckCircle, XCircle, Circle, Loader } from "lucide-react";
import { usePipelineDetail } from "@/lib/hooks/admin/usePipeline";
import type { PipelineStep, StepStatus } from "@/lib/api/admin/pipeline";

// ─── Formatters ───────────────────────────────────────────────────────────────

/** Formats duration in milliseconds to "X.Xs" string. */
function formatDuration(ms: number | undefined): string {
  if (ms === undefined || ms === null) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

/** Formats an ISO timestamp to a short readable string. */
function formatTime(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle
          className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0"
          aria-label="완료"
        />
      );
    case "running":
      return (
        <Loader
          className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 animate-spin"
          aria-label="실행 중"
        />
      );
    case "failed":
      return (
        <XCircle
          className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0"
          aria-label="실패"
        />
      );
    case "pending":
    default:
      return (
        <Circle
          className="w-5 h-5 text-muted-foreground shrink-0"
          aria-label="대기 중"
        />
      );
  }
}

// ─── Step display names ───────────────────────────────────────────────────────

const STEP_DISPLAY_NAMES: Record<string, string> = {
  upload: "업로드",
  analyze: "분석",
  detect: "감지",
};

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepRow({
  step,
  isLast,
}: {
  step: PipelineStep;
  isLast: boolean;
}) {
  const isPending = step.status === "pending";
  const isFailed = step.status === "failed";

  return (
    <div className="relative flex gap-3">
      {/* Vertical timeline connector line */}
      {!isLast && (
        <div
          className="absolute left-[9px] top-6 w-px bg-border"
          style={{ bottom: "-12px" }}
          aria-hidden="true"
        />
      )}

      {/* Step icon */}
      <div className="mt-0.5">
        <StepIcon status={step.status} />
      </div>

      {/* Step details */}
      <div className="flex-1 min-w-0 pb-6">
        <div className="flex items-center justify-between gap-2">
          <span
            className={[
              "text-sm font-medium",
              isPending
                ? "text-muted-foreground"
                : "text-foreground",
            ].join(" ")}
          >
            {STEP_DISPLAY_NAMES[step.name] ?? step.name}
          </span>
          <span
            className={[
              "text-xs tabular-nums shrink-0",
              isPending
                ? "text-muted-foreground/70"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {formatDuration(step.durationMs)}
          </span>
        </div>

        {/* Timestamps (skip for pending/running without completedAt) */}
        {!isPending && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {step.startedAt ? `시작: ${formatTime(step.startedAt)}` : ""}
            {step.completedAt ? ` · 완료: ${formatTime(step.completedAt)}` : ""}
          </p>
        )}

        {/* Error box for failed steps */}
        {isFailed && step.error && (
          <div className="mt-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30">
            <p className="text-xs text-destructive font-mono break-words">
              {step.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PipelineDetailProps {
  /** Pipeline ID whose steps should be fetched and displayed */
  pipelineId: string;
}

/**
 * Inline accordion content showing step-by-step pipeline execution timeline.
 * Fetches detail data via usePipelineDetail hook.
 * Shows upload → analyze → detect steps with status icons, durations, and errors.
 */
export function PipelineDetail({ pipelineId }: PipelineDetailProps) {
  const { data, isLoading } = usePipelineDetail(pipelineId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-4 text-sm text-muted-foreground text-center">
        파이프라인 상세 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-muted/30 border-t border-border">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        실행 단계
      </p>

      <div>
        {data.steps.map((step, index) => (
          <StepRow
            key={step.name}
            step={step}
            isLast={index === data.steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
