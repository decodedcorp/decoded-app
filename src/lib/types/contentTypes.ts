/**
 * Core content types and interfaces
 */
import {
  ContentType,
  ContentStatus,
  AIGenMetadataResponse,
  LinkPreviewMetadataResponse,
} from '@/api/generated';

/**
 * 콘텐츠 상태 타입 - 새로운 API enum과 일치
 */
export type ContentStatusType = ContentStatus;

/**
 * 통합된 콘텐츠 타입 - API 응답을 프론트엔드에서 사용하기 위한 통합 인터페이스
 */
export interface UnifiedContent {
  id: string;
  type: ContentType;
  channel_id: string;
  provider_id: string;
  created_at?: string | null;
  updated_at?: string | null;
  status?: ContentStatusType; // 새로운 API enum 사용

  // 공통 필드
  title?: string;
  description?: string | null;
  thumbnail_url?: string | null;

  // 타입별 특화 필드
  imageContent?: {
    url: string; // img_url에서 url로 변경
    likes?: number;
    tagged_items?: Array<any>;
  };

  videoContent?: {
    video_url: string;
    details?: {
      duration_seconds: number;
      width: number;
      height: number;
      format?: string | null;
    } | null;
    chapters?: Array<any>;
    transcript?: string | null;
  };

  linkContent?: {
    url: string;
    category?: string | null; // nullable로 변경
    link_preview_metadata?: LinkPreviewMetadataResponse | null;
    ai_gen_metadata?: AIGenMetadataResponse | null;
    metadata?: {
      game?: string;
      topics?: string;
      platforms?: string;
      content_type?: string;
      release_year?: string;
      [key: string]: any;
    } | null;
  };
}

/**
 * 프론트엔드에서 사용하는 콘텐츠 아이템 타입
 */
export interface ContentItem {
  id: string | number;
  type: ContentType | 'image' | 'video' | 'text';
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string; // 비디오 URL
  linkUrl?: string; // 링크 URL
  thumbnailUrl?: string;
  category?: string;
  author?: string;
  date?: string;
  likes?: number;
  views?: number;
  status?: ContentStatusType;
  
  // 색상 정보
  colors?: {
    primary: string;
    secondary: string;
  };
  
  // 추가 메타데이터
  width?: number;
  height?: number;
  duration?: number; // 비디오 길이 (초)
  sourceUrl?: string; // 원본 링크
  domain?: string; // 도메인 정보
  
  // AI 생성 메타데이터
  aiSummary?: string;
  aiQaList?: Array<{
    question: string;
    answer: string;
  }>;
  aiMetadata?: {
    tags?: string[];
    description?: string;
    mood?: string;
    style?: string;
    objects?: string[];
    colors?: string[];
  };
  
  // 링크 미리보기
  linkPreview?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    siteName?: string;
    favicon?: string;
    ogImage?: string;
    ogDescription?: string;
  };

  // 추가 메타데이터
  metadata?: {
    game?: string;
    topics?: string;
    platforms?: string;
    contentType?: string;
    releaseYear?: string;
  };
  
  // UI 상태 (프론트엔드 전용)
  isLoading?: boolean;
  hasError?: boolean;
  isSelected?: boolean;
}