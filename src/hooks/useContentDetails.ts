import { useQuery } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseContentDetailsParams {
  contentId: string | null;
  enabled?: boolean;
}

interface ContentDetailsResult {
  content: any;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useContentDetails({
  contentId,
  enabled = true,
}: UseContentDetailsParams): ContentDetailsResult {
  const query = useQuery({
    queryKey: queryKeys.contents.detail(contentId || ''),
    queryFn: () => ContentsService.getLinkContentContentsLinksContentIdGet(contentId!),
    enabled: enabled && !!contentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return {
    content: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
