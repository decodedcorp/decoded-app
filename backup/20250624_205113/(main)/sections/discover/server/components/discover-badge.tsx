import { cn } from '@/lib/utils/style';

export function DiscoverBadge() {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'px-2 py-1 rounded-lg text-sm',
          'bg-[#EAFD66]/10 text-[#EAFD66]',
          'font-medium'
        )}
      >
        For Creators
      </span>
    </div>
  );
} 