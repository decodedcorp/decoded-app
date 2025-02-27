'use client';

import { useState, useEffect, useMemo } from 'react';
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

  const categories = useMemo(() => data?.explore_images || [], [data]);

  useEffect(() => {
    if (categories?.[0]?.keyword) {
      setActiveCategory(categories[0].keyword);
    }
  }, [categories]);

  const currentImages =
    categories?.find((cat) => cat.keyword === activeCategory)?.images || [];

  const handleImageClick = (imageDocId: string) => {
    router.push(`/details/${imageDocId}`);
  };

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
                'overflow-hidden',
                position === 'right-main'
                  ? 'col-start-1 col-span-1 order-1 lg:pr-2'
                  : 'col-start-2 col-span-1 order-2 lg:pl-2'
              )}
            >
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1.2}
                spaceBetween={-20}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 10 },
                  768: { slidesPerView: 1, spaceBetween: 10 },
                  1024: { slidesPerView: 1.2, spaceBetween: -140 },
                  1280: { slidesPerView: 1.4, spaceBetween: -120 },
                  1440: { slidesPerView: 1.6, spaceBetween: -140 },
                  1600: { slidesPerView: 1.8, spaceBetween: -140 },
                  1920: { slidesPerView: 2, spaceBetween: -160 },
                }}
                className="w-full"
              >
                {currentImages.map((image, index) => (
                  <SwiperSlide
                    key={image.image_doc_id}
                    onClick={() => handleImageClick(image.image_doc_id)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="h-full"
                    >
                      <div className="aspect-[4/5] w-full bg-zinc-900 rounded-2xl overflow-hidden group relative cursor-pointer max-w-[420px]">
                        <Image
                          src={image.image_url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority={index < 3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {image.positions.map((position, idx) => (
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
                  </SwiperSlide>
                ))}
              </Swiper>
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
                className="w-full"
              >
                {category.images.map((image, index) => (
                  <SwiperSlide
                    key={image.image_doc_id}
                    onClick={() => handleImageClick(image.image_doc_id)}
                  >
                    <div className="aspect-[4/5] w-full h-full bg-zinc-900 rounded-2xl overflow-hidden group relative max-h-[500px]">
                      <Image
                        src={image.image_url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {image.positions.map((position, idx) => (
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
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Explore;
