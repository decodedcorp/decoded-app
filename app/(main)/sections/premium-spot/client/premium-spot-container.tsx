'use client';

import { cn } from '@/lib/utils/style';
import { PremiumSpotClient } from '../client/premium-spot-client';
import { PeriodSelector } from '../components/period-selector';
import { Period } from '../types';
import { useState, useEffect } from 'react';
import { useAvailablePeriods } from '../client/hooks/use-available-periods';

export function PremiumSpotContainer() {
  const [period, setPeriod] = useState<Period | null>(null);
  const { availablePeriods, isLoading } = useAvailablePeriods();

  useEffect(() => {
    if (!isLoading && availablePeriods.length > 0 && !period) {
      setPeriod(availablePeriods[0]);
    }
  }, [isLoading, availablePeriods, period]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  return (
    <section className="container mx-auto px-4">
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden',
          'border border-zinc-800/50'
        )}
      >
        <div className="relative z-10 p-8 md:p-12 space-y-12">
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

          {!isLoading && availablePeriods.length > 0 && (
            <PeriodSelector
              period={period || availablePeriods[0]}
              onPeriodChange={handlePeriodChange}
              availablePeriods={availablePeriods}
            />
          )}

          {period && <PremiumSpotClient key={period} period={period} />}
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </section>
  );
}
