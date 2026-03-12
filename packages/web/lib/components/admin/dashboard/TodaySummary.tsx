"use client";

import { Clock, FileImage, ShoppingBag, MousePointerClick } from "lucide-react";
import type { TodaySummary as TodaySummaryData } from "@/lib/api/admin/dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodaySummaryProps {
  data: TodaySummaryData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formats ISO timestamp to "HH:MM" in local time */
function formatTime(isoTimestamp: string): string {
  const d = new Date(isoTimestamp);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ─── Metric Item ──────────────────────────────────────────────────────────────

interface MetricItemProps {
  icon: React.ReactNode;
  iconBgClass: string;
  label: string;
  value: number;
}

function MetricItem({ icon, iconBgClass, label, value }: MetricItemProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Icon circle */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass}`}
      >
        {icon}
      </div>
      {/* Text */}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {value.toLocaleString("en-US")}
        </p>
      </div>
    </div>
  );
}

// ─── Today Summary ────────────────────────────────────────────────────────────

export function TodaySummary({ data }: TodaySummaryProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          오늘의 활동
        </h2>
        <span className="text-xs text-muted-foreground ml-auto">
          업데이트 {formatTime(data.timestamp)}
        </span>
      </div>

      {/* Metrics row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <MetricItem
          icon={<FileImage className="w-4 h-4 text-chart-1" />}
          iconBgClass="bg-primary/10"
          label="신규 게시물"
          value={data.newPosts}
        />
        <MetricItem
          icon={<ShoppingBag className="w-4 h-4 text-chart-2" />}
          iconBgClass="bg-muted"
          label="신규 솔루션"
          value={data.newSolutions}
        />
        <MetricItem
          icon={<MousePointerClick className="w-4 h-4 text-chart-3" />}
          iconBgClass="bg-chart-3/10"
          label="클릭"
          value={data.clicks}
        />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MetricItemSkeleton() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon circle skeleton */}
      <div className="w-8 h-8 rounded-full animate-pulse bg-muted flex-shrink-0" />
      {/* Text skeletons */}
      <div>
        <div className="h-3 w-20 animate-pulse bg-muted rounded mb-1.5" />
        <div className="h-4 w-12 animate-pulse bg-muted rounded" />
      </div>
    </div>
  );
}

export function TodaySummarySkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-28 animate-pulse bg-muted rounded" />
        <div className="h-3 w-24 animate-pulse bg-muted rounded ml-auto" />
      </div>
      {/* Metrics skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <MetricItemSkeleton />
        <MetricItemSkeleton />
        <MetricItemSkeleton />
      </div>
    </div>
  );
}
