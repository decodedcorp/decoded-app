"use client";

import { useState, useRef, useEffect } from "react";
import { ItemSpotCard } from "../components/item-spot-card";
import { useTrendingItems } from "./hooks/use-trending-items";
import { cn } from "@/lib/utils/style";
import { ArrowUpRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumSpotClientProps, TrendingItem } from "../types";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function PremiumSpotClient({ period }: PremiumSpotClientProps) {
  const { t } = useLocaleContext();
  const { items, isLoading, error } = useTrendingItems(period);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // period가 변경될 때마다 보이는 아이템 수 초기화
  useEffect(() => {
    setVisibleCount(3);
  }, [period]);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, items.length));
  };

  const handleShowLess = () => {
    setVisibleCount(3);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full aspect-[4/3] bg-zinc-800/50 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">{t.common.errors.dataFetchFailed}</div>
    );
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const isShowingAll = visibleCount === items.length;

  return (
    <div className="space-y-6">
      <div 
        ref={containerRef} 
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
          "transition-all duration-300 ease-in-out"
        )}
      >
        {visibleItems.map((item: TrendingItem) => (
          <div key={item.id} className="w-full">
            <ItemSpotCard
              image={item.image}
              title={item.title || "Unnamed Item"}
              brand={item.brand}
              views={item.views}
              requestCount={item.requestCount}
              exposureRate={item.exposureRate.toString()}
              trendingScore={item.trendingScore}
              featured={item.featured}
              imageDocId={item.imageDocId}
              itemDocId={item.itemDocId}
            />
          </div>
        ))}
      </div>

      {items.length > 3 && (
        <div className="flex justify-center mt-8">
          <div className="w-40">
            <Button
              onClick={isShowingAll ? handleShowLess : handleShowMore}
              className="w-full px-4 py-2 text-sm text-zinc-400 hover:text-[#EAFD66] transition-colors border border-zinc-800 rounded-lg hover:border-[#EAFD66]/20"
              variant="ghost"
            >
              {isShowingAll ? t.common.actions.less : t.common.actions.more}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
