import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils/style';
import type { ExploreImage } from '../types';

interface SlideProps {
  image: ExploreImage;
  index: number;
  onClick: (id: string, index: number) => void;
  isActive: boolean;
}

export const MemoizedSwiperSlide = memo(function SwiperSlide({
  image,
  index,
  onClick,
  isActive,
}: SlideProps) {
  return (
    <button 
      onClick={() => onClick(image.image_doc_id, index)} 
      className="w-full h-full text-left p-0 border-0 bg-transparent"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        <div
          className={cn(
            'aspect-[4/5] w-full bg-zinc-900 rounded-2xl overflow-hidden group relative cursor-pointer max-w-[380px]',
            isActive ? 'z-10' : 'z-0'
          )}
        >
          <Image
            src={image.image_url}
            alt={`Image ${index + 1}`}
            fill
            className="object-cover"
            priority={index < 3}
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {(image.positions ?? []).map((position, idx) => (
            <div
              key={`${image.image_doc_id}-${idx}`}
              className="absolute z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute w-2 h-2 rounded-full bg-[#EAFD66]" />
                <div className="absolute w-5 h-5 rounded-full border-2 border-[#EAFD66] animate-ping opacity-75" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </button>
  );
});
