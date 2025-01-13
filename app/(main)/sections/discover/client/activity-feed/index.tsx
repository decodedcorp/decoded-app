'use client';

import { cn } from '@/lib/utils/style';
import { ActivityCard } from './components/activity-card';
import { ActivityHeader } from './components/activity-header';
import { useActivityFeed } from './hooks/use-activity-feed';
import { Activity } from './utils/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function ActivityFeed() {
  const {
    activities,
    isLoading,
    isConnected,
    totalActivities,
    hasMoreActivities,
    onAnimationComplete,
    feedRef,
  } = useActivityFeed();

  return (
    <div
      className={cn(
        'relative h-[580px] overflow-hidden rounded-2xl',
        'border border-zinc-800/50',
        'bg-zinc-900/30 backdrop-blur-sm'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 z-20 pointer-events-none',
          'bg-gradient-to-b from-zinc-900/80 via-transparent to-zinc-900/80'
        )}
      />

      <ActivityHeader
        isLoading={isLoading}
        isConnected={isConnected}
        activityCount={totalActivities}
      />

      <div
        ref={feedRef}
        className="relative px-4 space-y-1.5 overflow-hidden mt-14"
      >
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="transform-gpu"
              onAnimationComplete={() => {
                if (activity === activities[activities.length - 1]) {
                  onAnimationComplete();
                }
              }}
            >
              <ActivityCard activity={activity} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
