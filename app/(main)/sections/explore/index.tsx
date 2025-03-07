'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/style';
import { ChevronRight, Compass } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useExplore } from './use-explore';
import 'swiper/css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExploreKeyword } from '@/lib/api/requests/explore';
import { SWIPER_DEFAULT_CONFIG, SWIPER_BREAKPOINTS } from './config/swiper.config';
import { MemoizedSwiperSlide } from './components/swiper-slide';

// Add this interface at the top of the file
interface ExploreResponse {
  explore_images: ExploreKeyword[];
}

interface ExploreProps {
  position: 'left-main' | 'right-main';
  of: 'identity' | 'brand';
}

function Explore({ position, of }: ExploreProps) {
  const router = useRouter();
  const { images: data } = useExplore(of) as unknown as {
    images: ExploreResponse;
  };
  const [activeCategory, setActiveCategory] = useState('');
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const desktopSwiperRef = useRef<any>(null);
  const mobileSwiperRef = useRef<any>(null);

  const categories = useMemo(() => data?.explore_images || [], [data]);

  useEffect(() => {
    if (categories?.[0]?.keyword) {
      setActiveCategory(categories[0].keyword);
    }
  }, [categories]);

  const currentImages =
    categories?.find((cat) => cat.keyword === activeCategory)?.images || [];

  useEffect(() => {
    console.log('Current images:', currentImages);
  }, [currentImages]);

  const handleSlideClick = useCallback((imageDocId: string, index: number) => {
    if (!desktopSwiperRef.current?.swiper) return;

    const swiper = desktopSwiperRef.current.swiper;
    const isTransitioning = swiper.isAnimating;
    const slidesPerView = swiper.params.slidesPerView;
    const visibleSlides = [];
    
    // 현재 보이는 슬라이드들의 인덱스를 계산
    for (let i = 0; i < slidesPerView; i++) {
      const slideIndex = (swiper.realIndex + i) % currentImages.length;
      visibleSlides.push(slideIndex);
    }
    
    // 전환 중이면 클릭 무시
    if (isTransitioning) return;
    
    // 보이는 슬라이드가 아니면 슬라이드 이동만
    if (!visibleSlides.includes(index)) {
      swiper.slideToLoop(index);
      return;
    }
    
    // 보이는 슬라이드일 때만 디테일 페이지로 이동
    router.push(`/details/${imageDocId}`);
  }, [currentImages.length, router]);

  // 이전 슬라이드로 이동
  const goPrev = (isMobile: boolean = false) => {
    const swiper = isMobile ? mobileSwiperRef.current?.swiper : desktopSwiperRef.current?.swiper;
    if (swiper) {
      swiper.slidePrev();
    }
  };

  // 다음 슬라이드로 이동
  const goNext = (isMobile: boolean = false) => {
    const swiper = isMobile ? mobileSwiperRef.current?.swiper : desktopSwiperRef.current?.swiper;
    if (swiper) {
      swiper.slideNext();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Swiper의 slide 변경 이벤트를 감지하여 현재 보이는 슬라이드들을 추적
  const handleSlideChange = useCallback((swiper: any) => {
    const visibleSlides = [];
    const slidesPerView = swiper.params.slidesPerView;
    
    // 현재 보이는 슬라이드들의 인덱스를 계산
    for (let i = 0; i < slidesPerView; i++) {
      const slideIndex = (swiper.realIndex + i) % currentImages.length;
      visibleSlides.push(slideIndex);
    }
    
    setActiveIndices(visibleSlides);
  }, [currentImages.length]);

  if (!categories?.find((cat) => cat.keyword === activeCategory)) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 py-10 md:py-14 lg:py-16 relative">
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[#EAFD66]/5 to-transparent opacity-20 pointer-events-none rounded-3xl" />

      <div className="flex flex-col gap-6 md:gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3 md:space-y-4"
        >
          <h2 className="text-2xl font-bold text-white">
            Style Explorer
          </h2>
        </motion.div>

        <div
          className={cn(
            'hidden lg:block',
            position === 'right-main' ? 'lg:pl-4' : 'lg:pr-4'
          )}
        >
          <div
            className={cn(
              'grid gap-6 md:gap-8',
              position === 'right-main'
                ? 'grid-cols-1 lg:grid-cols-[3fr_0.9fr]'
                : 'grid-cols-1 lg:grid-cols-[0.9fr_3fr]'
            )}
          >
            <div
              className={cn(
                'flex flex-col gap-3 md:gap-4',
                position === 'right-main'
                  ? 'col-start-2 col-span-1 order-2 lg:pl-2'
                  : 'col-start-1 col-span-1 order-1 lg:pr-2'
              )}
            >
              {categories.map(({ keyword }) => (
                <motion.button
                  key={keyword}
                  onClick={() => setActiveCategory(keyword)}
                  className={cn(
                    'w-full px-5 py-4 rounded-2xl text-left transition-all duration-300',
                    'group relative overflow-hidden',
                    'border-2',
                    activeCategory === keyword
                      ? 'bg-gradient-to-r from-[#EAFD66]/10 to-transparent border-[#EAFD66]'
                      : 'bg-black/20 border-zinc-800 hover:border-[#EAFD66]/50'
                  )}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          'font-medium transition-colors duration-300',
                          activeCategory === keyword
                            ? 'text-[#EAFD66]'
                            : 'text-white'
                        )}
                      >
                        {keyword}
                      </span>
                      <ChevronRight
                        className={cn(
                          'w-5 h-5 transition-all duration-300',
                          activeCategory === keyword
                            ? 'text-[#EAFD66] translate-x-0'
                            : 'text-zinc-600 -translate-x-2'
                        )}
                      />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* 이미지 슬라이더 영역 */}
            <div
              className={cn(
                'overflow-hidden relative',
                position === 'right-main'
                  ? 'col-start-1 col-span-1 order-1 lg:pr-2'
                  : 'col-start-2 col-span-1 order-2 lg:pl-2'
              )}
            >
              {/* 왼쪽 화살표 인디케이터 */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <ChevronRight className="w-6 h-6 text-white/20 rotate-180" />
              </div>
              
              {/* 왼쪽 클릭 영역 */}
              <button
                onClick={() => goPrev()}
                className="absolute left-0 top-0 bottom-0 w-20 z-20 bg-transparent cursor-pointer"
                aria-label="Previous slide"
              />
              
              <Swiper
                ref={desktopSwiperRef}
                {...SWIPER_DEFAULT_CONFIG}
                modules={[Autoplay]}
                onSlideChange={(swiper) => handleSlideChange(swiper)}
                breakpoints={{
                  ...SWIPER_BREAKPOINTS,
                  1536: { // 2xl
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1920: { // 3xl
                    slidesPerView: 3,
                    spaceBetween: 32,
                  }
                }}
                className="w-full"
                watchSlidesProgress={true}
                preventInteractionOnTransition={true}
                allowTouchMove={true}
              >
                {currentImages.map((image, index) => (
                  <SwiperSlide key={image.image_doc_id}>
                    <MemoizedSwiperSlide
                      image={image}
                      index={index}
                      onClick={handleSlideClick}
                      isActive={activeIndices.includes(index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* 오른쪽 화살표 인디케이터 */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <ChevronRight className="w-6 h-6 text-white/20" />
              </div>

              {/* 오른쪽 클릭 영역 */}
              <button
                onClick={() => goNext()}
                className="absolute right-0 top-0 bottom-0 w-20 z-20 bg-transparent cursor-pointer"
                aria-label="Next slide"
              />
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-6">
          {categories.map((category) => (
            <div key={category.keyword} className="space-y-4">
              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => setActiveCategory(category.keyword)}
                  className={cn(
                    'w-full px-4 sm:px-5 py-4 sm:py-5 rounded-2xl text-left transition-all duration-200',
                    'group relative overflow-hidden',
                    'border-2',
                    activeCategory === category.keyword
                      ? 'bg-[#EAFD66]/10 border-[#EAFD66]'
                      : 'bg-black/20 border-zinc-800 hover:border-[#EAFD66]/50'
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'font-medium transition-colors duration-300',
                            activeCategory === category.keyword
                              ? 'text-[#EAFD66]'
                              : 'text-white'
                          )}
                        >
                          {category.keyword}
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          'w-5 h-5 transition-all duration-300',
                          activeCategory === category.keyword
                            ? 'text-[#EAFD66] translate-x-0'
                            : 'text-zinc-600 -translate-x-2'
                        )}
                      />
                    </div>
                  </div>
                </motion.button>
              </div>

              <Swiper
                modules={[Autoplay]}
                slidesPerView={1.05}
                spaceBetween={10}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  480: { slidesPerView: 1.3, spaceBetween: 12 },
                  640: { slidesPerView: 1.8, spaceBetween: 16 },
                }}
                className="w-full relative"
                ref={mobileSwiperRef}
                onSlideChange={(swiper) => handleSlideChange(swiper)}
                watchSlidesProgress={true}
                preventInteractionOnTransition={true}
                allowTouchMove={true}
              >
                {/* 모바일 왼쪽 화살표 인디케이터 */}
                <button
                  onClick={() => goPrev(true)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-transparent cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronRight className="w-4 h-4 text-white/20 rotate-180" />
                </button>

                {category.images.map((image, index) => (
                  <SwiperSlide key={image.image_doc_id}>
                    <MemoizedSwiperSlide
                      image={image}
                      index={index}
                      onClick={handleSlideClick}
                      isActive={activeIndices.includes(index)}
                    />
                  </SwiperSlide>
                ))}

                {/* 모바일 오른쪽 화살표 인디케이터 */}
                <button
                  onClick={() => goNext(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-transparent cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </button>
              </Swiper>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Explore;
