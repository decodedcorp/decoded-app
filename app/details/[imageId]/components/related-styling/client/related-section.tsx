'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArtistHeader } from './artist-header';
import { SectionHeader } from './section-header';
import { motion } from 'framer-motion';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

// Define the RelatedImage interface directly in this file
interface RelatedImage {
  image_doc_id: string;
  image_url: string;
  title?: string;
  markers?: Array<{
    item_doc_id: string;
    position: {
      top: string;
      left: string;
    };
  }>;
}

interface RelatedSectionProps {
  images: RelatedImage[];
  isLoading: boolean;
  title?: string;
  artistId?: string;
  artistName?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function RelatedSection({
  images,
  isLoading,
  title = '관련 스타일링',
  artistId,
  artistName,
  onLoadMore,
  hasMore = false,
}: RelatedSectionProps) {
  const router = useRouter();
  
  // 유효한 이미지만 필터링
  const validImages = images.filter(image => image.image_url);
  
  // 무한 스크롤 훅 사용
  const { ref: loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: () => onLoadMore?.(),
  });

  const handleImageClick = (imageId: string) => {
    router.push(`/details/${imageId}`);
  };

  // 이미지 수에 따른 그리드 클래스 결정
  const getGridClass = (imageCount: number) => {
    if (imageCount === 1) return "grid-cols-1 max-w-md mx-auto";
    if (imageCount <= 3) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    if (imageCount <= 5) return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
  };

  return (
    <div className="w-full">
      {/* 헤더 영역 */}
      {artistId ? (
        <ArtistHeader artistId={artistId} artistName={artistName} />
      ) : (
        <SectionHeader title={title} />
      )}

      {/* 이미지 그리드 */}
      <div className={`grid ${getGridClass(validImages.length)} gap-4`}>
        {validImages.map((image, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.3,
              delay: Math.min(index * 0.05, 0.3) // 최대 0.3초 지연
            }}
            key={`${image.image_doc_id || 'img'}-${index}`}
            className="aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleImageClick(image.image_doc_id)}
          >
            <Image
              src={image.image_url}
              alt={`관련 이미지 ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              width={200}
              height={250}
              unoptimized
            />
          </motion.div>
        ))}
      </div>

      {/* 스크롤 감지 영역 - 화면에 들어오면 추가 로드 */}
      {hasMore && (
        <div 
          ref={loadMoreRef} 
          className="h-20 mt-8 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
          ) : (
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gray-700 to-transparent rounded-full" />
          )}
        </div>
      )}
    </div>
  );
}
