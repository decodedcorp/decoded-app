/**
 * Hook to get recent content details (simplified version)
 */

import { useRecentContentStore, selectRecentItems } from '@/store/recentContentStore';

interface ContentDetails {
  id: string;
  channelId: string;
  title: string;
  thumbnailUrl?: string;
  viewedAt: number;
}

/**
 * Hook to get recent content details without API calls
 */
export function useRecentContentDetails() {
  const recentItems = useRecentContentStore(selectRecentItems);

  // Transform recent items to content details (no API call needed)
  const contentDetails: ContentDetails[] = recentItems.map((item) => ({
    id: item.id,
    channelId: item.channelId,
    title: item.title || 'Untitled',
    thumbnailUrl: item.thumbnailUrl,
    viewedAt: item.viewedAt,
  }));

  return {
    contentDetails,
    isLoading: false,
    error: null,
    hasContent: contentDetails.length > 0,
  };
}
