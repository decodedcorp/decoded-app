'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { networkManager } from '@/lib/network/network';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/style';
import { Heart, TrendingUp } from 'lucide-react';

interface SearchResult {
  related_images?: {
    _id: string;
    img_url: string;
    title: string | null;
    upload_by: string;
    requested_items: Record<
      string,
      Array<{
        item_doc_id: string;
        position: {
          top: string;
          left: string;
        };
      }>
    >;
    like: number;
  }[];
  trending_images: {
    image: {
      _id: string;
      img_url: string;
      title: string | null;
      upload_by: string;
      requested_items: Record<
        string,
        Array<{
          item_doc_id: string;
          position: {
            top: string;
            left: string;
          };
        }>
      >;
      like: number;
    };
  }[];
  next_id?: string;
}

export function ImageCard({ image, onHover, hoveredId }: any) {
  if (image.img_url === undefined) {
    console.log('UNDEFINED', image);
  }
  const router = useRouter();
  const markers = image.requested_items
    ? Object.values(image.requested_items).flat()
    : [];

  const handleImageClick = () => {
    router.push(`/details/${image._id}`);
  };

  const handleMarkerClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    router.push(`/details/${image._id}?selectedItem=${itemId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => onHover(image._id)}
      onMouseLeave={() => onHover(null)}
      onClick={handleImageClick}
    >
      <div
        className={cn(
          'relative aspect-[4/5] rounded-xl overflow-hidden',
          'bg-zinc-900'
        )}
      >
        <Image
          src={image.img_url}
          alt={image.title || '이미지'}
          fill
          className={cn(
            'object-cover',
            'group-hover:scale-105',
            'transition-transform duration-300'
          )}
        />

        {/* 호버 오버레이 */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-300'
          )}
        />

        {/* 마커 표시 */}
        {hoveredId === image._id &&
          markers.map((marker: any) => (
            <div
              key={marker.item_doc_id}
              className="absolute z-30"
              style={{
                top: `${marker.position.top}%`,
                left: `${marker.position.left}%`,
                width: '20px',
                height: '20px',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={(e) => handleMarkerClick(e, marker.item_doc_id)}
            >
              {/* 중앙 점 */}
              <div className="absolute w-2 h-2 rounded-full bg-[#EAFD66]" />
              {/* 애니메이션되는 원 */}
              <div className="absolute w-full h-full rounded-full border-2 border-[#EAFD66] animate-ping opacity-75" />
            </div>
          ))}

        {/* 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-medium line-clamp-1">
            {image.title || '제목 없음'}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-white/60">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{image.like}</span>
            </div>
            <span className="text-xs text-white/60">
              {markers.length}개 아이템
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [result, setResult] = useState<SearchResult>();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSearchId, setHoveredSearchId] = useState<string | null>(null);
  const [hoveredTrendingId, setHoveredTrendingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      try {
        const response = await networkManager.request(
          `search?query=${encodeURIComponent(query)}`,
          'GET'
        );

        if (response.status_code === 200) {
          setResult(response.data);
        }
      } catch (error) {
        console.error('검색 결과 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-xl bg-zinc-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 검색 결과 섹션 */}
      {result?.related_images && result.related_images.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-medium text-white">검색 결과</h2>
            <span className="text-sm text-white/60">
              {result.related_images.length}개의 결과
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-6">
            {result.related_images.map((image) => (
              <ImageCard
                key={image._id}
                image={image}
                onHover={setHoveredSearchId}
                hoveredId={hoveredSearchId}
              />
            ))}
          </div>
        </section>
      )}

      {/* 결과가 없는 경우 */}
      {(!result?.related_images || result.related_images.length === 0) &&
        (!result?.trending_images || result.trending_images.length === 0) && (
          <div className="flex justify-center items-center h-48 text-white/60">
            검색 결과가 없습니다
          </div>
        )}
    </div>
  );
}
