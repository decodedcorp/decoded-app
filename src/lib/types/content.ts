import {
  ImageContentResponse,
  VideoContentResponse,
  LinkContentResponse,
  ContentType,
} from '@/api/generated';

/**
 * 콘텐츠 상태 타입
 */
export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'active';

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
  status?: ContentStatus; // 콘텐츠 상태 추가

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
  thumbnailUrl?: string; // thumbnailUrl 필드 추가
  category?: string;
  author?: string;
  date?: string;
  likes?: number;
  views?: number;
  status?: ContentStatus; // 콘텐츠 상태 추가

  // 레이아웃 관련
  height?: string;
  width?: string;

  // 타입별 추가 정보
  videoUrl?: string;
  linkUrl?: string;
  duration?: number;

  // AI generated data
  aiSummary?: string;
  aiQaList?: Array<{ question: string; answer: string }>;
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
 * DB 상태를 프론트엔드 상태로 매핑하는 함수
 */
export const mapContentStatus = (
  dbStatus?: string,
  processingStatus?: string,
  content?: Record<string, any>,
): ContentStatus => {
  console.log('mapContentStatus - input:', { dbStatus, processingStatus, content });

  // processing_status가 'completed'이면 approved로 처리
  if (processingStatus === 'completed') {
    console.log('mapContentStatus - processing completed, returning approved');
    return 'approved';
  }

  // processing_status가 'processing'이면 processing으로 처리
  if (processingStatus === 'processing') {
    console.log('mapContentStatus - processing in progress, returning processing');
    return 'processing';
  }

  // 기존 status 필드 처리
  switch (dbStatus) {
    case 'active':
      console.log('mapContentStatus - status active, returning approved');
      return 'approved';
    case 'pending':
    case 'processing':
    case 'approved':
    case 'rejected':
      console.log('mapContentStatus - status mapped directly:', dbStatus);
      return dbStatus as ContentStatus;
    default:
      // status 필드가 없을 때 다른 필드들로 상태 추론
      if (content) {
        // ai_gen_metadata가 있으면 처리 완료로 간주
        if (content.ai_gen_metadata && Object.keys(content.ai_gen_metadata).length > 0) {
          console.log('mapContentStatus - ai_gen_metadata exists, returning approved');
          return 'approved';
        }

        // created_at과 updated_at이 다르면 처리 중일 가능성
        if (content.created_at && content.updated_at && content.created_at !== content.updated_at) {
          const createdTime = new Date(content.created_at).getTime();
          const updatedTime = new Date(content.updated_at).getTime();
          const timeDiff = updatedTime - createdTime;

          // 30초 이상 차이나면 처리 완료로 간주
          if (timeDiff > 30000) {
            console.log('mapContentStatus - time difference > 30s, returning approved');
            return 'approved';
          } else {
            console.log('mapContentStatus - time difference < 30s, returning processing');
            return 'processing';
          }
        }
      }

      console.log('mapContentStatus - default case, returning pending');
      return 'pending';
  }
};

/**
 * API 콘텐츠를 통합 타입으로 변환
 */
export const unifyContent = (content: Record<string, any>): UnifiedContent => {
  console.log('unifyContent - input content:', content);
  console.log('unifyContent - status field:', content.status);
  console.log('unifyContent - processing_status field:', content.processing_status);

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

  // status 매핑 전후 로그
  const mappedStatus = mapContentStatus(content.status, content.processing_status, content);
  console.log('unifyContent - status mapping:', {
    originalStatus: content.status,
    mappedStatus: mappedStatus,
    processingStatus: content.processing_status,
    hasAiGenMetadata: !!content.ai_gen_metadata,
    aiGenMetadataKeys: content.ai_gen_metadata ? Object.keys(content.ai_gen_metadata) : [],
    timeDiff:
      content.created_at && content.updated_at
        ? new Date(content.updated_at).getTime() - new Date(content.created_at).getTime()
        : null,
  });

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
    status: mappedStatus, // status 매핑 함수 사용
  };

  switch (contentType) {
    case ContentType.IMAGE:
      return {
        ...baseContent,
        imageContent: {
          img_url: content.img_url,
          likes: content.likes,
          tagged_items: content.tagged_items,
        },
      };

    case ContentType.VIDEO:
      return {
        ...baseContent,
        videoContent: {
          video_url: content.video_url,
          details: content.details,
          chapters: content.chapters,
          transcript: content.transcript,
        },
      };

    case ContentType.LINK:
      return {
        ...baseContent,
        linkContent: {
          url: content.url,
          category: content.category,
          link_preview_metadata: content.link_preview_metadata,
          ai_gen_metadata: content.ai_gen_metadata,
        },
      };

    default:
      console.warn('unifyContent - unknown content type:', contentType, content);
      return baseContent;
  }
};

/**
 * UnifiedContent를 ContentItem으로 변환
 */
export const convertToContentItem = (content: UnifiedContent): ContentItem => {
  const baseItem: ContentItem = {
    id: content.id,
    type: content.type,
    title: content.title || 'Untitled',
    description: content.description || undefined,
    status: content.status, // status 필드 추가
  };

  if (isImageContent(content)) {
    return {
      ...baseItem,
      imageUrl: content.imageContent.img_url,
      likes: content.imageContent.likes,
    };
  }

  if (isVideoContent(content)) {
    return {
      ...baseItem,
      videoUrl: content.videoContent.video_url,
      thumbnailUrl: content.thumbnail_url || undefined,
      duration: content.videoContent.details?.duration_seconds,
    };
  }

  if (isLinkContent(content)) {
    return {
      ...baseItem,
      linkUrl: content.linkContent.url,
      category: content.linkContent.category,
      imageUrl: content.linkContent.link_preview_metadata?.image_url || undefined,
      // AI 생성 데이터 추가
      aiSummary: content.linkContent.ai_gen_metadata?.summary,
      aiQaList: content.linkContent.ai_gen_metadata?.qa_list?.map((qa: any) => ({
        question: qa.question || '',
        answer: qa.answer || '',
      })),
    };
  }

  return baseItem;
};
