"use client";

import { memo } from "react";
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
 * Search result tabs
 *
 * Features:
 * - All, People, Media, Items tabs
 * - Badge with result count from facets
 * - Active state styling
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
            <span className="flex items-center gap-2">
              {tab.label}
              {count !== undefined && count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count > 999 ? "999+" : count}
                </span>
              )}
            </span>
            {/* Active indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
});
