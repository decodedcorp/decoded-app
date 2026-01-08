"use client";

import React from "react";

interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  variant?: "default" | "primary";
  size?: "sm" | "md";
}

export function FilterChip({
  label,
  onRemove,
  variant = "default",
  size = "sm",
}: FilterChipProps) {
  const baseClasses = `
    inline-flex items-center gap-1 rounded-full transition-colors
    ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}
  `;

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground hover:bg-muted/80";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      <span className="truncate max-w-[100px]">{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
