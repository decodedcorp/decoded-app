import { useLayoutEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// 개발 환경에서만 로그 출력
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AnimationConfig {
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  blurToFocus?: boolean;
}

interface AnimationPosition {
  x: number;
  y: number;
}

export const useMasonryAnimation = (
  laidOut: GridItem[],
  imagesReady: boolean,
  blurToFocus: boolean,
  animateFrom: string,
  containerRef: React.RefObject<HTMLDivElement>,
  isResizing: React.MutableRefObject<boolean>,
  hasMounted: React.MutableRefObject<boolean>
) => {
  const gsapContextRef = useRef<gsap.Context | null>(null);

  // 초기 위치 계산 (SSR-safe)
  const getInitialPosition = useCallback(
    (item: GridItem): AnimationPosition => {
      if (typeof window === 'undefined') return { x: item.x, y: item.y };

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return { x: item.x, y: item.y };

      let direction = animateFrom;
      if (animateFrom === 'random') {
        const dirs = ['top', 'bottom', 'left', 'right'];
        direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
      }

      switch (direction) {
        case 'top':
          return { x: item.x, y: -200 };
        case 'bottom':
          return { x: item.x, y: window.innerHeight + 200 };
        case 'left':
          return { x: -200, y: item.y };
        case 'right':
          return { x: window.innerWidth + 200, y: item.y };
        case 'center':
          return {
            x: containerRect.width / 2 - item.w / 2,
            y: containerRect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef],
  );

  // GSAP 애니메이션 (FLIP 패턴 적용)
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !imagesReady || !laidOut.length) return;

    // 이전 컨텍스트 정리
    if (gsapContextRef.current) {
      gsapContextRef.current.revert();
    }

    // 가시 영역 우선 애니메이션을 위한 아이템 필터링
    const visibleItems = laidOut.filter((item) => {
      // 뷰포트 내에 있는 아이템만 우선 애니메이션
      return item.y < (typeof window !== 'undefined' ? window.innerHeight : 800) + 200;
    });

    log(
      'MasonryGridBits: Animating',
      visibleItems.length,
      'visible items out of',
      laidOut.length,
      'total',
    );

    // 새로운 GSAP 컨텍스트 생성
    gsapContextRef.current = gsap.context(() => {
      visibleItems.forEach((item, index) => {
        const selector = `[data-key="${item.id}"]`;

        if (!hasMounted.current) {
          // 최초 마운트: 단순한 등장 애니메이션
          const start = getInitialPosition(item);

          // GPU 가속 설정 (초기 한 번만)
          gsap.set(selector, { force3D: true });

          gsap.fromTo(
            selector,
            {
              opacity: 0,
              x: start.x,
              y: start.y,
              width: item.w,
              height: item.h,
              ...(blurToFocus && { filter: 'blur(10px)' }),
            },
            {
              opacity: 1,
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: 0.6, // 단순화된 duration
              ease: 'power2.out', // 단순화된 ease
              delay: index < 8 ? index * 0.05 : 0, // 상단 8개만 스태거
            },
          );
        } else {
          // 리사이즈/업데이트: FLIP 패턴 적용
          if (isResizing.current) {
            // 리사이즈 중: 크기와 위치 모두 즉시 설정 (애니메이션 스킵)
            gsap.set(selector, {
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h,
            });
          } else {
            // 리사이즈 완료 후: 위치만 부드럽게 애니메이션 (크기는 즉시, blur 없음)
            gsap.set(selector, {
              width: item.w,
              height: item.h,
            });

            gsap.to(selector, {
              x: item.x,
              y: item.y,
              duration: 0.3, // 빠른 반응
              ease: 'power2.out',
              overwrite: 'auto',
              // blur 효과는 초기 등장에만, 업데이트 시 비활성
            });
          }
        }
      });
    });

    hasMounted.current = true;

    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
        gsapContextRef.current = null;
      }
    };
  }, [laidOut, imagesReady, blurToFocus, getInitialPosition]);

  return { gsapContextRef };
};
