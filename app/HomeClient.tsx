"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { ImageRow } from "@/lib/supabase/types";
import { useFilteredImages } from "@/lib/hooks/useImages";
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
  initialImages: ImageRow[];
};

// Card cell component with actual image data
const CardCell = memo(({ gridIndex, position, isMoving, item }: ItemConfig) => {
  const [imageError, setImageError] = useState(false);
  const setTransition = useTransitionStore((state) => state.setTransition);

  // Top 6 images get high priority for faster initial load
  const isTopImage = gridIndex < 6;
  const imageUrl = item?.imageUrl;
  const status = item?.status;
  const hasItems = item?.hasItems;
  const imageId = item?.id;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!imageId) return;

    const target = e.currentTarget.querySelector("article") as HTMLElement;
    if (!target) return;

    // Capture FLIP state before navigation
    try {
      const state = Flip.getState(target);
      const rect = target.getBoundingClientRect();

      setTransition(imageId, state, rect);
    } catch (error) {
      // Fallback: just store rect if Flip.getState fails
      const rect = target.getBoundingClientRect();
      setTransition(imageId, null, rect);
    }
  };

  // Status badge colors
  const getStatusBadgeStyle = (status?: string) => {
    if (!status) return "";
    const lower = status.toLowerCase();

    if (lower === "pending") {
      return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100";
    }

    if (lower === "extracted") {
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100";
    }

    if (lower === "skipped") {
      return "bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100";
    }

    return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-100";
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
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground">
            <div className="mb-1 text-2xl">📷</div>
            <div className="text-xs">No image</div>
          </div>
        )}

        {/* Status and hasItems badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {status && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getStatusBadgeStyle(status)}`}
            >
              {status}
            </span>
          )}
          {hasItems && (
            <span className="rounded-full bg-blue-500/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-100">
              Items
            </span>
          )}
        </div>
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
});

CardCell.displayName = "CardCell";

// Skeleton card for loading state
const SkeletonCard = memo(() => {
  return (
    <article className="absolute inset-1 flex flex-col overflow-hidden rounded-xl border border-border bg-card/60">
      <div className="relative aspect-[3/4] animate-pulse bg-muted" />
    </article>
  );
});

SkeletonCard.displayName = "SkeletonCard";

// Skeleton cell component for loading state
const SkeletonCell = memo(({ gridIndex, position, isMoving }: ItemConfig) => {
  return <SkeletonCard />;
});

SkeletonCell.displayName = "SkeletonCell";

/**
 * Client Component for home page
 *
 * Uses SSR + React Query pattern:
 * - First render: Uses SSR initialImages
 * - React Query fetches in CSR → replaces with data when available
 */
export function HomeClient({ initialImages }: Props) {
  const activeFilter = useFilterStore((state) => state.activeFilter);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);

  // Use filtered images hook with current filter and search state
  const { data, isLoading, isError, error, refetch } = useFilteredImages(
    activeFilter,
    debouncedQuery,
    50
  );

  // Merge SSR and CSR data: use CSR data if available, fallback to SSR initial data
  // Note: When filter/search is active, SSR initial data may not match, so CSR data takes precedence
  const images = data ?? initialImages;

  // Normalize status values from database enum to consistent format
  const normalizeStatus = (
    raw: string | null
  ): "pending" | "extracted" | "skipped" | string | undefined => {
    if (!raw) return undefined;
    const lower = raw.toLowerCase();
    if (lower === "pending") return "pending";
    if (lower === "extracted") return "extracted";
    if (lower === "skipped") return "skipped";
    return raw; // fallback for any other values
  };

  // Map ImageRow[] to GridItem[]
  // Filter out any records without image_url as a safety guard
  const gridItems: GridItem[] = images
    .filter((image) => image.image_url != null)
    .map((image) => ({
      id: image.id,
      imageUrl: image.image_url,
      status: normalizeStatus(image.status),
      hasItems: image.with_items,
    }));

  // Loading state: show skeleton grid
  if (isLoading && !data) {
    return (
      <div className="absolute inset-0 z-0 pt-14 md:pt-16">
        <ThiingsGrid
          gridSize={{ width: 400, height: 500 }}
          renderItem={(config) => <SkeletonCell {...config} />}
          initialPosition={{ x: 0, y: 0 }}
          items={[]}
        />
      </div>
    );
  }

  // Error state: show error message with retry button
  if (isError) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-14 md:pt-16">
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
  if (!images || images.length === 0) {
    const hasActiveFilter = activeFilter !== "all";
    const hasSearchQuery = debouncedQuery.trim().length > 0;

    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-14 md:pt-16">
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
  // Note: filter and searchQuery props are kept for backward compatibility
  // but ThiingsGrid no longer uses them for filtering (filtering is now server-side)
  return (
    <div className="absolute inset-0 z-0 pt-14 md:pt-16">
      <ThiingsGrid
        gridSize={{ width: 400, height: 500 }}
        renderItem={(config) => <CardCell {...config} />}
        initialPosition={{ x: 0, y: 0 }}
        items={gridItems}
      />
    </div>
  );
}
