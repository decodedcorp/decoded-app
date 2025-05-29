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
  currentApiImageIndexRef: React.RefObject<number>;
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ImageItemData[]>([]);
  const loadedGridRef = useRef<LoadedGrid>({
    rows: { min: 0, max: -1 },
    cols: { min: 0, max: -1 },
  });
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 });
  const imageElementsRef = useRef<Record<string, boolean>>({});

  const tryAddApiImagesToCells = useCallback(
    (cells: { row: number; col: number }[]) => {
      const itemsToAddThisBatch: ImageItemData[] = [];
      let imagesAddedInThisCall = 0;

      for (const cell of cells) {
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
          loaded: false,
          image_doc_id: apiImage.image_doc_id,
        });
        currentApiImageIndexRef.current!++;
        imagesAddedInThisCall++;
      }

      if (itemsToAddThisBatch.length > 0) {
        setImages((prevImages) => {
          const newImages = [...prevImages, ...itemsToAddThisBatch];
          let newMinR = loadedGridRef.current.rows.min;
          let newMaxR = loadedGridRef.current.rows.max;
          let newMinC = loadedGridRef.current.cols.min;
          let newMaxC = loadedGridRef.current.cols.max;

          if (
            loadedGridRef.current.rows.max === -1 &&
            itemsToAddThisBatch.length > 0
          ) {
            newMinR = itemsToAddThisBatch[0].row;
            newMaxR = itemsToAddThisBatch[0].row;
            newMinC = itemsToAddThisBatch[0].col;
            newMaxC = itemsToAddThisBatch[0].col;
          }

          itemsToAddThisBatch.forEach((item) => {
            newMinR = Math.min(newMinR, item.row);
            newMaxR = Math.max(newMaxR, item.row);
            newMinC = Math.min(newMinC, item.col);
            newMaxC = Math.max(newMaxC, item.col);
          });

          loadedGridRef.current = {
            rows: { min: newMinR, max: newMaxR },
            cols: { min: newMinC, max: newMaxC },
          };
          return newImages;
        });
      }
      return imagesAddedInThisCall;
    },
    [apiImageUrlListRef, currentApiImageIndexRef, allApiImagesFetchedRef]
  );

  const expandGridIfNeeded = useCallback(() => {
    if (
      !scrollContainerRef.current ||
      scrollContainerRef.current.clientWidth === 0
    ) {
      return;
    }
    const viewWidth = scrollContainerRef.current.clientWidth;
    const viewHeight = scrollContainerRef.current.clientHeight;
    const currentGrid = loadedGridRef.current;

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
      return;
    } else if (
      currentGrid.rows.max === -1 &&
      images.length === 0 &&
      apiImageCount === 0 &&
      isFetchingApiImagesRef.current
    ) {
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

    if (
      currentGrid.rows.max === -1 &&
      (apiImageCount > 0 ||
        (allApiImagesFetchedRef.current &&
          apiImageUrlListRef.current!.length > 0))
    ) {
      const initialVisibleCols = Math.ceil(viewWidth / CELL_WIDTH) + 2;
      const initialVisibleRows = Math.ceil(viewHeight / CELL_HEIGHT) + 2;
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
        visibleRight + LOAD_THRESHOLD > contentActualRight;
      const shouldExpandLeft = visibleLeft - LOAD_THRESHOLD < contentActualLeft;
      const shouldExpandBottom =
        visibleBottom + LOAD_THRESHOLD > contentActualBottom;
      const shouldExpandTop = visibleTop - LOAD_THRESHOLD < contentActualTop;

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
    if (
      !scrollContainerRef.current ||
      scrollContainerRef.current.clientWidth === 0
    ) {
      return false;
    }
    const viewWidth = scrollContainerRef.current.clientWidth;
    const viewHeight = scrollContainerRef.current.clientHeight;

    const offsetX = Math.round(viewWidth * 0.75);
    const offsetY = Math.round(viewHeight * 0.75);
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
  }, [fetchAndCacheApiImages, apiImageCount, isFetchingApiImagesRef, allApiImagesFetchedRef, ]);

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

  useEffect(() => {
    expandGridIfNeeded();
  }, [contentOffset, apiImageCount, images.length, expandGridIfNeeded]);

  const onImageLoaded = (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, loaded: true } : img))
    );
  };

  return {
    scrollContainerRef,
    images,
    loadedGridRef, // 이 ref는 MainPage에서 직접 사용하지 않을 수 있으나, ImageItem 등 하위 컴포넌트에 전달될 수 있음
    contentOffset,
    setContentOffset, // Interaction Hook에서 사용할 수 있도록 반환
    imageElementsRef, // 이 ref는 MainPage에서 직접 사용하지 않을 수 있으나, 내부 로직에 필요
    onImageLoaded,
    // tryAddApiImagesToCells, // expandGridIfNeeded 내부에서만 사용되므로 반환 X
    // expandGridIfNeeded, // useEffect 내부에서만 사용되므로 반환 X
    // performInitialSetup, // useEffect 내부에서만 사용되므로 반환 X
  };
} 