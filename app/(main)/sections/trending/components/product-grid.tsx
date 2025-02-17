'use client';

import { cn } from '@/lib/utils/style';
import { ProductCard } from './product-card';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { useTrendingImages } from '@/lib/hooks/use-trending-images';
import { useState } from 'react';
import type { TrendingImage } from '@/lib/api/_types/trending';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface TrendingResponse {
  status_code: number;
  description: string;
  data: TrendingImage[];
}

interface ProductGridProps {
  slideCount: number;
}

const ITEMS_PER_PAGE = 5;

export function ProductGrid({ slideCount }: ProductGridProps) {
  const { t } = useLocaleContext();
  const { data, isLoading } = useTrendingImages({
    limit: 12,
  });
  const [showAll, setShowAll] = useState(false);

  const trendingImages = (data as TrendingResponse | undefined)?.data ?? [];
  const displayedItems = showAll
    ? trendingImages
    : trendingImages.slice(slideCount, slideCount + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] w-full rounded-xl bg-zinc-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!trendingImages.length) {
    return (
      <div className="flex justify-center items-center h-48 text-zinc-400">
        데이터가 없습니다
      </div>
    );
  }

  console.log('Trending Images:', trendingImages); // 데이터 확인용 로그

  return (
    <div className="space-y-6">
      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        modules={[Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        breakpoints={{
          // 모바일
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          // 태블릿
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // 작은 데스크톱
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          // 큰 데스크톱
          1280: {
            slidesPerView: 5,
            spaceBetween: 24,
          }
        }}
        className="w-full px-4 md:px-8 lg:px-12"
      >
        {displayedItems.map((item: TrendingImage, index: number) => (
          <SwiperSlide key={item.image._id} className="pb-8">
            <div className="aspect-[4/5] w-full">
              <ProductCard
                rank={index + 1}
                image={item.image.img_url}
                title={item.image.title || '제목 없음'}
                brand={item.image.upload_by}
                likes={item.image.like}
                imageId={item.image._id}
                requestedItems={item.image.requested_items}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
