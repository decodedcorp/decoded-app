"use client";

import { memo, useState, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useInfinitePosts } from "@/lib/hooks/usePosts";
import type { Post } from "@/lib/api/types";
import ThiingsGrid, {
  type ItemConfig,
  type GridItem,
} from "@/lib/components/ThiingsGrid";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useSearchStore } from "@/lib/stores/searchStore";
import { useTransitionStore } from "@/lib/stores/transitionStore";

// Register GSAP Flip plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

type Props = {
  initialPosts?: Post[];
};

// Card cell component with actual image data
const CardCell = memo(
  ({
    gridIndex,
    position: _position,
    isMoving: _isMoving,
    item,
  }: ItemConfig) => {
    const [imageError, setImageError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const setTransition = useTransitionStore((state) => state.setTransition);

    // Top 6 images get high priority for faster initial load
    const isTopImage = gridIndex < 6;
    const imageUrl = item?.imageUrl;
    const imageId = item?.id;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!imageId) return;

      const target = e.currentTarget.querySelector("article") as HTMLElement;
      if (!target) return;

      // Capture FLIP state before navigation
      try {
        const state = Flip.getState(target);
        const rect = target.getBoundingClientRect();

        setTransition(imageId, state, rect, imageUrl ?? undefined);
      } catch (_error) {
        // Fallback: just store rect if Flip.getState fails
        const rect = target.getBoundingClientRect();
        setTransition(imageId, null, rect, imageUrl ?? undefined);
      }
    };

    const cardContent = (
      <article
        data-flip-id={imageId ? `card-${imageId}` : undefined}
        className="absolute inset-1 flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 transition-shadow hover:shadow-lg"
      >
        {/* Image container with fixed aspect ratio */}
        <div className="relative aspect-[3/4] bg-muted">
          {/* Optimized image loading */}
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              loading={isTopImage ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={isTopImage ? "high" : "auto"}
              alt={item?.id ? `Image ${item.id}` : `Card ${gridIndex} image`}
              className={`h-full w-full object-cover transition-opacity duration-150 ease-out ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={() => setImageError(true)}
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>

        {/* Metadata footer */}
        {process.env.NODE_ENV === "development" && (
          <div className="flex items-center justify-between border-t border-border px-2 py-1">
            <span className="text-[10px] font-mono text-muted-foreground">
              {item?.id ? `#${item.id.slice(0, 8)}` : `#${gridIndex}`}
            </span>
          </div>
        )}
      </article>
    );

    if (!imageId) {
      return cardContent;
    }

    return (
      <Link
        href={`/images/${imageId}`}
        scroll={false}
        onClick={handleClick}
        className="absolute inset-0"
      >
        {cardContent}
      </Link>
    );
  }
);

CardCell.displayName = "CardCell";

// Skeleton card for loading state
const SkeletonCard = memo(() => {
  return (
    <article className="absolute inset-1 flex flex-col overflow-hidden rounded-xl border border-border bg-card/60">
      <div className="relative aspect-[3/4] animate-pulse bg-muted">
        {/* Skeleton badge placeholder */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    </article>
  );
});

SkeletonCard.displayName = "SkeletonCard";

// Skeleton cell component for loading state
const SkeletonCell = memo(
  ({
    gridIndex: _gridIndex,
    position: _position,
    isMoving: _isMoving,
  }: ItemConfig) => {
    return <SkeletonCard />;
  }
);

SkeletonCell.displayName = "SkeletonCell";

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

  // Loading state: show skeleton grid (only on initial load)
  if (isLoading && !data) {
    return (
      <div className="absolute inset-0 z-0 pt-14 pb-16 md:pt-16 md:pb-0">
        <ThiingsGrid
          gridSize={gridSize}
          renderItem={(config) => <SkeletonCell {...config} />}
          initialPosition={{ x: 0, y: 0 }}
          items={[]}
          hasMore={true}
        />
      </div>
    );
  }

  // Error state: show error message with retry button
  if (isError) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-14 pb-16 md:pt-16 md:pb-0">
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
    );
  }

  // Empty state: show empty state message
  if (!items || items.length === 0) {
    const hasActiveFilter = activeFilter !== "all";
    const hasSearchQuery = debouncedQuery.trim().length > 0;

    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-14 pb-16 md:pt-16 md:pb-0">
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mb-4 text-4xl">📷</div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {hasActiveFilter || hasSearchQuery
              ? "No images found"
              : "No images found yet."}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilter || hasSearchQuery
              ? "Try adjusting your filters or search query."
              : "Check back later or try adjusting your filters."}
          </p>
        </div>
      </div>
    );
  }

  // Success state: show grid with actual images
  return (
    <div className="absolute inset-0 z-0 pt-14 pb-16 md:pt-16 md:pb-0">
      <ThiingsGrid
        gridSize={gridSize}
        renderItem={(config) => <CardCell {...config} />}
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
  );
}
