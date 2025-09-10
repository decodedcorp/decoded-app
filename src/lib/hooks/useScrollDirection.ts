import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  debounceMs?: number;
}

interface ScrollState {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isScrolled: boolean;
  isAtTop: boolean;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}): ScrollState {
  const { threshold = 10, debounceMs = 10 } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    isScrolled: false,
    isAtTop: true,
  });

  // useRef를 사용하여 최신 값 유지
  const lastScrollY = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleScroll = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);

      // 충분한 스크롤 거리가 있을 때만 방향 업데이트
      if (scrollDifference > threshold) {
        const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';

        setScrollState((prevState) => {
          // 상태가 실제로 변경될 때만 업데이트
          if (
            prevState.scrollY !== currentScrollY ||
            prevState.scrollDirection !== direction ||
            prevState.isScrolled !== currentScrollY > 10 ||
            prevState.isAtTop !== currentScrollY <= 10
          ) {
            return {
              scrollY: currentScrollY,
              scrollDirection: direction,
              isScrolled: currentScrollY > 10,
              isAtTop: currentScrollY <= 10,
            };
          }
          return prevState;
        });

        lastScrollY.current = currentScrollY;
      }
    }, debounceMs);
  }, [threshold, debounceMs]);

  useEffect(() => {
    // 초기 상태 설정
    const initialScrollY = window.scrollY;
    lastScrollY.current = initialScrollY;

    setScrollState({
      scrollY: initialScrollY,
      scrollDirection: null,
      isScrolled: initialScrollY > 10,
      isAtTop: initialScrollY <= 10,
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [handleScroll]);

  return scrollState;
}
