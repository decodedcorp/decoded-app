"use client";

import React from "react";
import { useFilterStore } from "../stores/filterStore";

const filters = [
  {
    key: "all",
    label: "All",
    className:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/50",
  },
  {
    key: "latest",
    label: "Latest",
    className:
      "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-100",
  },
  {
    key: "clothing",
    label: "Clothing",
    className:
      "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-100",
  },
  {
    key: "accessories",
    label: "Accessories",
    className:
      "bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-100",
  },
  {
    key: "shoes",
    label: "Shoes",
    className:
      "bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-100",
  },
  {
    key: "bags",
    label: "Bags",
    className:
      "bg-stone-100 text-stone-900 hover:bg-stone-200 dark:bg-stone-900/30 dark:text-stone-100",
  },
] as const;

export function FilterTabs() {
  const active = useFilterStore((s) => s.activeFilter);
  const setFilter = useFilterStore((s) => s.setFilter);

  return (
    <div
      role="tablist"
      aria-label="Content filters"
      className="flex items-center gap-1"
    >
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            onClick={() => setFilter(f.key)}
            className={`h-8 px-3 py-1 rounded-full text-sm lowercase transition-all duration-150 ease-out
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                        ${f.className}
                        ${
                          isActive
                            ? "scale-105 font-semibold opacity-100 shadow-sm ring-2 ring-background"
                            : "opacity-80 hover:opacity-100"
                        }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
