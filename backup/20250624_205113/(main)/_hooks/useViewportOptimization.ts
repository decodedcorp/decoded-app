import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ImageItemData } from '../_types/image-grid';

interface ViewportConfig {
  buffer: number;
  cellHeight: number;
  cellWidth: number;
  columns: number;
}

interface ViewportState {
  scrollX: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
}

export function useViewportOptimization(
  images: ImageItemData[],
  contentOffset: { x: number; y: number },
  config: ViewportConfig
) {
  const [viewportState, setViewportState] = useState<ViewportState>({
    scrollX: 0,
    scrollY: 0,
    viewportWidth: 0,
    viewportHeight: 0,
  });

  // 이미지 좌표 계산을 메모이제이션
  const imagesWithCoordinates = useMemo(() => {
    return images.map((image, index) => {
      const row = Math.floor(index / config.columns);
      const col = index % config.columns;
      const x = col * config.cellWidth;
      const y = row * config.cellHeight;
      
      return {
        ...image,
        row,
        col,
        x,
        y,
        width: config.cellWidth,
        height: config.cellHeight,
      };
    });
  }, [images, config]);

  // 뷰포트 내 이미지만 필터링
  const visibleImages = useMemo(() => {
    const { scrollX, scrollY, viewportWidth, viewportHeight } = viewportState;
    const { buffer } = config;

    return imagesWithCoordinates.filter(img => {
      const adjustedX = img.x + contentOffset.x;
      const adjustedY = img.y + contentOffset.y;
      
      return (
        adjustedX < scrollX + viewportWidth + buffer &&
        adjustedX + img.width > scrollX - buffer &&
        adjustedY < scrollY + viewportHeight + buffer &&
        adjustedY + img.height > scrollY - buffer
      );
    });
  }, [imagesWithCoordinates, viewportState, contentOffset, config]);

  // 뷰포트 상태 업데이트
  const updateViewportState = useCallback(() => {
    if (typeof window === 'undefined') return;

    setViewportState({
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
  }, []);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    updateViewportState();
    
    const handleScroll = () => {
      requestAnimationFrame(updateViewportState);
    };

    const handleResize = () => {
      updateViewportState();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateViewportState]);

  return {
    visibleImages,
    imagesWithCoordinates,
    viewportState,
  };
} 