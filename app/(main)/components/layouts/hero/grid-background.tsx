import { useEffect, useRef, useState } from 'react';
import { CELL_SIZE, GAP_SIZE, GRID_COLS } from './constants';

interface GridBackgroundProps {
  onGridSizeChange?: (size: { cols: number; rows: number }) => void;
}

export function GridBackground({ onGridSizeChange }: GridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridDimensions, setGridDimensions] = useState({
    cols: GRID_COLS,
    rows: 13,
  });
  const [transparentPixels, setTransparentPixels] = useState<number[]>([]);

  useEffect(() => {
    function updateGridSize() {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // 컨테이너 크기에 맞춰 열과 행 수 계산
      const cols = Math.ceil(width / CELL_SIZE);
      const rows = Math.ceil(height / CELL_SIZE);

      setGridDimensions({ cols, rows });
      onGridSizeChange?.({ cols, rows });

      // 화면 크기에 따라 투명하게 할 픽셀 결정
      const pixels = [];
      if (width <= 479) {
        // 모바일용 패턴
        for (let i = 0; i < cols * rows; i += 3) {
          pixels.push(i);
        }
      } else if (width <= 991) {
        // 태블릿용 패턴
        for (let i = 0; i < cols * rows; i += 4) {
          pixels.push(i);
        }
      } else {
        // 데스크톱용 패턴
        for (let i = 0; i < cols * rows; i += 5) {
          pixels.push(i);
        }
      }
      setTransparentPixels(pixels);
    }

    updateGridSize();
    const debouncedResize = debounce(updateGridSize, 100);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [onGridSizeChange]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
      }}
    >
      {Array.from({ length: gridDimensions.cols * gridDimensions.rows }).map(
        (_, index) => (
          <div
            key={index}
            className="absolute transition-opacity duration-300"
            style={{
              opacity: transparentPixels.includes(index) ? 0 : 1,
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: (index % gridDimensions.cols) * CELL_SIZE,
              top: Math.floor(index / gridDimensions.cols) * CELL_SIZE,
            }}
          />
        )
      )}
    </div>
  );
}

// 디바운스 유틸리티 함수
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
