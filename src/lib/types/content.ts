import {
  ImageContentResponse,
  VideoContentResponse,
  LinkContentResponse,
  ContentType,
} from '@/api/generated';

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

  // 공통 필드
  title?: string;
  description?: string | null;
  thumbnail_url?: string | null;

  // 타입별 특화 필드
  imageContent?: {
    img_url: string;
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
    category: string;
    link_preview_metadata?: {
      title?: string;
      description?: string;
      image_url?: string;
      site_name?: string;
    } | null;
    ai_gen_metadata?: any;
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
  category?: string;
  author?: string;
  date?: string;
  likes?: number;
  views?: number;

  // 레이아웃 관련
  height?: string;
  width?: string;

  // 타입별 추가 정보
  videoUrl?: string;
  linkUrl?: string;
  duration?: number;
}

/**
 * 콘텐츠 타입 가드 함수들
 */
export const isImageContent = (
  content: UnifiedContent,
): content is UnifiedContent & { imageContent: NonNullable<UnifiedContent['imageContent']> } => {
  return content.type === ContentType.IMAGE && !!content.imageContent;
};

export const isVideoContent = (
  content: UnifiedContent,
): content is UnifiedContent & { videoContent: NonNullable<UnifiedContent['videoContent']> } => {
  return content.type === ContentType.VIDEO && !!content.videoContent;
};

export const isLinkContent = (
  content: UnifiedContent,
): content is UnifiedContent & { linkContent: NonNullable<UnifiedContent['linkContent']> } => {
  return content.type === ContentType.LINK && !!content.linkContent;
};

/**
 * API 콘텐츠를 통합 타입으로 변환
 */
export const unifyContent = (content: Record<string, any>): UnifiedContent => {
  console.log('unifyContent - input content:', content);
  
  // 필드 존재 여부로 타입 구분
  let contentType = ContentType.IMAGE; // 기본값
  if (content.url) {
    contentType = ContentType.LINK;
  } else if (content.video_url) {
    contentType = ContentType.VIDEO;
  } else if (content.img_url) {
    contentType = ContentType.IMAGE;
  }

  console.log('unifyContent - detected contentType:', contentType);

  const baseContent: UnifiedContent = {
    id: content.id,
    type: contentType,
    channel_id: content.channel_id,
    provider_id: content.provider_id,
    created_at: content.created_at,
    updated_at: content.updated_at,
    title: content.title,
    description: content.description,
    thumbnail_url: content.thumbnail_url,
  };

  switch (contentType) {
    case ContentType.IMAGE:
      const imageResult = {
        ...baseContent,
        imageContent: {
          img_url: content.img_url,
          likes: content.likes,
          tagged_items: content.tagged_items,
        },
      };
      console.log('unifyContent - image result:', imageResult);
      return imageResult;

    case ContentType.VIDEO:
      const videoResult = {
        ...baseContent,
        videoContent: {
          video_url: content.video_url,
          details: content.details,
          chapters: content.chapters,
          transcript: content.transcript,
        },
      };
      console.log('unifyContent - video result:', videoResult);
      return videoResult;

    case ContentType.LINK:
      const linkResult = {
        ...baseContent,
        linkContent: {
          url: content.url,
          category: content.category,
          link_preview_metadata: content.link_preview_metadata,
          ai_gen_metadata: content.ai_gen_metadata,
        },
      };
      console.log('unifyContent - link result:', linkResult);
      return linkResult;

    default:
      console.log('unifyContent - default result:', baseContent);
      return baseContent;
  }
};

/**
 * 통합 콘텐츠를 프론트엔드 ContentItem으로 변환
 */
export const convertToContentItem = (content: UnifiedContent): ContentItem => {
  console.log('convertToContentItem - input content:', content);
  
  const baseItem: ContentItem = {
    id: content.id,
    type: content.type,
    title: content.title || 'Untitled',
    description: content.description || undefined,
    date: content.created_at ? new Date(content.created_at).toISOString() : undefined,
  };

  // 타입별 특화 정보 추가
  if (isImageContent(content)) {
    const result = {
      ...baseItem,
      imageUrl: content.imageContent.img_url,
      likes: content.imageContent.likes,
      category: 'Image',
    };
    console.log('convertToContentItem - image result:', result);
    return result;
  }

  if (isVideoContent(content)) {
    const result = {
      ...baseItem,
      imageUrl: content.thumbnail_url || undefined,
      videoUrl: content.videoContent.video_url,
      duration: content.videoContent.details?.duration_seconds,
      category: 'Video',
    };
    console.log('convertToContentItem - video result:', result);
    return result;
  }

  if (isLinkContent(content)) {
    const result = {
      ...baseItem,
      imageUrl:
        content.linkContent.link_preview_metadata?.image_url || content.thumbnail_url || undefined,
      linkUrl: content.linkContent.url,
      category: content.linkContent.category,
    };
    console.log('convertToContentItem - link result:', result);
    return result;
  }

  console.log('convertToContentItem - default result:', baseItem);
  return baseItem;
};
