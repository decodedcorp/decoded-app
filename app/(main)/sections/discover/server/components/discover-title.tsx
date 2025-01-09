import { cn } from '@/lib/utils/style';
import { DiscoverBadge } from './discover-badge';

export function DiscoverTitle() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <DiscoverBadge />
        <h2
          className={cn(
            'text-3xl md:text-4xl font-bold',
            'bg-gradient-to-r from-[#EAFD66] to-[#EAFD66]/70',
            'bg-clip-text text-transparent'
          )}
        >
          여러분의 링크로
          <br />
          홍보해보세요
        </h2>
      </div>
      <p className="text-zinc-400 text-lg leading-relaxed">
        블로거, 크리에이터, 판매자님들의
        <br />
        제품 링크를 공유하고 홍보해보세요
      </p>
    </div>
  );
} 