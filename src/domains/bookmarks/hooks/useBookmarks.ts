import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { BookmarksService } from '@/api/generated/services/BookmarksService';
import { BookmarkListWithContentResponse, BookmarkResponse } from '@/api/generated';

interface UseBookmarksOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
  includeContent?: boolean;
}

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const { offset = 0, limit = 20, enabled = true, includeContent = true } = options;

  return useQuery({
    queryKey: ['bookmarks', offset, limit, includeContent],
    queryFn: () => BookmarksService.getBookmarksUsersMeBookmarksGet(offset, limit, includeContent),
    enabled,
  });
}

export function useBookmarkStats() {
  return useQuery({
    queryKey: ['bookmark-stats'],
    queryFn: () => BookmarksService.getBookmarkStatsUsersMeBookmarksStatsGet(),
  });
}

export function useCheckBookmarkStatus(contentId: string) {
  return useQuery({
    queryKey: ['bookmark-status', contentId],
    queryFn: () => BookmarksService.checkBookmarkStatusUsersMeBookmarksContentIdStatusGet(contentId),
    enabled: !!contentId,
  });
}

export function useBookmarkMutations() {
  const queryClient = useQueryClient();

  const addBookmark = useMutation({
    mutationFn: (contentId: string) =>
      BookmarksService.addBookmarkUsersMeBookmarksContentIdPost(contentId),
    onSuccess: (data, contentId) => {
      // Update bookmark status cache
      queryClient.setQueryData(['bookmark-status', contentId], { is_bookmarked: true });
      
      // Invalidate bookmarks list
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark-stats'] });
      
      toast.success('Added to bookmarks');
    },
    onError: (error) => {
      toast.error('Failed to add bookmark');
      console.error('Add bookmark error:', error);
    },
  });

  const removeBookmark = useMutation({
    mutationFn: (contentId: string) =>
      BookmarksService.removeBookmarkUsersMeBookmarksContentIdDelete(contentId),
    onSuccess: (data, contentId) => {
      // Update bookmark status cache
      queryClient.setQueryData(['bookmark-status', contentId], { is_bookmarked: false });
      
      // Invalidate bookmarks list
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark-stats'] });
      
      toast.success('Removed from bookmarks');
    },
    onError: (error) => {
      toast.error('Failed to remove bookmark');
      console.error('Remove bookmark error:', error);
    },
  });

  return {
    addBookmark,
    removeBookmark,
  };
}