import Image from 'next/image';
import { ImageInfo } from '../../../utils/types';
import { cn } from '@/lib/utils/style';

interface BoxImageProps {
  image: ImageInfo;
  isLarge: boolean;
  isHovered?: boolean;
}

export function BoxImage({ image, isLarge, isHovered }: BoxImageProps) {
  const blurAmount = isLarge ? 26 : 34;
  const opacity = isLarge ? 0.62 : 0.68;

  return (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={image.img_url!}
        alt={image.title || ''}
        fill
        className={cn(
          "object-cover w-full h-full",
          "transition-all duration-&lsqb;1200ms&rsqb; ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb; will-change-[filter,opacity]"
        )}
        style={{
          filter: isHovered ? 'none' : `blur(${blurAmount}px)`,
          opacity: isHovered ? 1 : opacity
        }}
        sizes={isLarge ? '264px' : '132px'}
        priority
        unoptimized
      />
    </div>
  );
} 