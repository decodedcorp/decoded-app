import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// 개발 환경에서만 로그 출력 (성능 최적화)
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

// 성능에 민감한 로그는 별도 함수로 분리
const perfLog = (message: string, ...args: any[]) => {
  if (isDev && process.env.NODE_ENV === 'development') {
    console.log(`[PERF] ${message}`, ...args);
  }
};

// SSR-safe useMedia hook
const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = useCallback(() => {
    if (typeof window === 'undefined') {
      log('useMedia: SSR not available, returning defaultValue:', defaultValue);
      return defaultValue;
    }
    const idx = queries.findIndex((q) => window.matchMedia(q).matches);
    const result = values[idx] ?? defaultValue;
    log('useMedia: get() called, result:', result, 'queries:', queries, 'values:', values);
    return result;
  }, [queries.join('|'), values, defaultValue]);

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = () => {
      const newValue = get();
      // 값이 실제로 변경되었을 때만 setState 호출
      if (newValue !== value) {
        log('useMedia: Media query changed, new value:', newValue);
        setValue(newValue);
      }
    };
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((m) => m.addEventListener('change', handler));

    return () => mqls.forEach((m) => m.removeEventListener('change', handler));
  }, [queries.join('|'), get, values, defaultValue, value]);

  log('useMedia: Current value:', value);
  return value;
};

// SSR-safe useMeasure hook (최적화)
const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastWidth = useRef(0); // height는 제거, width만 추적

  useEffect(() => {
    if (typeof window === 'undefined') {
      log('useMeasure: SSR not available');
      return;
    }

    if (!ref.current) {
      log('useMeasure: ref.current is null');
      return;
    }

    log('useMeasure: Setting up measurement');

    // 즉시 현재 크기 측정
    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const newWidth = rect.width;

        // width만 추적, epsilon 0.5px로 축소 (height는 제거)
        if (Math.abs(newWidth - lastWidth.current) > 0.5) {
          log('useMeasure: Width changed significantly:', newWidth);
          setSize((prev) => ({ ...prev, width: newWidth }));
          lastWidth.current = newWidth;
        }
      }
    };

    // requestAnimationFrame으로 RO 콜백 최적화
    const rafMeasure = () => {
      rafRef.current = requestAnimationFrame(measure);
    };

    // 초기 측정 (즉시)
    measure();

    // DOM이 완전히 렌더링된 후 다시 측정
    const timeoutId1 = setTimeout(() => {
      log('useMeasure: Delayed measurement 1');
      measure();
    }, 100);

    const timeoutId2 = setTimeout(() => {
      log('useMeasure: Delayed measurement 2');
      measure();
    }, 500);

    // ResizeObserver 설정 (rAF + 디바운스 적용)
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        log('useMeasure: ResizeObserver triggered');

        // 이전 디바운스 타이머 정리
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        // rAF로 한 틱 합치기 + 200ms 디바운스
        debounceRef.current = setTimeout(() => {
          rafMeasure();
        }, 200);
      });
      ro.observe(ref.current);

      return () => {
        ro.disconnect();
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    } else {
      // ResizeObserver가 없는 경우 window resize 이벤트 사용
      const debouncedMeasure = () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(rafMeasure, 200);
      };

      window.addEventListener('resize', debouncedMeasure);
      return () => {
        window.removeEventListener('resize', debouncedMeasure);
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, []);

  return [ref, size] as const;
};

