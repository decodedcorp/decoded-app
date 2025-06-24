import { useState, useRef, useCallback, useEffect } from "react";
import type {
  ImageItemData,
  LoadedGrid,
  ApiImage,
} from "../_types/image-grid";
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  GAP,
  LOAD_THRESHOLD,
} from "../_constants/image-grid";

interface UseImageGridProps {
  apiImageUrlListRef: React.RefObject<ApiImage[]>;
  currentApiImageIndexRef: React.MutableRefObject<number>;
  allApiImagesFetchedRef: React.RefObject<boolean>;
  isFetchingApiImagesRef: React.RefObject<boolean>;
  apiImageCount: number;
  fetchAndCacheApiImages: () => Promise<boolean>;
}

export function useImageGrid({
  apiImageUrlListRef,
  currentApiImageIndexRef,
  allApiImagesFetchedRef,
  isFetchingApiImagesRef,
  apiImageCount,
  fetchAndCacheApiImages,
}: UseImageGridProps) {
  const [images, setImages] = useState<ImageItemData[]>([]);
  const loadedGridRef = useRef<LoadedGrid>({
    rows: { min: 0, max: -1 },
    cols: { min: 0, max: -1 },
  });
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 });
  const imageElementsRef = useRef<Record<string, boolean>>({});
  
  // 스크롤 안정성을 위한 ref 추가
  const isExpandingRef = useRef(false);
  const lastContentOffsetRef = useRef({ x: 0, y: 0 });

  const tryAddApiImagesToCells = useCallback(
    (cells: { row: number; col: number }[]) => {
      const itemsToAddThisBatch: ImageItemData[] = [];
      let imagesAddedInThisCall = 0;

      // 배치 크기 제한으로 성능 향상
      const maxBatchSize = 20;
      const limitedCells = cells.slice(0, maxBatchSize);

      for (const cell of limitedCells) {
        const key = `${cell.row}_${cell.col}`;
        if (imageElementsRef.current[key]) continue;

        if (
          currentApiImageIndexRef.current! >= apiImageUrlListRef.current!.length
        ) {
          if (
            allApiImagesFetchedRef.current &&
            apiImageUrlListRef.current!.length > 0
          ) {
            currentApiImageIndexRef.current = 0;
          } else {
            break;
          }
        }

        if (apiImageUrlListRef.current!.length === 0) {
          break;
        }

        const apiImage =
          apiImageUrlListRef.current![currentApiImageIndexRef.current!];

        imageElementsRef.current[key] = true;
        itemsToAddThisBatch.push({
          id: key,
          ...cell,
          src: apiImage.image_url,
          alt: `Image ${cell.row},${
            cell.col
          } (ID: ${apiImage.image_doc_id.slice(-6)})`,
          left: cell.col * CELL_WIDTH,
          top: cell.row * CELL_HEIGHT,
          x: cell.col * CELL_WIDTH,
          y: cell.row * CELL_HEIGHT,
          loaded: false,
          image_doc_id: apiImage.image_doc_id,
        });
        currentApiImageIndexRef.current!++;
        imagesAddedInThisCall++;
      }

      if (itemsToAddThisBatch.length > 0) {
        setImages((prevImages) => {
          const newImages = [...prevImages, ...itemsToAddThisBatch];
          
          // 그리드 경계 업데이트 최적화
          if (loadedGridRef.current.rows.max === -1 && itemsToAddThisBatch.length > 0) {
            const firstItem = itemsToAddThisBatch[0];
            loadedGridRef.current = {
              rows: { min: firstItem.row, max: firstItem.row },
              cols: { min: firstItem.col, max: firstItem.col },
            };
          }

          itemsToAddThisBatch.forEach((item) => {
            loadedGridRef.current.rows.min = Math.min(loadedGridRef.current.rows.min, item.row);
            loadedGridRef.current.rows.max = Math.max(loadedGridRef.current.rows.max, item.row);
            loadedGridRef.current.cols.min = Math.min(loadedGridRef.current.cols.min, item.col);
            loadedGridRef.current.cols.max = Math.max(loadedGridRef.current.cols.max, item.col);
          });
          
          return newImages;
        });
      }
      return imagesAddedInThisCall;
    },
    [apiImageUrlListRef, currentApiImageIndexRef, allApiImagesFetchedRef]
  );

  const expandGridIfNeeded = useCallback(() => {
    if (isExpandingRef.current) {
      return;
    }

    // SSR 안전성 체크
    if (typeof window === 'undefined') {
      return;
    }

    isExpandingRef.current = true;
    
    // ThiingsGrid에서 관리하므로 고정된 뷰포트 크기 사용
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const currentGrid = loadedGridRef.current;

    // 현재 contentOffset을 저장
    lastContentOffsetRef.current = { ...contentOffset };

    if (currentGrid.rows.max === -1 && images.length > 0 && apiImageCount > 0) {
      let minR = Infinity,
        maxR = -Infinity,
        minC = Infinity,
        maxC = -Infinity;
      images.forEach((img) => {
        minR = Math.min(minR, img.row);
        maxR = Math.max(maxR, img.row);
        minC = Math.min(minC, img.col);
        maxC = Math.max(maxC, img.col);
      });
      if (maxR !== -Infinity) {
        loadedGridRef.current = {
          rows: { min: minR, max: maxR },
          cols: { min: minC, max: maxC },
        };
      }
    } else if (
      currentGrid.rows.max === -1 &&
      images.length === 0 &&
      apiImageCount === 0 &&
      !isFetchingApiImagesRef.current &&
      !allApiImagesFetchedRef.current
    ) {
      fetchAndCacheApiImages();
      isExpandingRef.current = false;
      return;
    } else if (
      currentGrid.rows.max === -1 &&
      images.length === 0 &&
      apiImageCount === 0 &&
      isFetchingApiImagesRef.current
    ) {
      isExpandingRef.current = false;
      return;
    }

    const { x: coX, y: coY } = contentOffset;
    const visibleLeft = -coX;
    const visibleTop = -coY;
    const visibleRight = visibleLeft + viewWidth;
    const visibleBottom = visibleTop + viewHeight;

    const contentActualLeft =
      currentGrid.rows.max === -1 ? 0 : currentGrid.cols.min * CELL_WIDTH;
    const contentActualTop =
      currentGrid.rows.max === -1 ? 0 : currentGrid.rows.min * CELL_HEIGHT;
    const contentActualRight =
      currentGrid.rows.max === -1
        ? 0
        : (currentGrid.cols.max + 1) * CELL_WIDTH - GAP;
    const contentActualBottom =
      currentGrid.rows.max === -1
        ? 0
        : (currentGrid.rows.max + 1) * CELL_HEIGHT - GAP;

    const cellsToAddConfigs: { row: number; col: number }[] = [];
    let newMinRow = currentGrid.rows.min,
      newMaxRow = currentGrid.rows.max;
    let newMinCol = currentGrid.cols.min,
      newMaxCol = currentGrid.cols.max;

    // 더 큰 LOAD_THRESHOLD 사용으로 미리 로드
    const expandedLoadThreshold = LOAD_THRESHOLD * 2;

    if (
      currentGrid.rows.max === -1 &&
      (apiImageCount > 0 ||
        (allApiImagesFetchedRef.current &&
          apiImageUrlListRef.current!.length > 0))
    ) {
      const initialVisibleCols = Math.ceil(viewWidth / CELL_WIDTH) + 4;
      const initialVisibleRows = Math.ceil(viewHeight / CELL_HEIGHT) + 4;
      const centerCol =
        Math.floor(-coX / CELL_WIDTH + initialVisibleCols / 2) - 1;
      const centerRow =
        Math.floor(-coY / CELL_HEIGHT + initialVisibleRows / 2) - 1;

      newMinCol = centerCol - Math.floor(initialVisibleCols / 2);
      newMaxCol = centerCol + Math.ceil(initialVisibleCols / 2) - 1;
      newMinRow = centerRow - Math.floor(initialVisibleRows / 2);
      newMaxRow = centerRow + Math.ceil(initialVisibleRows / 2) - 1;

      for (let r = newMinRow; r <= newMaxRow; r++) {
        for (let c = newMinCol; c <= newMaxCol; c++) {
          if (!imageElementsRef.current[`${r}_${c}`]) {
            cellsToAddConfigs.push({ row: r, col: c });
          }
        }
      }
    } else if (currentGrid.rows.max !== -1) {
      const shouldExpandRight =
        visibleRight + expandedLoadThreshold > contentActualRight;
      const shouldExpandLeft = visibleLeft - expandedLoadThreshold < contentActualLeft;
      const shouldExpandBottom =
        visibleBottom + expandedLoadThreshold > contentActualBottom;
      const shouldExpandTop = visibleTop - expandedLoadThreshold < contentActualTop;

      let didExpandHorizontally = false;
      if (shouldExpandRight) {
        newMaxCol = currentGrid.cols.max + 1;
        for (let r = currentGrid.rows.min; r <= currentGrid.rows.max; r++)
          cellsToAddConfigs.push({ row: r, col: newMaxCol });
        didExpandHorizontally = true;
      }
      if (shouldExpandLeft) {
        newMinCol = currentGrid.cols.min - 1;
        for (let r = currentGrid.rows.min; r <= currentGrid.rows.max; r++)
          cellsToAddConfigs.push({ row: r, col: newMinCol });
        didExpandHorizontally = true;
      }

      const currentMinColForVertical = didExpandHorizontally
        ? newMinCol
        : currentGrid.cols.min;
      const currentMaxColForVertical = didExpandHorizontally
        ? newMaxCol
        : currentGrid.cols.max;

      if (shouldExpandBottom) {
        newMaxRow = currentGrid.rows.max + 1;
        for (
          let c = currentMinColForVertical;
          c <= currentMaxColForVertical;
          c++
        )
          cellsToAddConfigs.push({ row: newMaxRow, col: c });
      }
      if (shouldExpandTop) {
        newMinRow = currentGrid.rows.min - 1;
        for (
          let c = currentMinColForVertical;
          c <= currentMaxColForVertical;
          c++
        )
          cellsToAddConfigs.push({ row: newMinRow, col: c });
      }
    }

    if (cellsToAddConfigs.length > 0) {
      const addedCount = tryAddApiImagesToCells(cellsToAddConfigs);
      if (
        addedCount < cellsToAddConfigs.length &&
        !allApiImagesFetchedRef.current &&
        !isFetchingApiImagesRef.current
      ) {
        fetchAndCacheApiImages();
      }
    }

    // 다음 프레임에서 isExpanding 해제
    requestAnimationFrame(() => {
      isExpandingRef.current = false;
    });
  }, [
    contentOffset,
    images,
    apiImageCount,
    tryAddApiImagesToCells,
    fetchAndCacheApiImages,
    allApiImagesFetchedRef,
    apiImageUrlListRef,
    isFetchingApiImagesRef,
  ]);

  const performInitialSetup = useCallback(() => {
    // SSR 안전성 체크
    if (typeof window === 'undefined') {
      return false;
    }
    
    // ThiingsGrid에서 관리하므로 고정된 뷰포트 크기 사용
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    // 첫 번째 이미지의 좌표
    const firstImageLeft = -768;
    const firstImageTop = -952.5;

    // 화면 중앙에 첫 이미지가 오도록 보정
    const offsetX = Math.round(viewWidth / 2 - firstImageLeft);
    const offsetY = Math.round(viewHeight / 2 - firstImageTop);
    setContentOffset({ x: offsetX, y: offsetY });

    if (
      apiImageCount === 0 &&
      !isFetchingApiImagesRef.current &&
      !allApiImagesFetchedRef.current
    ) {
      fetchAndCacheApiImages().then((newDataFetched) => {
        // Handle post-fetch logic if needed, e.g. logging
      });
    }
    return true;
  }, [fetchAndCacheApiImages, apiImageCount, isFetchingApiImagesRef, allApiImagesFetchedRef]);

  useEffect(() => {
    const tryInitialSetup = () => {
      if (!performInitialSetup()) {
        const timeoutId = setTimeout(tryInitialSetup, 100);
        return () => clearTimeout(timeoutId);
      }
    };
    const clearAttempt = tryInitialSetup();
    return () => {
      if (typeof clearAttempt === "function") clearAttempt();
    };
  }, [performInitialSetup]);

  // expandGridIfNeeded를 throttle로 감싸서 성능 개선
  const throttledExpandGrid = useCallback(
    () => {
      if (!isExpandingRef.current) {
        expandGridIfNeeded();
      }
    },
    [expandGridIfNeeded]
  );

  useEffect(() => {
    throttledExpandGrid();
  }, [contentOffset, apiImageCount, images.length, throttledExpandGrid]);

  const onImageLoaded = (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, loaded: true } : img))
    );
  };

  // thiings-grid 스타일의 뷰포트 최적화
  const calculateVisibleImages = useCallback(() => {
    // SSR 안전성 체크
    if (typeof window === 'undefined') {
      return images;
    }
    
    // ThiingsGrid에서 관리하므로 고정된 뷰포트 크기 사용
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // 뷰포트 마진 추가 (성능 향상)
    const margin = 600;
    const visibleLeft = -contentOffset.x - margin;
    const visibleTop = -contentOffset.y - margin;
    const visibleRight = -contentOffset.x + containerWidth + margin;
    const visibleBottom = -contentOffset.y + containerHeight + margin;
    
    const minLeft = Math.min(...images.map(img => img.left));
    const minTop = Math.min(...images.map(img => img.top));

    const visibleImages = images.map(img => ({
      ...img,
      left: img.left - minLeft,
      top: img.top - minTop,
    }));
    
    return visibleImages.filter(image => {
      const imageLeft = image.left;
      const imageTop = image.top;
      const imageRight = image.left + CELL_WIDTH;
      const imageBottom = image.top + CELL_HEIGHT;
      
      return (
        imageRight > visibleLeft &&
        imageLeft < visibleRight &&
        imageBottom > visibleTop &&
        imageTop < visibleBottom
      );
    });
  }, [images, contentOffset]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (images.length === 0) return;

    // 첫 번째 이미지의 좌표
    const firstImage = images[0];
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    const offsetX = Math.round(viewWidth / 2 - firstImage.left);
    const offsetY = Math.round(viewHeight / 2 - firstImage.top);

    setContentOffset({ x: offsetX, y: offsetY });
    // 이 코드는 최초 1회만 실행되도록 조건을 추가하세요.
  }, [images.length]);

  return {
    images,
    visibleImages: calculateVisibleImages(),
    loadedGridRef,
    contentOffset,
    setContentOffset,
    imageElementsRef,
    onImageLoaded,
    gridBounds: loadedGridRef.current,
    totalImages: images.length,
    isLoading: isFetchingApiImagesRef.current,
  };
} 