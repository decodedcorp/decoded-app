'use client';

import { cn } from '@/lib/utils/style';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityCard } from './components/activity-card';
import { ActivityHeader } from './components/activity-header';
import { useActivityFeed } from './hooks/use-activity-feed';

export function ActivityFeed() {
  const { activities, isLoading } = useActivityFeed();

  return (
    <div
      className={cn(
        'relative h-[600px] overflow-hidden rounded-2xl',
        'border border-zinc-800/50',
        'bg-zinc-900/30 backdrop-blur-sm'
      )}
    >
      {/* 그라데이션 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 z-20 pointer-events-none',
          'bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900'
        )}
      />

      {/* 활동 피드 */}
      <div className="relative p-4 space-y-4 mt-14">
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                height: { duration: 0.3 },
                y: { duration: 0.3 },
              }}
            >
              <ActivityCard activity={activity} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 상단 헤더 */}
      <ActivityHeader
        isLoading={isLoading}
        activityCount={activities.length}
      />
    </div>
  );
}

export default ActivityFeed; 