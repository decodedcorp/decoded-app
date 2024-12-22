import Image from 'next/image';
import { DetailPageState } from '@/types/model.d';

interface ItemDetailPopupProps {
  item: NonNullable<DetailPageState['itemList']>[number];
  isVisible: boolean;
  position?: 'left' | 'right';
}

export function ItemDetailPopup({ item, isVisible, position = 'right' }: ItemDetailPopupProps) {
  return (
    <div 
      className={`absolute ${position === 'right' ? 'left-full' : 'right-full'} top-1/2 -translate-y-1/2 ${position === 'right' ? 'ml-2' : 'mr-2'} 
        transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white/80 border border-white/50 backdrop-blur-md px-3 py-2 rounded-lg w-[280px]">
        <div className="flex gap-3">
          <div className="relative w-[90px] h-[90px] bg-white/10 shrink-0 rounded overflow-hidden">
            {item.info.imageUrl ? (
              <Image
                src={item.info.imageUrl}
                alt={item.info.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-white/40 uppercase">{item.info.category}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="text-xs text-black/60 mb-1">
              {item.info.category?.toUpperCase()}
            </div>
            <div className="text-xs text-black/80 mb-1">
              {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
            </div>
            <div className="text-sm text-black truncate">
              {item.info.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 