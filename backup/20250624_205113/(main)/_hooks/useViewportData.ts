import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import type { ImageItemData } from '../_types/image-grid';

interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface UseViewportDataProps {
  camera: { x: number; y: number; scale: number };
  fetchData: (bounds: ViewportBounds) => Promise<ImageItemData[]>;
  bufferMultiplier?: number;
}

export function useViewportData({
  camera,
  fetchData,
  bufferMultiplier = 2,
}: UseViewportDataProps) {
  const [items, setItems] = useState<ImageItemData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadedBoundsRef = useRef<ViewportBounds | null>(null);
  const loadingRef = useRef(false);

  const getViewportBounds = useCallback(() => {
    const { x, y, scale } = camera;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    const baseBounds = {
      left: -x / scale,
      top: -y / scale,
      right: (-x + viewportWidth) / scale,
      bottom: (-y + viewportHeight) / scale,
    };

    // 버퍼 영역 추가
    const width = baseBounds.right - baseBounds.left;
    const height = baseBounds.bottom - baseBounds.top;
    
    return {
      left: baseBounds.left - width * (bufferMultiplier - 1) / 2,
      top: baseBounds.top - height * (bufferMultiplier - 1) / 2,
      right: baseBounds.right + width * (bufferMultiplier - 1) / 2,
      bottom: baseBounds.bottom + height * (bufferMultiplier - 1) / 2,
    };
  }, [camera, bufferMultiplier]);

  const loadDataForBounds = useCallback(async (bounds: ViewportBounds) => {
    if (loadingRef.current) return;
    
    // 이미 로드된 영역인지 확인
    if (loadedBoundsRef.current) {
      const loaded = loadedBoundsRef.current;
      if (
        bounds.left >= loaded.left &&
        bounds.top >= loaded.top &&
        bounds.right <= loaded.right &&
        bounds.bottom <= loaded.bottom
      ) {
        return;
      }
    }

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const newItems = await fetchData(bounds);
      setItems(prevItems => {
        // 중복 제거
        const existingIds = new Set(prevItems.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        return [...prevItems, ...uniqueNewItems];
      });
      
      loadedBoundsRef.current = bounds;
    } catch (error) {
      console.error('Failed to load viewport data:', error);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchData]);

  // 디바운스된 데이터 로딩
  const debouncedLoadData = useRef(
    debounce((bounds: ViewportBounds) => {
      loadDataForBounds(bounds);
    }, 100)
  ).current;

  useEffect(() => {
    const bounds = getViewportBounds();
    debouncedLoadData(bounds);
  }, [camera, getViewportBounds, debouncedLoadData]);

  return {
    items,
    isLoading,
    loadDataForBounds,
  };
} 