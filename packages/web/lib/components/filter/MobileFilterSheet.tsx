"use client";

import React from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "motion/react";
import { useHierarchicalFilterStore } from "@decoded/shared/stores/hierarchicalFilterStore";
import {
  getMockCategories,
  getMockMediaByCategory,
  getMockCastByMedia,
  getMockContextOptions,
} from "@decoded/shared/data/mockFilterData";
import type { CategoryType, FilterLevel } from "@decoded/shared/types/filter";
import { FilterOption } from "./FilterOption";
import { FilterBreadcrumb } from "./FilterBreadcrumb";
import { FilterChip } from "./FilterChip";

export function MobileFilterSheet() {
  const {
    category,
    mediaId,
    castId,
    contextType,
    breadcrumb,
    isFilterOpen,
    setFilterOpen,
    setCategory,
    setMedia,
    setCast,
    setContext,
    clearAll,
    navigateToBreadcrumb,
    hasActiveFilters,
    getActiveFilterCount,
  } = useHierarchicalFilterStore();

  const dragControls = useDragControls();

  // Current options based on drill-down level
  const categories = getMockCategories();
  const mediaOptions = category ? getMockMediaByCategory(category) : [];
  const castOptions = mediaId ? getMockCastByMedia(mediaId) : [];
  const contextOptions = getMockContextOptions();

  // Determine current level
  const getCurrentLevel = (): FilterLevel => {
    if (!category) return 1;
    if (!mediaId) return 2;
    if (!castId) return 3;
    return 4;
  };

  const currentLevel = getCurrentLevel();

  // Handle drag end
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100) {
      setFilterOpen(false);
    }
  };

  // Get current level title
  const getLevelTitle = (): string => {
    switch (currentLevel) {
      case 1:
        return "Category";
      case 2:
        return "Media / Group";
      case 3:
        return "Cast / Member";
      case 4:
        return "Context";
      default:
        return "Filter";
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setFilterOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm transition-all hover:border-primary/50"
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
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filter</span>
        {hasActiveFilters() && (
          <span className="px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[9998]"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-[9999] max-h-[85vh] overflow-hidden shadow-xl"
            >
              {/* Drag handle */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
              >
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-4 pb-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">{getLevelTitle()}</h2>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Breadcrumb */}
                <FilterBreadcrumb
                  breadcrumb={breadcrumb}
                  onNavigate={navigateToBreadcrumb}
                  onClearAll={clearAll}
                />

                {/* Active filters chips */}
                {hasActiveFilters() && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {breadcrumb.map((item) => (
                      <FilterChip
                        key={`${item.level}-${item.id}`}
                        label={item.labelKo || item.label}
                        onRemove={() => navigateToBreadcrumb(item.level - 1)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                {/* Level 1: Categories */}
                {currentLevel === 1 && (
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <FilterOption
                        key={cat.id}
                        id={cat.id}
                        label={cat.label}
                        labelKo={cat.labelKo}
                        count={cat.postCount}
                        isSelected={category === cat.id}
                        onClick={() =>
                          setCategory(cat.id as CategoryType, cat.label)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Level 2: Media */}
                {currentLevel === 2 && (
                  <div className="space-y-1">
                    {mediaOptions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No media available
                      </p>
                    ) : (
                      mediaOptions.map((media) => (
                        <FilterOption
                          key={media.id}
                          id={media.id}
                          label={media.name}
                          labelKo={media.nameKo}
                          count={media.postCount}
                          imageUrl={media.imageUrl}
                          isSelected={mediaId === media.id}
                          onClick={() =>
                            setMedia(media.id, media.name, media.nameKo)
                          }
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Level 3: Cast */}
                {currentLevel === 3 && (
                  <div className="space-y-1">
                    {castOptions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No cast available
                      </p>
                    ) : (
                      castOptions.map((cast) => (
                        <FilterOption
                          key={cast.id}
                          id={cast.id}
                          label={cast.name}
                          labelKo={cast.nameKo}
                          count={cast.postCount}
                          imageUrl={cast.profileImageUrl}
                          isSelected={castId === cast.id}
                          onClick={() =>
                            setCast(cast.id, cast.name, cast.nameKo)
                          }
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Level 4: Context */}
                {currentLevel === 4 && (
                  <div className="space-y-1">
                    {contextOptions.map((ctx) => (
                      <FilterOption
                        key={ctx.id}
                        id={ctx.id}
                        label={ctx.label}
                        labelKo={ctx.labelKo}
                        isSelected={contextType === ctx.id}
                        onClick={() => setContext(ctx.id, ctx.label)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-card">
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90"
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
