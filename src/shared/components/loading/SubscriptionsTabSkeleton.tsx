import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SubscriptionsTabSkeletonProps {
  className?: string;
  count?: number;
}

/**
 * 구독 탭 전용 스켈레톤
 * 4열 그리드 형태의 채널 카드들을 표시
 */
export function SubscriptionsTabSkeleton({
  className = '',
  count = 8,
}: SubscriptionsTabSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900/50 rounded-xl p-4 animate-pulse">
          {/* 채널 썸네일 */}
          <div className="w-full aspect-square bg-zinc-800 rounded-lg mb-3" />

          {/* 채널 정보 */}
          <div className="space-y-2">
            {/* 채널명 */}
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
            {/* 구독자 수 */}
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
