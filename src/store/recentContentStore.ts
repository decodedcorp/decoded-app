/**
 * Recent Content Store
 * Manages recently viewed content state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getRecentContent,
  addRecentContent,
  removeRecentContent,
  clearRecentContent,
  type RecentContentItem,
} from '@/lib/utils/recentContentManager';

interface RecentContentState {
  // State
  recentItems: RecentContentItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadRecentContent: () => void;
  addContent: (content: Omit<RecentContentItem, 'viewedAt'>) => void;
  removeContent: (contentId: string) => void;
  clearAll: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useRecentContentStore = create<RecentContentState>()(
  devtools(
    (set, get) => ({
      // Initial state
      recentItems: [],
      isLoading: false,
      error: null,

      // Load recent content from session storage
      loadRecentContent: () => {
        try {
          set({ isLoading: true, error: null });
          const items = getRecentContent();
          set({ recentItems: items, isLoading: false });

          console.log('[RecentContentStore] Loaded recent content:', {
            count: items.length,
            items: items.map((item) => ({ id: item.id, title: item.title })),
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to load recent content';
          set({ error: errorMessage, isLoading: false });
          console.error('[RecentContentStore] Failed to load recent content:', error);
        }
      },

      // Add content to recent items
      addContent: (content) => {
        try {
          addRecentContent(content);
          const items = getRecentContent();
          set({ recentItems: items, error: null });

          console.log('[RecentContentStore] Added content:', {
            id: content.id,
            title: content.title,
            totalItems: items.length,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add content';
          set({ error: errorMessage });
          console.error('[RecentContentStore] Failed to add content:', error);
        }
      },

      // Remove content from recent items
      removeContent: (contentId) => {
        try {
          removeRecentContent(contentId);
          const items = getRecentContent();
          set({ recentItems: items, error: null });

          console.log('[RecentContentStore] Removed content:', {
            contentId,
            remainingItems: items.length,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove content';
          set({ error: errorMessage });
          console.error('[RecentContentStore] Failed to remove content:', error);
        }
      },

      // Clear all recent content
      clearAll: () => {
        try {
          clearRecentContent();
          set({ recentItems: [], error: null });

          console.log('[RecentContentStore] Cleared all recent content');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to clear recent content';
          set({ error: errorMessage });
          console.error('[RecentContentStore] Failed to clear recent content:', error);
        }
      },

      // Set error state
      setError: (error) => {
        set({ error });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'recent-content-store',
    },
  ),
);

// Selectors
export const selectRecentItems = (state: RecentContentState) => state.recentItems;
export const selectIsLoading = (state: RecentContentState) => state.isLoading;
export const selectError = (state: RecentContentState) => state.error;
export const selectRecentCount = (state: RecentContentState) => state.recentItems.length;
