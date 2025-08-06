'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// 미디어 쿼리 훅
const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach((q) => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

// 요소 크기 측정 훅
const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

// 이미지 프리로딩
const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

// 기본 아이템 인터페이스 (ReactBits 원래 API)
interface Item {
  id: string;
  img: string;
  url?: string;
  height: number;
  // 확장 필드들 (선택적)
  title?: string;
  category?: string;
  editors?: string[] | { name: string; avatarUrl: string }[];
  date?: string;
  isNew?: boolean;
  isHot?: boolean;
  type?: 'cta' | 'channel';
  ctaIdx?: number;
}

// 그리드 아이템 인터페이스
interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

// 메이슨리 Props (ReactBits 원래 API + 확장)
interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  className?: string;
  // 확장 props
  onItemClick?: (item: Item) => void;
  renderItem?: (item: GridItem) => React.ReactNode;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className,
  onItemClick,
  renderItem,
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1,
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    const imageUrls = items.map((i) => i.img).filter(Boolean);
    if (imageUrls.length > 0) {
      preloadImages(imageUrls).then(() => setImagesReady(true));
    } else {
      setImagesReady(true);
    }
  }, [items]);

  // 컨테이너 크기가 안정화되면 준비 완료
  useEffect(() => {
    if (width > 0) {
      const timer = setTimeout(() => {
        setContainerReady(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [width]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      // 높이를 더 정확하게 계산하고 다양성 추가
      const baseHeight = Math.max(child.height, 200);
      // 높이에 약간의 랜덤성 추가 (5% 범위 내로 줄임)
      const heightVariation = baseHeight * (0.95 + Math.random() * 0.1);
      const height = Math.round(heightVariation);
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady || !containerReady) return;

    // 애니메이션 시작 전에 아이템들을 올바른 위치에 배치
    grid.forEach((item) => {
      const selector = `[data-key="${item.id}"]`;
      gsap.set(selector, {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        opacity: 0,
      });
    });

    // 바로 애니메이션 시작
    setIsAnimating(true);

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          opacity: 1,
          duration,
          ease,
          overwrite: 'auto',
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, containerReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  const handleItemClick = (item: GridItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener');
    }
  };

  // 컨테이너가 준비되지 않았으면 로딩 상태 반환
  if (!containerReady) {
    return (
      <div ref={containerRef} className={`relative w-full h-full ${className || ''}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-zinc-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className || ''}`}>
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer"
          style={{
            willChange: 'transform, width, height, opacity',
            // 초기 상태에서 아이템을 숨김 (애니메이션 시작 전까지)
            opacity: isAnimating ? undefined : 0,
            transform: `translate(${item.x}px, ${item.y}px)`,
            width: item.w,
            height: item.h,
          }}
          onClick={() => handleItemClick(item)}
          onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
        >
          {renderItem ? (
            renderItem(item)
          ) : (
            <div
              className="relative w-full h-full bg-cover bg-center rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-[10px]"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              {colorShiftOnHover && (
                <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
