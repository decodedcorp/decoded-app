import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { CommentsService } from '@/api/generated/services/CommentsService';
import { CommentCreateRequest } from '@/api/generated/models/CommentCreateRequest';
import { CommentUpdateRequest } from '@/api/generated/models/CommentUpdateRequest';
import { CommentLikeRequest } from '@/api/generated/models/CommentLikeRequest';
import { CommentResponse } from '@/api/generated/models/CommentResponse';
import { CommentListResponse } from '@/api/generated/models/CommentListResponse';
import { queryKeys } from '@/lib/api/queryKeys';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';
import { toast } from 'react-hot-toast';
import { useSimpleToastMutation } from '@/lib/hooks/useToastMutation';
import { useCommonTranslation } from '@/lib/i18n/hooks';

// Type definitions for better type safety
interface InfiniteQueryData {
  pages: CommentListResponse[];
  pageParams: number[];
}

interface OptimisticCommentCache {
  comments: CommentResponse[];
  timestamp: number;
}

interface OptimisticDeletedCache {
  deletedIds: Set<string>;
  timestamp: number;
}

// Optimistic cache for newly created comments per content with timestamp for cleanup
const optimisticCommentsByContent: Map<string, OptimisticCommentCache> = new Map();
// Optimistic tombstone set for deleted comments per content (prevents reappearing after refetch)
const optimisticDeletedCommentsByContent: Map<string, OptimisticDeletedCache> = new Map();

// Cache cleanup configuration
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_AGE = 30 * 60 * 1000; // 30 minutes

/**
 * Custom hook for managing optimistic comment state
 */
export const useOptimisticComments = (contentId: string) => {
  const getOptimisticComments = (): CommentResponse[] => {
    const cache = optimisticCommentsByContent.get(contentId);
    if (!cache) return [];

    // Check if cache is expired
    if (Date.now() - cache.timestamp > MAX_CACHE_AGE) {
      optimisticCommentsByContent.delete(contentId);
      return [];
    }

    return cache.comments;
  };

  const setOptimisticComments = (comments: CommentResponse[]): void => {
    optimisticCommentsByContent.set(contentId, {
      comments,
      timestamp: Date.now(),
    });
  };

  const addOptimisticComment = (comment: CommentResponse): void => {
    const prev = getOptimisticComments();
    setOptimisticComments([comment, ...prev]);
  };

  const removeOptimisticComment = (commentId: string): void => {
    const optimistic = getOptimisticComments();
    const filtered = optimistic.filter((c) => c.id !== commentId);
    setOptimisticComments(filtered);
  };

  const getDeletedSet = (): Set<string> => {
    const cache = optimisticDeletedCommentsByContent.get(contentId);
    if (!cache) {
      const newCache = { deletedIds: new Set<string>(), timestamp: Date.now() };
      optimisticDeletedCommentsByContent.set(contentId, newCache);
      return newCache.deletedIds;
    }

    // Check if cache is expired
    if (Date.now() - cache.timestamp > MAX_CACHE_AGE) {
      optimisticDeletedCommentsByContent.delete(contentId);
      const newCache = { deletedIds: new Set<string>(), timestamp: Date.now() };
      optimisticDeletedCommentsByContent.set(contentId, newCache);
      return newCache.deletedIds;
    }

    return cache.deletedIds;
  };

  const addDeletedComment = (commentId: string): void => {
    const deletedSet = getDeletedSet();
    deletedSet.add(commentId);
  };

  const removeDeletedComment = (commentId: string): void => {
    const deletedSet = getDeletedSet();
    deletedSet.delete(commentId);
  };

  const cleanup = (): void => {
    optimisticCommentsByContent.delete(contentId);
    optimisticDeletedCommentsByContent.delete(contentId);
  };

  return {
    getOptimisticComments,
    addOptimisticComment,
    removeOptimisticComment,
    getDeletedSet,
    addDeletedComment,
    removeDeletedComment,
    cleanup,
  };
};

// Legacy helper functions for backward compatibility
const getOptimisticComments = (contentId: string): CommentResponse[] => {
  const cache = optimisticCommentsByContent.get(contentId);
  if (!cache) return [];

  // Check if cache is expired
  if (Date.now() - cache.timestamp > MAX_CACHE_AGE) {
    optimisticCommentsByContent.delete(contentId);
    return [];
  }

  return cache.comments;
};

