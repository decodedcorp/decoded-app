/**
 * 이미지 URL 우선순위를 처리하는 유틸리티 함수들
 */

/**
 * 채널 썸네일 이미지 URL의 최적 우선순위를 결정하는 함수
 * @param thumbnailUrl - 원본 썸네일 URL
 * @param downloadedUrl - 다운로드된 이미지 URL (향후 API에 추가될 수 있음)
 * @param fallbackUrl - 기본 fallback 이미지 URL
 * @returns 최적의 이미지 URL
 */
export const getOptimalChannelImageUrl = (
  thumbnailUrl?: string | null,
  downloadedUrl?: string | null,
  fallbackUrl: string = '/images/default-channel-thumbnail.jpg',
): string => {
  // 1. 다운로드된 이미지 (가장 안정적, 외부 의존성 없음)
  if (downloadedUrl && downloadedUrl.trim() !== '') {
    return downloadedUrl;
  }

  // 2. 원본 썸네일 URL
  if (thumbnailUrl && thumbnailUrl.trim() !== '') {
    return thumbnailUrl;
  }

  // 3. 기본 fallback 이미지
  return fallbackUrl;
};

/**
 * 이미지 URL이 유효한지 확인하는 함수
 * @param url - 확인할 이미지 URL
 * @returns 유효한 URL인지 여부
 */
export const isValidImageUrl = (url?: string | null): boolean => {
  if (!url || url.trim() === '') return false;

  // 기본적인 URL 형식 검증
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // 상대 경로나 다른 형식의 URL도 허용
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

/**
 * 이미지 로딩 실패 시 fallback 이미지로 대체하는 함수
 * @param originalUrl - 원본 이미지 URL
 * @param fallbackUrl - fallback 이미지 URL
 * @returns fallback 이미지 URL
 */
export const getFallbackImageUrl = (
  originalUrl?: string | null,
  fallbackUrl: string = '/images/default-channel-thumbnail.jpg',
): string => {
  if (isValidImageUrl(originalUrl)) {
    return originalUrl!; // 이미 유효성 검증을 통과했으므로 non-null assertion 사용
  }
  return fallbackUrl;
};

/**
 * 채널 카테고리별 기본 이미지 URL을 반환하는 함수
 * @param category - 채널 카테고리
 * @returns 해당 카테고리의 기본 이미지 URL
 */
export const getCategoryDefaultImage = (category?: string): string => {
  const categoryImages: Record<string, string> = {
    technology: '/images/categories/tech-default.jpg',
    design: '/images/categories/design-default.jpg',
    business: '/images/categories/business-default.jpg',
    lifestyle: '/images/categories/lifestyle-default.jpg',
    education: '/images/categories/education-default.jpg',
    entertainment: '/images/categories/entertainment-default.jpg',
    default: '/images/default-channel-thumbnail.jpg',
  };

  return categoryImages[category?.toLowerCase() || ''] || categoryImages.default;
};
