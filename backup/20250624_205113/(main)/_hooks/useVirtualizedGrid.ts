import { useState, useRef, useCallback, useEffect } from 'react';
import type { ImageItemData } from '../_types/image-grid';

interface UseVirtualizedGridProps {
  images: ImageItemData[];
  contentOffset: { x: number; y: number };
  gridConfig: {
    cellWidth: number;
    cellHeight: number;
    gap: number;
  };
  viewportWidth: number;
  viewportHeight: number;
}

export function useVirtualizedGrid({
  images,
  contentOffset,
  gridConfig,
  viewportWidth,
  viewportHeight,
}: UseVirtualizedGridProps) {
  const [visibleImages, setVisibleImages] = useState<ImageItemData[]>([]);
  const lastVisibleRangeRef = useRef({ start: 0, end: 0 });

  const calculateVisibleRange = useCallback(() => {
    if (!images.length) return [];
    
    const { cellWidth, cellHeight, gap } = gridConfig;
    const { x, y } = contentOffset;
    
    // 화면에 보이는 영역 계산
    const visibleLeft = -x;
    const visibleTop = -y;
    const visibleRight = visibleLeft + viewportWidth;
    const visibleBottom = visibleTop + viewportHeight;
    
    // 버퍼 영역 추가 (스크롤 성능 향상)
    const buffer = Math.max(cellWidth, cellHeight) * 2;
    const bufferedLeft = visibleLeft - buffer;
    const bufferedTop = visibleTop - buffer;
    const bufferedRight = visibleRight + buffer;
    const bufferedBottom = visibleBottom + buffer;
    
    // 보이는 이미지들 필터링
    const visible = images.filter(image => {
      const imageLeft = image.left;
      const imageTop = image.top;
      const imageRight = imageLeft + cellWidth;
      const imageBottom = imageTop + cellHeight;
      
      return (
        imageRight > bufferedLeft &&
        imageLeft < bufferedRight &&
        imageBottom > bufferedTop &&
        imageTop < bufferedBottom
      );
    });
    
    return visible;
  }, [images, contentOffset, gridConfig, viewportWidth, viewportHeight]);

  useEffect(() => {
    const visible = calculateVisibleRange();
    setVisibleImages(visible);
  }, [calculateVisibleRange]);

  // 초기 로딩 시 모든 이미지 표시 (가상화 비활성화)
  useEffect(() => {
    if (images.length > 0 && visibleImages.length === 0) {
      setVisibleImages(images);
    }
  }, [images, visibleImages.length]);

  return visibleImages;
} 