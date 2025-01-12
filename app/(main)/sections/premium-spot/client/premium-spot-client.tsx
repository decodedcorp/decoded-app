'use client';

import { useState, useRef } from 'react';
import { ItemSpotCard } from '../components/item-spot-card';
import { useTrendingItems } from './hooks/use-trending-items';
import { cn } from '@/lib/utils/style';
import { ArrowUpRight, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Period } from '../components/period-selector';

interface PremiumSpotClientProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

export function PremiumSpotClient({
  period,
  onPeriodChange,
}: PremiumSpotClientProps) {
  const { items, isLoading, error } = useTrendingItems(period);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalScrollPosition = useRef(0);

  const handleToggleShowAll = () => {
    if (showAll) {
      // 접기: 원래 위치로 스크롤
      setShowAll(false);
      window.scrollTo({
        top: originalScrollPosition.current,
        behavior: 'smooth',
      });
    } else {
      // 더보기: 현재 스크롤 위치 저장 후 새로운 아이템이 보이도록 스크롤
      originalScrollPosition.current = window.scrollY;
      setShowAll(true);
      setTimeout(() => {
        const lastVisibleItem = containerRef.current?.querySelector(
          '.grid > :nth-child(3)'
        );
        if (lastVisibleItem) {
          const rect = lastVisibleItem.getBoundingClientRect();
          const absoluteBottom = window.scrollY + rect.bottom;
          window.scrollTo({
            top: absoluteBottom - window.innerHeight / 3,
            behavior: 'smooth',
          });
        }
      }, 100);
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
      <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
    );
  }

  const displayedItems = showAll ? items : items?.slice(0, 3);
  const hasMoreItems = items && items.length >= 4;

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems?.map((item) => (
          <ItemSpotCard
            key={item.id}
            image={item.image}
            title={item.title}
            brand={item.brand}
            views={item.views}
            requestCount={item.requestCount}
            exposureRate={`${item.exposureRate.toFixed(1)}%`}
            trendingScore={item.trendingScore}
            // featured: item.trending_score > 30 인기 아이템,
            featured={item.featured}
            imageDocId={item.imageDocId}
            itemDocId={item.itemDocId}
          />
        ))}
      </div>

      {hasMoreItems && (
        <div className="flex">
          <Button
            onClick={handleToggleShowAll}
            className={cn(
              'group flex items-center gap-2',
              'bg-[#EAFD66] text-black',
              'px-6 py-6 rounded-xl',
              'font-semibold tracking-wide',
              'hover:bg-[#EAFD66]/90',
              'transition-all duration-200',
              'shadow-lg shadow-[#EAFD66]/20'
            )}
          >
            <span>{showAll ? '접기' : '인기 아이템 더보기'}</span>
            {showAll ? (
              <ChevronUp
                className={cn(
                  'w-4 h-4',
                  'transform group-hover:-translate-y-0.5',
                  'transition-transform duration-200'
                )}
              />
            ) : (
              <ArrowUpRight
                className={cn(
                  'w-4 h-4',
                  'transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                  'transition-transform duration-200'
                )}
              />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
