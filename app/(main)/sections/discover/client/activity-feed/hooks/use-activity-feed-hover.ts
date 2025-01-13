'use client';

import { RefObject, useCallback, useState } from 'react';

interface UseActivityFeedHoverProps {
  feedRef: RefObject<HTMLDivElement>;
}

export function useActivityFeedHover({ feedRef }: UseActivityFeedHoverProps) {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = useCallback(() => {
    console.log('🖱️ Mouse entered: Animation paused');
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    console.log('🖱️ Mouse left: Animation resumed');
    setIsPaused(false);
  }, []);

  // 이벤트 리스너 설정을 위한 초기화 함수
  const initializeHoverListeners = useCallback(() => {
    if (!feedRef.current) return;

    console.log('🎯 Initializing hover listeners');
    const element = feedRef.current;
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // 클린업 함수 반환
    return () => {
      console.log('🧹 Cleaning up hover listeners');
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [feedRef, handleMouseEnter, handleMouseLeave]);

  return {
    isPaused,
    initializeHoverListeners
  };
} 