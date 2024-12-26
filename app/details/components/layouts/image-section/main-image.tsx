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
    <div className="relative">
      <div
        className={`relative ${
          isItemDetail ? 'w-full h-full' : 'w-full max-w-screen-xl aspect-[3/4]'
        }`}
      >
        <Image
          src={imageUrl}
          alt={detailPageState.img?.title || ''}
          fill
          className={`${isItemDetail ? 'object-contain' : 'object-cover'}`}
          sizes={isItemDetail ? '40vw' : '(max-width: 768px) 100vw, 50vw'}
          priority={!isItemDetail}
        />
      </div>
      {!isItemDetail && (
        <div className="absolute bottom-4 right-4">
          <button className="bg-white px-4 py-2 rounded-md hover:bg-white/90 text-black text-sm font-medium transition-colors">
            아이템 추가 요청하기
          </button>
        </div>
      )}
    </div>
  );
}
