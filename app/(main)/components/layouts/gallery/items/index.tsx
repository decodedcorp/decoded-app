import Image from 'next/image';
import { pretendardBold } from '@/lib/constants/fonts';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ItemsGalleryProps {
  items: Array<{
    imageUrl: string;
    name: string;
    brand: string;
  }>;
}

export function ItemsGallery({ items }: ItemsGalleryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
      {items.map((item, index) => (
        <GalleryItem key={index} item={item} />
      ))}
    </div>
  );
}

interface GalleryItemProps {
  item: {
    imageUrl: string;
    name: string;
    brand: string;
  };
}

function GalleryItem({ item }: GalleryItemProps) {
  return (
    <div className="flex flex-col">
      <ImageContainer imageUrl={item.imageUrl} name={item.name} />
      <ItemInfo brand={item.brand} name={item.name} />
      <RelatedStyles />
    </div>
  );
}

function ImageContainer({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) {
  return (
    <div className="flex w-full">
      <div className="relative w-full pb-[100%]">
        <Image
          src={imageUrl}
          alt={name}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

function ItemInfo({ brand, name }: { brand: string; name: string }) {
  return (
    <div className="flex flex-col w-full mt-2 md:mt-4">
      <h2 className={`${pretendardBold.className} text-sm md:text-lg text-black`}>
        {brand.toUpperCase()}
      </h2>
      <h3 className={`${pretendardBold.className} text-xs md:text-lg text-black/50`}>
        {name.toUpperCase()}
      </h3>
    </div>
  );
}

function RelatedStyles() {
  return (
    <div className="flex cursor-pointer mt-2 md:mt-4 items-center">
      <p className={`${pretendardBold.className} text-xs md:text-md text-black/50`}>
        관련 스타일
      </p>
      <ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6 text-black/50" />
    </div>
  );
}
