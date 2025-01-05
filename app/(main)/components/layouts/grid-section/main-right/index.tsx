import Image from 'next/image';
import Link from 'next/link';
import { ContentSection } from '../common/content-section';
import { PickInfo } from '@/types/model';

interface MainRightGridProps {
  pick: PickInfo;
}

export function MainRightGrid({ pick }: MainRightGridProps) {
  return (
    <div className="flex flex-col md:flex-row-reverse w-full md:min-w-[1300px]">
      <div className="w-full md:w-1/2 md:ml-3 lg:ml-6">
        <div className="relative aspect-[3/4]">
          <Image
            src={pick.imageUrl}
            alt={pick.title}
            fill
            className="object-cover"
          />
          {pick.items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              href={item.affilateUrl}
              className="absolute bg-white/20 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base"
              style={{
                top: `${item.pos.top}`,
                left: `${item.pos.left}`,
              }}
            >
              {String.fromCharCode(65 + itemIndex)}
            </Link>
          ))}
        </div>
      </div>
      <ContentSection pick={pick} />
    </div>
  );
}