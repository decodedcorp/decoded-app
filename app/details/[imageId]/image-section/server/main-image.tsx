import { DetailPageState } from '@/types/model.d';
import Image from 'next/image';

interface MainImageProps {
  imageUrl: string;
  detailPageState: DetailPageState;
  isItemDetail?: boolean;
}

export function MainImage({
  imageUrl,
  detailPageState,
  isItemDetail = false,
}: MainImageProps) {
  return (
    <div className={`relative ${isItemDetail ? 'w-full h-full' : 'w-auto'}`}>
      <Image
        src={imageUrl}
        alt={detailPageState.img?.title || ''}
        width={1}
        height={1}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100vh - 10rem)',
        }}
        className={`object-contain max-h-[calc(100vh-4rem)]`}
        sizes={isItemDetail ? '40vw' : '100vw'}
        priority={!isItemDetail}
      />
    </div>
  );
}