const setOptimisticComments = (contentId: string, comments: CommentResponse[]): void => {
  optimisticCommentsByContent.set(contentId, {
    comments,
    timestamp: Date.now(),
  });
};

const getDeletedSet = (contentId: string): Set<string> => {
  const cache = optimisticDeletedCommentsByContent.get(contentId);
  if (!cache) {
    const newCache = { deletedIds: new Set<string>(), timestamp: Date.now() };
    optimisticDeletedCommentsByContent.set(contentId, newCache);
    return newCache.deletedIds;
  }

  // Check if cache is expired
  if (Date.now() - cache.timestamp > MAX_CACHE_AGE) {
    optimisticDeletedCommentsByContent.delete(contentId);
    const newCache = { deletedIds: new Set<string>(), timestamp: Date.now() };
    optimisticDeletedCommentsByContent.set(contentId, newCache);
    return newCache.deletedIds;
  }

  return cache.deletedIds;
};

const cleanupOptimisticData = (contentId: string): void => {
  optimisticCommentsByContent.delete(contentId);
  optimisticDeletedCommentsByContent.delete(contentId);
};

// Periodic cleanup of expired cache entries
setInterval(() => {
  const now = Date.now();

  // Cleanup optimistic comments
  for (const [contentId, cache] of optimisticCommentsByContent.entries()) {
    if (now - cache.timestamp > MAX_CACHE_AGE) {
      optimisticCommentsByContent.delete(contentId);
    }
  }

  // Cleanup deleted comments
  for (const [contentId, cache] of optimisticDeletedCommentsByContent.entries()) {
    if (now - cache.timestamp > MAX_CACHE_AGE) {
      optimisticDeletedCommentsByContent.delete(contentId);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

export interface UseCommentsParams {
  contentId: string;
  enabled?: boolean;
  sortOrder?: 'newest' | 'oldest' | 'most_liked';
  includeReplies?: boolean;
  parentCommentId?: string | null;
}

export interface UseCommentsResult {
  comments: CommentResponse[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  totalCount: number;
  fetchMore: () => void;
  refetch: () => void;
}

/**
 * 컨텐츠의 댓글 목록을 무한 스크롤로 조회하는 훅
 */
export const useComments = ({
  contentId,
  enabled = true,
  sortOrder = 'newest',
  includeReplies = true,
  parentCommentId = null,
}: UseCommentsParams): UseCommentsResult => {
  const queryKey = parentCommentId
    ? [...queryKeys.comments.replies(parentCommentId), { sortOrder }]
    : [...queryKeys.comments.byContent(contentId), { sortOrder, includeReplies }];

  const query = useInfiniteQuery<CommentListResponse>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      refreshOpenAPIToken();

      console.log('[useComments] Fetching comments:', {
        contentId,
        skip: pageParam,
        sortOrder,
        parentCommentId,
      });

      const result = await CommentsService.getCommentsByContentCommentsContentContentIdGet(
        contentId,
        20, // limit
        pageParam as number, // skip
        includeReplies,
        sortOrder,
        parentCommentId,
      );

      console.log('[useComments] API response:', result);

      // Apply optimistic deletions (filter out tombstoned ids)
      const deletedSet = getDeletedSet(contentId);
      let filtered = result;
      if (deletedSet.size > 0) {
        const comments = (result.comments || []).filter((c) => !deletedSet.has(c.id));
        filtered = {
          ...result,
          comments,
          // keep total_count as-is or adjust optimistically; adjusting is optional
        } as CommentListResponse;
      }

      // Merge optimistic comments into page 0 so they persist across refetches
      if (!parentCommentId && pageParam === 0) {
        const optimistic = getOptimisticComments(contentId);
        if (optimistic.length > 0) {
          // Filter out duplicates by id
          const existingIds = new Set((filtered.comments || []).map((c) => c.id));
          const newOnes = optimistic.filter((c) => !existingIds.has(c.id));
          return {
            ...filtered,
            comments: [...newOnes, ...(filtered.comments || [])],
            total_count: (filtered.total_count || 0) + newOnes.length,
          } as CommentListResponse;
        }
      }

      return filtered;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: CommentListResponse, allPages: CommentListResponse[]) => {
      console.log('[useComments] Checking next page:', {
        hasMore: lastPage.has_more,
        commentsCount: lastPage.comments.length,
      });
      // Next pageParam should be the cumulative number of loaded comments (offset-based pagination)
      if (!lastPage.has_more) return undefined;
      const nextSkip = allPages.reduce(
        (sum: number, p: CommentListResponse) => sum + (p.comments?.length || 0),
        0,
      );
      return nextSkip;
    },
    enabled: enabled && !!contentId,
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 모든 페이지의 댓글을 평면화 + id 기준 dedup (중복 키 방지)
  const comments = (() => {
    const pages: CommentListResponse[] = query.data?.pages || [];
    const flat = pages.flatMap((page) => page.comments || []);
    const seen = new Set<string>();
    const unique: CommentResponse[] = [];
    for (const c of flat) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        unique.push(c);
      }
    }
    return unique;
  })();
  const totalCount = query.data?.pages[0]?.total_count || 0;
  const hasMore = query.hasNextPage || false;

  console.log('[useComments] Final result:', {
    commentsLength: comments.length,
    totalCount,
    hasMore,
    isLoading: query.isLoading,
    error: query.error,
  });

  return {
    comments,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error as Error | null,
    hasMore,
    totalCount,
    fetchMore: query.fetchNextPage,
    refetch: query.refetch,
  };
};

/**
 * 댓글 작성 훅
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation<
    CommentResponse,
    Error,
    { contentId: string; text: string; parentCommentId?: string }
  >(
    async ({ contentId, text, parentCommentId }) => {
      refreshOpenAPIToken();

      console.log('[useCreateComment] Creating comment:', { contentId, text, parentCommentId });

      const request: CommentCreateRequest = {
        text,
        parent_comment_id: parentCommentId || null,
      };

      return CommentsService.createCommentCommentsContentContentIdPost(contentId, request);
    },
    {
      actionName: 'Add comment',
      toastId: 'create-comment',
      onSuccess: (response, { contentId, parentCommentId }) => {
        console.log('[useCreateComment] Comment created:', response);
        // Optimistically prepend new comment to visible lists to show immediately
        if (!parentCommentId) {
          // Save into optimistic cache for persistence across refetch
          const prev = getOptimisticComments(contentId);
          setOptimisticComments(contentId, [response, ...prev]);
          // If this id was tombstoned by a previous delete, remove from tombstone
          const del = getDeletedSet(contentId);
          if (del.has(response.id)) {
            del.delete(response.id);
          }
          // Top-level comments list
          queryClient.setQueriesData(
            { queryKey: queryKeys.comments.byContent(contentId) },
            (old: InfiniteData<CommentListResponse> | undefined) => {
              if (!old?.pages) return old;
              const alreadyExists = old.pages.some((p) =>
                (p.comments || []).some((c) => c.id === response.id),
              );
              if (alreadyExists) return old;
              const first = old.pages[0] || { comments: [], has_more: true, total_count: 0 };
              const updatedFirst = {
                ...first,
                comments: [response, ...(first.comments || [])],
                total_count: (first.total_count || 0) + 1,
              };
              const pages = [updatedFirst, ...old.pages.slice(1)];
              return { ...old, pages };
            },
          );
        } else {
          // Replies list for the parent comment
          queryClient.setQueriesData(
            { queryKey: queryKeys.comments.replies(parentCommentId) },
            (old: InfiniteData<CommentListResponse> | undefined) => {
              if (!old?.pages) return old;
              const alreadyExists = old.pages.some((p) =>
                (p.comments || []).some((c) => c.id === response.id),
              );
              if (alreadyExists) return old;
              const first = old.pages[0] || { comments: [], has_more: true, total_count: 0 };
              const updatedFirst = {
                ...first,
                comments: [response, ...(first.comments || [])],
                total_count: (first.total_count || 0) + 1,
              };
              const pages = [updatedFirst, ...old.pages.slice(1)];
              return { ...old, pages };
            },
          );
        }

        // 약간 지연 후 서버 재조회(즉시 리페치로 낙관적 항목이 사라지는 깜빡임 방지)
        setTimeout(() => {
          // 댓글 목록 쿼리 무효화
          queryClient.invalidateQueries({
            queryKey: queryKeys.comments.byContent(contentId),
          });

          // 답글인 경우 부모 댓글 쿼리도 무효화
          if (parentCommentId) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.comments.replies(parentCommentId),
            });
          }

          // 댓글 통계도 무효화
          queryClient.invalidateQueries({
            queryKey: queryKeys.comments.stats(contentId),
          });
        }, 500);

        // 피드(infinite) 캐시 내 해당 콘텐츠의 댓글 수를 즉시 증가시켜 카드 UI에 반영
        // 여러 정렬/필터 조합의 피드가 있을 수 있으므로 'feed' 네임스페이스 전체를 대상으로 부분 업데이트
        queryClient.setQueriesData(
          {
            queryKey: queryKeys.feed.all,
            predicate: (q) =>
              Array.isArray(q.queryKey) && q.queryKey[0] === 'feed' && q.queryKey[1] === 'infinite',
          },
          (old: any) => {
            if (!old?.pages) return old;
            const pages = old.pages.map((page: any) => {
              if (!page?.items) return page;
              const items = page.items.map((item: any) => {
                if (item?.id !== contentId) return item;
                return {
                  ...item,
                  metadata: {
                    ...(item.metadata || {}),
                    comments: ((item.metadata?.comments as number | undefined) || 0) + 1,
                  },
                };
              });
              return { ...page, items };
            });
            return { ...old, pages };
          },
        );

        // 콘텐츠 상세/기타 피드도 약간 지연 후 무효화
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.contents.detail(contentId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.feeds.all,
          });
        }, 500);

        toast.success(t.toast.comments.added());
      },
      onError: (error, { contentId, parentCommentId }) => {
        console.error('[useCreateComment] Failed to create comment:', contentId, error);

        // Rollback optimistic updates
        if (!parentCommentId) {
          // Remove from optimistic cache
          const prev = getOptimisticComments(contentId);
          const filtered = prev.filter((c) => c.id !== 'temp-id'); // Assuming we have a temp id
          setOptimisticComments(contentId, filtered);

          // Rollback UI updates
          queryClient.invalidateQueries({
            queryKey: queryKeys.comments.byContent(contentId),
          });
        } else {
          // Rollback replies
          queryClient.invalidateQueries({
            queryKey: queryKeys.comments.replies(parentCommentId),
          });
        }

        // Show error toast
        toast.error(t.toast.comments.addFailed());
      },
    },
  );
};

/**
 * 댓글 수정 훅
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation<
    CommentResponse,
    Error,
    { commentId: string; text: string; contentId: string }
  >(
    async ({ commentId, text }) => {
      refreshOpenAPIToken();

      console.log('[useUpdateComment] Updating comment:', { commentId, text });

      const request: CommentUpdateRequest = { text };

      return CommentsService.updateCommentCommentsCommentIdPut(commentId, request);
    },
    {
      actionName: 'Update comment',
      toastId: 'update-comment',
      onSuccess: (response, { contentId }) => {
        console.log('[useUpdateComment] Comment updated:', response);

        // 관련 댓글 쿼리들 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byContent(contentId),
        });

        toast.success(t.toast.comments.updated());
      },
      onError: (error, { commentId }) => {
        console.error('[useUpdateComment] Failed to update comment:', commentId, error);
      },
    },
  );
};

/**
 * 댓글 삭제 훅
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation<void, Error, { commentId: string; contentId: string }>(
    async ({ commentId }) => {
      refreshOpenAPIToken();

      console.log('[useDeleteComment] Deleting comment:', { commentId });

      return CommentsService.deleteCommentCommentsCommentIdDelete(commentId);
    },
    {
      actionName: 'Delete comment',
      toastId: 'delete-comment',
      onSuccess: (_, { contentId, commentId }) => {
        console.log('[useDeleteComment] Comment deleted successfully');

        // Tombstone this comment id so it won't reappear on refetch
        const deletedSet = getDeletedSet(contentId);
        deletedSet.add(commentId);

        // Optimistically remove the deleted comment from byContent list
        queryClient.setQueriesData(
          { queryKey: queryKeys.comments.byContent(contentId) },
          (old: InfiniteData<CommentListResponse> | undefined) => {
            if (!old?.pages) return old;
            let removed = false;
            const pages = old.pages.map((p, idx: number) => {
              if (!p?.comments) return p;
              const before = p.comments.length;
              const filtered = p.comments.filter((c) => c.id !== commentId);
              if (filtered.length !== before) removed = true;
              // Adjust page object if changed
              if (filtered.length !== before) {
                return {
                  ...p,
                  comments: filtered,
                };
              }
              return p;
            });
            if (!removed) return old;
            // Adjust total_count on first page if present
            if (pages[0]) {
              pages[0] = {
                ...pages[0],
                total_count: Math.max(0, (pages[0].total_count || 0) - 1),
              };
            }
            return { ...old, pages };
          },
        );

        // Remove from any replies lists
        queryClient.setQueriesData(
          {
            queryKey: queryKeys.comments.all,
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === 'comments' &&
              q.queryKey[1] === 'replies',
          },
          (old: InfiniteData<CommentListResponse> | undefined) => {
            if (!old?.pages) return old;
            let changed = false;
            const pages = old.pages.map((p) => {
              if (!p?.comments) return p;
              const filtered = p.comments.filter((c) => c.id !== commentId);
              if (filtered.length !== p.comments.length) {
                changed = true;
                return {
                  ...p,
                  comments: filtered,
                  total_count: Math.max(0, (p.total_count || 0) - 1),
                };
              }
              return p;
            });
            return changed ? { ...old, pages } : old;
          },
        );

        // Remove from optimistic cache for this content
        const optimistic = getOptimisticComments(contentId);
        if (optimistic.length > 0) {
          const filtered = optimistic.filter((c) => c.id !== commentId);
          setOptimisticComments(contentId, filtered);
        }

        // 댓글 통계도 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.stats(contentId),
        });

        // 피드 카드의 댓글 수 즉시 감소
        queryClient.setQueriesData(
          {
            queryKey: queryKeys.feed.all,
            predicate: (q) =>
              Array.isArray(q.queryKey) && q.queryKey[0] === 'feed' && q.queryKey[1] === 'infinite',
          },
          (old: any) => {
            if (!old?.pages) return old;
            const pages = old.pages.map((page: any) => {
              if (!page?.items) return page;
              const items = page.items.map((item: any) => {
                if (item?.id !== contentId) return item;
                const current = (item.metadata?.comments as number | undefined) || 0;
                return {
                  ...item,
                  metadata: {
                    ...(item.metadata || {}),
                    comments: Math.max(0, current - 1),
                  },
                };
              });
              return { ...page, items };
            });
            return { ...old, pages };
          },
        );

        toast.success(t.toast.comments.deleted());
      },
      onError: (error, { commentId, contentId }) => {
        console.error('[useDeleteComment] Failed to delete comment:', commentId, error);

        // Rollback optimistic updates
        const deletedSet = getDeletedSet(contentId);
        deletedSet.delete(commentId);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byContent(contentId),
        });

        // Show error toast
        toast.error(t.toast.comments.deleteFailed());
      },
    },
  );
};

/**
 * 댓글 좋아요/싫어요 훅
 */
export const useCommentLike = () => {
  const queryClient = useQueryClient();

  return useSimpleToastMutation<
    any,
    Error,
    { commentId: string; action: 'like' | 'dislike' | 'unlike' | 'undislike'; contentId: string }
  >(
    async ({ commentId, action }) => {
      refreshOpenAPIToken();

      console.log('[useCommentLike] Handling comment like:', { commentId, action });

      const request: CommentLikeRequest = { action };

      return CommentsService.handleCommentLikeCommentsCommentIdLikePost(commentId, request);
    },
    {
      actionName: 'Handle comment reaction',
      toastId: 'comment-like',
      onSuccess: (_, { contentId }) => {
        console.log('[useCommentLike] Comment reaction handled successfully');

        // 관련 댓글 쿼리들 무효화 (좋아요 수 업데이트 반영)
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byContent(contentId),
        });
      },
      onError: (error, { commentId, action }) => {
        console.error(
          '[useCommentLike] Failed to handle comment reaction:',
          commentId,
          action,
          error,
        );
      },
    },
  );
};

/**
 * 댓글 통계 조회 훅
 */
export const useCommentStats = (contentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.comments.stats(contentId)],
    queryFn: async () => {
      refreshOpenAPIToken();

      console.log('[useCommentStats] Fetching comment stats:', { contentId });

      return CommentsService.getCommentStatsCommentsContentContentIdStatsGet(contentId);
    },
    enabled: enabled && !!contentId,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
