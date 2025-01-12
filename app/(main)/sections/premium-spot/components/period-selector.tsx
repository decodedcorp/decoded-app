import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/style";

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  availablePeriods: Period[];
}

export function PeriodSelector({ period, onPeriodChange, availablePeriods }: PeriodSelectorProps) {
  if (availablePeriods.length === 0) return null;

  return (
    <div className="flex justify-end space-x-4">
      {availablePeriods.map((p) => (
        <Button
          key={p}
          onClick={() => onPeriodChange(p)}
          className={cn(
            'px-4 py-2 rounded uppercase',
            period === p ? 'bg-primary text-black' : 'bg-gray-900 text-white'
          )}
        >
          {p}
        </Button>
      ))}
    </div>
  );
} 