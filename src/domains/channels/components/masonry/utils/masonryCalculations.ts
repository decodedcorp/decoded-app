// 개발 환경에서만 로그 출력
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

export interface Item {
  id: string;
  img: string;
  url: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  title?: string;
  category?: string;
  editors?: Array<{ name: string; avatar: string | null }>;
}

export interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutResult {
  laidOut: GridItem[];
  maxHeight: number;
}

// 이미지 프리로드 및 실제 크기 추출
export const preloadImages = async (items: Item[]): Promise<Item[]> => {
  log('preloadImages: Starting preload for', items.length, 'items');

  const loadedItems = await Promise.all(
    items.map(async (item, index) => {
      log(`preloadImages: Loading item ${index + 1}/${items.length}:`, item.img);

      return new Promise<Item>((resolve) => {
        const img = new Image();
        img.src = item.img;
        img.onload = () => {
          log(`preloadImages: Image ${index + 1} loaded successfully:`, item.img);
          // 실제 이미지 크기로 비율 계산
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          resolve({
            ...item,
            width: item.width || 300, // 기본값
            height: item.height || Math.round(300 * aspectRatio),
            aspectRatio,
          });
        };
        img.onerror = () => {
          log(`preloadImages: Image ${index + 1} failed to load:`, item.img);
          // 이미지 로드 실패 시 기본값 사용
          resolve({
            ...item,
            width: item.width || 300,
            height: item.height || 200,
            aspectRatio: 0.67,
          });
        };
      });
    }),
  );

  log('preloadImages: All images processed:', loadedItems.length, 'items');
  return loadedItems;
};

// Masonry 그리드 계산 (부수효과 제거)
export const calculateMasonryLayout = (
  columns: number,
  loadedItems: Item[],
  width: number
): LayoutResult => {
  log('MasonryGridBits: Calculating grid with width:', width, 'loadedItems:', loadedItems.length);

  // width가 0이면 기본값 사용 (SSR-safe)
  const effectiveWidth =
    width || (typeof window !== 'undefined' ? window.innerWidth : 1200) || 1200;
  log('MasonryGridBits: Using effective width:', effectiveWidth);

  if (!loadedItems.length) {
    log('MasonryGridBits: Grid calculation skipped - missing loadedItems');
    log('MasonryGridBits: loadedItems.length =', loadedItems.length);
    return { laidOut: [], maxHeight: 0 };
  }

  const colHeights = new Array(columns).fill(0);
  const gap = 16;
  const totalGaps = (columns - 1) * gap;
  const columnWidth = (effectiveWidth - totalGaps) / columns;

  log(
    'MasonryGridBits: Grid params - columns:',
    columns,
    'columnWidth:',
    columnWidth,
    'gap:',
    gap,
  );

  const laidOut = loadedItems.map((child, index) => {
    // 종횡비 기반 높이 계산
    const aspectRatio = child.aspectRatio || 0.67;
    const h = Math.round(columnWidth * aspectRatio);

    const col = colHeights.indexOf(Math.min(...colHeights));
    const x = col * (columnWidth + gap);
    const y = colHeights[col];

    colHeights[col] += h + gap;

    const item = {
      ...child,
      x,
      y,
      w: columnWidth,
      h,
    };

    if (index < 3) {
      log(`MasonryGridBits: Item ${index} calculated:`, item);
    }

    return item;
  });

  // 컨테이너 총 높이 계산 (반환만, setState는 별도)
  const maxHeight = Math.max(...colHeights) - gap;

  log(
    'MasonryGridBits: Grid calculated successfully:',
    laidOut.length,
    'items, maxHeight:',
    maxHeight,
  );
  log('MasonryGridBits: First few items:', laidOut.slice(0, 3));

  return { laidOut, maxHeight };
};
