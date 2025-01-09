"use client";

import { useEffect, useRef, useState } from "react";
import { CELL_SIZE, GAP_SIZE, GRID_COLS } from "../../utils/constants";
import { GridCell } from "./grid-cell";
import { debounce } from "../../utils/debounce";

interface GridBackgroundProps {
  onGridSizeChange?: (size: { cols: number; rows: number }) => void;
  isHighlighted?: boolean;
  highlightArea?: { x: number; y: number; radius: number };
}

export function GridBackground({
  onGridSizeChange,
  isHighlighted,
  highlightArea,
}: GridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridDimensions, setGridDimensions] = useState({
    cols: GRID_COLS,
    rows: 13,
  });

  // 정사각형 거리 계산 함수 (Chebyshev distance)
  const calculateSquareDistance = (dx: number, dy: number) => {
    return Math.max(Math.abs(dx), Math.abs(dy));
  };

  // 거리에 따른 투명도 계산 (1에 가까울수록 진하게)
  const calculateOpacity = (distance: number, radius: number) => {
    const normalizedDistance = distance / radius;
    // 더 부드러운 감소를 위해 4제곱 사용
    return Math.max(0, 1 - Math.pow(normalizedDistance, 4));
  };

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
    }

    updateGridSize();
    const debouncedResize = debounce(updateGridSize, 100);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [onGridSizeChange]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, ${CELL_SIZE}px)`,
          gap: GAP_SIZE,
        }}
      >
        {Array.from({ length: gridDimensions.cols * gridDimensions.rows }).map(
          (_, index) => {
            const row = Math.floor(index / gridDimensions.cols);
            const col = index % gridDimensions.cols;

            let shouldHighlight = false;
            let opacity = 0;
            if (isHighlighted && highlightArea && containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              // 그리드 셀의 중앙 위치 계산
              const cellCenterX = rect.left + col * CELL_SIZE + CELL_SIZE / 2;
              const cellCenterY = rect.top + row * CELL_SIZE + CELL_SIZE / 2;

              const dx = cellCenterX - highlightArea.x;
              const dy = cellCenterY - highlightArea.y;
              const distance = calculateSquareDistance(dx, dy);
              shouldHighlight = distance <= highlightArea.radius;
              opacity = calculateOpacity(distance, highlightArea.radius);
            }

            return (
              <GridCell
                key={index}
                className="transition-colors duration-300"
                isHighlighted={shouldHighlight}
                opacity={opacity}
              />
            );
          }
        )}
      </div>
    </div>
  );
}
