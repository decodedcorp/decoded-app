/**
 * React Query hooks for images
 *
 * These hooks are defined in web package to avoid QueryClient context issues
 * in monorepo setup. They use query functions from shared package.
 */

import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchLatestImages,
  fetchFilteredImages,
  fetchImageById,
  fetchUnifiedImages,
  fetchRelatedImagesByAccount,
} from "@decoded/shared/supabase/queries/images";
import type {
  CategoryFilter,
  ImagePage,
  ImagePageWithPostId,
  ImageDetail,
  ImageRow,
} from "@decoded/shared/supabase/queries/images";
import { fetchPosts, fetchPostDetail } from "@/lib/api/posts";
import { postDetailToImageDetail } from "@/lib/api/adapters/postDetailToImageDetail";
import type { Post, PostsListParams } from "@/lib/api/types";

/**
 * @deprecated Use useInfiniteFilteredImages with unified adapter instead.
 */
export function useLatestImages(limit = 20) {
  return useQuery<ImageRow[]>({
    queryKey: ["images", "latest", limit],
    queryFn: () => fetchLatestImages(limit),
  });
}

/**
 * React Query hook for fetching post detail via 백엔드 API
 * Explore/Feed는 post ID를 /posts/[id]로 전달하므로 API 사용
 */
export function usePostDetailForImage(postId: string) {
  return useQuery<ImageDetail | null>({
    queryKey: ["posts", "detail", "image-view", postId],
    queryFn: async () => {
      const post = await fetchPostDetail(postId);
      return postDetailToImageDetail(post, postId);
    },
    enabled: !!postId,
  });
}

/**
 * @deprecated Supabase 직접 조회. usePostDetailForImage(백엔드 API) 사용 권장
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
 */
export function useInfiniteFilteredImages(params: {
  limit: number;
  filter?: CategoryFilter;
  search?: string;
  deduplicateByImageId?: boolean;
}) {
  const {
    limit,
    filter = "all",
    search = "",
    deduplicateByImageId = true,
  } = params;

  return useInfiniteQuery<ImagePageWithPostId>({
    queryKey: [
      "images",
      "infinite",
      { filter, search, limit, deduplicateByImageId },
    ],
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
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

/**
 * React Query hook for fetching related images from the same account
 */
export function useRelatedImagesByAccount(
  imageId: string,
  account: string | null | undefined,
  limit: number = 24
) {
  return useQuery<ImageRow[]>({
    queryKey: ["images", "related", account, imageId],
    queryFn: () => fetchRelatedImagesByAccount(imageId, account!, limit),
    enabled: !!account && !!imageId,
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================
// Posts API Hook (Replaces Supabase direct queries)
// ============================================================

/**
 * Post mapped to grid-compatible format
 */
export type PostGridItem = {
  id: string;
  imageUrl: string;
  postId: string;
  postSource: "post";
  postAccount: string;
  postCreatedAt: string;
  spotCount: number;
  viewCount: number;
};

/**
 * Infinite query result for posts
 */
export type PostsPage = {
  items: PostGridItem[];
  nextPage: number | null;
  hasMore: boolean;
};

/**
 * React Query hook for fetching infinite posts via REST API
 * This replaces the Supabase-based useInfiniteFilteredImages
 */
export function useInfinitePosts(params: {
  limit?: number;
  category?: string;
  search?: string;
  artistName?: string;
  groupName?: string;
  sort?: "recent" | "popular" | "trending";
}) {
  const {
    limit = 40,
    category,
    search,
    artistName,
    groupName,
    sort = "recent",
  } = params;

  return useInfiniteQuery<PostsPage>({
    queryKey: [
      "posts",
      "infinite",
      { category, search, artistName, groupName, sort, limit },
    ],
    queryFn: async ({ pageParam }) => {
      const apiParams: PostsListParams = {
        page: (pageParam as number) ?? 1,
        per_page: limit,
        sort,
      };

      if (category && category !== "all") {
        apiParams.category = category;
      }
      if (artistName) {
        apiParams.artist_name = artistName;
      }
      if (groupName) {
        apiParams.group_name = groupName;
      }

      const response = await fetchPosts(apiParams);

      // Map Post[] to PostGridItem[]
      const items: PostGridItem[] = response.data.map((post: Post) => ({
        id: post.id,
        imageUrl: post.image_url,
        postId: post.id,
        postSource: "post" as const,
        postAccount: post.user.username,
        postCreatedAt: post.created_at,
        spotCount: post.spot_count,
        viewCount: post.view_count,
      }));

      const { pagination } = response;
      const hasMore = pagination.current_page < pagination.total_pages;
      const nextPage = hasMore ? pagination.current_page + 1 : null;

      return { items, nextPage, hasMore };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

// Re-export types for convenience
export type {
  CategoryFilter,
  ImagePage,
  ImagePageWithPostId,
  ImageDetail,
  ImageRow,
  Post,
};
