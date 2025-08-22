'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';

import { SearchService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseSearchContentsParams {
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseSearchChannelsParams {
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseSearchChannelContentsParams {
  channelId: string;
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook for searching contents across all channels
 */
export const useSearchContents = ({
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchContentsParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content
  const shouldQuery = enabled && debouncedQuery.trim().length > 0;

  return useQuery({
    queryKey: queryKeys.search.contents(debouncedQuery, limit),
    queryFn: () => SearchService.searchContentsSearchContentsGet(debouncedQuery, limit),
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for searching channels
 */
export const useSearchChannels = ({
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchChannelsParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content
  const shouldQuery = enabled && debouncedQuery.trim().length > 0;

  return useQuery({
    queryKey: queryKeys.search.channels(debouncedQuery, limit),
    queryFn: () => SearchService.searchChannelsSearchChannelsGet(debouncedQuery, limit),
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for searching contents within a specific channel
 */
export const useSearchChannelContents = ({
  channelId,
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchChannelContentsParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content and channelId exists
  const shouldQuery = enabled && debouncedQuery.trim().length > 0 && channelId.trim().length > 0;

  return useQuery({
    queryKey: queryKeys.search.channelContents(channelId, debouncedQuery, limit),
    queryFn: () => SearchService.searchChannelContentsSearchChannelsChannelIdContentsGet(
      channelId,
      debouncedQuery,
      limit
    ),
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Combined search hook that provides both channel and content results
 */
interface UseCombinedSearchParams {
  query: string;
  channelLimit?: number;
  contentLimit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

export const useCombinedSearch = ({
  query,
  channelLimit = 5,
  contentLimit = 8,
  enabled = true,
  debounceMs = 300,
}: UseCombinedSearchParams) => {
  const channelsQuery = useSearchChannels({
    query,
    limit: channelLimit,
    enabled,
    debounceMs,
  });

  const contentsQuery = useSearchContents({
    query,
    limit: contentLimit,
    enabled,
    debounceMs,
  });

  const combinedData = useMemo(() => {
    return {
      channels: channelsQuery.data?.channels || [],
      contents: {
        image: contentsQuery.data?.image || [],
        video: contentsQuery.data?.video || [],
        link: contentsQuery.data?.link || [],
      },
    };
  }, [channelsQuery.data, contentsQuery.data]);

  const isLoading = channelsQuery.isLoading || contentsQuery.isLoading;
  const error = channelsQuery.error || contentsQuery.error;
  const isFetching = channelsQuery.isFetching || contentsQuery.isFetching;

  return {
    data: combinedData,
    isLoading,
    error,
    isFetching,
    refetch: () => {
      channelsQuery.refetch();
      contentsQuery.refetch();
    },
  };
};