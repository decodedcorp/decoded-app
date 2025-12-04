import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchLatestImages, fetchFilteredImages, type CategoryFilter } from "@/lib/supabase/queries/images";
import type { ImageRow } from "@/lib/supabase/types";

/**
 * React Query hook for fetching latest images
 *
 * This hook wraps the Supabase query function with React Query,
 * providing caching, refetching, and loading/error states.
 *
 * Query key pattern: ['도메인명', '뷰타입', filters...]
 * Example: ['images', 'latest', limit]
 * Future filters can extend this pattern: ['images', 'latest', { withItems: true, status: 'extracted' }]
 *
 * @param limit - Maximum number of images to fetch (default: 20)
 * @returns React Query result with data, loading, error states
 *
 * @example
 * ```tsx
 * function ImagesList() {
 *   const { data: images, isLoading, error } = useLatestImages(20);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div className="grid">
 *       {images?.map(image => <ImageCard key={image.id} image={image} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLatestImages(limit = 20) {
  return useQuery<ImageRow[]>({
    queryKey: ['images', 'latest', limit],
    queryFn: () => fetchLatestImages(limit),
  });
}

import { fetchImageById } from "@/lib/supabase/queries/images";

/**
 * React Query hook for fetching a single image by ID
 *
 * @param id - Image ID to fetch
 * @returns React Query result with data, loading, error states
 */
export function useImageById(id: string) {
  return useQuery<ImageRow | null>({
    queryKey: ['images', 'detail', id],
    queryFn: () => fetchImageById(id),
    enabled: !!id,
  });
}

/**
 * React Query hook for fetching filtered images based on category and search query
 *
 * This hook wraps the Supabase query function with React Query,
 * providing caching, refetching, and loading/error states.
 *
 * Query key pattern: ['images', 'filtered', { filter, searchQuery, limit }]
 * This ensures automatic refetching when filter or searchQuery changes.
 *
 * @param filter - Category filter key ('all', 'latest', 'clothing', etc.)
 * @param searchQuery - User-entered search query (should be debounced)
 * @param limit - Maximum number of images to fetch (default: 50)
 * @returns React Query result with data, loading, error states
 *
 * @example
 * ```tsx
 * function FilteredImagesList() {
 *   const activeFilter = useFilterStore(s => s.activeFilter);
 *   const searchQuery = useSearchStore(s => s.debouncedQuery);
 *   const { data: images, isLoading, error } = useFilteredImages(activeFilter, searchQuery, 50);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div className="grid">
 *       {images?.map(image => <ImageCard key={image.id} image={image} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFilteredImages(
  filter: CategoryFilter = 'all',
  searchQuery: string = '',
  limit: number = 50
) {
  return useQuery<ImageRow[]>({
    queryKey: ['images', 'filtered', { filter, searchQuery, limit }],
    queryFn: () => fetchFilteredImages(filter, searchQuery, limit),
    placeholderData: keepPreviousData, // Prevent flash of empty content during filter switches
    staleTime: 0, // Always check for new data
    gcTime: 5 * 60 * 1000, // Keep cache for 5 minutes to allow quick navigation back to previous filters
  });
}

