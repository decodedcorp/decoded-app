import { cn } from '@/lib/utils/style';
import { DiscoverContent } from './components/discover-content';

export function DiscoverServer() {
  return (
    <section className="container mx-auto px-4">
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden',
          'border border-zinc-800/50'
        )}
      >
        <DiscoverContent />


        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div
          className={cn(
            'absolute top-0 right-0 w-1/2 h-full',
            'bg-gradient-to-l from-[#EAFD66]/5 to-transparent'
          )}
        />
      </div>
    </section>
  );
}
