/**
 * Content Type Detection and Categorization
 * 
 * API 콘텐츠의 타입과 카테고리를 자동으로 감지하는 유틸리티
 */

import type { CardType } from '../types/card';

// URL 패턴 기반 미디어 타입 감지
const VIDEO_URL_PATTERNS = [
  /youtube\.com\/watch/i,
  /youtu\.be\//i,
  /vimeo\.com\/\d+/i,
  /dailymotion\.com\/video/i,
  /twitch\.tv\/videos/i,
  /facebook\.com\/.*\/videos/i,
  /instagram\.com\/p\/.*\/\?/i,
  /tiktok\.com\/@.*\/video/i,
];

const IMAGE_URL_PATTERNS = [
  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i,
  /imgur\.com\/\w+$/i,
  /flickr\.com\/photos/i,
  /instagram\.com\/p\//i,
  /pinterest\.com\/pin/i,
];

const BLOG_DOMAIN_PATTERNS = [
  /blog\.naver\.com/i,
  /tistory\.com/i,
  /brunch\.co\.kr/i,
  /medium\.com/i,
  /wordpress\.com/i,
  /blogspot\.com/i,
  /ghost\.org/i,
];

const NEWS_DOMAIN_PATTERNS = [
  /chosun\.com/i,
  /joongang\.co\.kr/i,
  /donga\.com/i,
  /hani\.co\.kr/i,
  /khan\.co\.kr/i,
  /ajunews\.com/i,
  /yonhapnews\.co\.kr/i,
  /yna\.co\.kr/i,
  /newsis\.com/i,
  /mt\.co\.kr/i,
  /etnews\.com/i,
  /mk\.co\.kr/i,
  /sedaily\.com/i,
  /hankyung\.com/i,
  /hankookilbo\.com/i,
  /kstarfashion\.com/i,
  /nc\.press/i,
  /imbc\.com/i,
  /nate\.com/i,
  /pickcon\.co\.kr/i,
];

/**
 * URL과 카테고리를 기반으로 카드 타입 결정
 */
export function determineCardType(category: string | null, url: string): CardType {
  // 카테고리가 명시적으로 제공된 경우
  if (category) {
    switch (category.toLowerCase()) {
      case 'photo':
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'news':
      case 'blog':
      case 'article':
      default:
        return 'card';
    }
  }

  // URL 패턴 기반 감지
  if (VIDEO_URL_PATTERNS.some(pattern => pattern.test(url))) {
    return 'video';
  }

  if (IMAGE_URL_PATTERNS.some(pattern => pattern.test(url))) {
    return 'image';
  }

  // 기본값은 카드 타입
  return 'card';
}

/**
 * URL을 기반으로 콘텐츠 소스 타입 감지
 */
export function detectContentSource(url: string): 'news' | 'blog' | 'social' | 'video' | 'image' | 'article' | 'unknown' {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // 뉴스 사이트
    if (NEWS_DOMAIN_PATTERNS.some(pattern => pattern.test(hostname))) {
      return 'news';
    }

    // 블로그 플랫폼
    if (BLOG_DOMAIN_PATTERNS.some(pattern => pattern.test(hostname))) {
      return 'blog';
    }

    // 소셜 미디어
    if (hostname.includes('instagram.com') || 
        hostname.includes('twitter.com') || 
        hostname.includes('facebook.com') ||
        hostname.includes('tiktok.com')) {
      return 'social';
    }

    // 비디오 플랫폼
    if (hostname.includes('youtube.com') || 
        hostname.includes('vimeo.com') ||
        hostname.includes('dailymotion.com')) {
      return 'video';
    }

    // 이미지 서비스
    if (hostname.includes('imgur.com') || 
        hostname.includes('flickr.com') ||
        IMAGE_URL_PATTERNS.some(pattern => pattern.test(pathname))) {
      return 'image';
    }

    return 'article';
  } catch {
    return 'unknown';
  }
}

/**
 * 콘텐츠 로드 우선순위 결정
 */
export function determineLoadPriority(
  status: string,
  category: string | null,
  sourceType: string
): 'high' | 'medium' | 'low' {
  // 비활성 콘텐츠는 낮은 우선순위
  if (status !== 'active') {
    return 'low';
  }

  // 미디어 콘텐츠는 높은 우선순위
  if (category === 'photo' || category === 'video' || sourceType === 'image' || sourceType === 'video') {
    return 'high';
  }

  // 뉴스와 소셜 미디어는 중간 우선순위
  if (sourceType === 'news' || sourceType === 'social') {
    return 'medium';
  }

  // 기본값은 중간 우선순위
  return 'medium';
}

/**
 * 콘텐츠 카테고리를 표준화
 */
export function normalizeCategory(category: string | null, sourceType: string): string {
  if (category) {
    return category.toLowerCase();
  }

  // 소스 타입을 기반으로 카테고리 추론
  switch (sourceType) {
    case 'news':
      return 'news';
    case 'blog':
      return 'blog';
    case 'social':
      return 'social';
    case 'video':
      return 'video';
    case 'image':
      return 'photo';
    default:
      return 'article';
  }
}

/**
 * 콘텐츠 성숙도 점수 계산 (0-1)
 */
export function calculateContentMaturity(content: {
  status: string;
  link_preview_metadata: any;
  ai_gen_metadata: any;
  category: string | null;
}): number {
  let score = 0;

  // 기본 활성 상태
  if (content.status === 'active') score += 0.3;

  // 링크 프리뷰 메타데이터 존재
  if (content.link_preview_metadata) {
    score += 0.2;
    if (content.link_preview_metadata.title) score += 0.1;
    if (content.link_preview_metadata.description) score += 0.1;
    if (content.link_preview_metadata.img_url) score += 0.1;
  }

  // AI 생성 메타데이터 존재
  if (content.ai_gen_metadata) {
    score += 0.1;
    if (content.ai_gen_metadata.summary) score += 0.05;
    if (content.ai_gen_metadata.qa_list?.length > 0) score += 0.05;
  }

  // 카테고리 분류 존재
  if (content.category) score += 0.1;

  return Math.min(score, 1.0);
}

/**
 * 콘텐츠 타입별 적절한 그리드 스팬 계산
 */
export function calculateGridSpan(cardType: CardType, aspectRatio: number = 0.8): { spanX: number; spanY: number } {
  switch (cardType) {
    case 'video':
      // 비디오는 가로로 넓게
      return { spanX: 2, spanY: 1 };
    
    case 'image':
      // 이미지는 세로 비율에 따라
      if (aspectRatio > 1.2) {
        return { spanX: 1, spanY: 1 }; // 가로가 긴 이미지
      } else if (aspectRatio < 0.6) {
        return { spanX: 1, spanY: 2 }; // 세로가 긴 이미지
      }
      return { spanX: 1, spanY: 1 }; // 일반적인 이미지
    
    case 'card':
    default:
      // 카드는 기본 1x1
      return { spanX: 1, spanY: 1 };
  }
}

// 디버깅 및 개발용 유틸리티
export const ContentDetectionUtils = {
  VIDEO_URL_PATTERNS,
  IMAGE_URL_PATTERNS,
  BLOG_DOMAIN_PATTERNS,
  NEWS_DOMAIN_PATTERNS,
  determineCardType,
  detectContentSource,
  determineLoadPriority,
  normalizeCategory,
  calculateContentMaturity,
  calculateGridSpan,
} as const;