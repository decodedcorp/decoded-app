'use client';

import { useRef, useEffect, useCallback } from 'react';

import { RotateCcw, ChevronDown } from 'lucide-react';
import { useCommonTranslation } from '@/lib/i18n/hooks';

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
  customMessages?: {
    loadingMore?: string;
    retry?: string;
    serverError?: string;
    loadFailed?: string;
    serverIssueDetected?: string;
    viewMoreContent?: string;
  };
}

export function InfiniteScrollLoader({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  error,
  onRetry,
  className = '',
  scrollRoot,
  rootMargin = '800px', // 더 자연스러운 로딩을 위해 거리 조정
  threshold = 0.1,
  customMessages,
}: InfiniteScrollLoaderProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const translations = useCommonTranslation();

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
    <div ref={observerRef} className={`${className}`}>
      {error ? (
        // 에러 상태 - 향상된 에러 처리
        <div className="flex justify-center py-6">
          <div className="text-center">
            <div className="text-red-400 mb-3 text-sm">
              {(error as any)?.status >= 500
                ? customMessages?.serverError || translations.feed.infiniteScroll.serverError()
                : customMessages?.loadFailed || translations.feed.infiniteScroll.loadFailed()}
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={onRetry || fetchNextPage}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 text-sm font-medium border border-zinc-600 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{customMessages?.retry || translations.feed.infiniteScroll.retry()}</span>
              </button>
              {(error as any)?.status >= 500 && (
                <div className="text-xs text-gray-500 self-center">
                  {customMessages?.serverIssueDetected ||
                    translations.feed.infiniteScroll.serverIssueDetected()}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isFetchingNextPage ? (
        // 자연스러운 로딩 상태 - 새로운 애니메이션 적용
        <div className="flex justify-center py-6">
          <div className="flex items-center justify-center space-x-3 opacity-80">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#eafd66] rounded-full animate-infinite-scroll-dot"></div>
              <div className="w-2 h-2 bg-[#eafd66] rounded-full animate-infinite-scroll-dot"></div>
              <div className="w-2 h-2 bg-[#eafd66] rounded-full animate-infinite-scroll-dot"></div>
            </div>
            <span className="text-gray-400 text-sm">
              {customMessages?.loadingMore || translations.feed.infiniteScroll.loadingMore()}
            </span>
          </div>
        </div>
      ) : hasNextPage ? (
        // 더 많은 콘텐츠가 있을 때 심플한 스크롤 유도 UI
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2 text-gray-400">
              <ChevronDown className="w-4 h-4 animate-scroll-hint" />
              <span className="text-sm">
                {customMessages?.viewMoreContent ||
                  translations.feed.infiniteScroll.viewMoreContent()}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
