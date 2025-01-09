import { cn } from '@/lib/utils/style';
import { ImageInfo } from '../../../utils/types';

interface BoxInfoProps {
  image: ImageInfo;
  isLarge: boolean;
  isHovered: boolean;
}

export function BoxInfo({ image, isLarge, isHovered }: BoxInfoProps) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white',
        'transition-transform duration-200',
        isHovered ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <p className="text-xs truncate">{image.title || '제목 없음'}</p>
      {isLarge && image.style && (
        <p className="text-xs text-primary mt-1">{image.style}</p>
      )}
    </div>
  );
} 