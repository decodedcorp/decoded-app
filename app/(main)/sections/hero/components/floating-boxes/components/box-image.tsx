import Image from 'next/image';
import { ImageInfo } from '../../../utils/types';

interface BoxImageProps {
  image: ImageInfo;
  isLarge: boolean;
}

export function BoxImage({ image, isLarge }: BoxImageProps) {
  const width = isLarge ? 264 : 132;
  const height = isLarge ? Math.floor(width * 1.25) : width;

  return (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={image.img_url!}
        alt={image.title || ''}
        fill
        className="object-fill w-full h-full"
        sizes={`${width}px`}
        priority
      />
    </div>
  );
} 