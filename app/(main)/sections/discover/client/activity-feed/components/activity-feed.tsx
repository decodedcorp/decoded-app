"use client";

import { cn } from "@/lib/utils/style";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wifi, WifiOff } from "lucide-react";
import { useActivityFeed } from "../hooks/use-activity-feed";
import { ActivityCard } from "./activity-card";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function ActivityFeed() {
  const { t } = useLocaleContext();
  const { activities, isLoading, isConnected } = useActivityFeed();

  return (
    <div
      className={cn(
        "relative h-[600px] overflow-hidden rounded-2xl",
        "border border-zinc-800/50",
        "bg-zinc-900/30 backdrop-blur-sm"
      )}
    >
      {/* 그라데이션 오버레이 */}
      <div
        className={cn(
          "absolute inset-0 z-20 pointer-events-none",
          "bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900"
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
      <div
        className={cn(
          "absolute top-0 inset-x-0 z-30",
          "p-4 border-b border-zinc-800/50",
          "bg-zinc-900/50 backdrop-blur-sm"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-[#EAFD66]" : "bg-red-500",
                isConnected && !isLoading && "animate-pulse"
              )}
            />
            <span className="text-sm font-medium text-zinc-400">
              {isLoading
                ? t.home.discover.activityFeed.loading
                : isConnected
                ? t.home.discover.activityFeed.connected
                : t.home.discover.activityFeed.disconnected}
            </span>
            {isConnected ? (
              <Wifi className="w-4 h-4 text-[#EAFD66]" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Search className="w-4 h-4" />
            <span>
              {activities.length} {t.home.discover.activityFeed.searchRequests}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
