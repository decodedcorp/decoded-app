"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useInfiniteFilteredImages } from "@/lib/hooks/useImages";
import type { ImageWithPostId } from "@decoded/shared/supabase/queries/images";
import ThiingsGrid, { type GridItem } from "@/lib/components/ThiingsGrid";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useSearchStore } from "@/lib/stores/searchStore";
import { ExploreCardCell, ExploreSkeletonCell } from "@/lib/components/explore";

type Props = {
  initialPosts?: ImageWithPostId[];
};

/**
 * Explore Client Component - Pinterest-style Masonry Grid
 *
 * Uses Direct Supabase Query Pattern:
 * - Bypasses failed REST API proxy
 * - Supports robust category filtering via spots/solutions join
 */
export function ExploreClient({ initialPosts: _initialPosts }: Props) {
  const activeFilter = useFilterStore((state) => state.activeFilter);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);

  // Responsive grid size: smaller on mobile, larger on desktop
  const [gridSize, setGridSize] = useState({ width: 400, height: 500 });

  useEffect(() => {
    const updateGridSize = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      setGridSize(
        isMobile
          ? { width: 180, height: 225 } // Mobile: smaller cells
          : { width: 400, height: 500 } // Desktop: original size
      );
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  // Use the direct query hook for robust filtering
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFilteredImages({
    limit: 40,
    filter: activeFilter,
    search: debouncedQuery,
  });

  // Flatten pages into a single items array
  const items: ImageWithPostId[] = useMemo(() => {
    return data ? data.pages.flatMap((page) => page.items) : [];
  }, [data]);

  // Map ImageWithPostId to GridItem[]
  const gridItems: GridItem[] = useMemo(() => {
    return items
      .filter((item) => item.image_url != null)
      .map((item) => ({
        id: item.id,
        imageUrl: item.image_url,
        status: item.status === "extracted" ? "extracted" : undefined,
        hasItems: item.with_items,
        postId: item.postId,
        postSource: item.postSource,
        postAccount: item.postAccount,
        postCreatedAt: item.postCreatedAt,
      }));
  }, [items]);

  // Render full-screen ThiingsGrid (no header/filter)
  return (
    <div className="relative h-[calc(100dvh-120px)] md:h-[calc(100dvh-72px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter + debouncedQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          {/* Loading state: show skeleton grid (only on initial load) */}
          {isLoading && !data && (
            <div className="absolute inset-0 z-0">
              <ThiingsGrid
                gridSize={gridSize}
                renderItem={() => <ExploreSkeletonCell />}
                initialPosition={{ x: 0, y: 0 }}
                items={[]}
                hasMore={true}
              />
            </div>
          )}

          {/* Error state: show error message with retry button */}
          {isError && (
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mb-4 text-4xl">⚠️</div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Failed to load images
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while loading images."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  type="button"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty state: show empty state message */}
          {!isError && !isLoading && items.length === 0 && (
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mb-4 text-4xl">📷</div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  {activeFilter !== "all" || debouncedQuery.trim().length > 0
                    ? "No images found"
                    : "No images found yet."}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeFilter !== "all" || debouncedQuery.trim().length > 0
                    ? "Try adjusting your filters or search query."
                    : "Check back later or try adjusting your filters."}
                </p>
              </div>
            </div>
          )}

          {/* Success state: show grid with actual images */}
          {!isError && items.length > 0 && (
            <div className="absolute inset-0 z-0">
              <ThiingsGrid
                gridSize={gridSize}
                renderItem={(config) => <ExploreCardCell {...config} />}
                initialPosition={{ x: 0, y: 0 }}
                items={gridItems}
                onReachEnd={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
                hasMore={!!hasNextPage}
                isLoadingMore={isFetchingNextPage}
              />

              {/* Loading indicator for next page */}
              {isFetchingNextPage && (
                <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Loading more...
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
