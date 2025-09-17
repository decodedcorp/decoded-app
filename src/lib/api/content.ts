import { notFound, redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { ContentItem } from '@/lib/types/contentTypes';

/**
 * 콘텐츠 데이터 가져오기 (캐싱 지원)
 */
export async function getContent(contentId: string): Promise<ContentItem> {
  try {
    // API에서 콘텐츠 가져오기
    const { ContentsService } = await import('@/api/generated/services/ContentsService');
    const response = await ContentsService.getContentContentsContentIdGet(contentId);

    if (!response) {
      notFound();
    }

    // ContentItem으로 변환 (임시로 기본 구조 반환)
    return {
      id: response.id,
      type: 'text' as const,
      title: response.title || 'Untitled',
      description: response.description || '',
      thumbnailUrl: response.thumbnail_url,
      author: 'Unknown',
      date: response.created_at || new Date().toISOString(),
      likes: 0,
      views: 0,
    };
  } catch (error) {
    console.error('Failed to fetch content:', error);
    notFound();
  }
}

/**
 * 콘텐츠와 채널 ID 정합성 검증
 */
export async function getContentWithValidation(params: {
  channelId: string;
  contentId: string;
}): Promise<ContentItem> {
  const content = await getContent(params.contentId);

  // 채널 ID 정합성 검증 (임시로 스킵)
  // TODO: 실제 채널 ID 검증 로직 구현 필요

  return content;
}

/**
 * 콘텐츠 캐시 무효화
 */
export async function revalidateContent(contentId: string): Promise<void> {
  revalidateTag(`content:${contentId}`);
}

/**
 * 채널의 콘텐츠 목록 가져오기
 */
export async function getChannelContents(
  channelId: string,
  page: number = 0,
  limit: number = 20,
): Promise<ContentItem[]> {
  try {
    const { ContentsService } = await import('@/api/generated/services/ContentsService');
    const response = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
      channelId,
      page,
      limit,
    );

    if (!response?.contents) {
      return [];
    }

    // ContentItem 배열로 변환 (임시로 기본 구조 반환)
    return response.contents.map((content) => ({
      id: content.id,
      type: 'text' as const,
      title: content.title || 'Untitled',
      description: content.description || '',
      thumbnailUrl: content.thumbnail_url,
      author: 'Unknown',
      date: content.created_at || new Date().toISOString(),
      likes: 0,
      views: 0,
    }));
  } catch (error) {
    console.error('Failed to fetch channel contents:', error);
    return [];
  }
}
