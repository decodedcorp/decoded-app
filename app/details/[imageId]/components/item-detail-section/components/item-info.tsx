import Image from 'next/image';
import type { ItemDetailData } from '../types';

interface ItemInfoProps {
  data: ItemDetailData;
}

export function ItemInfo({ data }: ItemInfoProps) {
  return (
    <>
      <div className="w-[5rem] h-[5rem] bg-white mb-3 border border-neutral-800 rounded-lg overflow-hidden">
        {data.docs.img_url ? (
          <Image
            src={data.docs.img_url}
            alt={data.docs.metadata.name || ''}
            width={240}
            height={240}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
          </div>
        )}
      </div>

      <div className="text-neutral-500 text-xs mb-1.5">
        {data.docs.metadata.category}
      </div>

      <div className="text-white text-xs font-bold mb-1.5">
        {data.metadata?.brand || 'Unknown Brand'}
      </div>

      <div className="text-white text-base mb-2">
        {data.docs.metadata.name}
      </div>
    </>
  );
} 