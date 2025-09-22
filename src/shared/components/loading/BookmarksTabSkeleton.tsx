import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BookmarksTabSkeletonProps {
  className?: string;
  count?: number;
}

/**
 * 북마크 탭 전용 스켈레톤
 * 리스트 형태의 북마크 아이템들을 표시
 */
export function BookmarksTabSkeleton({ className = '', count = 5 }: BookmarksTabSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            {/* 썸네일 */}
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0" />

            {/* 콘텐츠 정보 */}
            <div className="flex-1 min-w-0">
              {/* 제목 */}
              <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
              {/* 설명 */}
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>

            {/* 액션 버튼 영역 */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
