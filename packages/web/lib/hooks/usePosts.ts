import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchPostWithImagesAndItems,
  type PostDetail,
} from "@/lib/supabase/queries/posts";
import { fetchPosts } from "@/lib/api/posts";
import type { Post, PostsListResponse, PostsListParams } from "@/lib/api/types";

/**
 * React Query hook for fetching a single post with its items and images
 *
 * @param id - Post ID to fetch
 * @returns React Query result with data, loading, error states
 */
export function usePostById(id: string) {
  return useQuery<PostDetail | null>({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchPostWithImagesAndItems(id),
    enabled: !!id,
  });
}

// ============================================================
// Infinite Posts Hook (REST API)
// ============================================================

export interface UseInfinitePostsParams {
  perPage?: number;
  sort?: "recent" | "popular" | "trending";
  artistName?: string;
  groupName?: string;
  context?: string;
  category?: string;
  userId?: string;
}

export interface PostsPage {
  items: Post[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * React Query hook for fetching infinite posts with page-based pagination
 * Uses REST API instead of direct Supabase queries
 */
export function useInfinitePosts(params: UseInfinitePostsParams = {}) {
  const {
    perPage = 20,
    sort = "recent",
    artistName,
    groupName,
    context,
    category,
    userId,
  } = params;

  return useInfiniteQuery<PostsPage>({
    queryKey: [
      "posts",
      "infinite",
      { perPage, sort, artistName, groupName, context, category, userId },
    ],
    queryFn: async ({ pageParam }): Promise<PostsPage> => {
      const page = (pageParam as number) ?? 1;

      const apiParams: PostsListParams = {
        page,
        per_page: perPage,
        sort,
        artist_name: artistName,
        group_name: groupName,
        context,
        category,
        user_id: userId,
      };

      const response: PostsListResponse = await fetchPosts(apiParams);

      return {
        items: response.data,
        currentPage: response.pagination.current_page,
        totalPages: response.pagination.total_pages,
        hasMore:
          response.pagination.current_page < response.pagination.total_pages,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Re-export types for convenience
export type { Post, PostsListResponse, PostsListParams };
