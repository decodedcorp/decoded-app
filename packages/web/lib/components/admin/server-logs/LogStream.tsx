"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Trash2 } from "lucide-react";
import { useLogStream } from "@/lib/hooks/admin/useServerLogs";
import type { ServerLogEntry } from "@/lib/api/admin/server-logs";
import type { LogLevel } from "@/lib/api/admin/server-logs";

// ─── Style maps ───────────────────────────────────────────────────────────────

const LEVEL_TERMINAL_COLORS: Record<LogLevel, string> = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
  debug: "text-purple-400",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formats a timestamp as HH:MM:SS for terminal display */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

/** Pads a string to a fixed length for monospace alignment */
function pad(str: string, length: number): string {
  return str.padEnd(length).slice(0, length);
}

// ─── Log line ─────────────────────────────────────────────────────────────────

function LogLine({ entry }: { entry: ServerLogEntry }) {
  const levelColor = LEVEL_TERMINAL_COLORS[entry.level];

  return (
    <div className="leading-5 hover:bg-accent/20 px-4 py-0.5 group">
      {/* [HH:MM:SS] LEVEL  METHOD ENDPOINT STATUS RESPONSEms — MESSAGE */}
      <span className="text-muted-foreground">[{formatTime(entry.timestamp)}]</span>{" "}
      <span className={`${levelColor} font-semibold`}>
        {pad(entry.level.toUpperCase(), 5)}
      </span>{" "}
      <span className="text-foreground font-semibold">{pad(entry.method, 6)}</span>
      <span className="text-muted-foreground">{entry.endpoint}</span>{" "}
      <span className="text-foreground tabular-nums">{entry.statusCode}</span>{" "}
      <span className="text-muted-foreground tabular-nums">{entry.responseTimeMs}ms</span>
      {" — "}
      <span className={levelColor}>{entry.message}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Terminal-style real-time log streaming console.
 *
 * Visual design: dark background, monospace font — mimics `tail -f` experience.
 * Self-contained: uses useLogStream hook internally, no props needed.
 *
 * Features:
 * - Pulsing green dot when streaming, gray when paused
 * - Pause/Resume toggle (Play/Pause icons)
 * - Clear button (Trash2)
 * - Entry count badge
 * - Auto-scroll to bottom on new entries (stops when user scrolls up)
 * - "Jump to bottom" pill when user has scrolled up
 */
export function LogStream() {
  const { entries, isStreaming, isPaused, toggle, clear } = useLogStream();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const isAutoScrollActiveRef = useRef(true);

  // Detect manual scroll up
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, clientHeight, scrollHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isAtBottom) {
      isAutoScrollActiveRef.current = true;
      setIsUserScrolledUp(false);
    } else {
      isAutoScrollActiveRef.current = false;
      setIsUserScrolledUp(true);
    }
  }, []);

  // Auto-scroll to bottom on new entries, unless user scrolled up
  useEffect(() => {
    if (!isAutoScrollActiveRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [entries]);

  // Jump to bottom handler
  const jumpToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    isAutoScrollActiveRef.current = true;
    setIsUserScrolledUp(false);
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden font-mono">
      {/* Header bar */}
      <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isStreaming && !isPaused
                ? "bg-primary animate-pulse"
                : "bg-muted-foreground"
            }`}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-foreground tracking-wide">
            실시간 로그
          </span>
          {isPaused && (
            <span className="text-xs text-muted-foreground ml-1">(일시정지)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Entry count badge */}
          <span className="text-xs text-muted-foreground tabular-nums">
            {entries.length.toLocaleString()}건
          </span>

          {/* Pause/Resume toggle */}
          <button
            type="button"
            onClick={toggle}
            title={isPaused || !isStreaming ? "스트리밍 재개" : "스트리밍 일시정지"}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={isPaused || !isStreaming ? "재개" : "일시정지"}
          >
            {isPaused || !isStreaming ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={clear}
            title="로그 지우기"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="지우기"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log area */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-[400px] overflow-y-auto text-xs py-2 bg-background"
        >
          {entries.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              {isStreaming && !isPaused
                ? "로그 항목 대기 중..."
                : "스트리밍 일시정지. 재생 버튼을 눌러 재개하세요."}
            </div>
          ) : (
            entries.map((entry) => <LogLine key={entry.id} entry={entry} />)
          )}
        </div>

        {/* Jump to bottom pill */}
        {isUserScrolledUp && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <button
              type="button"
              onClick={jumpToBottom}
              className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full border border-border transition-colors shadow-lg"
            >
              맨 아래로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
