import { useState, useCallback } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { networkManager } from '@/lib/network/network';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

interface UseLikeProps {
  itemId: string;
  type: 'item' | 'image';
  initialLikeCount: number;
}

interface LikeResponse {
  status?: boolean;
  message?: string;
  status_code?: number;
  description?: string;
  data?: {
    is_like?: boolean;
  };
}

interface LikeCountResponse {
  count: number;
}

export function useLike({ itemId, type, initialLikeCount }: UseLikeProps) {
  const queryClient = useQueryClient();
  const setStatus = useStatusStore((state) => state.setStatus);
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('USER_DOC_ID') : null;

  // Query for getting initial like status
  const { data: isLiked = false } = useQuery<boolean>({
    queryKey: ['like', type, itemId, userId],
    queryFn: async () => {
      if (!userId) return false;
      
      try {
        // Check if user has already liked this item
        if (type === 'item') {
          const response = await networkManager.request<LikeResponse>(
            `user/${userId}/islike?doc_type=items&doc_id=${itemId}`,
            'GET'
          );
          return response?.data?.is_like || false;
        }

        const response = await networkManager.request<LikeResponse>(
          `${type}/like/status/${itemId}/${userId}`,
          'GET'
        );

        return response?.status || false;
      } catch (error) {
        console.error('Error checking like status:', error);
        return false;
      }
    },
    // Only run query if we have both userId and itemId
    enabled: !!userId && !!itemId,
    // Prevent background refetches
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Mutation for toggling like
  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      if (!userId) {
        setStatus({
          type: 'warning',
          message: '로그인이 필요한 기능입니다.',
        });
        throw new Error('User not logged in');
      }

      try {
        // Attempt to toggle like status
        const endpoint = type === 'item'
          ? `user/${userId}/${isLiked ? 'unlike' : 'like'}/item/${itemId}`
          : `${type}/like/${itemId}/${userId}`;

        const response = await networkManager.request<LikeResponse>(
          endpoint,
          'POST'
        );

        if (!response) {
          throw new Error('No response from server');
        }

        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['like', type, itemId, userId] });
      if (type !== 'item') {
        await queryClient.cancelQueries({ queryKey: ['likeCount', type, itemId] });
      }

      // Snapshot the previous values
      const previousLikeStatus = queryClient.getQueryData(['like', type, itemId, userId]);
      const previousCount = type === 'item' 
        ? initialLikeCount 
        : (queryClient.getQueryData(['likeCount', type, itemId]) as number ?? initialLikeCount);

      // Optimistically update the cache
      const newLikeStatus = !isLiked;
      queryClient.setQueryData(['like', type, itemId, userId], newLikeStatus);
      if (type !== 'item') {
        queryClient.setQueryData(
          ['likeCount', type, itemId], 
          (old: number) => (isLiked ? Math.max(0, (old - 1)) : (old + 1))
        );
      }

      return { previousLikeStatus, previousCount };
    },
    onError: (err, variables, context) => {
      // On error, roll back to the previous values
      if (context) {
        queryClient.setQueryData(['like', type, itemId, userId], context.previousLikeStatus);
        if (type !== 'item') {
          queryClient.setQueryData(['likeCount', type, itemId], context.previousCount);
        }
      }
      
      if (err instanceof Error && err.message !== 'Duplicate like action') {
        setStatus({
          type: 'error',
          message: '좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
        });
      }
      console.error('Error toggling like:', err);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['like', type, itemId, userId] });
      if (type !== 'item') {
        queryClient.invalidateQueries({ queryKey: ['likeCount', type, itemId] });
      }
    },
  });

  // Query for like count
  const { data: likeCount = initialLikeCount } = useQuery<number>({
    queryKey: ['likeCount', type, itemId],
    queryFn: async () => {
      try {
        if (type === 'item') {
          return initialLikeCount;
        }
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
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });

  const handleToggleLike = useCallback(() => {
    if (!userId) {
      setStatus({
        type: 'warning',
        message: '로그인이 필요한 기능입니다.',
      });
      return;
    }
    toggleLike();
  }, [toggleLike, userId, setStatus]);

  return {
    isLiked,
    likeCount,
    toggleLike: handleToggleLike,
  };
} 