import { Flame } from 'lucide-react';

export function TrendingHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-[#EAFD66]" />
        <h2 className="text-xl font-semibold text-white">트렌딩 나우</h2>
      </div>
      <p className="text-zinc-400">
        지금 가장 인기 있는 아이템을 확인하세요
      </p>
    </div>
  );
} 