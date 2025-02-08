'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/style';
import {
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useExplore } from './use-explore';
import 'swiper/css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExploreKeyword } from '@/lib/api/requests/explore';

// Add this interface at the top of the file
interface ExploreResponse {
  explore_images: ExploreKeyword[];
}

// 카테고리 맵 정의
const CATEGORY_MAP: Record<string, { label: string; description: string }> = {
  general: {
    label: '일반',
    description: '일상적인 패션 스타일',
  },
  kpop: {
    label: 'K-POP',
    description: 'K-POP 아티스트들의 스타일',
  },
  rapper: {
    label: '래퍼',
    description: '래퍼들의 스트릿 스타일',
  },
};

function Explore() {
  const router = useRouter();
  const { images: data } = useExplore('identity') as unknown as { images: ExploreResponse };
  const [activeCategory, setActiveCategory] = useState('');

  const categories = useMemo(() => 
    data?.explore_images || [], 
    [data]
  );

  useEffect(() => {
    if (categories?.[0]?.keyword) {
      setActiveCategory(categories[0].keyword);
    }
  }, [categories]);

  // Update find operation to use categories array
  const currentImages = categories?.find(
    (cat) => cat.keyword === activeCategory
  )?.images || [];

  const handleImageClick = (imageDocId: string) => {
    router.push(`/details/${imageDocId}`);
  };

  if (!categories?.find(
    (cat) => cat.keyword === activeCategory
  )) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8 h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EAFD66]/10">
              <Compass className="w-5 h-5 text-[#EAFD66]" />
            </div>
            <h2 className="text-4xl font-bold text-white">Style Explorer</h2>
          </div>
          <p className="text-zinc-400 max-w-lg">
            다양한 스타일을 탐색하고 영감을 얻어보세요. 각 이미지의 아이템
            정보를 확인할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          {/* 왼쪽: 카테고리 네비게이션 */}
          <div className="w-full lg:w-[400px] lg:shrink-0 flex flex-col gap-6">
            {categories.map(({ keyword, images }) => (
              <motion.button
                key={keyword}
                onClick={() => setActiveCategory(keyword)}
                className={cn(
                  'w-full px-6 lg:px-8 py-6 lg:py-12 rounded-2xl text-left transition-all duration-200',
                  'group relative overflow-hidden flex-1',
                  'border-2',
                  activeCategory === keyword
                    ? 'bg-[#EAFD66]/10 border-[#EAFD66]'
                    : 'bg-black/20 border-zinc-800 hover:border-[#EAFD66]/50'
                )}
              >
                {/* 배경 효과 */}
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 transition-opacity duration-300',
                    'bg-gradient-to-r from-[#EAFD66]/5 to-transparent',
                    activeCategory === keyword && 'opacity-100'
                  )}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'font-medium transition-colors duration-300',
                          activeCategory === keyword
                            ? 'text-[#EAFD66]'
                            : 'text-white'
                        )}
                      >
                        {CATEGORY_MAP[keyword]?.label || keyword}
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-5 h-5 transition-all duration-300',
                        activeCategory === keyword
                          ? 'text-[#EAFD66] translate-x-0'
                          : 'text-zinc-600 -translate-x-2'
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      'text-sm transition-colors duration-300',
                      activeCategory === keyword ? 'text-zinc-300' : 'text-zinc-500'
                    )}
                  >
                    {CATEGORY_MAP[keyword]?.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 오른쪽: 아이템 슬라이더 */}
          <div className="flex-1 relative">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={24}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!absolute inset-0"
            >
              {currentImages.map((image, index) => (
                <SwiperSlide 
                  key={image.image_doc_id} 
                  className="h-full"
                  onClick={() => handleImageClick(image.image_doc_id)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full cursor-pointer"
                  >
                    <div className="relative h-full rounded-2xl overflow-hidden bg-zinc-900 group">
                      <Image
                        src={image.image_url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

                      {/* 마커 표시 - opacity 클래스 추가 */}
                      {image.positions.map((position, idx) => (
                        <div
                          key={`${image.image_doc_id}-${idx}`}
                          className="absolute z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            top: `${position.top}%`,
                            left: `${position.left}%`,
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div className="absolute w-2 h-2 rounded-full bg-[#EAFD66]" />
                          <div className="absolute w-5 h-5 rounded-full border-2 border-[#EAFD66] animate-ping opacity-75" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Explore;

