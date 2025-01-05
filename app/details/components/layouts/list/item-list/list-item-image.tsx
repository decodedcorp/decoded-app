import { HoverItem } from '@/types/model.d';
import Image from 'next/image';
import { ImagePlaceholder } from '@/components/ui/icons/image-placeholder';

interface ListItemImageProps {
  item: HoverItem;
  isActive: boolean;
}

export function ListItemImage({ item, isActive }: ListItemImageProps) {
  const imgUrl = item.info?.item?.item?.img_url;

  return (
    <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={item.info?.item?.item?.metadata?.name || '아이템 이미지'}
          width={64}
          height={64}
          className={`
            w-full h-full object-cover transition-opacity duration-200
            ${isActive ? 'opacity-100' : 'opacity-80'}
          `}
        />
      ) : (
        <div className="w-full h-full bg-[#1A1A1A]/[0.5] flex items-center justify-center">
          <ImagePlaceholder />
        </div>
      )}
    </div>
  );
}
