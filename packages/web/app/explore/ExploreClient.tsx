"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useInfinitePosts } from "@/lib/hooks/usePosts";
import type { Post } from "@/lib/api/types";
import ThiingsGrid, { type GridItem } from "@/lib/components/ThiingsGrid";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useSearchStore } from "@/lib/stores/searchStore";
import { ExploreCardCell, ExploreSkeletonCell } from "@/lib/components/explore";

type Props = {
  initialPosts?: Post[];
};

/**
 * Explore Client Component - Pinterest-style Masonry Grid
 *
 * Uses SSR + React Query infinite scroll pattern:
 * - First render: Uses SSR initialPosts (if provided)
 * - React Query fetches from REST API -> appends data as user scrolls
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

  // Map filter store value to API category parameter
  const categoryParam = activeFilter !== "all" ? activeFilter : undefined;

  // Use infinite posts query hook (REST API)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts({
    perPage: 40,
    sort: "recent",
    category: categoryParam,
    // Note: search functionality would require API support for text search
  });

  // Flatten pages into a single items array
  const items: Post[] = data ? data.pages.flatMap((page) => page.items) : [];

  // Map Post[] to GridItem[]
  const gridItems: GridItem[] = items
    .filter((post) => post.image_url != null)
    .map((post) => {
      return {
        id: post.id,
        imageUrl: post.image_url,
        status: post.spot_count > 0 ? "extracted" : undefined,
        hasItems: post.spot_count > 0,
        postId: post.id,
        postSource: "post" as const,
        postAccount: post.user?.username ?? "Unknown",
        postCreatedAt: post.created_at,
      };
    });

  // Render full-screen ThiingsGrid (no header/filter)
  return (
    <div className="h-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
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
          {!isError && !isLoading && (!items || items.length === 0) && (
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
          {!isError && items && items.length > 0 && (
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
