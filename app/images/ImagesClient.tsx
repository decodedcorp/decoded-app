"use client";

import type { ImageRow } from "@/lib/supabase/types";
import { useInfiniteFilteredImages } from "@/lib/hooks/useImages";
import { ImageCard } from "./ImageCard";
import { ImageCardSkeleton } from "./ImageCardSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";

type Props = {
  initialImages: ImageRow[];
};

/**
 * Client Component for images feed
 *
 * Now uses unified adapter with deduplication for gallery mode:
 * - Uses fetchUnifiedImages with deduplicateByImageId=true
 * - Ensures all images visible (post-based + orphans)
 * - Prevents showing same image multiple times
 */
export function ImagesClient({ initialImages }: Props) {
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
    filter: "all",
    search: "",
    deduplicateByImageId: true, // Gallery mode: dedupe
  });

  // Flatten pages and use CSR data if available, fallback to SSR initial data
  const images = data
    ? data.pages.flatMap((page) => page.items)
    : initialImages;

  // Loading state: show skeleton grid
  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ImageCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Error state: show error component with retry button
  if (isError) {
    return (
      <ErrorState
        error={error instanceof Error ? error : new Error("Unknown error")}
        onRetry={() => refetch()}
      />
    );
  }

  // Empty state: show empty state component
  if (!images || images.length === 0) {
    return <EmptyState />;
  }

  // Success state: show image grid with infinite scroll
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>

      {/* Load more button or auto-load */}
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            type="button"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
