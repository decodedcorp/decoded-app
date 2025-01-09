'use client';

import { cn } from '@/lib/utils/style';
import { Search, Share2, Sparkles } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          'flex-shrink-0',
          'w-10 h-10 rounded-xl',
          'bg-[#EAFD66]/10 text-[#EAFD66]',
          'flex items-center justify-center'
        )}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

export function FeatureList() {
  return (
    <div className="space-y-4">
      <FeatureItem
        icon={<Search className="w-5 h-5" />}
        title="이미지로 검색"
        description="찾고 싶은 제품이 있는 이미지를 공유하세요"
      />
      <FeatureItem
        icon={<Share2 className="w-5 h-5" />}
        title="정보 공유"
        description="다른 사용자들과 함께 제품 정보를 공유하세요"
      />
      <FeatureItem
        icon={<Sparkles className="w-5 h-5" />}
        title="포인트 획득"
        description="정확한 정보 제공으로 포인트를 획득하세요"
      />
    </div>
  );
} 