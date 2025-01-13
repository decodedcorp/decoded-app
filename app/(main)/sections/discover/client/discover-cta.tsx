'use client';

import { cn } from '@/lib/utils/style';

export function DiscoverCTA() {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        className={cn(
          'bg-white/5 text-white',
          'px-6 py-3 rounded-xl',
          'font-semibold tracking-wide',
          'hover:bg-white/10',
          'transition-all duration-200',
          'border border-white/10'
        )}
      >
        자세히 알아보기
      </button>
    </div>
  );
} 