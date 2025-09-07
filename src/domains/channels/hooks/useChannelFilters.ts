import React, { useMemo } from 'react';
import { ContentType } from '@/lib/types/ContentType';
import { useChannelContentsSinglePage } from './useChannelContents';
import { ContentItem } from '@/lib/types/content';

interface FilterOption {
  id: string;
  label: string;
  icon: string;
  count: number;
}

interface CategoryOption extends FilterOption {
  color: string;
}

interface UseChannelFiltersResult {
  dataTypes: FilterOption[];
  categories: CategoryOption[];
  isLoading: boolean;
  error: Error | null;
}

// Data Type 매핑
const DATA_TYPE_CONFIG = {
  [ContentType.LINK]: { label: 'Link', icon: '🔗' },
  [ContentType.IMAGE]: { label: 'Image', icon: '🖼️' },
  [ContentType.VIDEO]: { label: 'Video', icon: '🎥' },
  // 추가적인 타입들
  pdf: { label: 'PDF', icon: '📄' },
  audio: { label: 'Audio', icon: '🎵' },
  text: { label: 'Text', icon: '📝' },
} as const;

// Category 색상 매핑
const CATEGORY_COLORS = [
  'bg-red-500/20 text-red-300',
  'bg-emerald-500/20 text-emerald-300', 
  'bg-amber-500/20 text-amber-300',
  'bg-pink-500/20 text-pink-300',
  'bg-violet-500/20 text-violet-300',
  'bg-cyan-500/20 text-cyan-300',
  'bg-orange-500/20 text-orange-300',
  'bg-blue-500/20 text-blue-300',
  'bg-green-500/20 text-green-300',
  'bg-purple-500/20 text-purple-300',
];


/**
 * 채널의 콘텐츠를 기반으로 실제 사용되는 필터 옵션들을 추출하는 훅
 */
export const useChannelFilters = (channelId: string): UseChannelFiltersResult => {
  const {
    data: contentItems,
    isLoading,
    error,
  } = useChannelContentsSinglePage({
    channelId,
    limit: 100, // 충분한 수의 콘텐츠를 가져와서 정확한 통계 제공
    enabled: !!channelId,
    enableSmartPolling: false, // 필터 정보는 폴링하지 않음
  });

  // Data Types 추출 및 집계
  const dataTypes = useMemo((): FilterOption[] => {
    if (!contentItems || contentItems.length === 0) return [];

    const typeCount = new Map<string, number>();
    
    contentItems.forEach((item: ContentItem) => {
      const type = item.type;
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    return Array.from(typeCount.entries())
      .map(([type, count]) => {
        const config = DATA_TYPE_CONFIG[type as keyof typeof DATA_TYPE_CONFIG] || {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          icon: '📄',
        };
        
        return {
          id: type,
          label: config.label,
          icon: config.icon,
          count,
        };
      })
      .sort((a, b) => b.count - a.count); // 개수 순으로 정렬
  }, [contentItems]);

  // Categories 추출 및 집계
  const categories = useMemo((): CategoryOption[] => {
    if (!contentItems || contentItems.length === 0) return [];

    const categoryCount = new Map<string, number>();
    
    contentItems.forEach((item: ContentItem) => {
      if (item.category) {
        const category = item.category.toLowerCase().trim();
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }
    });

    return Array.from(categoryCount.entries())
      .map(([category, count], index) => {
        const icon = '📁'; // 모든 카테고리에 동일한 기본 아이콘 사용
        const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        
        return {
          id: category,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          icon,
          count,
          color,
        };
      })
      .sort((a, b) => b.count - a.count); // 개수 순으로 정렬
  }, [contentItems]);

  return {
    dataTypes,
    categories,
    isLoading,
    error,
  };
};

/**
 * 채널의 콘텐츠 필터링을 수행하는 훅
 */
export const useChannelContentFiltering = (
  channelId: string,
  filters: {
    dataTypes: string[];
    categories: string[];
    tags: string[];
    statuses: string[];
  }
) => {
  const {
    data: contentItems,
    isLoading,
    error,
    refetch,
  } = useChannelContentsSinglePage({
    channelId,
    enabled: !!channelId,
    enableSmartPolling: true,
  });

  // 필터링된 콘텐츠
  const filteredContent = useMemo(() => {
    if (!contentItems) return [];

    return contentItems.filter((item: ContentItem) => {
      // Data Type 필터링
      if (filters.dataTypes.length > 0 && !filters.dataTypes.includes(item.type)) {
        return false;
      }

      // Category 필터링
      if (filters.categories.length > 0) {
        const itemCategory = item.category?.toLowerCase().trim();
        if (!itemCategory || !filters.categories.includes(itemCategory)) {
          return false;
        }
      }

      // Status 필터링
      if (filters.statuses?.length > 0) {
        const itemStatus = item.status?.toLowerCase();
        if (!itemStatus || !filters.statuses.includes(itemStatus)) {
          return false;
        }
      }

      // Tags 필터링 (향후 확장 가능)
      if (filters.tags.length > 0) {
        // TODO: 태그 시스템이 구현되면 여기에 태그 필터링 로직 추가
        return true;
      }

      return true;
    });
  }, [contentItems, filters]);

  return {
    filteredContent,
    totalCount: contentItems?.length || 0,
    filteredCount: filteredContent.length,
    isLoading,
    error,
    refetch,
  };
};