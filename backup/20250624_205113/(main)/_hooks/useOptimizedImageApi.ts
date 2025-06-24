import { useRef, useCallback, useState } from 'react';
import { debounce } from 'lodash';

interface LoadedGrid {
  rows: { min: number; max: number };
  cols: { min: number; max: number };
}

interface LoadingArea {
  rows: { min: number; max: number };
  cols: { min: number; max: number };
  timestamp: number;
}

interface ApiConfig {
  gap: number;
  debounceMs: number;
  requestTimeout: number;
}

export function useOptimizedImageApi(
  fetchAndCacheApiImages: (rows: number[], cols: number[]) => Promise<void>,
  config: ApiConfig = { gap: 2, debounceMs: 300, requestTimeout: 10000 }
) {
  const loadedGridRef = useRef<LoadedGrid>({
    rows: { min: 0, max: 0 },
    cols: { min: 0, max: 0 },
  });
  
  const loadingAreasRef = useRef<LoadingArea[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // 범위가 겹치는지 확인
  const isOverlapping = useCallback((area1: LoadingArea, area2: LoadingArea) => {
    return !(
      area1.rows.max < area2.rows.min ||
      area1.rows.min > area2.rows.max ||
      area1.cols.max < area2.cols.min ||
      area1.cols.min > area2.cols.max
    );
  }, []);

  // 이미 로딩 중인 범위인지 확인
  const isAlreadyLoading = useCallback((rows: number[], cols: number[]) => {
    const newArea = {
      rows: { min: Math.min(...rows), max: Math.max(...rows) },
      cols: { min: Math.min(...cols), max: Math.max(...cols) },
      timestamp: Date.now(),
    };

    return loadingAreasRef.current.some(area => isOverlapping(area, newArea));
  }, [isOverlapping]);

  // 이미 로드된 범위인지 확인
  const isAlreadyLoaded = useCallback((rows: number[], cols: number[]) => {
    const { rows: loadedRows, cols: loadedCols } = loadedGridRef.current;
    
    return rows.every(row => 
      row >= loadedRows.min - config.gap && row <= loadedRows.max + config.gap
    ) && cols.every(col => 
      col >= loadedCols.min - config.gap && col <= loadedCols.max + config.gap
    );
  }, [config.gap]);

  // 새로운 범위를 로딩 영역에 추가
  const addLoadingArea = useCallback((rows: number[], cols: number[]) => {
    const newArea = {
      rows: { min: Math.min(...rows), max: Math.max(...rows) },
      cols: { min: Math.min(...cols), max: Math.max(...cols) },
      timestamp: Date.now(),
    };

    loadingAreasRef.current.push(newArea);

    // 타임아웃된 로딩 영역 제거
    const now = Date.now();
    loadingAreasRef.current = loadingAreasRef.current.filter(
      area => now - area.timestamp < config.requestTimeout
    );
  }, [config.requestTimeout]);

  // 로딩 완료 시 범위 업데이트
  const updateLoadedGrid = useCallback((rows: number[], cols: number[]) => {
    const newRows = { min: Math.min(...rows), max: Math.max(...rows) };
    const newCols = { min: Math.min(...cols), max: Math.max(...cols) };

    loadedGridRef.current = {
      rows: {
        min: Math.min(loadedGridRef.current.rows.min, newRows.min),
        max: Math.max(loadedGridRef.current.rows.max, newRows.max),
      },
      cols: {
        min: Math.min(loadedGridRef.current.cols.min, newCols.min),
        max: Math.max(loadedGridRef.current.cols.max, newCols.max),
      },
    };
  }, []);

  // 최적화된 API 호출
  const optimizedFetch = useCallback(
    debounce(async (rows: number[], cols: number[]) => {
      if (isAlreadyLoading(rows, cols) || isAlreadyLoaded(rows, cols)) {
        return;
      }

      setIsFetching(true);
      addLoadingArea(rows, cols);

      try {
        await fetchAndCacheApiImages(rows, cols);
        updateLoadedGrid(rows, cols);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setIsFetching(false);
      }
    }, config.debounceMs),
    [isAlreadyLoading, isAlreadyLoaded, addLoadingArea, updateLoadedGrid, fetchAndCacheApiImages, config.debounceMs]
  );

  return {
    optimizedFetch,
    isFetching,
    loadedGrid: loadedGridRef.current,
  };
} 