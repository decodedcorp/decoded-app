import { useState, useEffect, useCallback } from 'react';

interface GridConfig {
  cellWidth: number;
  cellHeight: number;
  gap: number;
  columns: number;
  rows: number;
}

export function useResponsiveGrid() {
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    cellWidth: 369,
    cellHeight: 461,
    gap: 15,
    columns: 0,
    rows: 0,
  });

  const calculateGridConfig = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 기본값 사용 (기존 코드와 호환)
    let cellWidth = 369;
    let gap = 15;
    
    if (viewportWidth < 768) {
      cellWidth = Math.floor(viewportWidth * 0.9);
      gap = 10;
    } else if (viewportWidth < 1024) {
      cellWidth = Math.floor((viewportWidth - 60) / 2);
      gap = 12;
    } else if (viewportWidth < 1440) {
      cellWidth = Math.floor((viewportWidth - 80) / 3);
      gap = 15;
    } else {
      cellWidth = Math.floor((viewportWidth - 100) / 4);
      gap = 18;
    }
    
    const cellHeight = Math.floor(cellWidth * (5 / 4));
    const columns = Math.floor((viewportWidth + gap) / (cellWidth + gap));
    const rows = Math.floor((viewportHeight + gap) / (cellHeight + gap));
    
    setGridConfig({
      cellWidth,
      cellHeight,
      gap,
      columns,
      rows,
    });
  }, []);

  useEffect(() => {
    calculateGridConfig();
    
    const handleResize = () => {
      calculateGridConfig();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateGridConfig]);

  return gridConfig;
} 