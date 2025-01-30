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
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalScrollPosition = useRef(0);

  // period가 변경될 때마다 showAll 상태 초기화
  useEffect(() => {
    setShowAll(false);
  }, [period]);

  const handleToggleShowAll = () => {
    if (showAll) {
      // 접기: 원래 위치로 스크롤
      setShowAll(false);
      window.scrollTo({
        top: originalScrollPosition.current,
        behavior: "smooth",
      });
    } else {
      // 더보기: 현재 스크롤 위치 저장 후 새로운 아이템이 보이도록 스크롤
      originalScrollPosition.current = window.scrollY;
      setShowAll(true);

      // DOM 업데이트 후 스크롤 위치 조정
      requestAnimationFrame(() => {
        const lastVisibleItem = containerRef.current?.querySelector(
          ".grid > :nth-child(3)"
        );
        if (lastVisibleItem) {
          const rect = lastVisibleItem.getBoundingClientRect();
          const absoluteBottom = window.scrollY + rect.bottom;
          window.scrollTo({
            top: absoluteBottom - window.innerHeight / 3,
            behavior: "smooth",
          });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-zinc-800/50 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">{t.common.errors.dataFetchFailed}</div>
    );
  }

  const visibleItems = showAll ? items : items.slice(0, 3);

  return (
    <div className="space-y-6">
      <div ref={containerRef} className="grid md:grid-cols-3 gap-6">
        {visibleItems.map((item: TrendingItem) => (
          <ItemSpotCard
            key={item.id}
            image={item.image}
            title={item.title}
            brand={item.brand}
            views={item.views}
            requestCount={item.requestCount}
            exposureRate={item.exposureRate.toString()}
            trendingScore={item.trendingScore}
            featured={item.featured}
            imageDocId={item.imageDocId}
            itemDocId={item.itemDocId}
          />
        ))}
      </div>

      {items.length > 3 && (
        <div className="flex justify-center">
          <Button
            onClick={handleToggleShowAll}
            variant="ghost"
            className="group px-4 py-2"
          >
            {showAll ? t.common.actions.less : t.common.actions.more}
            {showAll ? (
              <ChevronUp className="ml-2 w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform duration-200" />
            ) : (
              <ArrowUpRight className="ml-2 w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
