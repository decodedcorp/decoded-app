'use client';

import dynamic from 'next/dynamic';

const Counter = dynamic(() => import('./counter').then(mod => mod.Counter), {
  ssr: false
});

interface MetricItemProps {
  label: string;
  value: number;
  suffix?: string;
  isLoading?: boolean;
}

export function MetricItem({
  label,
  value,
  suffix = '',
  isLoading = false,
}: MetricItemProps) {
  return (
    <div className="text-center px-4">
      <div className="flex items-baseline justify-center gap-1 h-[40px] md:h-[48px]">
        {isLoading ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-bold text-zinc-700/50 animate-pulse">
              00
            </span>
            {suffix && (
              <span className="text-xl text-zinc-700/50 animate-pulse">
                {suffix}
              </span>
            )}
          </div>
        ) : value === 0 ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-bold text-[#EAFD66]">
              0
            </span>
            {suffix && (
              <span className="text-xl text-[#EAFD66]/70">{suffix}</span>
            )}
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <Counter
              from={0}
              to={value}
              className="text-3xl md:text-4xl font-bold text-[#EAFD66]"
            />
            {suffix && (
              <span className="text-xl text-[#EAFD66]/70">{suffix}</span>
            )}
          </div>
        )}
      </div>
      <p className="text-sm md:text-base text-zinc-400 mt-2">{label}</p>
    </div>
  );
}
