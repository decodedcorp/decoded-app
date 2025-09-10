import { useQuery } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseContentDetailParams {
  contentId: string;
  enabled?: boolean;
}

export function useContentDetail({ contentId, enabled = true }: UseContentDetailParams) {
  return useQuery({
    queryKey: queryKeys.contents.detail(contentId),
    queryFn: () => ContentsService.getContentContentsContentIdGet(contentId),
    enabled: enabled && !!contentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
