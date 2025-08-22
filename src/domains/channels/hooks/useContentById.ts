import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { queryKeys } from '@/lib/api/queryKeys';
import { convertToContentItem, unifyContent, ContentItem } from '@/lib/types/content';

export interface UseContentByIdParams {
  contentId: string;
  enabled?: boolean;
}

export interface UseContentByIdResult {
  content: ContentItem | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 개별 콘텐츠를 ID로 가져오는 훅
 */
export const useContentById = ({
  contentId,
  enabled = true,
}: UseContentByIdParams): UseContentByIdResult => {
  const query = useQuery({
    queryKey: [...queryKeys.contents.detail(contentId)],
    queryFn: async () => {
      try {
        // 콘텐츠 타입을 먼저 확인하기 위해 여러 API를 시도
        // 링크 콘텐츠 시도
        try {
          const linkResult = await ContentsService.getLinkContentContentsLinksContentIdGet(
            contentId,
          );
          if (linkResult) {
            const unifiedContent = unifyContent(linkResult);
            return convertToContentItem(unifiedContent);
          }
        } catch (error) {
          // 링크 콘텐츠가 아닌 경우 무시
        }

        // 이미지 콘텐츠 시도
        try {
          const imageResult = await ContentsService.getImageContentContentsImagesContentIdGet(
            contentId,
          );
          if (imageResult) {
            const unifiedContent = unifyContent(imageResult);
            return convertToContentItem(unifiedContent);
          }
        } catch (error) {
          // 이미지 콘텐츠가 아닌 경우 무시
        }

        // 비디오 콘텐츠 시도
        try {
          const videoResult = await ContentsService.getVideoContentContentsVideosContentIdGet(
            contentId,
          );
          if (videoResult) {
            const unifiedContent = unifyContent(videoResult);
            return convertToContentItem(unifiedContent);
          }
        } catch (error) {
          // 비디오 콘텐츠가 아닌 경우 무시
        }

        throw new Error('Content not found');
      } catch (error) {
        console.error('Error fetching content by ID:', error);
        throw error;
      }
    },
    enabled: enabled && !!contentId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    content: query.data || null,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
};
