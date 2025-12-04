'use client';

import { memo } from 'react';
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
  // Top 6 images get high priority for faster initial load
  const isTopImage = gridIndex < 6;
  const imageUrl = item?.imageUrl;

  return (
    <div
      className={`absolute inset-1 border border-gray-200 rounded-xl overflow-hidden transition-shadow ${
        isMoving ? 'shadow-xl' : 'shadow-md'
      }`}
    >
      {/* Optimized image loading */}
      {imageUrl ? (
        <img
          src={imageUrl}
          loading={isTopImage ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={isTopImage ? 'high' : 'auto'}
          width={400}
          height={300}
          alt={item?.id ? `Image ${item.id}` : `Card ${gridIndex} image`}
          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0"
          onError={(e) => {
            // Fallback to placeholder on error
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      {/* Fallback UI when no image or error */}
      <div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 z-0"
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        <div className="text-2xl mb-1">📷</div>
        <div className="text-xs">No image</div>
      </div>
      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs z-10 pointer-events-none">
        <div className="text-base font-bold mb-1 drop-shadow-lg">
          {item?.id ? `#${item.id.slice(0, 8)}` : `#${gridIndex}`}
        </div>
        <div className="text-[10px] text-white/90 drop-shadow-md">
          {position.x}, {position.y}
        </div>
      </div>
    </div>
  );
});

CardCell.displayName = 'CardCell';

/**
 * Client Component for home page
 *
 * Uses SSR + React Query pattern:
 * - First render: Uses SSR initialImages
 * - React Query fetches in CSR → replaces with data when available
 */
export function HomeClient({ initialImages }: Props) {
  const { data, isLoading, isError } = useLatestImages(50);
  const activeFilter = useFilterStore((state) => state.activeFilter);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);

  // Merge SSR and CSR data: use CSR data if available, fallback to SSR initial data
  const images = data ?? initialImages;

  // Map ImageRow[] to GridItem[]
  const gridItems: GridItem[] = images.map((image) => ({
    id: image.id,
    imageUrl: image.image_url,
  }));

  // Loading state: show empty grid (or could show skeleton)
  if (isLoading && !data) {
    // Return empty grid for now - could add skeleton later
    return (
      <div className="absolute inset-0 z-0 pt-14 md:pt-16">
        <ThiingsGrid
          gridSize={{ width: 400, height: 500 }}
          renderItem={(config) => <CardCell {...config} />}
          initialPosition={{ x: 0, y: 0 }}
          filter={activeFilter}
          searchQuery={debouncedQuery}
          items={[]}
        />
      </div>
    );
  }

  // Error state: show grid with empty items (could add error message later)
  if (isError) {
    return (
      <div className="absolute inset-0 z-0 pt-14 md:pt-16">
        <ThiingsGrid
          gridSize={{ width: 400, height: 500 }}
          renderItem={(config) => <CardCell {...config} />}
          initialPosition={{ x: 0, y: 0 }}
          filter={activeFilter}
          searchQuery={debouncedQuery}
          items={[]}
        />
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

