'use client';

import { cn } from '@/lib/utils/style';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  rank: number;
  image: string;
  title: string;
  brand: string;
  likes: number;
  imageId: string;
  requestedItems?: Record<string, Array<{
    item_doc_id: string;
    position: {
      top: string;
      left: string;
    };
  }>>;
}

export function ProductCard({
  rank,
  image,
  title,
  brand,
  likes,
  imageId,
  requestedItems
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // 모든 position 값을 하나의 배열로 변환
  const markers = requestedItems 
    ? Object.values(requestedItems).flat()
    : [];

  const handleImageClick = () => {
    router.push(`/details/${imageId}`);
  };

  const handleMarkerClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation(); // 이미지 클릭 이벤트가 발생하지 않도록 방지
    router.push(`/details/${imageId}?selectedItem=${itemId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick}
    >
      {/* 이미지 컨테이너 */}
      <div
        className={cn(
          'relative aspect-[3/4] rounded-xl overflow-hidden',
          'bg-zinc-900',
          'mb-3'
        )}
      >
        {/* 순위 뱃지 */}
        <div
          className={cn(
            'absolute top-3 left-3 z-10',
            'w-8 h-8 rounded-lg',
            'bg-black/80 backdrop-blur-sm',
            'flex items-center justify-center',
            'text-sm font-bold',
            rank <= 3 ? 'text-[#EAFD66]' : 'text-white'
          )}
        >
          {rank}
        </div>

        {/* 이미지 */}
        <Image
          src={image}
          alt={title}
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

        {/* Hover Markers */}
        {isHovered && markers.map((marker) => (
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
              cursor: 'pointer'
            }}
            onClick={(e) => handleMarkerClick(e, marker.item_doc_id)}
          >
            {/* 중앙 점 */}
            <div className="absolute w-2 h-2 rounded-full bg-[#EAFD66]" />
            {/* 애니메이션되는 원 */}
            <div className="absolute w-full h-full rounded-full border-2 border-[#EAFD66] animate-ping opacity-75" />
          </div>
        ))}

        {/* 텍스트 정보 */}
        <div className="space-y-1 px-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-zinc-400">
              <Heart className="w-6 h-6" />
              <span>{likes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
