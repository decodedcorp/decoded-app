"use client";

import { cn } from "@/lib/utils/style";
import { ProductCard } from "./product-card";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { useTrendingImages } from "@/lib/hooks/use-trending-images";
import { useState } from "react";
import type { TrendingImage } from "@/lib/api/_types/trending";
import { Button } from "@/components/ui/button";

interface TrendingResponse {
  status_code: number;
  description: string;
  data: TrendingImage[];
}

type PeriodType = 'daily' | 'weekly' | 'monthly';

const ITEMS_PER_PAGE = 6;

const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: '일간', value: 'daily' },
  { label: '주간', value: 'weekly' },
  { label: '월간', value: 'monthly' },
];

export function ProductGrid() {
  const { t } = useLocaleContext();
  const [period, setPeriod] = useState<PeriodType>('daily');
  const { data, isLoading } = useTrendingImages({
    limit: 8,
    period
  });
  const [showAll, setShowAll] = useState(false);

  const trendingImages = (data as TrendingResponse | undefined)?.data ?? [];
  const displayedItems = showAll 
    ? trendingImages 
    : trendingImages.slice(0, ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <div 
            key={i} 
            className="aspect-[3/4] w-full rounded-xl bg-zinc-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!trendingImages.length) {
    return (
      <div className="flex justify-center items-center h-48 text-zinc-400">
        데이터가 없습니다
      </div>
    );
  }

  console.log('Trending Images:', trendingImages); // 데이터 확인용 로그

  return (
    <div className="space-y-6">

      {/* Content */}
      <div>
        {!trendingImages.length ? (
          <div className="flex justify-center items-center h-48 text-zinc-400">
            데이터가 없습니다
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayedItems.map((item: TrendingImage, index: number) => (
                <ProductCard
                  key={item.image._id}
                  rank={index + 1}
                  image={item.image.img_url}
                  title={item.image.title || '제목 없음'}
                  brand={item.image.upload_by}
                  likes={item.image.like}
                  imageId={item.image._id}
                  requestedItems={item.image.requested_items}
                />
              ))}
            </div>

            {trendingImages.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <div className="w-40">
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full px-4 py-2 text-sm text-zinc-400 hover:text-[#EAFD66] transition-colors border border-zinc-800 rounded-lg hover:border-[#EAFD66]/20"
                    variant="ghost"
                  >
                    {showAll ? t.common.actions.less : t.common.actions.more}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
