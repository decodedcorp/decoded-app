import { useQueries } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { queryKeys } from '@/lib/api/queryKeys';
import { convertToContentItem, unifyContent, ContentItem } from '@/lib/types/content';

export interface UseContentsByIdsParams {
  contentIds: string[];
  enabled?: boolean;
}

export interface UseContentsByIdsResult {
  contents: (ContentItem | null)[];
  contentMap: Map<string, ContentItem>;
  isLoading: boolean;
  isLoadingAny: boolean;
  errors: (Error | null)[];
  hasErrors: boolean;
  refetchAll: () => void;
}

/**
 * 여러 콘텐츠를 ID 배열로 병렬 조회하는 훅
 */
export const useContentsByIds = ({
  contentIds,
  enabled = true,
}: UseContentsByIdsParams): UseContentsByIdsResult => {
  const queries = useQueries({
    queries: contentIds.map((contentId) => ({
      queryKey: [...queryKeys.contents.detail(contentId)],
      queryFn: async (): Promise<ContentItem | null> => {
        if (!contentId) return null;
        
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

          console.warn(`Content not found for ID: ${contentId}`);
          return null;
        } catch (error) {
          console.error(`Error fetching content by ID ${contentId}:`, error);
          throw error;
        }
      },
      enabled: enabled && !!contentId,
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retry: 1, // 여러 API 시도하므로 재시도는 1번만
    }))
  });

  // 결과 처리
  const contents = queries.map(query => query.data || null);
  const errors = queries.map(query => query.error as Error | null);
  const isLoadingArray = queries.map(query => query.isLoading);
  
  // 컨텐츠 맵 생성 (ID -> ContentItem)
  const contentMap = new Map<string, ContentItem>();
  contentIds.forEach((id, index) => {
    const content = contents[index];
    if (content) {
      contentMap.set(id, content);
    }
  });

  // 모든 쿼리가 로딩 완료되었는지 확인
  const isLoading = isLoadingArray.every(loading => loading);
  
  // 하나라도 로딩 중인지 확인
  const isLoadingAny = isLoadingArray.some(loading => loading);
  
  // 에러가 있는지 확인
  const hasErrors = errors.some(error => error !== null);
  
  // 모든 쿼리 다시 실행
  const refetchAll = () => {
    queries.forEach(query => {
      query.refetch();
    });
  };

  return {
    contents,
    contentMap,
    isLoading,
    isLoadingAny,
    errors,
    hasErrors,
    refetchAll,
  };
};