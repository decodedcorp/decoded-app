import { ItemDocument } from '@/types/model.d';
import { ImagePlaceholder } from '@/components/ui/icons/image-placeholder';
import Image from 'next/image';

interface ItemInfoSectionProps {
  item: ItemDocument;
  onProvideClick: () => void;
}

export default function ItemInfoSection({
  item,
  onProvideClick,
}: ItemInfoSectionProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 bg-gray-800 rounded-lg mb-4 overflow-hidden">
        {item.imgUrl ? (
          <Image
            src={item.imgUrl}
            alt="Item"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholder className="w-12 h-12 text-gray-600" />
          </div>
        )}
      </div>
      <h2 className="text-xl font-medium text-white mb-2">
        {item.metadata?.name || item.metadata?.category}
      </h2>
      <button
        onClick={onProvideClick}
        className="mt-4 px-4 py-2 bg-[#1A1A1A] text-[#EAFD66] rounded-full text-sm hover:bg-[#222222] transition-colors"
      >
        아이템 링크 제공
      </button>
    </div>
  );
}
