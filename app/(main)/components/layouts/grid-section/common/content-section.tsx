import Image from 'next/image';
import { ItemsGrid } from './items-grid';
import { PickInfo } from '@/types/model.d';

interface ContentSectionProps {
  pick: PickInfo;
}

export function ContentSection({ pick }: ContentSectionProps) {
  return (
    <div className="w-full md:w-1/2 flex flex-col space-y-4 md:space-y-6 mt-4 md:mt-0">
      <div className="flex flex-col">
        <div className="w-full md:w-1/2">
          <h2 className="text-xl md:text-2xl mb-2 md:mb-4">{pick.title}</h2>
          <p className="text-sm md:text-md text-white/80 mb-4 md:mb-6">
            {pick.description}
          </p>
        </div>
        <div className="flex items-center mb-4 md:mb-6">
          <div className="flex items-center w-[24px] h-[24px] md:w-[30px] md:h-[30px] relative">
            <Image
              src={pick.imageUrl}
              alt={pick.title}
              fill={true}
              style={{ objectFit: 'cover' }}
              className="rounded-full mr-2 md:mr-3"
            />
          </div>
          <span className="ml-2 md:ml-4 text-sm md:text-base">
            {pick.artist}
          </span>
        </div>
      </div>
      <ItemsGrid items={pick.items} />
    </div>
  );
}