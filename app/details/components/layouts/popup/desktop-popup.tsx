import Image from 'next/image';
import { DetailPageState } from '@/types/model.d';
import { pretendardRegular, pretendardSemiBold } from '@/lib/constants/fonts';

interface DesktopPopupProps {
  item: NonNullable<DetailPageState['itemList']>[number];
  index: number;
  currentIndex: number | null;
}

export function DesktopPopup({ item, index, currentIndex }: DesktopPopupProps) {
  if (index !== currentIndex) return null;

  return (
    <div className="absolute bg-white text-black p-2 rounded-md shadow-lg z-10 w-64 left-full ml-2 top-1/2 -translate-y-1/2">
      <div className="flex flex-col">
        <div className="relative w-full h-[200px] bg-gray-50 rounded-md mb-2">
          <Image
            src={item.info.imageUrl ?? ''}
            alt={item.info.name}
            fill={true}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col p-2">
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