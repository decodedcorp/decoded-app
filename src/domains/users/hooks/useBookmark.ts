'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarksService } from '@/api/generated/services/BookmarksService';
import { queryKeys } from '@/lib/api/queryKeys';
import type { BookmarkStatusResponse } from '@/api/generated/models/BookmarkStatusResponse';
import type { BookmarkResponse } from '@/api/generated/models/BookmarkResponse';

export function useBookmarkStatus(contentId: string) {
  return useQuery({
    queryKey: queryKeys.users.bookmarkStatus(contentId),
    queryFn: () => BookmarksService.checkBookmarkStatusUsersMeBookmarksContentIdStatusGet(contentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBookmark(contentId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.users.bookmarkStatus(contentId);

  const addBookmarkMutation = useMutation({
    mutationFn: () => BookmarksService.addBookmarkUsersMeBookmarksContentIdPost(contentId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot previous value
      const previousBookmarkStatus = queryClient.getQueryData<BookmarkStatusResponse>(queryKey);
      
      // Optimistically update to the new value
      queryClient.setQueryData<BookmarkStatusResponse>(queryKey, (old) => ({
        ...old,
        content_id: contentId,
        is_bookmarked: true,
        bookmark_count: old?.bookmark_count ? old.bookmark_count + 1 : 1,
      }));

      return { previousBookmarkStatus };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBookmarkStatus) {
        queryClient.setQueryData(queryKey, context.previousBookmarkStatus);
      }
    },
    onSettled: () => {
      // Refetch after either success or error
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.myBookmarks() });
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: () => BookmarksService.removeBookmarkUsersMeBookmarksContentIdDelete(contentId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot previous value
      const previousBookmarkStatus = queryClient.getQueryData<BookmarkStatusResponse>(queryKey);
      
      // Optimistically update to the new value
      queryClient.setQueryData<BookmarkStatusResponse>(queryKey, (old) => ({
        ...old,
        content_id: contentId,
        is_bookmarked: false,
        bookmark_count: old?.bookmark_count ? Math.max(0, old.bookmark_count - 1) : 0,
      }));

      return { previousBookmarkStatus };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBookmarkStatus) {
        queryClient.setQueryData(queryKey, context.previousBookmarkStatus);
      }
    },
    onSettled: () => {
      // Refetch after either success or error
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.myBookmarks() });
    },
  });

  return {
    addBookmark: addBookmarkMutation.mutate,
    removeBookmark: removeBookmarkMutation.mutate,
    isAddingBookmark: addBookmarkMutation.isPending,
    isRemovingBookmark: removeBookmarkMutation.isPending,
    isLoading: addBookmarkMutation.isPending || removeBookmarkMutation.isPending,
  };
}

export function useMyBookmarks(params?: { offset?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.users.myBookmarks(params),
    queryFn: () => BookmarksService.getBookmarksUsersMeBookmarksGet(params?.offset, params?.limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}