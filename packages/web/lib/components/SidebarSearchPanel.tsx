"use client";

import { memo, useEffect, useRef, useCallback } from "react";
import { X, Search } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchStore } from "../stores/searchStore";
import { useFilterStore, type FilterKey } from "../stores/filterStore";

interface FilterOption {
  id: FilterKey;
  label: string;
}

const filterOptions: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "newjeanscloset", label: "NewJeans" },
  { id: "blackpinkk.style", label: "BLACKPINK" },
];

interface SidebarSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SidebarSearchPanel - Slide-out search panel for desktop sidebar
 *
 * Features:
 * - Slides out from sidebar on Search click
 * - Integrated search input with debounce
 * - Filter options as list (not dropdown)
 * - Click outside / ESC to close
 * - Positioned next to sidebar (left-[60px] lg:left-[240px])
 */
export const SidebarSearchPanel = memo(
  ({ isOpen, onClose }: SidebarSearchPanelProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Search store
    const query = useSearchStore((s) => s.query);
    const setQuery = useSearchStore((s) => s.setQuery);
    const setDebouncedQuery = useSearchStore((s) => s.setDebouncedQuery);
    const debounced = useDebounce(query, 250);

    // Filter store
    const activeFilter = useFilterStore((state) => state.activeFilter);
    const setFilter = useFilterStore((state) => state.setFilter);

    // Update debounced query
    useEffect(() => {
      setDebouncedQuery(debounced);
    }, [debounced, setDebouncedQuery]);

    // Focus input when panel opens
    useEffect(() => {
      if (isOpen && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300); // Wait for animation
      }
    }, [isOpen]);

    // Click outside handler
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        // Don't close if clicking inside the sidebar (parent handles toggle)
        const sidebar = document.querySelector(
          '[aria-label="Main navigation"]'
        );
        if (sidebar?.contains(e.target as Node)) {
          return;
        }

        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      if (isOpen) {
        // Use setTimeout to avoid immediate close on the same click that opens
        const timeoutId = setTimeout(() => {
          document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        return () => {
          clearTimeout(timeoutId);
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [isOpen, onClose]);

    // Escape key handler
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [isOpen, onClose]);

    const handleClearSearch = useCallback(() => {
      setQuery("");
      inputRef.current?.focus();
    }, [setQuery]);

    return (
      <div
        ref={panelRef}
        className={`fixed top-0 h-screen z-40 hidden md:block
                    left-[60px] lg:left-[240px]
                    w-[340px] bg-sidebar border-r border-sidebar-border
                    shadow-xl
                    transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 border-b border-sidebar-border">
          <h2 className="text-xl font-semibold text-sidebar-foreground">
            Search
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
            aria-label="Close search panel"
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg px-4 py-3 bg-sidebar-accent/50 border border-sidebar-border">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              aria-label="Search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if (query) {
                    setQuery("");
                  } else {
                    onClose();
                  }
                }
              }}
              className="flex-1 bg-transparent outline-none text-base text-sidebar-foreground placeholder-muted-foreground"
              type="text"
            />
            {query && (
              <button
                className="rounded-full p-1 transition-colors hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground"
                aria-label="Clear search"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
            Filter by source
          </h3>
          <div className="space-y-1">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`w-full px-4 py-3 text-left text-base rounded-lg transition-colors ${
                  activeFilter === option.id
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches (Placeholder for future) */}
        <div className="px-4 pt-4 border-t border-sidebar-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
            Recent
          </h3>
          <p className="px-2 text-sm text-muted-foreground">
            No recent searches
          </p>
        </div>
      </div>
    );
  }
);

SidebarSearchPanel.displayName = "SidebarSearchPanel";
