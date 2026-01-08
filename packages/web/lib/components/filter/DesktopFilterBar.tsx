"use client";

import React from "react";
import { useHierarchicalFilterStore } from "@decoded/shared/stores/hierarchicalFilterStore";
import {
  getMockCategories,
  getMockMediaByCategory,
  getMockCastByMedia,
  getMockContextOptions,
} from "@decoded/shared/data/mockFilterData";
import type { CategoryType, ContextType } from "@decoded/shared/types/filter";
import { FilterDropdown } from "./FilterDropdown";
import { FilterBreadcrumb } from "./FilterBreadcrumb";

export function DesktopFilterBar() {
  const {
    category,
    mediaId,
    castId,
    contextType,
    breadcrumb,
    setCategory,
    setMedia,
    setCast,
    setContext,
    clearAll,
    navigateToBreadcrumb,
    hasActiveFilters,
  } = useHierarchicalFilterStore();

  // Get options
  const categories = getMockCategories();
  const mediaOptions = category ? getMockMediaByCategory(category) : [];
  const castOptions = mediaId ? getMockCastByMedia(mediaId) : [];
  const contextOptions = getMockContextOptions();

  return (
    <div className="flex items-center gap-2">
      {/* Breadcrumb (shows when filters are active) */}
      {hasActiveFilters() && (
        <div className="hidden lg:flex items-center mr-2">
          <FilterBreadcrumb
            breadcrumb={breadcrumb}
            onNavigate={navigateToBreadcrumb}
            onClearAll={clearAll}
          />
        </div>
      )}

      {/* Filter dropdowns */}
      <div className="flex items-center gap-1.5">
        {/* Category dropdown */}
        <FilterDropdown
          label="Category"
          options={categories.map((c) => ({
            id: c.id,
            label: c.label,
            labelKo: c.labelKo,
            count: c.postCount,
          }))}
          selectedId={category}
          onSelect={(id, label) => setCategory(id as CategoryType, label)}
          placeholder="All"
        />

        {/* Media dropdown */}
        <FilterDropdown
          label="Media"
          options={mediaOptions.map((m) => ({
            id: m.id,
            label: m.name,
            labelKo: m.nameKo,
            count: m.postCount,
            imageUrl: m.imageUrl,
          }))}
          selectedId={mediaId}
          onSelect={(id, label, labelKo) => setMedia(id, label, labelKo)}
          disabled={!category}
          placeholder="Select..."
          searchable={mediaOptions.length > 5}
        />

        {/* Cast dropdown */}
        <FilterDropdown
          label="Cast"
          options={castOptions.map((c) => ({
            id: c.id,
            label: c.name,
            labelKo: c.nameKo,
            count: c.postCount,
            imageUrl: c.profileImageUrl,
          }))}
          selectedId={castId}
          onSelect={(id, label, labelKo) => setCast(id, label, labelKo)}
          disabled={!mediaId}
          placeholder="Select..."
          searchable={castOptions.length > 5}
        />

        {/* Context dropdown */}
        <FilterDropdown
          label="Context"
          options={contextOptions.map((c) => ({
            id: c.id,
            label: c.label,
            labelKo: c.labelKo,
          }))}
          selectedId={contextType}
          onSelect={(id, label) => setContext(id as ContextType, label)}
          disabled={!castId}
          placeholder="Select..."
        />
      </div>

      {/* Clear all button */}
      {hasActiveFilters() && (
        <button
          onClick={clearAll}
          className="ml-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
