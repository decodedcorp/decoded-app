"use client";

import { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogFiltersProps {
  level: string | undefined;
  search: string;
  timeRange: string;
  onLevelChange: (level: string | undefined) => void;
  onSearchChange: (search: string) => void;
  onTimeRangeChange: (range: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_OPTIONS = [
  { label: "전체", value: undefined, dotColor: null, textColor: "text-muted-foreground" },
  { label: "정보", value: "info", dotColor: "bg-blue-400", textColor: "text-blue-600 dark:text-blue-400" },
  { label: "경고", value: "warn", dotColor: "bg-yellow-400", textColor: "text-yellow-600 dark:text-yellow-400" },
  { label: "에러", value: "error", dotColor: "bg-red-400", textColor: "text-red-600 dark:text-red-400" },
  { label: "디버그", value: "debug", dotColor: "bg-purple-400", textColor: "text-purple-600 dark:text-purple-400" },
] as const;

const TIME_RANGE_OPTIONS = [
  { label: "1시간", value: "1h" },
  { label: "6시간", value: "6h" },
  { label: "24시간", value: "24h" },
  { label: "7일", value: "7d" },
  { label: "전체", value: "all" },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computes the ISO string for the start of the selected time range.
 * Returns undefined when "all" is selected (no date filter).
 */
export function timeRangeToFrom(range: string): string | undefined {
  if (range === "all") return undefined;

  const now = new Date();
  const ms: Record<string, number> = {
    "1h": 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  };
  const offset = ms[range];
  if (!offset) return undefined;
  return new Date(now.getTime() - offset).toISOString();
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Filter bar for the server logs table.
 * Provides level button group, time range presets, and debounced search input.
 */
export function LogFilters({
  level,
  search,
  timeRange,
  onLevelChange,
  onSearchChange,
  onTimeRangeChange,
}: LogFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync localSearch if parent resets the search value externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const activeBtnBase =
    "px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground transition-colors";
  const inactiveBtnBase =
    "px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors";

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
      {/* Level filter */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {LEVEL_OPTIONS.map((opt) => {
          const isActive = level === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onLevelChange(opt.value)}
              className={isActive ? activeBtnBase : inactiveBtnBase}
              aria-pressed={isActive}
            >
              <span className="flex items-center gap-1.5">
                {opt.dotColor && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dotColor} ${!isActive ? "opacity-70" : ""}`}
                  />
                )}
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time range selector */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {TIME_RANGE_OPTIONS.map((opt) => {
          const isActive = timeRange === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTimeRangeChange(opt.value)}
              className={isActive ? activeBtnBase : inactiveBtnBase}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={handleSearchInput}
          placeholder="로그 검색..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
