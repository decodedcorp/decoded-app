import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LoadingSkeletonProps {
  kind: 'grid' | 'card' | 'text' | 'list' | 'profile' | 'feed' | 'channel' | 'comment' | 'tab';
  rows?: number;
  columns?: number; // grid용 컬럼 수
  className?: string;
  compact?: boolean; // 컴팩트 버전
}

/**
 * 통일된 스켈레톤 UI 컴포넌트
 * 실제 레이아웃과 동일한 크기 유지
 */
export function LoadingSkeleton({
  kind,
  rows = 3,
  columns = 4,
  className = '',
  compact = false
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (kind) {
      case 'grid':
        const gridCols = columns === 2 ? 'grid-cols-2' :
                        columns === 3 ? 'grid-cols-2 md:grid-cols-3' :
                        columns === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
                        'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
        return (
          <div className={`grid ${gridCols} gap-4`}>
            {Array.from({ length: rows * columns }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-800 rounded-xl animate-pulse" />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                {i === 0 && <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />}
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 border-b border-zinc-800 animate-pulse"
              >
                <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-zinc-800 rounded mb-1 w-1/4" />
                  <div className="h-2 bg-zinc-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-zinc-800 rounded-full" />
              <div className="space-y-2">
                <div className="h-6 bg-zinc-800 rounded w-32" />
                <div className="h-4 bg-zinc-800 rounded w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-800 rounded w-2/3" />
            </div>
          </div>
        );

      case 'feed':
        // 메인 피드용 포스트 카드 스켈레톤
        return (
          <div className="space-y-6">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded mb-1 w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="aspect-[4/3] bg-zinc-800 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'channel':
        // 채널 페이지용 스켈레톤
        return (
          <div className="space-y-6 animate-pulse">
            {/* 헤더 */}
            <div className="space-y-4">
              <div className="h-8 bg-zinc-800 rounded w-1/3" />
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                </div>
              </div>
            </div>
            {/* 콘텐츠 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
        );

      case 'comment':
        // 댓글 리스트용 스켈레톤
        return (
          <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 bg-zinc-800 rounded w-20" />
                    <div className="h-3 bg-zinc-800 rounded w-16" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'tab':
        // 탭 콘텐츠용 스켈레톤 (channels, bookmarks 등)
        return (
          <div className="space-y-4">
            {/* 탭 헤더 */}
            <div className="flex space-x-6 border-b border-zinc-800 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-zinc-800 rounded w-16 mb-4" />
              ))}
            </div>
            {/* 탭 콘텐츠 */}
            {compact ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-zinc-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-zinc-800 rounded-xl animate-pulse" />
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={cn('w-full', className)}>{renderSkeleton()}</div>;
}
