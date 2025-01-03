"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Link } from "lucide-react";
import { useState, useEffect } from "react";

interface Activity {
  id: number;
  creator: string;
  category: string;
  reward: string;
  time: string;
  profileImage: string;
}

const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: 1,
    creator: "패션블로거 미나",
    category: "패션/의류",
    reward: "12.5",
    time: "방금 전",
    profileImage: "/images/profiles/1.jpg",
  },
  {
    id: 2,
    creator: "뷰티크리에이터 소희",
    category: "뷰티",
    reward: "12.5",
    time: "2분 전",
    profileImage: "/images/profiles/2.jpg",
  },
];

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 초기 활동 목록 설정 (최대 8개)
    setActivities(
      Array(8)
        .fill(null)
        .map((_, index) => ({
          ...SAMPLE_ACTIVITIES[index % 2],
          id: Date.now() - (8 - index) * 1000, // 고유 ID 생성
        }))
    );

    // 3초마다 새로운 활동 추가
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = {
          ...SAMPLE_ACTIVITIES[currentIndex % 2],
          id: Date.now(),
        };

        // 새 활동을 맨 앞에 추가하고 마지막 항목 제거
        const updated = [newActivity, ...prev.slice(0, -1)];
        return updated;
      });

      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

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
      <div className="relative p-4 space-y-4">
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
              <ActivityCard {...activity} />
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
                "bg-[#EAFD66] animate-pulse"
              )}
            />
            <span className="text-sm font-medium text-zinc-400">
              실시간 활동
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link className="w-4 h-4" />
            <span>2.3K 링크 공유됨</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  creator,
  category,
  reward,
  time,
  profileImage,
}: Activity) {
  return (
    <div
      className={cn(
        "bg-zinc-800/30 backdrop-blur-sm",
        "border border-zinc-700/30 rounded-xl",
        "p-4 transition-all duration-300",
        "hover:bg-zinc-700/30 hover:border-zinc-600/30"
      )}
    >
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <div
          className={cn(
            "w-10 h-10 rounded-full overflow-hidden",
            "border-2 border-[#EAFD66]/20"
          )}
        >
          <img
            src={profileImage}
            alt={creator}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 활동 정보 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white leading-snug">
            <span className="font-medium">{creator}</span>님이
            <span className="text-[#EAFD66]"> {category}</span> 카테고리에
            <br />
            링크를 제공했습니다
          </p>
          <p className="text-xs text-zinc-400 mt-1">{time}</p>
        </div>

        {/* 보상 금액 */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5",
            "bg-[#EAFD66]/10 rounded-lg"
          )}
        >
          <Coins className="w-4 h-4 text-[#EAFD66]" />
          <span className="text-[#EAFD66] font-medium">${reward}</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityFeed;
