import { useMemo } from 'react';
import type { ImageItemData } from '../_types/image-grid';

interface ViewportConfig {
  buffer: number;
  cellHeight: number;
  cellWidth: number;
  columns: number;
}

export function useSimpleViewportOptimization(
  images: ImageItemData[],
  contentOffset: { x: number; y: number },
  config: ViewportConfig
) {
  // 간단한 뷰포트 계산 (기본값으로 전체 화면 크기 사용)
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  const visibleImages = useMemo(() => {
    // 처음에는 모든 이미지를 보여주고, 점진적으로 최적화
    if (images.length < 50) {
      return images; // 이미지가 적으면 모두 렌더링
    }

    return images.filter((_, index) => {
      const row = Math.floor(index / config.columns);
      const col = index % config.columns;
      const x = col * config.cellWidth + contentOffset.x;
      const y = row * config.cellHeight + contentOffset.y;
      
      return (
        x < viewportWidth + config.buffer &&
        x + config.cellWidth > -config.buffer &&
        y < viewportHeight + config.buffer &&
        y + config.cellHeight > -config.buffer
      );
    });
  }, [images, contentOffset, config, viewportWidth, viewportHeight]);

  return { visibleImages };
} 