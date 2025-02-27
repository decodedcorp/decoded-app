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
      {images.map((image, index) => {
        // 이미지 URL이 없으면 렌더링하지 않음
        if (!image.image_url) {
          console.warn(`이미지 URL 누락: ${image.image_doc_id || 'unknown id'}`);
          return null;
        }
        
        return (
          <div
            key={`${image.image_doc_id || ''}-${index}`} // 고유한 키 보장
            onClick={() => navigateToDetail(image.image_doc_id)}
            className="aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
          >
            <Image
              src={image.image_url}
              alt={`스타일링 이미지 ${index + 1}`}
              width={300}
              height={400}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        );
      })}
    </div>
  );
} 