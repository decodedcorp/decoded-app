import { useCallback, useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { networkManager } from '@/lib/network/network';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

interface UseLikeProps {
  itemId: string;
  type: 'item' | 'image';
  initialLikeCount: number;
}

interface LikeResponse {
  status_code: number;
  description: string;
  data: {
    is_like?: boolean;
  };
}

interface LikeCountResponse {
  count: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초
const STALE_TIME = 1000 * 60 * 5; // 5분
const GC_TIME = 1000 * 60 * 30; // 30분

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isNetworkError = (error: any): boolean => {
  return error?.message?.includes('Network') || 
         error?.message?.includes('Failed to fetch') ||
         error?.status === 0;
};

export function useLike({ itemId, type, initialLikeCount }: UseLikeProps) {
  const queryClient = useQueryClient();
  const setStatus = useStatusStore((state) => state.setStatus);
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('USER_DOC_ID') : null;
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 좋아요 상태 조회
  const { data: likeData } = useQuery({
    queryKey: ['like', type, itemId, userId],
    queryFn: async () => {
      if (!userId) return { isLiked: false };
      
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const response = await networkManager.request<LikeResponse>(
            `user/${userId}/islike?doc_type=${type}s&doc_id=${itemId}`,
            'GET'
          );

          if (!response || response.status_code !== 200) {
            throw new Error(`Invalid response: ${response?.status_code}`);
          }

          return {
            isLiked: Boolean(response.data?.is_like)
          };
        } catch (error: any) {
          if (isNetworkError(error)) {
            retries++;
            if (retries < MAX_RETRIES) {
              const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
              await delay(waitTime);
              continue;
            }
          }
          return { isLiked: false };
        }
      }
      return { isLiked: false };
    },
    enabled: !!userId && !!itemId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  // 좋아요 수 조회
  const { data: likeCountData } = useQuery({
    queryKey: ['likeCount', type, itemId],
    queryFn: async () => {
      if (type === 'item') return initialLikeCount;
      
      try {
        const response = await networkManager.request<LikeCountResponse>(
          `${type}/like/count/${itemId}`,
          'GET'
        );
        return response?.count ?? initialLikeCount;
      } catch (error) {
        console.error('Error fetching like count:', error);
        return initialLikeCount;
      }
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  // 좋아요 수 동기화
  useEffect(() => {
    if (likeCountData !== undefined) {
      setLikeCount(likeCountData);
    }
  }, [likeCountData]);

  // 좋아요 토글
  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: async () => {
      if (!userId) {
        setStatus({
          type: 'warning',
          message: '로그인이 필요한 기능입니다.',
        });
        throw new Error('User not logged in');
      }

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const endpoint = `user/${userId}/${likeData?.isLiked ? 'unlike' : 'like'}/${type}/${itemId}`;
          const response = await networkManager.request<LikeResponse>(
            endpoint,
            'POST'
          );

          if (!response || response.status_code !== 200) {
            throw new Error(`Invalid response: ${response?.status_code}`);
          }

          return response;
        } catch (error: any) {
          if (isNetworkError(error)) {
            retries++;
            if (retries < MAX_RETRIES) {
              const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
              await delay(waitTime);
              continue;
            }
          }
          throw error;
        }
      }
      throw new Error('Failed to toggle like status after max retries');
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['like', type, itemId, userId] });

      const previousData = queryClient.getQueryData(['like', type, itemId, userId]);

      // Optimistic update
      queryClient.setQueryData(['like', type, itemId, userId], (old: any) => ({
        ...old,
        isLiked: !old?.isLiked
      }));

      setLikeCount(prev => likeData?.isLiked ? prev - 1 : prev + 1);

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['like', type, itemId, userId], context.previousData);
        setLikeCount(initialLikeCount);
      }
      
      setStatus({
        type: 'error',
        message: '좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['like', type, itemId, userId] });
      queryClient.invalidateQueries({ queryKey: ['likeCount', type, itemId] });
    },
  });

  const handleToggleLike = useCallback(() => {
    if (!userId) {
      setStatus({
        type: 'warning',
        message: '로그인이 필요한 기능입니다.',
      });
      return;
    }
    
    if (isPending) return;
    
    toggleLike();
  }, [toggleLike, userId, setStatus, isPending]);

  return {
    isLiked: likeData?.isLiked ?? false,
    likeCount,
    toggleLike: handleToggleLike,
    isLikeLoading: isPending,
  };
} 