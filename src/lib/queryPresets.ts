/**
 * 도메인별 React Query 옵션 프리셋
 * 일관된 캐싱 전략과 성능 최적화
 */

export const queryPresets = {
  // 검색: 빠른 응답, 짧은 캐시
  search: {
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 0, // 재시도 없음 (빠른 응답)
    refetchOnWindowFocus: false, // 포커스 시 재요청 안함
  },

  // 댓글: 중간 캐시, 실시간성 중시
  comments: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    retry: 1, // 1회 재시도
    refetchOnWindowFocus: false, // 포커스 시 재요청 안함
  },

  // 프로필/채널 통계: 긴 캐시, 안정성 중시
  profile: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
    retry: 2, // 2회 재시도
    refetchOnMount: false, // 마운트 시 재요청 안함
  },

  // 메인 피드: 중간 캐시, 백그라운드 갱신
  feed: {
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1, // 1회 재시도
    refetchOnWindowFocus: true, // 포커스 시 재요청
  },

  // 알림: 짧은 캐시, 실시간성 중시
  notifications: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    retry: 1, // 1회 재시도
    refetchOnWindowFocus: true, // 포커스 시 재요청
  },

  // 북마크: 중간 캐시, 사용자 액션 기반
  bookmarks: {
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1, // 1회 재시도
    refetchOnWindowFocus: false, // 포커스 시 재요청 안함
  },
} as const;

/**
 * 특정 도메인의 쿼리 옵션을 가져오는 헬퍼
 */
export function getQueryPreset(domain: keyof typeof queryPresets) {
  return queryPresets[domain];
}

/**
 * 도메인별 기본 옵션과 커스텀 옵션을 병합
 */
export function mergeQueryOptions<T extends Record<string, any>>(
  domain: keyof typeof queryPresets,
  customOptions: T = {} as T,
) {
  return {
    ...queryPresets[domain],
    ...customOptions,
  };
}
