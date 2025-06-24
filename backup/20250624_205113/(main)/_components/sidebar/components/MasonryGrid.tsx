import Image from 'next/image';

interface MasonryGridProps {
  items: any[];
  mainImages: Array<{
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  }>;
  activeItem: any;
  type: 'items' | 'related';
}

interface MasonryCardProps {
  pattern: {
    height: number;
    aspectRatio: string;
    type: string;
  };
  imageSrc: string;
  isSpecial: boolean;
  label: string;
  activeItem: any;
  mainImages: Array<{
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  }>;
  idx: number;
  type: 'items' | 'related';
}

export function MasonryGrid({ items, mainImages, activeItem, type }: MasonryGridProps) {
  const patterns = [
    { height: 200, aspectRatio: '4/3', type: 'normal' },
    { height: 280, aspectRatio: '3/4', type: 'tall' },
    { height: 180, aspectRatio: '16/9', type: 'wide' },
    { height: 320, aspectRatio: '1/1', type: 'square' },
    { height: 240, aspectRatio: '5/4', type: 'normal' },
    { height: 300, aspectRatio: '2/3', type: 'tall' },
    { height: 160, aspectRatio: '3/2', type: 'normal' },
    { height: 260, aspectRatio: '4/5', type: 'tall' },
  ];

  return (
    <div className="w-full columns-2 gap-4 space-y-4">
      {items.map((_, idx) => {
        const pattern = patterns[idx % patterns.length];
        const isSpecial = type === 'items' ? idx % 7 === 0 : idx % 4 === 0;
        const imageSrc = isSpecial ? activeItem.imageUrl : 
          idx % 3 === 0 ? mainImages[0].src : mainImages[1].src;
        const label = isSpecial ? (type === 'items' ? 'FEATURED' : 'MAIN ITEM') : 'RELATED';

        return (
          <MasonryCard
            key={`${type}-${idx}`}
            pattern={pattern}
            imageSrc={imageSrc}
            isSpecial={isSpecial}
            label={label}
            activeItem={activeItem}
            mainImages={mainImages}
            idx={idx}
            type={type}
          />
        );
      })}
    </div>
  );
}

// 메이슨리 카드 컴포넌트
function MasonryCard({ pattern, imageSrc, isSpecial, label, activeItem, mainImages, idx, type }: MasonryCardProps) {
  return (
    <div className="break-inside-avoid rounded-xl overflow-hidden bg-[#222] hover:bg-[#2a2a2a] transition-all duration-300 hover:shadow-lg mb-4">
      <div className="relative">
        <Image
          src={imageSrc}
          alt={isSpecial ? activeItem.name : 'Related'}
          width={400}
          height={pattern.height}
          className={`w-full h-auto rounded-t-xl transition-all duration-300 hover:scale-105 ${
            isSpecial ? 'object-contain bg-white' : 'object-cover'
          }`}
          style={{ 
            maxHeight: pattern.height,
            minHeight: pattern.height * 0.8,
            aspectRatio: pattern.aspectRatio
          }}
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs text-white font-semibold">{label}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-3 h-3 rounded-full ${isSpecial ? 'bg-primary' : 'bg-[#F6FF4A]'}`}></div>
          <span className={`text-xs font-bold ${isSpecial ? 'text-primary' : 'text-[#F6FF4A]'}`}>
            {isSpecial ? activeItem.brand : 'KARINA'}
          </span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
          {isSpecial ? activeItem.name : mainImages[idx % mainImages.length].title}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2">
          {isSpecial 
            ? (type === 'items' ? "Signature style highlight with premium quality" : "Main item with related styling inspiration")
            : mainImages[idx % mainImages.length].subtitle
          }
        </p>
      </div>
    </div>
  );
} 