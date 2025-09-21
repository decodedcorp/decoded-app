'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ChannelExploreFilters,
  ChannelContentFilters,
  DEFAULT_CHANNEL_EXPLORE_FILTERS,
  DEFAULT_CHANNEL_CONTENT_FILTERS,
  isChannelExploreFilters,
  isChannelContentFilters,
} from '../types/unifiedFilters';

/**
 * 통일된 필터 관리 훅
 * ChannelModal과 ChannelMainContent에서 일관된 필터 처리를 위해 사용
 */

// 채널 탐색용 필터 훅
export function useChannelExploreFilters(initialFilters?: Partial<ChannelExploreFilters>) {
  const [filters, setFilters] = useState<ChannelExploreFilters>({
    ...DEFAULT_CHANNEL_EXPLORE_FILTERS,
    ...initialFilters,
  });

  const updateFilters = useCallback((newFilters: Partial<ChannelExploreFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_CHANNEL_EXPLORE_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.search && filters.search.trim() !== '') ||
      filters.category !== 'all' ||
      filters.subcategory !== 'all'
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}

// 채널 콘텐츠용 필터 훅
export function useChannelContentFilters(initialFilters?: Partial<ChannelContentFilters>) {
  const [filters, setFilters] = useState<ChannelContentFilters>({
    ...DEFAULT_CHANNEL_CONTENT_FILTERS,
    ...initialFilters,
  });

  const updateFilters = useCallback((newFilters: Partial<ChannelContentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_CHANNEL_CONTENT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.search && filters.search.trim() !== '') ||
      (filters.dataTypes && filters.dataTypes.length > 0) ||
      (filters.categories && filters.categories.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      (filters.statuses && filters.statuses.length > 0 && filters.statuses.length < 3) // 3개 모두 선택되지 않은 경우
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}

// 범용 필터 훅 (타입에 따라 자동으로 적절한 훅 사용)
export function useUnifiedFilters<T extends ChannelExploreFilters | ChannelContentFilters>(
  type: 'explore' | 'content',
  initialFilters?: Partial<T>,
) {
  if (type === 'explore') {
    return useChannelExploreFilters(initialFilters as Partial<ChannelExploreFilters>);
  } else {
    return useChannelContentFilters(initialFilters as Partial<ChannelContentFilters>);
  }
}
