"use client";

import { useMemo, useCallback } from "react";
import type { ImageRow } from "@/lib/supabase/types";
import { useInfiniteFilteredImages } from "@/lib/hooks/useImages";
import type { ImageWithPostId } from "@/lib/supabase/queries/images";
import {
  VerticalFeed,
  VerticalFeedSkeleton,
} from "@/lib/components/VerticalFeed";
import type { FeedCardItem } from "@/lib/components/FeedCard";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useSearchStore } from "@/lib/stores/searchStore";
import { FeedHeader } from "@/lib/components/feed";

type Props = {
  initialImages: ImageRow[];
};

/**
 * Feed Client Component - Instagram-style Vertical Feed
 *
 * Uses SSR + React Query infinite scroll pattern:
 * - First render: Uses SSR initialImages
 * - React Query fetches in CSR -> appends data as user scrolls
 */
export function FeedClient({ initialImages: _initialImages }: Props) {
  const activeFilter = useFilterStore((state) => state.activeFilter);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);

  // Use infinite query hook
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
    limit: 20, // Smaller batch for vertical feed (full-width cards)
    filter: activeFilter,
    search: debouncedQuery,
  });

  // Flatten pages into a single items array with cross-page deduplication
  const items: ImageWithPostId[] = useMemo(() => {
    if (!data) return [];
    const seen = new Set<string>();
    return data.pages
      .flatMap((page) => page.items)
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
  }, [data]);

  // Normalize status values from database enum to consistent format
  const normalizeStatus = (
    raw: string | null
  ): "pending" | "extracted" | "skipped" | string | undefined => {
    if (!raw) return undefined;
    const lower = raw.toLowerCase();
    if (lower === "pending") return "pending";
    if (lower === "extracted") return "extracted";
    if (lower === "skipped") return "skipped";
    return raw;
  };

  // Map ImageWithPostId[] to FeedCardItem[]
  const feedItems: FeedCardItem[] = useMemo(
    () =>
      items
        .filter((image) => image.image_url != null)
        .map((image) => ({
          id: image.id,
          imageUrl: image.image_url,
          status: normalizeStatus(image.status),
          hasItems: image.with_items,
          postId: image.postId,
          postSource: image.postSource,
          postAccount: image.postAccount,
          postCreatedAt: image.postCreatedAt,
        })),
    [items]
  );

  // Memoize onReachEnd callback to prevent unnecessary re-renders
  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state: show skeleton feed (only on initial load)
  if (isLoading && !data) {
    return (
      <div className="flex flex-col h-full">
        <FeedHeader />
        <div className="flex-1 relative">
          <div className="h-full">
            <VerticalFeedSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state: show error message with retry button
  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <FeedHeader />
        <div className="flex-1 relative">
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-4 text-4xl">Warning</div>
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
        </div>
      </div>
    );
  }

  // Empty state: show empty state message
  if (!items || items.length === 0) {
    const hasActiveFilter = activeFilter !== "all";
    const hasSearchQuery = debouncedQuery.trim().length > 0;
    const hasFiltersApplied = hasActiveFilter || hasSearchQuery;

    const handleResetFilters = () => {
      useFilterStore.getState().setFilter("all");
      useSearchStore.getState().setQuery("");
      useSearchStore.getState().setDebouncedQuery("");
    };

    return (
      <div className="flex flex-col h-full">
        <FeedHeader />
        <div className="flex-1 relative">
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                {hasFiltersApplied
                  ? "검색 결과가 없습니다"
                  : "아직 이미지가 없습니다"}
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                {hasFiltersApplied
                  ? "다른 검색어나 필터를 사용해보세요."
                  : "나중에 다시 확인해주세요."}
              </p>
              {hasFiltersApplied && (
                <button
                  onClick={handleResetFilters}
                  className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  type="button"
                >
                  필터 초기화
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state: show vertical feed with actual images
  return (
    <div className="flex flex-col h-full">
      <FeedHeader />
      <div className="flex-1 relative">
        <div className="h-full">
          <VerticalFeed
            items={feedItems}
            onReachEnd={handleReachEnd}
            hasMore={!!hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        </div>
      </div>
    </div>
  );
}
