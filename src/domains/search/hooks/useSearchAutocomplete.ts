'use client';

import { useMemo } from 'react';
import { useCombinedSearch, useSearchChannelContents } from './useSearch';

export interface AutocompleteItem {
  id: string;
  type: 'channel' | 'image' | 'video' | 'link';
  title: string;
  subtitle?: string;
  thumbnail?: string;
  url?: string;
  channelId?: string;
  channelName?: string;
}

interface UseSearchAutocompleteParams {
  query: string;
  channelId?: string; // If provided, search within specific channel
  maxChannels?: number;
  maxContents?: number;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook for search autocomplete that provides formatted results
 * ready for display in autocomplete dropdown
 */
export const useSearchAutocomplete = ({
  query,
  channelId,
  maxChannels = 3,
  maxContents = 5,
  enabled = true,
  debounceMs = 300,
}: UseSearchAutocompleteParams) => {
  // Use combined search for global results
  const globalSearch = useCombinedSearch({
    query,
    channelLimit: maxChannels,
    contentLimit: maxContents,
    enabled: enabled && !channelId,
    debounceMs,
  });

  // Use channel-specific search if channelId is provided
  const channelSearch = useSearchChannelContents({
    channelId: channelId || '',
    query,
    limit: maxContents,
    enabled: enabled && !!channelId,
    debounceMs,
  });

  // Format results for autocomplete display
  const formattedResults = useMemo((): AutocompleteItem[] => {
    const results: AutocompleteItem[] = [];

    if (channelId) {
      // Channel-specific search results
      const contents = channelSearch.data;

      // Add image content
      contents?.image?.forEach((item) => {
        results.push({
          id: item.id,
          type: 'image',
          title: `Image ${item.id}`,
          subtitle: 'Image content',
          thumbnail: item.url,
          url: item.url,
          channelId: item.channel_id,
        });
      });

      // Add video content
      contents?.video?.forEach((item) => {
        results.push({
          id: item.id,
          type: 'video',
          title: `Video ${item.id}`,
          subtitle: 'Video content',
          thumbnail: item.thumbnail_url || undefined,
          url: item.video_url,
          channelId: item.channel_id,
        });
      });

      // Add link content
      contents?.link?.forEach((item) => {
        results.push({
          id: item.id,
          type: 'link',
          title: item.link_preview_metadata?.title || item.url,
          subtitle: item.link_preview_metadata?.description || 'Link content',
          thumbnail: item.link_preview_metadata?.img_url || undefined,
          url: item.url,
          channelId: item.channel_id,
        });
      });
    } else {
      // Global search results
      const { channels, contents } = globalSearch.data;

      // Add channel results first
      channels.forEach((channel) => {
        results.push({
          id: channel.id,
          type: 'channel',
          title: channel.name,
          subtitle: channel.description || `${channel.subscriber_count || 0} subscribers`,
          thumbnail: channel.thumbnail_url || undefined,
          channelId: channel.id,
        });
      });

      // Add content results
      contents.image?.forEach((item) => {
        results.push({
          id: item.id,
          type: 'image',
          title: `Image ${item.id}`,
          subtitle: 'Image content',
          thumbnail: item.url,
          url: item.url,
          channelId: item.channel_id,
        });
      });

      contents.video?.forEach((item) => {
        results.push({
          id: item.id,
          type: 'video',
          title: `Video ${item.id}`,
          subtitle: 'Video content',
          thumbnail: item.thumbnail_url || undefined,
          url: item.video_url,
          channelId: item.channel_id,
        });
      });

      contents.link?.forEach((item) => {
        results.push({
          id: item.id,
          type: 'link',
          title: item.link_preview_metadata?.title || item.url,
          subtitle: item.link_preview_metadata?.description || 'Link content',
          thumbnail: item.link_preview_metadata?.img_url || undefined,
          url: item.url,
          channelId: item.channel_id,
        });
      });
    }

    return results;
  }, [globalSearch.data, channelSearch.data, channelId]);

  // Group results by type for better organization
  const groupedResults = useMemo(() => {
    const groups = {
      channels: formattedResults.filter((item) => item.type === 'channel'),
      contents: formattedResults.filter((item) => item.type !== 'channel'),
    };

    return groups;
  }, [formattedResults]);

  const isLoading = channelId ? channelSearch.isLoading : globalSearch.isLoading;
  const error = channelId ? channelSearch.error : globalSearch.error;
  const isFetching = channelId ? channelSearch.isFetching : globalSearch.isFetching;

  return {
    results: formattedResults,
    groupedResults,
    isLoading,
    error,
    isFetching,
    hasResults: formattedResults.length > 0,
    refetch: channelId ? channelSearch.refetch : globalSearch.refetch,
  };
};

/**
 * Lightweight hook for search suggestions
 * Returns only a limited number of results for quick autocomplete
 */
export const useSearchSuggestions = (query: string, enabled = true) => {
  return useSearchAutocomplete({
    query,
    maxChannels: 2,
    maxContents: 3,
    enabled,
    debounceMs: 150, // 더 빠른 반응 (적응형 적용됨)
  });
};
