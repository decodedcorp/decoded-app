import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
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
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      console.log('[useComments] Checking next page:', {
        hasMore: lastPage.has_more,
        commentsCount: lastPage.comments.length,
      });
      return lastPage.has_more ? lastPage.comments.length || 0 : undefined;
    },
    enabled: enabled && !!contentId,
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 모든 페이지의 댓글을 평면화
  const comments = query.data?.pages.flatMap((page) => page.comments || []) || [];
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

        toast.success(t.toast.comments.added());
      },
      onError: (error, { contentId }) => {
        console.error('[useCreateComment] Failed to create comment:', contentId, error);
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
      onSuccess: (_, { contentId }) => {
        console.log('[useDeleteComment] Comment deleted successfully');

        // 관련 댓글 쿼리들 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byContent(contentId),
        });

        // 댓글 통계도 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.stats(contentId),
        });

        toast.success(t.toast.comments.deleted());
      },
      onError: (error, { commentId }) => {
        console.error('[useDeleteComment] Failed to delete comment:', commentId, error);
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
