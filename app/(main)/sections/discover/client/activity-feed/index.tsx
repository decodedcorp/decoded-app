'use client';

import { cn } from '@/lib/utils/style';
import { ActivityCard } from './components/activity-card';
import { ActivityHeader } from './components/activity-header';
import { useActivityFeed } from './hooks/use-activity-feed';
import { useActivityFeedAnimation } from './hooks/use-activity-feed-animation';
import { Activity } from './types/activity';

export function ActivityFeed() {
  const {
    activities,
    isLoading,
    totalActivities,
    hasMoreActivities,
    onAnimationComplete,
    feedRef,
  } = useActivityFeed();

  // 애니메이션 훅 사용
  useActivityFeedAnimation({
    feedRef,
    hasMoreActivities,
    activities,
    onAnimationComplete,
  });

  return (
    <div
      className={cn(
        'relative h-[580px] overflow-hidden rounded-2xl',
        'border border-zinc-800/50',
        'bg-zinc-900/30 backdrop-blur-sm'
      )}
    >
      {/* 그라데이션 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 z-20 pointer-events-none',
          'bg-gradient-to-b from-zinc-900/80 via-transparent to-zinc-900/80'
        )}
      />

      {/* 상단 헤더 */}
      <ActivityHeader isLoading={isLoading} activityCount={totalActivities} />

      {/* 활동 피드 */}
      <div
        ref={feedRef}
        className="relative px-4 py-4 space-y-1.5 overflow-hidden"
      >
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            <ActivityCard activity={activity} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
