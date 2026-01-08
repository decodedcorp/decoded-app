"use client";

import React from "react";
import type { FilterBreadcrumb as BreadcrumbType } from "@decoded/shared/types/filter";

interface FilterBreadcrumbProps {
  breadcrumb: BreadcrumbType[];
  onNavigate: (level: number) => void;
  onClearAll?: () => void;
}

export function FilterBreadcrumb({
  breadcrumb,
  onNavigate,
  onClearAll,
}: FilterBreadcrumbProps) {
  if (breadcrumb.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-sm overflow-x-auto pb-1 scrollbar-hide">
      {/* Home/All button */}
      <button
        onClick={onClearAll}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Clear all filters"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>

      {breadcrumb.map((item, index) => (
        <React.Fragment key={`${item.level}-${item.id}`}>
          {/* Separator */}
          <span className="text-muted-foreground/50 flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>

          {/* Breadcrumb item */}
          <button
            onClick={() => onNavigate(item.level)}
            className={`
              flex-shrink-0 px-2 py-0.5 rounded transition-colors truncate max-w-[120px]
              ${
                index === breadcrumb.length - 1
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }
            `}
          >
            {item.labelKo || item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
