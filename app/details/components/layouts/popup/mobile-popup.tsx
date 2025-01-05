import Image from 'next/image';
import { DetailPageState } from '@/types/model.d';
import { pretendardRegular, pretendardSemiBold } from '@/lib/constants/fonts';

interface MobilePopupProps {
  item: NonNullable<DetailPageState['itemList']>[number];
  index: number;
  isTouch: boolean;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
}

export function MobilePopup({ 
  item, 
  index,
  isTouch,
  hoveredItem,
  setHoveredItem 
}: MobilePopupProps) {
  return (
    <div
      className={`absolute border border-black/10 backdrop-blur-sm text-black rounded-md shadow-lg w-64 left-0 md:hidden 
        transition-all duration-300 ease-out overflow-hidden
        ${isTouch ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        ${hoveredItem === index ? 'z-50 bg-white' : 'z-10 bg-white'}`}
      onMouseEnter={() => setHoveredItem(index)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="flex flex-col">
        <div className="relative w-full h-[200px] bg-gray-50 rounded-t-md">
          <Image
            src={item.info.imageUrl ?? ''}
            alt={item.info.name}
            fill={true}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col p-3">
          <p className={`${pretendardSemiBold.className} text-sm mb-1`}>
            {item.info.name}
          </p>
          <p className={`${pretendardRegular.className} text-xs text-gray-600`}>
            {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
} 