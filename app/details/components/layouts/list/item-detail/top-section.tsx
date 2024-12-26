'use client';

import { HoverItem } from '@/types/model.d';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface TopSectionProps {
  item: HoverItem;
  onClose: () => void;
  isTransitioning: boolean;
}

export function TopSection({ item, onClose, isTransitioning }: TopSectionProps) {
  return (
    <div className="flex flex-col flex-shrink-0">
      {/* Back Button */}
      <div className="py-2">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
          disabled={isTransitioning}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-2">
        {/* Product Image */}
        <div className="w-[113px] h-[140px] bg-neutral-800 mb-4">
          {item.info.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={item.info.imageUrl}
                alt={item.info.name || ''}
                fill
                className="object-contain"
                sizes="113px"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              NO IMAGE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col items-center text-center w-full space-y-1.5">
          <div className="text-neutral-400 text-sm">
            {item.info.category || 'CATEGORY'}
          </div>
          <div className="text-xl font-medium text-white break-keep max-w-[80%]">
            {item.info.name || 'Product Name'}
          </div>
          <div className="text-base text-white/80 break-keep max-w-[80%]">
            {item.info.brands?.[0]?.replace(/_/g, ' ') || 'BRAND'}
          </div>
          {/* Item Info Button */}
          <button
            className="w-[127px] h-[38px] mt-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-sm"
            onClick={() => {}}
          >
            아이템 정보 제공
          </button>
        </div>
      </div>
    </div>
  );
} 