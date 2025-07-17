"use client";

import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";
import { Search } from "lucide-react";

interface ActivityHeaderProps {
  isLoading: boolean;
  isConnected: boolean;
  activityCount: number;
}

export function ActivityHeader({
  isLoading,
  activityCount,
}: ActivityHeaderProps) {
  const { t } = useLocaleContext();

  return (
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
            {isLoading
              ? t.home.discover.activityFeed.loading
              : t.home.discover.activityFeed.connected}
          </span>
        </div>
      </div>
    </div>
  );
}
