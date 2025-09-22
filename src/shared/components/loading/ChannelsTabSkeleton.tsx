import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ChannelsTabSkeletonProps {
  className?: string;
  count?: number;
}

/**
 * 채널 탭 전용 스켈레톤
 * 3열 그리드 형태의 채널 카드들을 표시
 */
export function ChannelsTabSkeleton({ className = '', count = 6 }: ChannelsTabSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
          {/* 채널 헤더 */}
          <div className="flex items-center gap-4 mb-4">
            {/* 채널 썸네일 */}
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0" />

            {/* 채널 정보 */}
            <div className="flex-1 min-w-0">
              {/* 채널명 */}
              <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
              {/* 구독자 수 */}
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          </div>

          {/* 채널 설명 */}
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded" />
            <div className="h-3 bg-zinc-800 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
