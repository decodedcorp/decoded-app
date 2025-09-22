import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CommentsTabSkeletonProps {
  className?: string;
  count?: number;
}

/**
 * 댓글 탭 전용 스켈레톤
 * 댓글 리스트 형태의 아이템들을 표시
 */
export function CommentsTabSkeleton({ className = '', count = 5 }: CommentsTabSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
          <div className="flex items-start gap-4">
            {/* 아바타 */}
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex-shrink-0" />

            {/* 댓글 내용 */}
            <div className="flex-1 min-w-0">
              {/* 사용자명/시간 */}
              <div className="h-4 bg-zinc-800 rounded w-1/4 mb-2" />
              {/* 댓글 텍스트 */}
              <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
