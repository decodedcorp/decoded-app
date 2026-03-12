"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { DailyMetric } from "@/lib/api/admin/dashboard";

/** Reads chart colors from CSS variables (chart-1..5) for Recharts compatibility */
function useChartColors(): [string, string, string] {
  return useMemo(() => {
    if (typeof document === "undefined")
      return ["oklch(0.9519 0.1739 115.8446)", "oklch(0.7058 0 0)", "oklch(0.7049 0.1867 47.6044)"];
    const s = getComputedStyle(document.documentElement);
    const c1 = s.getPropertyValue("--chart-1").trim() || "oklch(0.9519 0.1739 115.8446)";
    const c2 = s.getPropertyValue("--chart-2").trim() || "oklch(0.7058 0 0)";
    const c3 = s.getPropertyValue("--chart-3").trim() || "oklch(0.7049 0.1867 47.6044)";
    return [c1, c2, c3];
  }, []);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrafficChartProps {
  data: DailyMetric[];
  currentPeriod: number;
  onPeriodChange: (days: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PERIODS = [
  { label: "7일", value: 7 },
  { label: "14일", value: 14 },
  { label: "30일", value: 30 },
];

/** Formats ISO date string "YYYY-MM-DD" to short "Feb 1" style */
function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Determines X-axis tick interval based on period to avoid crowding */
function tickInterval(period: number): number {
  if (period <= 7) return 1;
  if (period <= 14) return 2;
  return 4; // 30D: show every 5th label (interval=4 means show index 0,4,8,...)
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-medium text-foreground mb-2">
        {label ? formatDateLabel(label) : ""}
      </p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground capitalize">
            {item.name}:
          </span>
          <span className="font-semibold text-foreground">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Traffic Chart ────────────────────────────────────────────────────────────

export function TrafficChart({
  data,
  currentPeriod,
  onPeriodChange,
}: TrafficChartProps) {
  const [c1, c2, c3] = useChartColors();

  // Format dates for display while keeping original as data key
  const chartData = data.map((d) => ({
    ...d,
    displayDate: formatDateLabel(d.date),
  }));

  const interval = tickInterval(currentPeriod);

  // Compute date range subtitle
  const startDate = data.length > 0 ? formatDateLabel(data[0].date) : "";
  const endDate =
    data.length > 0 ? formatDateLabel(data[data.length - 1].date) : "";
  const subtitle = startDate && endDate ? `${startDate} – ${endDate}` : "";

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            트래픽 현황
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => onPeriodChange(period.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                currentPeriod === period.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradDau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c1} stopOpacity={0.15} />
              <stop offset="95%" stopColor={c1} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradSearches" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c2} stopOpacity={0.12} />
              <stop offset="95%" stopColor={c2} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c3} stopOpacity={0.1} />
              <stop offset="95%" stopColor={c3} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={interval}
            tickFormatter={formatDateLabel}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--muted-foreground)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={32}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />

          <Area
            type="monotone"
            dataKey="dau"
            name="일간 활성"
            stroke={c1}
            strokeWidth={2}
            fill="url(#gradDau)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />

          <Area
            type="monotone"
            dataKey="searches"
            name="검색"
            stroke={c2}
            strokeWidth={2}
            fill="url(#gradSearches)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />

          <Area
            type="monotone"
            dataKey="clicks"
            name="클릭"
            stroke={c3}
            strokeWidth={2}
            fill="url(#gradClicks)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function TrafficChartSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="h-4 w-32 animate-pulse bg-muted rounded mb-2" />
          <div className="h-3 w-40 animate-pulse bg-muted rounded" />
        </div>
        {/* Period selector skeleton */}
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 w-10 animate-pulse bg-muted rounded-md"
            />
          ))}
        </div>
      </div>
      {/* Chart area skeleton */}
      <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
    </div>
  );
}
