import Image from 'next/image';
import Link from 'next/link';

interface ItemsGridProps {
  items: Array<{
    imageUrl: string;
    affilateUrl: string;
    name: string;
    brand: { name: string };
  }>;
}

export function ItemsGrid({ items }: ItemsGridProps) {
  return (
    <div className="flex flex-wrap justify-between">
      {items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className={`w-[48%] md:w-[48%] mb-4 md:mb-6 ${
            itemIndex === 0 ? 'mt-0' : 'md:mt-20'
          }`}
        >
          <Link
            href={item.affilateUrl}
            className="block relative aspect-square mb-2 w-full aspect-[3/4] bg-white"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill={true}
              style={{ objectFit: 'cover' }}
            />
          </Link>
          <p className="text-xs md:text-sm text-white/80 hover:underline">
            {item.brand.name.replace('_', ' ').toUpperCase()}
          </p>
          <h3 className="text-sm md:text-lg">{item.name}</h3>
        </div>
      ))}
    </div>
  );
}