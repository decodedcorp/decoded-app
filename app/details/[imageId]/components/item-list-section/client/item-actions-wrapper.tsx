'use client';

import { ItemActions } from './item-actions';
import { useIsLike } from '@/app/details/utils/hooks/isLike';
import { useState, useEffect, useCallback } from 'react';

interface ItemActionsWrapperProps {
  initialLikeCount: number;
  imageId: string;
}

export function ItemActionsWrapper({
  initialLikeCount,
  imageId,
}: ItemActionsWrapperProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const {
    checkInitialLikeStatus: checkLikeStatus,
    toggleLike: toggleLikeStatus,
  } = useIsLike();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  // 좋아요 초기 상태 확인
  const checkInitialLikeStatus = useCallback(
    async (uid: string) => {
      try {
        const likeStatus = await checkLikeStatus('images', imageId, uid);
        setIsLiked(likeStatus);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    },
    [imageId, checkLikeStatus]
  );

  // userId가 변경될 때 좋아요 초기 상태를 확인
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('USER_DOC_ID');
    setUserId(storedUserId);

    if (storedUserId) {
      checkInitialLikeStatus(storedUserId);
    }
  }, [checkInitialLikeStatus]);

  // 좋아요 토글 핸들러
  const handleLike = useCallback(async () => {
    if (!userId) {
      console.warn('User is not logged in. Like action is disabled.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Optimistic UI 업데이트
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));

      // 실제 API 호출
      await toggleLikeStatus('image', imageId, userId, isLiked);
    } catch (error) {
      // 에러 발생 시 상태 롤백
      console.error('Error toggling like:', error);
      setIsLiked(isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    } finally {
      setIsLoading(false);
    }
  }, [imageId, userId, isLiked, toggleLikeStatus]);

  return (
    <ItemActions
      likeCount={likeCount}
      isLiked={isLiked}
      isLoading={isLoading}
      onLike={handleLike}
    />
  );
}
