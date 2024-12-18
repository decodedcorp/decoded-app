import { pretendardBold } from '@/lib/constants/fonts';
import { SingleImageView } from '@/app/details/components/single-image-view';
import { ImageInfo } from '@/types/model.d';

interface FeaturedImageListProps {
  images: {
    imageUrl: string;
    imgInfo: ImageInfo;
    imageDocId: string;
  }[];
}

export function FeaturedImageList({ images }: FeaturedImageListProps) {
  return (
    <>
      <div className="flex flex-col w-full mt-10 p-5 text-center">
        <p
          className={`${pretendardBold.className} text-lg md:text-4xl text-white mb-5 font-bold`}
        >
          {images[1].imgInfo.title}
        </p>
        <SingleImageView
          imageId={images[1].imageDocId}
          imageUrl={images[1].imageUrl}
          isFeatured={true}
        />
      </div>
    </>
  );
}
