import { useRef, useEffect, useCallback } from 'react';

export function useScrollMemory() {
  const lastScrollPositionRef = useRef({ x: 0, y: 0 });
  const isRestoringRef = useRef(false);

  // 스크롤 위치 저장
  const saveScrollPosition = useCallback((x: number, y: number) => {
    lastScrollPositionRef.current = { x, y };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', JSON.stringify({ x, y }));
    }
  }, []);

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('scrollPosition');
        if (saved) {
          const position = JSON.parse(saved);
          lastScrollPositionRef.current = position;
          isRestoringRef.current = true;
          return position;
        }
      }
    } catch (error) {
      console.warn('Failed to restore scroll position:', error);
    }
    return null;
  }, []);

  // 페이지 언로드 시 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(lastScrollPositionRef.current.x, lastScrollPositionRef.current.y);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [saveScrollPosition]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    isRestoring: isRestoringRef.current,
  };
} 