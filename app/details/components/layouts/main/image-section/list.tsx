import Link from 'next/link';
import Image from 'next/image';
import { DetailPageState } from '@/types/model.d';
import { pretendardSemiBold } from '@/lib/constants/fonts';

interface ImageListProps {
  detailPageState: DetailPageState;
  setCurrentIndex: (index: number | null) => void;
}

export function ImageList({
  detailPageState,
  setCurrentIndex,
}: ImageListProps) {
  return (
    <div className="flex-col w-full overflow-y-auto hidden lg:block">
      {detailPageState.itemList?.map((item, index) => (
        <Link
          href={item.info.affiliateUrl ?? '#'}
          className="p-2 m-2 border-b border-white/10 flex flex-row items-center hover:bg-white/10"
          key={index}
          onMouseOver={() => setCurrentIndex(index)}
          onMouseOut={() => setCurrentIndex(null)}
        >
          <div className="w-16 h-20 relative ml-4">
            <Image
              src={item.info.imageUrl ?? ''}
              alt={item.info.name}
              fill={true}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col w-full text-center overflow-clip">
            <div className="text-sm">
              {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
            </div>
            <div
              className={`text-center text-sm ${pretendardSemiBold.className}`}
            >
              {item.info.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
