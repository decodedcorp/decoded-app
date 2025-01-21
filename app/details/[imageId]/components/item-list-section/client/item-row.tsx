'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

interface ItemRowProps {
  id: string;
  category: string;
  subCategory: string;
  imageUrl?: string;
}

export function ItemRow({ id, category, subCategory, imageUrl }: ItemRowProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get('selectedItem');
  const isSelected = selectedId === id;

  const handleItemClick = () => {
    const params = new URLSearchParams(searchParams);
    if (isSelected) {
      params.delete('selectedItem');
    } else {
      params.set('selectedItem', id);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      onClick={handleItemClick}
      className={cn(
        'flex items-center px-3 py-3.5 hover:bg-neutral-900 cursor-pointer group',
        isSelected && 'bg-neutral-900'
      )}
    >
      <div className="w-16 h-16 rounded bg-neutral-800 mr-3 overflow-hidden flex-shrink-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={category}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="text-xs text-neutral-400 font-medium">{category}</div>
        <div className="text-xs text-neutral-500">{subCategory}</div>
      </div>
      <div className="text-neutral-600 group-hover:text-neutral-400 transition-colors">
        <svg
          className={cn(
            'w-4 h-4 transition-transform',
            isSelected && 'rotate-90'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