// 이미지 프리로드 및 실제 크기 추출
const preloadImages = async (items: Item[]): Promise<Item[]> => {
  log('preloadImages: Starting preload for', items.length, 'items');

  const loadedItems = await Promise.all(
    items.map(async (item, index) => {
      // 로깅 최적화: 처음 3개만 상세 로그
      if (index < 3) {
        log(`preloadImages: Loading item ${index + 1}/${items.length}:`, item.img);
      }

      return new Promise<Item>((resolve) => {
        const img = new Image();
        img.src = item.img;
        img.onload = () => {
          if (index < 3) {
            log(`preloadImages: Image ${index + 1} loaded successfully:`, item.img);
          }
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
          if (index < 3) {
            log(`preloadImages: Image ${index + 1} failed to load:`, item.img);
          }
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

interface Item {
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

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

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
  onItemClick,
}) => {
  // 개발용: 렌더링 횟수 추적 (리렌더 원인 진단용)
  if (isDev) {
    console.count('Masonry render');
  }

  // items 안정화 키 생성 (불필요한 재프리로드 방지)
  const itemsStableKey = useMemo(() => {
    return items.map((item) => `${item.id}:${item.img}`).join('|');
  }, [items]);

  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1,
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [loadedItems, setLoadedItems] = useState<Item[]>([]);
  const hasMounted = useRef(false);
  const gsapContextRef = useRef<gsap.Context | null>(null);

  // 리사이즈 최적화를 위한 상태
  const isResizing = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWidth = useRef(width);
  const prevColumns = useRef(columns);

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
  }, [itemsStableKey]); // items 대신 itemsStableKey 사용

  // 초기 위치 계산 (SSR-safe)
  const getInitialPosition = useCallback(
    (item: GridItem) => {
      if (typeof window === 'undefined') return { x: item.x, y: item.y };

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
    },
    [animateFrom, containerRef],
  );

  // Masonry 그리드 계산 (부수효과 제거)
  const { laidOut, maxHeight } = useMemo(() => {
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
  }, [columns, loadedItems, width, loadedItems.length]); // loadedItems.length 추가로 더 정확한 의존성

  // 컨테이너 높이 설정 (부수효과를 별도 useEffect로 분리)
  useLayoutEffect(() => {
    setContainerHeight(maxHeight);
  }, [maxHeight]);

  // 리사이즈 감지 및 디바운스 처리
  useEffect(() => {
    if (width !== lastWidth.current) {
      // 리사이즈 시작
      isResizing.current = true;
      lastWidth.current = width;

      // 이전 타이머 정리
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // 150ms 후 리사이즈 완료로 간주
      resizeTimeoutRef.current = setTimeout(() => {
        isResizing.current = false;
        log('MasonryGridBits: Resize completed, animations enabled');
      }, 150);
    }
  }, [width]);

  // 브레이크포인트 변경 감지
  useEffect(() => {
    if (prevColumns.current !== columns) {
      log('MasonryGridBits: Breakpoint changed, columns:', prevColumns.current, '→', columns);

      // 컬럼 수 변경 시 대규모 재배치 플래그 설정
      isResizing.current = true;

      // 컬럼 변경 후 200ms 후에 애니메이션 활성화 (더 긴 지연)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        isResizing.current = false;
        log('MasonryGridBits: Breakpoint change completed, animations enabled');
      }, 200);

      prevColumns.current = columns;
    }
  }, [columns]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // GSAP 애니메이션 (FLIP 패턴 적용)
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !imagesReady || !laidOut.length) return;

    // 컨텍스트 재생성 최적화: 실제로 필요할 때만
    const needsNewContext = !gsapContextRef.current || !hasMounted.current || isResizing.current;

    if (needsNewContext) {
      // 이전 컨텍스트 정리
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
      }

      // 새로운 GSAP 컨텍스트 생성
      gsapContextRef.current = gsap.context(() => {
        const visibleItems = laidOut.filter((item) => {
          // 가시 영역 우선 애니메이션을 위한 아이템 필터링 (성능 최적화)
          const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          return item.y < viewportHeight + 100; // 200 → 100으로 줄여서 애니메이션 대상 축소
        });

        log(
          'MasonryGridBits: Animating',
          visibleItems.length,
          'visible items out of',
          laidOut.length,
          'total',
        );

        visibleItems.forEach((item, index) => {
          const selector = `[data-key="${item.id}"]`;

          if (!hasMounted.current) {
            // 최초 마운트: 단순한 등장 애니메이션
            const start = getInitialPosition(item);

            // GPU 가속 설정 (초기 한 번만)
            gsap.set(selector, { force3D: true });

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
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
                ...(blurToFocus && { filter: 'blur(0px)' }),
                duration: 0.6, // 단순화된 duration
                ease: 'power2.out', // 단순화된 ease
                delay: index < 8 ? index * 0.05 : 0, // 상단 8개만 스태거
              },
            );
          } else {
            // 리사이즈/업데이트: FLIP 패턴 적용
            if (isResizing.current) {
              // 리사이즈 중: 크기와 위치 모두 즉시 설정 (애니메이션 스킵)
              gsap.set(selector, {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
              });
            } else {
              // 리사이즈 완료 후: 위치만 부드럽게 애니메이션 (크기는 즉시, blur 없음)
              gsap.set(selector, {
                width: item.w,
                height: item.h,
              });

              gsap.to(selector, {
                x: item.x,
                y: item.y,
                duration: 0.3, // 빠른 반응
                ease: 'power2.out',
                overwrite: 'auto',
                // blur 효과는 초기 등장에만, 업데이트 시 비활성
              });
            }
          }
        });
      });
    } else {
      // 기존 컨텍스트에서 값만 업데이트 (성능 최적화)
      if (gsapContextRef.current) {
        gsapContextRef.current.add(() => {
          laidOut.forEach((item) => {
            const selector = `[data-key="${item.id}"]`;
            if (isResizing.current) {
              gsap.set(selector, {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
              });
            }
          });
        });
      }
    }

    hasMounted.current = true;

    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
        gsapContextRef.current = null;
      }
    };
  }, [laidOut, imagesReady, blurToFocus, getInitialPosition, isResizing.current]); // isResizing.current 추가

  // 호버 핸들러 최적화 (단순화)
  const handleMouseEnter = useCallback(
    (element: HTMLElement) => {
      if (scaleOnHover) {
        gsap.to(element, {
          scale: hoverScale,
          duration: 0.15, // 0.2 → 0.15로 단축하여 더 빠른 반응
          ease: 'power2.out',
          overwrite: 'auto', // 이전 애니메이션 덮어쓰기
        });
      }
      if (colorShiftOnHover) {
        const overlay = element.querySelector<HTMLElement>('.color-overlay');
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0.3,
            duration: 0.15, // 0.2 → 0.15로 단축
            overwrite: 'auto',
          });
        }
      }
    },
    [scaleOnHover, hoverScale, colorShiftOnHover],
  );

  const handleMouseLeave = useCallback(
    (element: HTMLElement) => {
      if (scaleOnHover) {
        gsap.to(element, {
          scale: 1,
          duration: 0.15, // 0.2 → 0.15로 단축
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (colorShiftOnHover) {
        const overlay = element.querySelector<HTMLElement>('.color-overlay');
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.15, // 0.2 → 0.15로 단축
            overwrite: 'auto',
          });
        }
      }
    },
    [scaleOnHover, colorShiftOnHover],
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
            // content-visibility를 컨테이너에서 제거하여 RO 자극 방지
          }}
          onClick={() => handleItemClick(item)}
          onKeyDown={(e) => handleKeyDown(e, item)}
          onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div
            className="relative w-full h-full bg-cover bg-center rounded-[12px] shadow-[0px_4px_20px_-8px_rgba(0,0,0,0.15)] overflow-hidden"
            style={{
              backgroundImage: `url(${item.img})`,
              contentVisibility: 'auto', // 개별 카드 내부에서만 사용
            }}
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

