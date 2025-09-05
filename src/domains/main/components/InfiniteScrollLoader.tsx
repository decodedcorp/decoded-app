'use client';

import { useRef, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface InfiniteScrollLoaderProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function InfiniteScrollLoader({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  error,
  onRetry,
  className = '',
}: InfiniteScrollLoaderProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer로 무한스크롤 구현
  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting && 
          hasNextPage && 
          !isFetchingNextPage && 
          !error
        ) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1, // 10% 보이면 트리거
        rootMargin: '100px', // 100px 미리 트리거 (더 부드러운 UX)
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, error]);

  // 더 이상 로드할 페이지가 없으면 렌더링하지 않음
  if (!hasNextPage && !error) return null;

  return (
    <div 
      ref={observerRef}
      className={`flex justify-center py-8 ${className}`}
    >
      {error ? (
        // 에러 상태 - 향상된 에러 처리
        <div className="text-center">
          <div className="text-red-400 mb-3 text-sm">
            {(error as any)?.status >= 500 
              ? 'Server error - please try again later' 
              : 'Failed to load more posts'}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={onRetry || fetchNextPage}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 text-sm font-medium border border-zinc-600 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            {(error as any)?.status >= 500 && (
              <div className="text-xs text-gray-500 self-center">
                Server issues detected
              </div>
            )}
          </div>
        </div>
      ) : isFetchingNextPage ? (
        // 로딩 상태 - 개선된 애니메이션
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#eafd66] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-[#eafd66] rounded-full animate-spin animation-delay-150"></div>
          </div>
          <span className="text-gray-400 text-sm font-medium">
            Loading more posts...
          </span>
        </div>
      ) : (
        // 기본 상태 - Intersection Observer를 위한 빈 영역
        <div className="h-4 w-full" />
      )}
    </div>
  );
}