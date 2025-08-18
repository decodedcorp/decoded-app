import { useState, useEffect } from 'react';

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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        // 충분한 스크롤 거리가 있을 때만 방향 업데이트
        if (scrollDifference > threshold) {
          const direction = currentScrollY > lastScrollY ? 'down' : 'up';
          
          setScrollState({
            scrollY: currentScrollY,
            scrollDirection: direction,
            isScrolled: currentScrollY > 10,
            isAtTop: currentScrollY <= 10,
          });
          
          lastScrollY = currentScrollY;
        }
      }, debounceMs);
    };

    // 초기 상태 설정
    setScrollState({
      scrollY: window.scrollY,
      scrollDirection: null,
      isScrolled: window.scrollY > 10,
      isAtTop: window.scrollY <= 10,
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold, debounceMs]);

  return scrollState;
}