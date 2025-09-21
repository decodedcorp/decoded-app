/**
 * 통일된 필터 타입 정의
 * ChannelModal과 ChannelMainContent에서 일관된 필터링을 위해 사용
 */

// 기본 필터 인터페이스
export interface BaseFilters {
  search?: string;
  sortBy?: 'recent' | 'popular' | 'content' | 'subscribers';
  sortOrder?: 'asc' | 'desc';
}

// 채널 탐색용 필터 (ChannelMainContent에서 사용)
export interface ChannelExploreFilters extends BaseFilters {
  category?: string;
  subcategory?: string;
}

// 채널 콘텐츠 필터 (ChannelModal에서 사용)
export interface ChannelContentFilters extends BaseFilters {
  dataTypes?: string[];
  categories?: string[];
  tags?: string[];
  statuses?: string[];
}

// 통합 필터 타입
export type UnifiedFilters = ChannelExploreFilters | ChannelContentFilters;

// 필터 타입 가드
export function isChannelExploreFilters(filters: UnifiedFilters): filters is ChannelExploreFilters {
  return 'category' in filters || 'subcategory' in filters;
}

export function isChannelContentFilters(filters: UnifiedFilters): filters is ChannelContentFilters {
  return (
    'dataTypes' in filters || 'categories' in filters || 'tags' in filters || 'statuses' in filters
  );
}

// 기본 필터 값들
export const DEFAULT_CHANNEL_EXPLORE_FILTERS: ChannelExploreFilters = {
  search: '',
  category: 'all',
  subcategory: 'all',
  sortBy: 'recent',
  sortOrder: 'desc',
};

export const DEFAULT_CHANNEL_CONTENT_FILTERS: ChannelContentFilters = {
  search: '',
  dataTypes: [],
  categories: [],
  tags: [],
  statuses: ['active'],
  sortBy: 'recent',
  sortOrder: 'desc',
};
