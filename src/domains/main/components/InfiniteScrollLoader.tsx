'use client';

import { useRef, useEffect, useCallback } from 'react';

import { RotateCcw, ChevronDown } from 'lucide-react';

interface InfiniteScrollLoaderProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
  scrollRoot?: Element | null; // Custom scroll container
  rootMargin?: string; // Custom root margin for pre-loading
  threshold?: number; // Custom intersection threshold
}

export function InfiniteScrollLoader({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  error,
  onRetry,
  className = '',
  scrollRoot,
  rootMargin = '1200px', // Enhanced pre-loading distance
  threshold = 0.1,
}: InfiniteScrollLoaderProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !error) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, error, fetchNextPage]);

  // Enhanced Intersection Observer with performance optimizations
  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef) return;

    // Find scroll container (.content-wrapper) if not provided
    // Fallback to window if no specific container found
    const root = scrollRoot || document.querySelector('.content-wrapper') || null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to prevent blocking the main thread
          requestAnimationFrame(() => {
            handleFetchNextPage();
          });
        }
      },
      {
        root: root, // Use custom scroll container
        threshold, // Configurable threshold
        rootMargin, // Enhanced pre-loading margin
      },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [handleFetchNextPage, scrollRoot, rootMargin, threshold]);

  // 더 이상 로드할 페이지가 없으면 렌더링하지 않음
  if (!hasNextPage && !error) return null;

  return (
    <div ref={observerRef} className={`flex justify-center py-8 ${className}`}>
      {error ? (
        // 에러 상태 - 향상된 에러 처리
        <div className="text-center">
          <div className="text-red-400 mb-3 text-sm">
            {(error as any)?.status >= 500 ? '서버 오류가 발생했어요' : '불러오기에 실패했어요'}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={onRetry || fetchNextPage}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 text-sm font-medium border border-zinc-600 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 시도</span>
            </button>
            {(error as any)?.status >= 500 && (
              <div className="text-xs text-gray-500 self-center">서버 문제가 감지되었어요</div>
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
          <span className="text-gray-400 text-sm font-medium">최신 콘텐츠를 불러오는 중</span>
        </div>
      ) : hasNextPage ? (
        // 더보기 버튼 - 사용자가 수동으로 로드할 수 있음
        <button
          onClick={handleFetchNextPage}
          className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-700 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-600 transition-all duration-200 text-sm font-medium border border-zinc-600 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <ChevronDown className="w-4 h-4" />
          <span>더 보기</span>
        </button>
      ) : null}
    </div>
  );
}
