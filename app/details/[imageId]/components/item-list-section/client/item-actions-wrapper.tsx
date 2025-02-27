'use client';

import { ItemActions } from './item-actions';
import { useIsLike } from '@/app/details/utils/hooks/isLike';
import { useState, useEffect, useCallback } from 'react';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import { useLoginModalStore } from '@/components/auth/login-modal/store';

interface ItemActionsWrapperProps {
  initialLikeCount: number;
  imageId: string;
  render?: (props: {
    likeCount: number;
    isLiked: boolean;
    isLoading: boolean;
    onLike: () => void;
  }) => React.ReactNode;
}

export function ItemActionsWrapper({
  initialLikeCount,
  imageId,
  render,
}: ItemActionsWrapperProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const {
    checkInitialLikeStatus: checkLikeStatus,
    toggleLike: toggleLikeStatus,
  } = useIsLike();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  
  // 상태 모달 스토어와 인증 스토어 추가
  const setStatus = useStatusStore((state) => state.setStatus);
  const openLoginModal = useLoginModalStore((state) => state.openLoginModal);
  
  // 로그인 모달 열기 함수
  const handleOpenLoginModal = useCallback(() => {
    console.log('로그인 모달 열기 실행됨');
    
    // 여기에서 마이페이지 모달을 직접 열기
    const event = new CustomEvent('OPEN_MYPAGE_MODAL');
    window.dispatchEvent(event);
    
    // 원래 로그인 모달도 실행 (백업)
    openLoginModal();
  }, [openLoginModal]);

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
      
      // 모바일 환경인지 확인 (화면 크기 기준)
      const isMobile = window.innerWidth < 768;
      console.log('모바일 환경 여부:', isMobile);
      
      // 로그인 필요 모달 표시 추가
      setStatus({
        type: 'warning',
        messageKey: 'login',
        onLoginRequired: handleOpenLoginModal,
      });
      
      // 모바일에서는 직접 로그인 모달 열기 시도
      if (isMobile) {
        console.log('모바일 환경에서 직접 로그인 모달 열기 시도');
        setTimeout(() => {
          openLoginModal();
        }, 500);
      }
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
      
      // 에러 모달 표시
      setStatus({
        type: 'error',
        messageKey: 'default',
        message: '좋아요 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageId, userId, isLiked, toggleLikeStatus, setStatus, handleOpenLoginModal, openLoginModal]);

  if (render) {
    return render({
      likeCount,
      isLiked,
      isLoading,
      onLike: handleLike,
    });
  }

  return (
    <ItemActions
      likeCount={likeCount}
      isLiked={isLiked}
      isLoading={isLoading}
      onLike={handleLike}
    />
  );
}
