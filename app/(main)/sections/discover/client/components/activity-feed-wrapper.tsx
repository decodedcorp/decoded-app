'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/style';

const ActivityFeed = dynamic(
  () => import('../activity-feed').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          'relative h-[580px] overflow-hidden rounded-2xl',
          'border border-zinc-800/50',
          'bg-zinc-900/30 backdrop-blur-sm'
        )}
      >
        {/* 로딩 상태 UI */}
      </div>
    ),
  }
);

export function ActivityFeedWrapper() {
  return <ActivityFeed />;
} 