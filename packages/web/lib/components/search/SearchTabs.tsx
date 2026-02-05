"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { useSearchStore } from "@decoded/shared";
import type { SearchTab, SearchFacets } from "@decoded/shared/types/search";

interface SearchTabsProps {
  facets?: SearchFacets;
  totalCount?: number;
  className?: string;
}

interface TabConfig {
  id: SearchTab;
  label: string;
  getCount?: (facets: SearchFacets, totalCount?: number) => number | undefined;
}

const TABS: TabConfig[] = [
  {
    id: "all",
    label: "All",
    getCount: (_, totalCount) => totalCount,
  },
  {
    id: "people",
    label: "People",
    // People count would come from a separate facet if available
    getCount: () => undefined,
  },
  {
    id: "media",
    label: "Media",
    getCount: (facets) =>
      Object.values(facets.media_type).reduce((sum, count) => sum + count, 0),
  },
  {
    id: "items",
    label: "Items",
    getCount: (facets) =>
      Object.values(facets.category).reduce((sum, count) => sum + count, 0),
  },
];

/**
 * Search result tabs with animated sliding underline
 *
 * Features:
 * - All, People, Media, Items tabs
 * - Result counts in "Label (count)" format
 * - Animated sliding underline indicator between active tabs
 * - Active state styling per decoded.pen spec
 */
export const SearchTabs = memo(function SearchTabs({
  facets,
  totalCount,
  className = "",
}: SearchTabsProps) {
  const activeTab = useSearchStore((s) => s.activeTab);
  const setActiveTab = useSearchStore((s) => s.setActiveTab);

  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-border ${className}`}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count =
          facets && tab.getCount ? tab.getCount(facets, totalCount) : undefined;

        // Format count display: "Label (count)"
        const displayLabel =
          count !== undefined && count > 0
            ? `${tab.label} (${count > 999 ? "999+" : count})`
            : tab.label;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {displayLabel}
            {/* Animated sliding underline indicator */}
            {isActive && (
              <motion.span
                layoutId="search-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});
