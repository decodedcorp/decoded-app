import Image from 'next/image';

interface ItemThumbnailListProps {
  items: Array<{
    id: number;
    label: string;
    brand: string;
    name: string;
    imageUrl: string;
  }>;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export function ItemThumbnailList({ items, activeIndex, onIndexChange }: ItemThumbnailListProps) {
  return (
    <div className="w-full flex items-center gap-4 overflow-x-auto mb-6 pb-2">
      {items.map((item, idx) => (
        <button
          key={item.id}
          className={`rounded-2xl p-1 transition-all border-2
            ${activeIndex === idx ? 'border-white bg-white' : 'border-transparent bg-[#333] opacity-60'}
            focus:outline-none`}
          style={{ minWidth: 120, minHeight: 120 }}
          onClick={() => onIndexChange(idx)}
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={120}
            height={120}
            className={`rounded-xl object-contain w-[120px] h-[120px] transition-all
              ${activeIndex === idx ? '' : 'grayscale brightness-75'}`}
            style={{ background: '#fff' }}
          />
        </button>
      ))}
    </div>
  );
} 