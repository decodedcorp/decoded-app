"use client";

import Image from "next/image";
import { toast } from "sonner";
import type { PipelineListItem, PipelineStatus } from "@/lib/api/admin/pipeline";
import { PipelineDetail } from "./PipelineDetail";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PipelineTableProps {
  data: PipelineListItem[];
  onSelectPipeline: (id: string) => void;
  expandedId: string | null;
}

// ─── Status badge styles ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<PipelineStatus, string> = {
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  running:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status }: { status: PipelineStatus }) {
  const isRunning = status === "running";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {isRunning && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse shrink-0"
          aria-hidden="true"
        />
      )}
      {status}
    </span>
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────

/** Formats total duration in ms to "X.Xs" or "—" */
function formatDuration(ms: number | undefined): string {
  if (ms === undefined || ms === null) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

/** Simple relative time formatter */
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Table of pipeline executions with expandable accordion rows.
 * Clicking a row expands it to show step-by-step detail (PipelineDetail).
 * Failed pipelines have a Retry button that shows a sonner toast.
 */
export function PipelineTable({
  data,
  onSelectPipeline,
  expandedId,
}: PipelineTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          파이프라인이 없습니다
        </div>
      </div>
    );
  }

  const handleRetry = (
    e: React.MouseEvent,
    pipelineId: string
  ) => {
    e.stopPropagation(); // Don't trigger row expansion
    toast.success(`Pipeline ${pipelineId} retry initiated`);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-16" />
          <col className="w-32" />
          <col className="w-28" />
          <col className="w-24" />
          <col className="hidden sm:table-column w-32" />
          <col className="hidden sm:table-column w-36" />
          <col className="w-20" />
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              이미지
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              게시물 ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              상태
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              소요 시간
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              실행자
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              시작 시각
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              액션
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((pipeline) => {
            const isExpanded = expandedId === pipeline.id;
            const isFailed = pipeline.status === "failed";

            return (
              <>
                <tr
                  key={pipeline.id}
                  onClick={() => onSelectPipeline(pipeline.id)}
                  aria-expanded={isExpanded}
                  className={[
                    "cursor-pointer transition-colors border-b border-border",
                    isExpanded
                      ? "bg-accent/30"
                      : "hover:bg-accent/30",
                  ].join(" ")}
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-[30px] shrink-0 rounded overflow-hidden">
                      <Image
                        src={pipeline.imageUrl}
                        alt={`Pipeline ${pipeline.id}`}
                        width={40}
                        height={30}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>

                  {/* Post ID */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-foreground font-mono truncate block"
                      title={pipeline.postId}
                    >
                      {pipeline.postId}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <StatusBadge status={pipeline.status} />
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3 text-sm text-foreground tabular-nums">
                    {formatDuration(pipeline.totalDurationMs)}
                  </td>

                  {/* Triggered By (hidden on mobile) */}
                  <td className="hidden sm:table-cell px-4 py-3 text-sm text-foreground truncate">
                    {pipeline.triggerUser}
                  </td>

                  {/* Started At (hidden on mobile) */}
                  <td className="hidden sm:table-cell px-4 py-3 text-sm text-muted-foreground">
                    {formatRelativeTime(pipeline.startedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {isFailed && (
                      <button
                        type="button"
                        onClick={(e) => handleRetry(e, pipeline.id)}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-foreground hover:bg-accent transition-colors"
                      >
                        재시도
                      </button>
                    )}
                  </td>
                </tr>

                {/* Accordion: step detail row */}
                {isExpanded && (
                  <tr key={`${pipeline.id}-detail`}>
                    <td
                      colSpan={7}
                      className="p-0 border-b border-border"
                    >
                      <PipelineDetail pipelineId={pipeline.id} />
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

/**
 * Shimmer skeleton for PipelineTable while data is loading or on error.
 */
export function PipelineTableSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-16" />
          <col className="w-32" />
          <col className="w-28" />
          <col className="w-24" />
          <col className="hidden sm:table-column w-32" />
          <col className="hidden sm:table-column w-36" />
          <col className="w-20" />
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            {["이미지", "게시물 ID", "상태", "소요 시간", "실행자", "시작 시각", "액션"].map(
              (label, i) => (
                <th
                  key={label}
                  className={[
                    "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    i >= 4 ? "hidden sm:table-cell" : "",
                  ].join(" ")}
                >
                  {label}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-0"
            >
              {/* Thumbnail shimmer */}
              <td className="px-4 py-3">
                <div className="w-10 h-[30px] rounded bg-muted" />
              </td>
              {/* Post ID shimmer */}
              <td className="px-4 py-3">
                <div className="h-4 w-24 rounded bg-muted" />
              </td>
              {/* Status shimmer */}
              <td className="px-4 py-3">
                <div className="h-5 w-20 rounded-full bg-muted" />
              </td>
              {/* Duration shimmer */}
              <td className="px-4 py-3">
                <div className="h-4 w-12 rounded bg-muted" />
              </td>
              {/* Triggered By shimmer (hidden on mobile) */}
              <td className="hidden sm:table-cell px-4 py-3">
                <div className="h-4 w-24 rounded bg-muted" />
              </td>
              {/* Started At shimmer (hidden on mobile) */}
              <td className="hidden sm:table-cell px-4 py-3">
                <div className="h-4 w-20 rounded bg-muted" />
              </td>
              {/* Actions shimmer */}
              <td className="px-4 py-3">
                <div className="h-6 w-12 rounded bg-muted" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
