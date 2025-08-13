import { gsap } from 'gsap';

// 개발 환경에서만 로그 출력
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

// 호버 애니메이션 핸들러
export const createHoverHandlers = (
  scaleOnHover: boolean,
  hoverScale: number,
  colorShiftOnHover: boolean
) => {
  const handleMouseEnter = (element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.2, // 빠른 반응
        ease: 'power2.out',
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector<HTMLElement>('.color-overlay');
      if (overlay) {
        gsap.to(overlay, { opacity: 0.3, duration: 0.2 });
      }
    }
  };

  const handleMouseLeave = (element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(element, {
        scale: 1,
        duration: 0.2, // 빠른 반응
        ease: 'power2.out',
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector<HTMLElement>('.color-overlay');
      if (overlay) {
        gsap.to(overlay, { opacity: 0, duration: 0.2 });
      }
    }
  };

  return { handleMouseEnter, handleMouseLeave };
};

// 리사이즈 최적화 유틸리티
export const createResizeOptimizer = () => {
  const isResizing = { current: false };
  const resizeTimeoutRef = { current: null as NodeJS.Timeout | null };
  const lastWidth = { current: 0 };
  const prevColumns = { current: 0 };

  const handleResize = (width: number, columns: number) => {
    if (width !== lastWidth.current) {
      // 리사이즈 시작
      isResizing.current = true;
      lastWidth.current = width;

      // 이전 타이머 정리
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // 150ms 후 리사이즈 완료로 간주
      resizeTimeoutRef.current = setTimeout(() => {
        isResizing.current = false;
        log('MasonryGridBits: Resize completed, animations enabled');
      }, 150);
    }

    if (prevColumns.current !== columns) {
      log('MasonryGridBits: Breakpoint changed, columns:', prevColumns.current, '→', columns);

      // 컬럼 수 변경 시 대규모 재배치 플래그 설정
      isResizing.current = true;

      // 컬럼 변경 후 200ms 후에 애니메이션 활성화 (더 긴 지연)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        isResizing.current = false;
        log('MasonryGridBits: Breakpoint change completed, animations enabled');
      }, 200);

      prevColumns.current = columns;
    }
  };

  const cleanup = () => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
  };

  return {
    isResizing,
    resizeTimeoutRef,
    lastWidth,
    prevColumns,
    handleResize,
    cleanup,
  };
};
