"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Link, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface Activity {
  type: "request_image";
  data: {
    image_url: string;
    item_len: number;
    request_by: string;
  };
  timestamp: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://dev.decoded.style/subscribe/events");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setIsLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const newActivity = JSON.parse(event.data) as Activity;
        setActivities((prev) => [newActivity, ...prev.slice(0, 7)]); // 최대 8개 유지
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsLoading(true);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

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
              key={activity.timestamp}
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
                "bg-[#EAFD66]",
                !isLoading && "animate-pulse"
              )}
            />
            <span className="text-sm font-medium text-zinc-400">
              {isLoading ? "연결 중..." : "실시간 요청"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Search className="w-4 h-4" />
            <span>{activities.length} 검색 요청</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  const { data, timestamp } = activity;

  return (
    <div
      className={cn(
        "bg-zinc-800/30 backdrop-blur-sm",
        "border border-zinc-700/30 rounded-xl",
        "p-4 transition-all duration-300",
        "hover:bg-zinc-700/30 hover:border-zinc-600/30"
      )}
    >
      <div className="flex gap-4">
        {/* 요청 이미지 */}
        <div
          className={cn(
            "w-16 h-16 rounded-lg overflow-hidden",
            "border border-zinc-700/50"
          )}
        >
          <img
            src={data.image_url}
            alt="Requested item"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 요청 정보 */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-white leading-snug">
                <span className="font-medium text-[#EAFD66]">
                  {data.request_by.slice(0, 8)}...
                </span>
                님이 이미지 검색을 요청했습니다
              </p>
              <p className="text-xs text-zinc-500">
                {new Date(timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityFeed;
