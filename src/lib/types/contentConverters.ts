/**
 * Complex content conversion utilities
 */
import { ContentType } from '@/api/generated';

import { UnifiedContent, ContentItem } from './contentTypes';
import { mapContentStatus } from './contentMappers';
import { isImageContent, isVideoContent, isLinkContent } from './contentGuards';

/**
 * 새로운 API 구조에 맞는 콘텐츠 통합 함수
 */
export const unifyContent = (content: Record<string, any>): UnifiedContent => {
  console.log('unifyContent - input content:', content);
  console.log('unifyContent - status field:', content.status);

  // 필드 존재 여부로 타입 구분
  let contentType = ContentType.IMAGE; // 기본값

  // 링크 콘텐츠 확인 (link_preview_metadata나 ai_gen_metadata가 있으면 링크)
  if (content.link_preview_metadata || content.ai_gen_metadata || content.category) {
    contentType = ContentType.LINK;
  } else if (content.video_url && content.type === ContentType.VIDEO) {
    contentType = ContentType.VIDEO;
  } else if ((content.url || content.img_url) && content.type === ContentType.IMAGE) {
    contentType = ContentType.IMAGE;
  }

  console.log('unifyContent - detected contentType:', contentType);

  // status 매핑
  const mappedStatus = mapContentStatus(content.status);
  console.log('unifyContent - status mapping:', {
    originalStatus: content.status,
    mappedStatus: mappedStatus,
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
    status: mappedStatus,
  };

  switch (contentType) {
    case ContentType.IMAGE:
      return {
        ...baseContent,
        imageContent: {
          url: content.url || content.img_url, // 새로운 API는 url 필드 사용
          likes: content.likes,
          tagged_items: content.tagged_items,
        },
      };

    case ContentType.VIDEO:
      return {
        ...baseContent,
        videoContent: {
          video_url: content.video_url,
          details: content.details || {
            duration_seconds: content.duration_seconds || 0,
            width: content.width || 0,
            height: content.height || 0,
            format: content.format || null,
          },
          chapters: content.chapters || [],
          transcript: content.transcript || null,
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
          metadata: content.metadata,
        },
      };

    default:
      return baseContent;
  }
};

/**
 * URL에서 도메인 추출하여 기본 사이트명 생성
 */
const getDefaultSiteName = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.split('.')[0]; // 첫 번째 부분만 사용 (예: naver, youtube)
  } catch {
    return 'link';
  }
};

/**
 * 이미지 콘텐츠를 ContentItem으로 변환
 */
const convertImageContent = (content: UnifiedContent, baseItem: ContentItem): ContentItem => {
  if (!isImageContent(content)) return baseItem;

  console.log('[convertToContentItem] Processing as image content');
  return {
    ...baseItem,
    imageUrl: content.imageContent.url,
    likes: content.imageContent.likes,
    thumbnailUrl: content.thumbnail_url || undefined,
  };
};

/**
 * 비디오 콘텐츠를 ContentItem으로 변환
 */
const convertVideoContent = (content: UnifiedContent, baseItem: ContentItem): ContentItem => {
  if (!isVideoContent(content)) return baseItem;

  console.log('[convertToContentItem] Processing as video content');
  return {
    ...baseItem,
    videoUrl: content.videoContent.video_url,
    thumbnailUrl: content.thumbnail_url || undefined,
    duration: content.videoContent.details?.duration_seconds,
  };
};

/**
 * 링크 콘텐츠를 ContentItem으로 변환
 */
const convertLinkContent = (content: UnifiedContent, baseItem: ContentItem): ContentItem => {
  if (!isLinkContent(content)) return baseItem;

  console.log('[convertToContentItem] Processing as link content:', {
    id: content.id,
    url: content.linkContent.url,
    hasLinkPreview: !!content.linkContent.link_preview_metadata,
    hasAiGenMetadata: !!content.linkContent.ai_gen_metadata,
  });

  // 링크 프리뷰 메타데이터 처리
  const linkPreview = content.linkContent.link_preview_metadata
    ? {
        title: content.linkContent.link_preview_metadata.title || '링크 제목 없음',
        description: content.linkContent.link_preview_metadata.description || '설명이 없습니다.',
        imageUrl: content.linkContent.link_preview_metadata.img_url || content.thumbnail_url || '',
        downloadedImageUrl:
          content.linkContent.link_preview_metadata.downloaded_img_url ||
          content.thumbnail_url ||
          '',
        siteName:
          content.linkContent.link_preview_metadata.site_name ||
          getDefaultSiteName(content.linkContent.url),
      }
    : {
        title: '링크 제목 없음',
        description: '설명이 없습니다.',
        imageUrl: content.thumbnail_url || '',
        downloadedImageUrl: content.thumbnail_url || '',
        siteName: getDefaultSiteName(content.linkContent.url),
      };

  const result = {
    ...baseItem,
    linkUrl: content.linkContent.url,
    category: content.linkContent.category || undefined,
    thumbnailUrl: content.thumbnail_url || undefined,
    // AI 생성 메타데이터 추가
    aiSummary: content.linkContent.ai_gen_metadata?.summary,
    aiQaList: content.linkContent.ai_gen_metadata?.qa_list?.map((qa) => ({
      question: qa.question,
      answer: qa.answer,
    })),
    // 링크 프리뷰 메타데이터 추가
    linkPreview,
    // 추가 메타데이터
    metadata: content.linkContent.metadata
      ? {
          game: content.linkContent.metadata.game,
          topics: content.linkContent.metadata.topics,
          platforms: content.linkContent.metadata.platforms,
          contentType: content.linkContent.metadata.content_type,
          releaseYear: content.linkContent.metadata.release_year,
        }
      : undefined,
  };

  console.log('[convertToContentItem] Link content result:', {
    type: result.type,
    linkUrl: result.linkUrl,
    aiSummary: result.aiSummary,
    aiQaListCount: result.aiQaList?.length || 0,
    linkPreviewTitle: result.linkPreview?.title,
    linkPreviewSiteName: result.linkPreview?.siteName,
  });

  return result;
};

/**
 * Helper function to extract title based on content type
 */
const getContentTitle = (content: UnifiedContent): string => {
  // Link content - check link preview metadata first
  if (content.linkContent?.link_preview_metadata?.title) {
    return content.linkContent.link_preview_metadata.title;
  }
  
  // Video content - title might be directly available
  if (content.title && content.title !== 'Untitled') {
    return content.title;
  }
  
  // AI generated metadata
  if (content.linkContent?.ai_gen_metadata?.summary) {
    return content.linkContent.ai_gen_metadata.summary;
  }
  
  // Fallback
  return content.title || 'Untitled';
};

/**
 * UnifiedContent를 ContentItem으로 변환
 */
export const convertToContentItem = (content: UnifiedContent): ContentItem => {
  console.log('[convertToContentItem] Processing content:', {
    id: content.id,
    type: content.type,
    hasImageContent: !!content.imageContent,
    hasVideoContent: !!content.videoContent,
    hasLinkContent: !!content.linkContent,
  });

  const baseItem: ContentItem = {
    id: content.id,
    type: content.type,
    title: getContentTitle(content),
    description: content.description || undefined,
    status: content.status,
  };

  if (isImageContent(content)) {
    return convertImageContent(content, baseItem);
  }

  if (isVideoContent(content)) {
    return convertVideoContent(content, baseItem);
  }

  if (isLinkContent(content)) {
    return convertLinkContent(content, baseItem);
  }

  console.log('[convertToContentItem] Processing as unknown content type');
  return baseItem;
};
