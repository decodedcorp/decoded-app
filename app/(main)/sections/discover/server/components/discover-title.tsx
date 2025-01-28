import { cn } from '@/lib/utils/style';
import { DiscoverBadge } from './discover-badge';

export function DiscoverTitle() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <DiscoverBadge />
        <h2
          className={cn(
            'text-5xl md:text-4xl font-bold'
          )}
        >
          여러분의 링크로 홍보해보세요
        </h2>
      </div>
      <p className="text-zinc-400 text-base leading-relaxed">
        블로거, 크리에이터, 판매자님들의 제품 링크를 공유하고 홍보해보세요
      </p>
    </div>
  );
} 