/**
 * Comment Hooks
 * React Query hooks for post comments CRUD
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/api/comments";
import {
  CommentResponse,
  CreateCommentDto,
  UpdateCommentDto,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const commentKeys = {
  all: ["comments"] as const,
  list: (postId: string) => [...commentKeys.all, "list", postId] as const,
  detail: (commentId: string) => [...commentKeys.all, "detail", commentId] as const,
};

// ============================================================
// useComments - Fetch comments for a post
// ============================================================

export function useComments(
  postId: string,
  options?: Omit<UseQueryOptions<CommentResponse[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

// ============================================================
// useCreateComment - Create a new comment
// ============================================================

interface CreateCommentVariables {
  postId: string;
  data: CreateCommentDto;
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: CreateCommentVariables) =>
      createComment(postId, data),
    onSuccess: (newComment, variables) => {
      // Optimistically add comment to cache
      queryClient.setQueryData<CommentResponse[]>(
        commentKeys.list(variables.postId),
        (old) => {
          if (!old) return [newComment];

          // If it's a reply, find parent and add to replies
          if (newComment.parent_id) {
            return old.map((comment) => {
              if (comment.id === newComment.parent_id) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                };
              }
              return comment;
            });
          }

          // Top-level comment
          return [...old, newComment];
        }
      );

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
    },
  });
}

// ============================================================
// useUpdateComment - Update an existing comment
// ============================================================

interface UpdateCommentVariables {
  commentId: string;
  postId: string; // Needed for cache invalidation
  data: UpdateCommentDto;
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: UpdateCommentVariables) =>
      updateComment(commentId, data),
    onMutate: async ({ commentId, postId, data }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData<CommentResponse[]>(
        commentKeys.list(postId)
      );

      // Optimistically update the comment
      if (previousComments) {
        const updateRecursive = (comments: CommentResponse[]): CommentResponse[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                content: data.content,
                updated_at: new Date().toISOString(),
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateRecursive(comment.replies),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData(
          commentKeys.list(postId),
          updateRecursive(previousComments)
        );
      }

      return { previousComments, postId };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(context.postId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
    },
  });
}

// ============================================================
// useDeleteComment - Delete a comment
// ============================================================

interface DeleteCommentVariables {
  commentId: string;
  postId: string; // Needed for cache invalidation
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentVariables) =>
      deleteComment(commentId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData<CommentResponse[]>(
        commentKeys.list(postId)
      );

      // Optimistically remove the comment
      if (previousComments) {
        const removeRecursive = (comments: CommentResponse[]): CommentResponse[] => {
          return comments
            .filter((comment) => comment.id !== commentId)
            .map((comment) => {
              if (comment.replies) {
                return {
                  ...comment,
                  replies: removeRecursive(comment.replies),
                };
              }
              return comment;
            });
        };

        queryClient.setQueryData(
          commentKeys.list(postId),
          removeRecursive(previousComments)
        );
      }

      return { previousComments, postId };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(context.postId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
    },
  });
}
