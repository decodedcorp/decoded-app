'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
  threshold?: number;
  debounceTime?: number;
}

export function useInfiniteScroll({
  hasMore,
  isLoading = false,
  onLoadMore,
  threshold = 0.1,
  debounceTime = 200,
}: UseInfiniteScrollOptions) {
  // IntersectionObserver 설정
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
  });

  // 요소가 화면에 보일 때 데이터 로드
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const timer = setTimeout(() => {
        onLoadMore();
      }, debounceTime);
      
      return () => clearTimeout(timer);
    }
  }, [inView, hasMore, isLoading, onLoadMore, debounceTime]);

  return { ref, inView };
} 