'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';

// 훅들 import
import { useMasonryMeasure } from './hooks/useMasonryMeasure';
import { useMasonryColumns } from './hooks/useMasonryLayout';
import { useMasonryAnimation } from './hooks/useMasonryAnimation';

// 유틸리티들 import
import {
  preloadImages,
  calculateMasonryLayout,
  type Item,
  type GridItem,
} from './utils/masonryCalculations';
import { createHoverHandlers, createResizeOptimizer } from './utils/animationUtils';

// 개발 환경에서만 로그 출력
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

interface MasonryProps {
  items: Item[];
  ease?: string; // gsap.EaseValue는 타입 에러가 발생하여 string으로 유지
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: Item) => void;
}

const MasonryGridCore: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
}) => {
  const columns = useMasonryColumns();
  const [containerRef, { width }] = useMasonryMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [loadedItems, setLoadedItems] = useState<Item[]>([]);
  const hasMounted = useRef(false);

  // 리사이즈 최적화 유틸리티
  const resizeOptimizer = createResizeOptimizer();
  const { isResizing, handleResize, cleanup } = resizeOptimizer;

  // 호버 핸들러 생성
  const { handleMouseEnter, handleMouseLeave } = createHoverHandlers(
    scaleOnHover,
    hoverScale,
    colorShiftOnHover,
  );

  log(
    'MasonryGridBits: Component state - columns:',
    columns,
    'width:',
    width,
    'imagesReady:',
    imagesReady,
    'loadedItems.length:',
    loadedItems.length,
  );

  // 이미지 프리로드 (품질 유지 + 성능 최적화)
  useEffect(() => {
    let cancelled = false;

    log('MasonryGridBits: Starting image preload for', items.length, 'items');
    preloadImages(items)
      .then((loaded) => {
        if (!cancelled) {
          log('MasonryGridBits: Images loaded successfully:', loaded.length, 'items');
          setLoadedItems(loaded);
          setImagesReady(true);
        } else {
          log('MasonryGridBits: Image preload cancelled, ignoring result');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          log('MasonryGridBits: Image preload failed:', error);
          // 에러 발생 시에도 기본값으로 설정
          setLoadedItems(items);
          setImagesReady(true);
        }
      });

    return () => {
      cancelled = true;
      log('MasonryGridBits: Image preload cancelled');
    };
  }, [items]);

  // Masonry 그리드 계산
  const { laidOut, maxHeight } = useMemo(() => {
    return calculateMasonryLayout(columns, loadedItems, width);
  }, [columns, loadedItems, width]);

  // 컨테이너 높이 설정
  useLayoutEffect(() => {
    setContainerHeight(maxHeight);
  }, [maxHeight]);

  // 리사이즈 감지 및 디바운스 처리
  useEffect(() => {
    handleResize(width, columns);
  }, [width, columns]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // 애니메이션 훅 사용
  useMasonryAnimation(
    laidOut,
    imagesReady,
    blurToFocus,
    animateFrom,
    containerRef,
    isResizing,
    hasMounted,
  );

  // 클릭 핸들러
  const handleItemClick = useCallback(
    (item: Item) => {
      if (onItemClick) {
        onItemClick(item);
      } else {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    },
    [onItemClick],
  );

  // 키보드 접근성
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, item: Item) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleItemClick(item);
      }
    },
    [handleItemClick],
  );

  if (!imagesReady) {
    log('MasonryGridBits: Images not ready yet, showing loading...');
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading images...</div>
      </div>
    );
  }

  log(
    'MasonryGridBits: Rendering grid with',
    laidOut.length,
    'items, containerHeight:',
    containerHeight,
  );

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: containerHeight }}>
      {laidOut.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          role="link"
          tabIndex={0}
          className="absolute box-content cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{
            willChange: 'transform, width, height, opacity',
            transform: 'translate3d(0, 0, 0)', // GPU 가속 힌트
            contentVisibility: 'auto', // 오프스크린 렌더링 최적화
          }}
          onClick={() => handleItemClick(item)}
          onKeyDown={(e) => handleKeyDown(e, item)}
          onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div
            className="relative w-full h-full bg-cover bg-center rounded-[12px] shadow-[0px_4px_20px_-8px_rgba(0,0,0,0.15)] overflow-hidden"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* 색상 시프트 오버레이 (옵션) */}
            {colorShiftOnHover && (
              <div className="color-overlay absolute inset-0 rounded-[12px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
            )}

            {/* 카드 콘텐츠 */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              {/* 제목과 카테고리 */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold line-clamp-1">
                  {item.title || `Channel ${item.id}`}
                </h3>
                {item.category && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                )}
              </div>

              {/* 에디터 정보 */}
              {item.editors && item.editors.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {item.editors.slice(0, 3).map((editor, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center text-xs text-white font-medium backdrop-blur-sm"
                      >
                        {editor.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  {item.editors.length > 3 && (
                    <span className="text-xs text-white/70">+{item.editors.length - 3} more</span>
                  )}
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-white/70">
                  <span>👤 312</span>
                  <span>❤️ 48</span>
                </div>
                <button
                  className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 onClick 이벤트 버블링 방지
                    log('View Details clicked for:', item.id);
                    // TODO: 별도 액션 (Follow, 상세 모달 등)
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryGridCore;
