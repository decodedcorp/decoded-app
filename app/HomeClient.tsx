'use client';

import { memo, useState } from 'react';
import type { ImageRow } from '@/lib/supabase/types';
import { useLatestImages } from '@/lib/hooks/useImages';
import ThiingsGrid, { type ItemConfig, type GridItem } from '@/lib/components/ThiingsGrid';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useSearchStore } from '@/lib/stores/searchStore';

type Props = {
  initialImages: ImageRow[];
};

// Card cell component with actual image data
const CardCell = memo(({ gridIndex, position, isMoving, item }: ItemConfig) => {
  const [imageError, setImageError] = useState(false);
  // Top 6 images get high priority for faster initial load
  const isTopImage = gridIndex < 6;
  const imageUrl = item?.imageUrl;
  const status = item?.status;
  const hasItems = item?.hasItems;

  // Status badge colors
  const getStatusBadgeStyle = (status?: string) => {
    if (!status) return '';
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'bg-yellow-500/80 text-yellow-100';
    if (lower === 'extracted') return 'bg-green-500/80 text-green-100';
    if (lower === 'skipped') return 'bg-zinc-600/80 text-zinc-200';
    return 'bg-zinc-700/80 text-zinc-200';
  };

  return (
    <article className="absolute inset-1 flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 transition-shadow">
      {/* Image container with fixed aspect ratio */}
      <div className="relative aspect-[3/4] bg-zinc-900">
        {/* Optimized image loading */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            loading={isTopImage ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={isTopImage ? 'high' : 'auto'}
            alt={item?.id ? `Image ${item.id}` : `Card ${gridIndex} image`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900 text-zinc-500">
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
      {process.env.NODE_ENV === 'development' && (
        <div className="flex items-center justify-between border-t border-zinc-800 px-2 py-1">
          <span className="text-[10px] font-mono text-zinc-500">
            {item?.id ? `#${item.id.slice(0, 8)}` : `#${gridIndex}`}
          </span>
        </div>
      )}
    </article>
  );
});

CardCell.displayName = 'CardCell';

// Skeleton card for loading state
const SkeletonCard = memo(() => {
  return (
    <article className="absolute inset-1 flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
      <div className="relative aspect-[3/4] animate-pulse bg-zinc-900" />
    </article>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

// Skeleton cell component for loading state
const SkeletonCell = memo(({ gridIndex, position, isMoving }: ItemConfig) => {
  return <SkeletonCard />;
});

SkeletonCell.displayName = 'SkeletonCell';

/**
 * Client Component for home page
 *
 * Uses SSR + React Query pattern:
 * - First render: Uses SSR initialImages
 * - React Query fetches in CSR → replaces with data when available
 */
export function HomeClient({ initialImages }: Props) {
  const { data, isLoading, isError, error, refetch } = useLatestImages(50);
  const activeFilter = useFilterStore((state) => state.activeFilter);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);

  // Merge SSR and CSR data: use CSR data if available, fallback to SSR initial data
  const images = data ?? initialImages;

  // Normalize status values from database enum to consistent format
  const normalizeStatus = (raw: string | null): 'pending' | 'extracted' | 'skipped' | string | undefined => {
    if (!raw) return undefined;
    const lower = raw.toLowerCase();
    if (lower === 'pending') return 'pending';
    if (lower === 'extracted') return 'extracted';
    if (lower === 'skipped') return 'skipped';
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
          filter={activeFilter}
          searchQuery={debouncedQuery}
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
          <h2 className="mb-2 text-xl font-semibold text-zinc-200">Failed to load images</h2>
          <p className="mb-6 text-sm text-zinc-400">
            {error instanceof Error ? error.message : 'Something went wrong while loading images.'}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
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
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-14 md:pt-16">
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mb-4 text-4xl">📷</div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-200">No images found yet.</h2>
          <p className="text-sm text-zinc-400">Check back later or try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  // Success state: show grid with actual images
  return (
    <div className="absolute inset-0 z-0 pt-14 md:pt-16">
      <ThiingsGrid
        gridSize={{ width: 400, height: 500 }}
        renderItem={(config) => <CardCell {...config} />}
        initialPosition={{ x: 0, y: 0 }}
        filter={activeFilter}
        searchQuery={debouncedQuery}
        items={gridItems}
      />
    </div>
  );
}

