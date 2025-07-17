'use client';

import { ItemActions } from './item-actions';
import { useIsLike } from '@/backup/app/details/utils/hooks/isLike';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import { useLoginModalStore } from '@/components/auth/login-modal/store';

interface ItemActionsWrapperProps {
  initialLikeCount: number;
  imageId: string;
  layoutType: 'masonry' | 'list';
  render?: (props: {
    likeCount: number;
    isLiked: boolean;
    isLoading: boolean;
    onLike: () => void;
  }) => React.ReactNode;
}

const DEBOUNCE_DELAY = 300; // 300ms

export function ItemActionsWrapper({
  initialLikeCount,
  imageId,
  layoutType,
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
  
  // 상태 관리를 위한 refs
  const pendingLikeRef = useRef(false);
  const lastClickTimeRef = useRef(0);
  const isMountedRef = useRef(true);
  
  const setStatus = useStatusStore((state) => state.setStatus);
  const openLoginModal = useLoginModalStore((state) => state.openLoginModal);

  // 로그인 모달 열기 함수
  const handleOpenLoginModal = useCallback(() => {
    console.log('로그인 모달 열기 실행됨');
    const event = new CustomEvent('OPEN_MYPAGE_MODAL');
    window.dispatchEvent(event);
    openLoginModal();
  }, [openLoginModal]);

  // 좋아요 초기 상태 확인
  const checkInitialLikeStatus = useCallback(
    async (uid: string) => {
      try {
        const likeStatus = await checkLikeStatus('image', imageId, uid);
        if (isMountedRef.current) {
          setIsLiked(likeStatus);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    },
    [imageId, checkLikeStatus]
  );

  // userId가 변경될 때 좋아요 초기 상태를 확인
  useEffect(() => {
    isMountedRef.current = true;
    const storedUserId = sessionStorage.getItem('USER_DOC_ID');
    setUserId(storedUserId);

    if (storedUserId) {
      checkInitialLikeStatus(storedUserId);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [checkInitialLikeStatus]);

  // 좋아요 토글 핸들러
  const handleLike = useCallback(async () => {
    if (!userId) {
      console.warn('User is not logged in. Like action is disabled.');
      const isMobile = window.innerWidth < 768;
      
      setStatus({
        type: 'warning',
        messageKey: 'login',
        onLoginRequired: handleOpenLoginModal,
      });
      
      if (isMobile) {
        setTimeout(openLoginModal, 500);
      }
      return;
    }

    // 디바운싱: 연속 클릭 방지
    const now = Date.now();
    if (now - lastClickTimeRef.current < DEBOUNCE_DELAY || pendingLikeRef.current) {
      console.log('Like action debounced');
      return;
    }
    lastClickTimeRef.current = now;

    // 이미 진행 중인 요청이 있으면 무시
    if (pendingLikeRef.current) {
      console.log('Like action in progress');
      return;
    }

    pendingLikeRef.current = true;
    setIsLoading(true);
    
    try {
      // Optimistic UI 업데이트
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikeCount((prev) => (newLikeStatus ? prev + 1 : Math.max(0, prev - 1)));

      // 실제 API 호출
      await toggleLikeStatus('image', imageId, userId, isLiked);
      
      // 컴포넌트가 언마운트되었다면 상태 업데이트 중단
      if (!isMountedRef.current) return;

    } catch (error) {
      // 컴포넌트가 언마운트되었다면 상태 업데이트 중단
      if (!isMountedRef.current) return;

      // 에러 발생 시 상태 롤백
      console.error('Error toggling like:', error);
      setIsLiked(isLiked);
      setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
      
      setStatus({
        type: 'error',
        messageKey: 'default',
        message: '좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      pendingLikeRef.current = false;
    }
  }, [imageId, userId, isLiked, toggleLikeStatus, setStatus, handleOpenLoginModal, openLoginModal]);

  // initialLikeCount가 변경될 때 likeCount 업데이트
  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

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
      layoutType={layoutType}
    />
  );
}

