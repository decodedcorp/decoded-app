import Image from 'next/image';
import { HoverItem } from '@/types/model.d';

interface ListItemImageProps {
  item: HoverItem;
  isActive: boolean;
}

export function ListItemImage({ item, isActive }: ListItemImageProps) {
  const imageSize = 90;

  if (!item.info.imageUrl) {
    return (
      <div 
        className="relative bg-white/10 flex items-center justify-center shrink-0"
        style={{ width: imageSize, height: imageSize }}
      >
        <div className="text-xs text-white/40 uppercase">
          {item.info.category}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-white/10 shrink-0"
      style={{ width: imageSize, height: imageSize }}
    >
      <Image
        src={item.info.imageUrl}
        alt={item.info.name}
        width={imageSize}
        height={imageSize}
        className="w-full h-full object-cover"
        priority
        unoptimized
      />
    </div>
  );
} 