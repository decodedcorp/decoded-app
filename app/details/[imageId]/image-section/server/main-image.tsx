import { DetailPageState } from '@/types/model.d';
import Image from 'next/image';
import { AddItemButton } from '@/app/details/[imageId]/image-section/client/add-item-button';

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
  const imageDocId = detailPageState.itemList?.[0]?.imageDocId;
  const requestUrl = imageDocId ? `/request?imageId=${imageDocId}` : '/request';

  const itemPositions = Object.values(detailPageState.img?.items || {})
    .flat()
    .map(item => ({
      top: item.position?.top || "0",
      left: item.position?.left || "0"
    }));

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
        <div className="absolute top-4 right-4 z-20">
          <AddItemButton 
            requestUrl={requestUrl}
            imageId={imageDocId || ''}
            imageUrl={imageUrl}
            itemPositions={itemPositions}
          />
        </div>
      )}
    </div>
  );
}