// 커스텀 비교 함수: 실제 변화가 있을 때만 리렌더
const areEqual = (prevProps: MasonryProps, nextProps: MasonryProps): boolean => {
  // items 내용 비교 (참조가 아닌 실제 데이터)
  if (prevProps.items.length !== nextProps.items.length) return false;

  // 더 정확한 items 비교 (id, img, title, category, editors)
  for (let i = 0; i < prevProps.items.length; i++) {
    const prev = prevProps.items[i];
    const next = nextProps.items[i];

    if (
      prev.id !== next.id ||
      prev.img !== next.img ||
      prev.title !== next.title ||
      prev.category !== next.category
    ) {
      return false;
    }

    // editors 배열 비교
    if (prev.editors?.length !== next.editors?.length) return false;
    if (prev.editors && next.editors) {
      for (let j = 0; j < prev.editors.length; j++) {
        if (prev.editors[j].name !== next.editors[j].name) return false;
      }
    }
  }

  // 다른 props 비교 (참조 비교)
  return (
    prevProps.ease === nextProps.ease &&
    prevProps.duration === nextProps.duration &&
    prevProps.stagger === nextProps.stagger &&
    prevProps.animateFrom === nextProps.animateFrom &&
    prevProps.scaleOnHover === nextProps.scaleOnHover &&
    prevProps.hoverScale === nextProps.hoverScale &&
    prevProps.blurToFocus === nextProps.blurToFocus &&
    prevProps.colorShiftOnHover === nextProps.colorShiftOnHover &&
    prevProps.onItemClick === nextProps.onItemClick
  );
};

export default React.memo(Masonry, areEqual);
