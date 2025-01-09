"use client";

import { useEffect, useRef, useState } from "react";
import { CELL_SIZE, GAP_SIZE, GRID_COLS } from "../utils/constants";
import { GridCell } from "./grid/grid-cell";
import { debounce } from "../utils/debounce";

interface GridBackgroundProps {
  onGridSizeChange?: (size: { cols: number; rows: number }) => void;
}

export function GridBackground({ onGridSizeChange }: GridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridDimensions, setGridDimensions] = useState({
    cols: GRID_COLS,
    rows: 13,
  });

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
          (_, index) => (
            <GridCell key={index} className="transition-colors duration-300" />
          )
        )}
      </div>
    </div>
  );
}
