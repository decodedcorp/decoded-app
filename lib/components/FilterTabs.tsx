"use client";

import React from "react";
import { useFilterStore } from "../stores/filterStore";

const filters = [
  { key: "all", label: "All", color: "rgb(255, 133, 0)" }, // Orange
  { key: "latest", label: "Latest", color: "rgb(255, 215, 0)" }, // Gold
  { key: "clothing", label: "Clothing", color: "rgb(255, 182, 193)" }, // Pink
  { key: "accessories", label: "Accessories", color: "rgb(221, 160, 221)" }, // Plum
  { key: "shoes", label: "Shoes", color: "rgb(135, 206, 250)" }, // Light blue
  { key: "bags", label: "Bags", color: "rgb(210, 180, 140)" }, // Tan
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
                        ${
                          isActive
                            ? "scale-105 font-semibold opacity-100 shadow-lg ring-2 ring-white/50"
                            : "opacity-80 hover:opacity-100"
                        }`}
            style={{
              backgroundColor: f.color,
              color: "rgb(0, 0, 0)",
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
