'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/style';
import { Period, PeriodSelectorProps } from '../types';

export function PeriodSelector({
  period,
  onPeriodChange,
  availablePeriods,
}: PeriodSelectorProps) {
  if (availablePeriods.length === 0) return null;

  const handlePeriodClick = (selectedPeriod: Period) => {
    console.log('Current period:', period); // 디버깅용
    console.log('Selected period:', selectedPeriod); // 디버깅용
    onPeriodChange(selectedPeriod);
  };

  return (
    <div className="flex justify-end space-x-4">
      {availablePeriods.map((p) => (
        <Button
          key={p}
          variant="ghost"
          onClick={() => handlePeriodClick(p)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200',
            period === p
              ? 'bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
          )}
        >
          {p.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
