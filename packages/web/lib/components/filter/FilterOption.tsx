"use client";

import React from "react";

interface FilterOptionProps {
  id: string;
  label: string;
  labelKo?: string;
  count?: number;
  imageUrl?: string | null;
  isSelected?: boolean;
  onClick: () => void;
}

export function FilterOption({
  label,
  labelKo,
  count,
  imageUrl,
  isSelected = false,
  onClick,
}: FilterOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
        ${
          isSelected
            ? "bg-primary/10 text-primary border border-primary/30"
            : "hover:bg-muted/50 border border-transparent"
        }
      `}
    >
      {/* Optional image */}
      {imageUrl && (
        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Label */}
      <div className="flex-1 text-left min-w-0">
        <div className="font-medium text-sm truncate">{label}</div>
        {labelKo && labelKo !== label && (
          <div className="text-xs text-muted-foreground truncate">
            {labelKo}
          </div>
        )}
      </div>

      {/* Count badge */}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
          {count.toLocaleString()}
        </span>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <svg
          className="w-4 h-4 text-primary flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}
