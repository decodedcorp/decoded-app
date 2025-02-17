'use client';

import Image from 'next/image';
import { RelatedImage } from '../types';
import { useNavigateToDetail } from '@/lib/hooks/common/useNavigateToDetail';

interface RelatedImageGridProps {
  images: RelatedImage[];
}

export function RelatedImageGrid({ images }: RelatedImageGridProps) {
  const navigateToDetail = useNavigateToDetail();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.image_doc_id}
          onClick={() => navigateToDetail(image.image_doc_id)}
          className="aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
        >
          <Image
            src={image.image_url}
            alt="Related styling image"
            width={300}
            height={400}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
} 