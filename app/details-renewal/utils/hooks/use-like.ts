'use client';

import { useCallback } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { networkManager } from '@/lib/network/network';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

// islike 엔드포인트용 DocType
type IsLikeDocType = 'images' | 'items';
// like/unlike 엔드포인트용 DocType
type LikeDocType = 'image' | 'item';

interface LikeResponse {
  status_code: number;
  description: string;
  data: null;
}

interface IsLikeResponse {
  status_code: number;
  description: string;
  data: boolean;
}

interface UseLikeProps {
  itemId: string;
  type: LikeDocType;
  initialLikeCount: number;
  initialIsLiked?: boolean;
}

interface LikeData {
  isLiked: boolean;
  likeCount: number;
}

interface NetworkError {
  errorCode: string;
  errorMessage: string;
  method: string;
  url: string;
  responseStatus?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초
const STALE_TIME = 0; // 캐시 무효화 시간을 0으로 설정하여 항상 최신 상태 유지
const GC_TIME = 1000 * 60 * 30; // 30분

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isNetworkError = (error: any): error is NetworkError => {
  return (
    error?.errorCode === 'ERR_NETWORK' || 
    error?.status === 500 ||
    error?.responseStatus === 500
  );
};

export function useLike({ itemId, type, initialLikeCount, initialIsLiked = false }: UseLikeProps) {
  const queryClient = useQueryClient();
  const setStatus = useStatusStore((state) => state.setStatus);
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('USER_DOC_ID') : null;

  // 좋아요 상태 조회
  const { data: likeData, refetch: refetchLikeStatus } = useQuery<LikeData>({
    queryKey: ['like', type, itemId, userId],
    queryFn: async () => {
      if (!userId) return { isLiked: false, likeCount: initialLikeCount };
      
      let retries = 0;
      const islikeDocType: IsLikeDocType = `${type}s` as IsLikeDocType;
      
      while (retries < MAX_RETRIES) {
        try {
          console.log(`Checking like status (attempt ${retries + 1}/${MAX_RETRIES})...`);
          const response = await networkManager.request<IsLikeResponse>(
            `user/${userId}/islike?doc_type=${islikeDocType}&doc_id=${itemId}`,
            'GET'
          );

          if (!response) {
            throw new Error('No response received');
          }

          if (response.status_code !== 200) {
            throw new Error(`Invalid status code: ${response.status_code}`);
          }

          // 응답 데이터 구조 검증
          if (typeof response.data !== 'boolean') {
            console.warn('Invalid response data type:', response.data);
            return { isLiked: initialIsLiked, likeCount: initialLikeCount };
          }

          const serverIsLiked = response.data;
          console.log('Successfully fetched like status:', serverIsLiked);
          
          return {
            isLiked: serverIsLiked,
            likeCount: initialLikeCount
          };
        } catch (error: any) {
          console.error('Error details:', {
            error,
            attempt: retries + 1,
            endpoint: `user/${userId}/islike?doc_type=${islikeDocType}&doc_id=${itemId}`,
            status: error?.responseStatus
          });

          if (isNetworkError(error)) {
            retries++;
            if (retries < MAX_RETRIES) {
              const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
              console.warn(`Retrying islike request in ${waitTime}ms (${retries}/${MAX_RETRIES})...`);
              await delay(waitTime);
              continue;
            }
          }
          return { isLiked: initialIsLiked, likeCount: initialLikeCount };
        }
      }
      return { isLiked: initialIsLiked, likeCount: initialLikeCount };
    },
    enabled: !!userId && !!itemId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    initialData: { isLiked: initialIsLiked, likeCount: initialLikeCount },
  });

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

      const currentIsLiked = likeData?.isLiked ?? false;
      let retries = 0;
      const endpoint = `user/${userId}/${currentIsLiked ? 'unlike' : 'like'}/${type}/${itemId}`;

      while (retries < MAX_RETRIES) {
        try {
          console.log(`Current like status: ${currentIsLiked}`);
          console.log(`Attempting to ${currentIsLiked ? 'unlike' : 'like'} (attempt ${retries + 1}/${MAX_RETRIES})...`);
          console.log('Sending request to:', endpoint);
          
          const response = await networkManager.request<LikeResponse>(
            endpoint,
            'POST'
          );

          if (!response) {
            throw new Error('No response received');
          }

          if (response.status_code !== 200) {
            throw new Error(`Invalid status code: ${response.status_code}`);
          }

          console.log('Successfully toggled like status');
          return response;
        } catch (error: any) {
          console.error('Error details:', {
            error,
            attempt: retries + 1,
            endpoint,
            type,
            isLiked: currentIsLiked,
            status: error?.status || error?.responseStatus
          });

          if (isNetworkError(error)) {
            retries++;
            if (retries < MAX_RETRIES) {
              const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
              console.warn(`Retrying like/unlike request in ${waitTime}ms (${retries}/${MAX_RETRIES})...`);
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

      const previousData = queryClient.getQueryData<LikeData>(['like', type, itemId, userId]);

      // Optimistic update
      queryClient.setQueryData<LikeData>(['like', type, itemId, userId], (old) => {
        if (!old) return { isLiked: false, likeCount: initialLikeCount };
        const newLikeCount = old.isLiked ? old.likeCount - 1 : old.likeCount + 1;
        return {
          isLiked: !old.isLiked,
          likeCount: newLikeCount
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['like', type, itemId, userId], context.previousData);
      }
      
      setStatus({
        type: 'error',
        message: '좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    },
    onSuccess: async () => {
      // 토글 성공 후 상태를 다시 확인하고 업데이트
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          // 상태 조회 전에 잠시 대기
          await delay(500);
          
          const { data } = await refetchLikeStatus();
          if (data) {
            const currentData = queryClient.getQueryData<LikeData>(['like', type, itemId, userId]);
            // 현재 상태 유지
            if (currentData) {
              queryClient.setQueryData(['like', type, itemId, userId], {
                isLiked: data.isLiked,
                likeCount: currentData.likeCount
              });
            }
            break;
          }
        } catch (error) {
          console.error('Error refetching like status:', error);
          retries++;
          if (retries < MAX_RETRIES) {
            const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
            await delay(waitTime);
            continue;
          }
        }
      }
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
    isLiked: likeData?.isLiked ?? initialIsLiked,
    likeCount: likeData?.likeCount ?? initialLikeCount,
    toggleLike: handleToggleLike,
    isLikeLoading: isPending,
  };
} 