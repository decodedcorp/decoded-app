'use client';

import { cn } from '@/lib/utils/style';
import { PremiumSpotClient } from '../client/premium-spot-client';
import { Period, PeriodSelector } from '../components/period-selector';
import { useState, useEffect } from 'react';
import { useAvailablePeriods } from '../client/hooks/use-available-periods';

export function PremiumSpotServer() {
  const [period, setPeriod] = useState<Period>('weekly');
  const { availablePeriods, isLoading } = useAvailablePeriods();

  useEffect(() => {
    if (!isLoading && availablePeriods.length > 0) {
      // If daily is available, use it, otherwise keep weekly as default
      if (availablePeriods.includes('daily')) {
        setPeriod('daily');
      }
    }
  }, [isLoading, availablePeriods]);

  return (
    <section className="container mx-auto px-4">
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden',
          'border border-zinc-800/50'
        )}
      >
        <div className="relative z-10 p-8 md:p-12 space-y-12">
          {/* 헤더 */}
          <div className="max-w-2xl space-y-4">
            <h2
              className={cn(
                'text-3xl md:text-4xl font-bold',
                'bg-gradient-to-r from-[#EAFD66] to-[#EAFD66]/70',
                'bg-clip-text text-transparent'
              )}
            >
              인기 아이템의
              <br />
              링크를 제공해보세요
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              많은 사람들이 찾는 아이템에 링크를 제공하고
              <br />더 높은 노출 기회를 얻으세요
            </p>
          </div>
          {/* Period Selector */}
          {!isLoading && (
            <PeriodSelector
              period={period}
              onPeriodChange={setPeriod}
              availablePeriods={availablePeriods}
            />
          )}

          {/* 인기 아이템 그리드 */}
          <PremiumSpotClient period={period} onPeriodChange={setPeriod} />
        </div>

        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </section>
  );
}
