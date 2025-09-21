// 기존 필터 타입 (호환성 유지)
export type { ExploreFilters } from './filters';

// 새로운 통일된 필터 타입들
export {
  type BaseFilters,
  type ChannelExploreFilters,
  type ChannelContentFilters,
  type UnifiedFilters,
  isChannelExploreFilters,
  isChannelContentFilters,
  DEFAULT_CHANNEL_EXPLORE_FILTERS,
  DEFAULT_CHANNEL_CONTENT_FILTERS,
} from './unifiedFilters';
