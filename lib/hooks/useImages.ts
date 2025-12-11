import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchLatestImages, fetchFilteredImages, fetchImageById, type CategoryFilter, type ImagePage } from "@/lib/supabase/queries/images";
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
 * @deprecated Use useInfiniteFilteredImages instead for infinite scrolling
 * React Query hook for fetching filtered images based on category and search query
 */
export function useFilteredImages(
  filter: CategoryFilter = 'all',
  searchQuery: string = '',
  limit: number = 50
) {
  return useQuery<ImagePage>({
    queryKey: ['images', 'filtered', { filter, searchQuery, limit }],
    queryFn: () => fetchFilteredImages({ filter, search: searchQuery, limit }),
    placeholderData: keepPreviousData,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * React Query hook for fetching infinite filtered images with cursor-based pagination
 * 
 * @param params - Fetch params
 * @returns Infinite Query result
 */
export function useInfiniteFilteredImages(params: {
  limit: number;
  filter?: CategoryFilter;
  search?: string;
}) {
  const { limit, filter = 'all', search = '' } = params;

  return useInfiniteQuery<ImagePage>({
    queryKey: ['images', 'infinite', { filter, search, limit }],
    queryFn: ({ pageParam }) =>
      fetchFilteredImages({
        limit,
        cursor: (pageParam as string) ?? null,
        filter,
        search,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
