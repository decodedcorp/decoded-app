'use client';

import type { ImageRow } from '@/lib/supabase/types';
import { useLatestImages } from '@/lib/hooks/useImages';
import { ImageCard } from './ImageCard';
import { ImageCardSkeleton } from './ImageCardSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

type Props = {
  initialImages: ImageRow[];
};

/**
 * Client Component for images feed
 *
 * Uses SSR + React Query pattern:
 * - First render: Uses SSR initialImages
 * - React Query fetches in CSR → replaces with data when available
 * - Future optimization: Consider using initialData or dehydrate to avoid duplicate fetches
 */
export function ImagesClient({ initialImages }: Props) {
  const { data, isLoading, isError, error, refetch } = useLatestImages(20);

  // Merge SSR and CSR data: use CSR data if available, fallback to SSR initial data
  const images = data ?? initialImages;

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
        error={error instanceof Error ? error : new Error('Unknown error')}
        onRetry={() => refetch()}
      />
    );
  }

  // Empty state: show empty state component
  if (!images || images.length === 0) {
    return <EmptyState />;
  }

  // Success state: show image grid
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}

