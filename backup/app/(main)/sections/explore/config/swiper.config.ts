// app/(main)/sections/explore/config/swiper.config.ts
import type { SwiperOptions } from 'swiper/types';

// Swiper 설정에 대한 타입 정의
export interface SwiperBreakpoint {
  slidesPerView: number;
  spaceBetween: number;
}

export interface SwiperConfig {
  speed: number;
  allowTouchMove: boolean;
  resistance: boolean;
  resistanceRatio: number;
  threshold: number;
  loop: boolean;
  slidesPerView: number;
  spaceBetween: number;
  watchSlidesProgress: boolean;
  observer: boolean;
  observeParents: boolean;
  preloadImages: boolean;
  lazy: {
    loadPrevNext: boolean;
    loadPrevNextAmount: number;
  };
  touchRatio: number;
  touchAngle: number;
  grabCursor: boolean;
  preventInteractionOnTransition: boolean;
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
    pauseOnMouseEnter: boolean;
  };
  breakpoints?: Record<number, SwiperBreakpoint>;
}

// 기본 breakpoint 계산 함수
function calculateBreakpoint(width: number): SwiperBreakpoint {
  const baseSpace = 8;
  const ratio = (width - 640) / 1280;
  
  return {
    slidesPerView: 1.05 + (ratio * 0.75),
    spaceBetween: Math.round(baseSpace - (ratio * 400))
  };
}

// Breakpoint 설정
export const SWIPER_BREAKPOINTS: Record<number, SwiperBreakpoint> = {
  320: { slidesPerView: 1.05, spaceBetween: 10 },
  480: { slidesPerView: 1.2, spaceBetween: 15 },
  768: { slidesPerView: 1.5, spaceBetween: 20 },
  1024: { slidesPerView: 2, spaceBetween: 25 },
  1280: { slidesPerView: 2.5, spaceBetween: 30 }
} as const;

// 기본 Swiper 설정
export const SWIPER_DEFAULT_CONFIG: SwiperOptions = {
  speed: 600,
  allowTouchMove: true,
  resistance: true,
  resistanceRatio: 0.85,
  threshold: 5,
  loop: true,
  centeredSlides: false,
  slidesPerView: 1.05,
  spaceBetween: 20,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
  touchRatio: 1.5,
  touchAngle: 45,
  grabCursor: true,
  preventInteractionOnTransition: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }
} as const;

// 모바일 전용 Swiper 설정 (필요한 경우)
export const MOBILE_SWIPER_CONFIG: Partial<SwiperConfig> = {
  slidesPerView: 1.05,
  spaceBetween: 10,
  breakpoints: {
    480: { slidesPerView: 1.3, spaceBetween: 12 },
    640: { slidesPerView: 1.8, spaceBetween: 16 },
  }
} as const;
