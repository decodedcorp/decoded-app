import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchLatestImages,
  fetchFilteredImages,
  fetchImagesByPostImage,
  fetchImageById,
  fetchUnifiedImages,
  type CategoryFilter,
  type ImagePage,
  type ImagePageWithPostId,
  type ImageDetail,
} from "@/lib/supabase/queries/images";
import type { ImageRow } from "@/lib/supabase/types";

/**
 * @deprecated Use useInfiniteFilteredImages with unified adapter instead.
 * This hook does not include post context (postId, account).
 * 
 * Migration guide:
 * - Replace: useLatestImages(20)
 * - With: useInfiniteFilteredImages({ limit: 20, filter: "all", search: "" })
 * 
 * @param limit - Maximum number of images to fetch (default: 20)
 * @returns React Query result with data, loading, error states
 */
export function useLatestImages(limit = 20) {
  if (process.env.NODE_ENV === "development") {
    console.warn("[useLatestImages] Deprecated: Use useInfiniteFilteredImages instead");
  }
  return useQuery<ImageRow[]>({
    queryKey: ["images", "latest", limit],
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
  return useQuery<ImageDetail | null>({
    queryKey: ["images", "detail", id],
    queryFn: () => fetchImageById(id),
    enabled: !!id,
  });
}

/**
 * @deprecated Use useInfiniteFilteredImages instead for infinite scrolling
 * React Query hook for fetching filtered images based on category and search query
 */
export function useFilteredImages(
  filter: CategoryFilter = "all",
  searchQuery: string = "",
  limit: number = 50
) {
  return useQuery<ImagePage>({
    queryKey: ["images", "filtered", { filter, searchQuery, limit }],
    queryFn: () => fetchFilteredImages({ filter, search: searchQuery, limit }),
    placeholderData: keepPreviousData,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * React Query hook for fetching infinite filtered images with cursor-based pagination
 * Now uses unified adapter (post_image + orphan fallback) to ensure all images are visible
 *
 * @param params - Fetch params
 * @param params.limit - Items per page
 * @param params.filter - Category filter
 * @param params.search - Search query
 * @param params.deduplicateByImageId - Deduplicate by image.id (default: false for feed, true for gallery)
 * @returns Infinite Query result with images including full post metadata
 */
export function useInfiniteFilteredImages(params: {
  limit: number;
  filter?: CategoryFilter;
  search?: string;
  deduplicateByImageId?: boolean;
}) {
  const { limit, filter = "all", search = "", deduplicateByImageId = false } = params;

  return useInfiniteQuery<ImagePageWithPostId>({
    queryKey: ["images", "infinite", { filter, search, limit, deduplicateByImageId }],
    queryFn: ({ pageParam }) =>
      fetchUnifiedImages({
        limit,
        cursor: (pageParam as string) ?? null,
        filter,
        search,
        deduplicateByImageId,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
