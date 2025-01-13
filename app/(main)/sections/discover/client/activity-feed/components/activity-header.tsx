'use client';

import { cn } from '@/lib/utils/style';
import { Search } from 'lucide-react';

interface ActivityHeaderProps {
  isLoading: boolean;
  activityCount: number;
}

export function ActivityHeader({
  isLoading,
  activityCount,
}: ActivityHeaderProps) {
  return (
    <div
      className={cn(
        'absolute top-0 inset-x-0 z-30',
        'p-4 border-b border-zinc-800/50',
        'bg-zinc-900/50 backdrop-blur-sm'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              'bg-[#EAFD66]',
              !isLoading && 'animate-pulse'
            )}
          />
          <span className="text-sm font-medium text-zinc-400">
            {isLoading ? '연결 중...' : '실시간 요청'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Search className="w-4 h-4" />
          <span>{activityCount} 검색 요청</span>
        </div>
      </div>
    </div>
  );
}
