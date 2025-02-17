'use client';

import { RelatedImage } from '../types';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RelatedSectionProps { 
  images: RelatedImage[];
  isLoading: boolean;
}

export function RelatedSection({  images, isLoading }: RelatedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const itemWidth = scrollContainerRef.current.clientWidth / 4;
    const scrollAmount = itemWidth * 4;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleImageClick = (imageDocId: string) => {
    router.push(`/details/${imageDocId}`);
  };

  return (
    <div className="w-full py-8">
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory"
        >
          {images.map((image) => (
            <div
              key={image.image_doc_id}
              className="flex-none w-[calc(25%-18px)] aspect-[4/5] snap-start cursor-pointer"
              onClick={() => handleImageClick(image.image_doc_id)}
            >
              <img
                src={image.image_url}
                alt=""
                className="w-full h-full object-cover rounded-lg transition-transform hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="pointer-events-auto text-white/80 hover:text-white hover:bg-transparent"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="pointer-events-auto text-white/80 hover:text-white hover:bg-transparent"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
} 