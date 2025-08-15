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

// 요소 크기 측정 훅 (debounced)
const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      
      // debounce resize events to prevent excessive re-renders
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize((prev) => {
          // Only update if size actually changed significantly
          if (Math.abs(prev.width - width) > 5 || Math.abs(prev.height - height) > 5) {
            return { width, height };
          }
          return prev;
        });
      }, 100);
    });
    
    ro.observe(ref.current);
    
    return () => {
      ro.disconnect();
      clearTimeout(timeoutId);
    };
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

    return items.map((child, index) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      
      // 안정적인 높이 계산 - 랜덤성 제거
      const baseHeight = Math.max(child.height, 240);
      // 콘텐츠 타입별로 예측 가능한 높이 조정
      let height = baseHeight;
      if (child.type === 'image') {
        height = Math.max(baseHeight, 300);
      } else if (child.type === 'link') {
        height = Math.max(baseHeight, 200);
      }
      
      const y = colHeights[col];
      colHeights[col] += height + gap;
      
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady || !containerReady) return;

    // 더 안정적인 애니메이션을 위해 단순화
    const animationDelay = 50; // 짧은 지연으로 레이아웃 안정화

    const timeoutId = setTimeout(() => {
      setIsAnimating(true);
      
      grid.forEach((item, index) => {
        const selector = `[data-key="${item.id}"]`;
        const element = document.querySelector(selector) as HTMLElement;
        
        if (!element) return;

        // 초기 위치 설정 (CSS로 더 안정적으로)
        element.style.transform = `translate(${item.x}px, ${item.y}px)`;
        element.style.width = `${item.w}px`;
        element.style.height = `${item.h}px`;

        if (!hasMounted.current) {
          // 첫 렌더링 시 부드러운 페이드인
          gsap.fromTo(
            element,
            {
              opacity: 0,
              scale: 0.8,
              ...(blurToFocus && { filter: 'blur(5px)' }),
            },
            {
              opacity: 1,
              scale: 1,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: 0.5,
              ease: 'power2.out',
              delay: index * Math.min(stagger, 0.03), // 최대 지연 시간 제한
            },
          );
        } else {
          // 리사이즈나 재배치 시 부드러운 전환
          gsap.to(element, {
            opacity: 1,
            duration: Math.min(duration, 0.4),
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });

      hasMounted.current = true;
    }, animationDelay);

    return () => clearTimeout(timeoutId);
  }, [grid, imagesReady, containerReady, stagger, blurToFocus, duration]);

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

  // 컨테이너가 준비되지 않았으면 스켈레톤 UI 표시
  if (!containerReady) {
    return (
      <div ref={containerRef} className={`relative w-full ${className || ''}`}>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <div 
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl animate-pulse" 
                style={{ height: `${200 + Math.random() * 200}px` }}
              />
            </div>
          ))}
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
