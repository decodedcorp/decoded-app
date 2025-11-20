"use client";

import React, { Component } from "react";

// Grid physics constants
const MIN_VELOCITY = 0.2;
const UPDATE_INTERVAL = 16;
const VELOCITY_HISTORY_SIZE = 5;
const FRICTION = 0.9;
const VELOCITY_THRESHOLD = 0.3;

// Custom debounce implementation
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

  const debouncedFn = function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = undefined;
    }, wait);
  };

  debouncedFn.cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  return debouncedFn;
}

// Custom throttle implementation
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
) {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
  const { leading = true, trailing = true } = options;

  const throttledFn = function (...args: Parameters<T>) {
    const now = Date.now();

    if (!lastCall && !leading) {
      lastCall = now;
    }

    const remaining = limit - (now - lastCall);

    if (remaining <= 0 || remaining > limit) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      lastCall = now;
      func(...args);
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastCall = leading ? Date.now() : 0;
        timeoutId = undefined;
        func(...args);
      }, remaining);
    }
  };

  throttledFn.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return throttledFn;
}

function getDistance(p1: Position, p2: Position) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export type Position = {
  x: number;
  y: number;
};

type GridItem = {
  position: Position;
  gridIndex: number;
};

type State = {
  offset: Position;
  isDragging: boolean;
  startPos: Position;
  restPos: Position;
  velocity: Position;
  gridItems: GridItem[];
  isMoving: boolean;
  lastMoveTime: number;
  velocityHistory: Position[];
};

export type ItemConfig = {
  isMoving: boolean;
  position: Position;
  gridIndex: number;
};

// Props 타입 변경
export type ThiingsGridProps = {
  gridSize: number | { width: number; height: number };
  renderItem: (itemConfig: ItemConfig) => React.ReactNode;
  className?: string;
  initialPosition?: Position;
  filter?: 'all' | 'latest' | 'clothing' | 'accessories' | 'shoes' | 'bags';
  searchQuery?: string;
};

class ThiingsGrid extends Component<ThiingsGridProps, State> {
  private containerRef: React.RefObject<HTMLElement | null>;
  private lastPos: Position;
  private animationFrame: number | null;
  private isComponentMounted: boolean;
  private lastUpdateTime: number;
  private debouncedUpdateGridItems: ReturnType<typeof throttle>;
  private intersectionObserver: IntersectionObserver | null;
  private imageObserver: IntersectionObserver | null;
  private staggerPositionCache: WeakMap<Element, number>; // Cache top position for stagger calculation
  private staggerDelayMap: WeakMap<Element, number>; // Cache stagger delay value
  private staggerTick: number; // Counter for stagger assignment

  constructor(props: ThiingsGridProps) {
    super(props);
    const offset = this.props.initialPosition || { x: 0, y: 0 };
    this.state = {
      offset: { ...offset },
      restPos: { ...offset },
      startPos: { ...offset },
      velocity: { x: 0, y: 0 },
      isDragging: false,
      gridItems: [],
      isMoving: false,
      lastMoveTime: 0,
      velocityHistory: [],
    };
    this.containerRef = React.createRef();
    this.lastPos = { x: 0, y: 0 };
    this.animationFrame = null;
    this.isComponentMounted = false;
    this.lastUpdateTime = 0;
    this.intersectionObserver = null;
    this.imageObserver = null;
    this.staggerPositionCache = new WeakMap();
    this.staggerDelayMap = new WeakMap();
    this.staggerTick = 0;
    this.debouncedUpdateGridItems = throttle(
      this.updateGridItems,
      UPDATE_INTERVAL,
      {
        leading: true,
        trailing: true,
      }
    );
  }

  componentDidMount() {
    this.isComponentMounted = true;
    this.updateGridItems();
    this.initializeIntersectionObserver();
    this.initializeImageObserver();

    // Add non-passive event listener
    if (this.containerRef.current) {
      this.containerRef.current.addEventListener("wheel", this.handleWheel, {
        passive: false,
      });
      this.containerRef.current.addEventListener(
        "touchmove",
        this.handleTouchMove,
        { passive: false }
      );
    }
  }

  componentDidUpdate(prevProps: ThiingsGridProps) {
    // Re-observe elements when filter or search changes
    if (
      prevProps.filter !== this.props.filter ||
      prevProps.searchQuery !== this.props.searchQuery
    ) {
      // Recalculate grid items with new filter/search
      this.updateGridItems();
    }

    // Observe new card elements when grid items update
    this.observeCardElements();
    // Observe new images when grid items update
    this.observeImages();
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.debouncedUpdateGridItems.cancel();

    // Disconnect IntersectionObservers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }

    // Remove event listeners
    if (this.containerRef.current) {
      this.containerRef.current.removeEventListener("wheel", this.handleWheel);
      this.containerRef.current.removeEventListener(
        "touchmove",
        this.handleTouchMove
      );
    }
  }

  public publicGetCurrentPosition = () => {
    return this.state.offset;
  };

  // Initialize IntersectionObserver for scroll animations
  private initializeIntersectionObserver = () => {
    if (typeof IntersectionObserver === 'undefined') {
      return; // Fallback for browsers without IntersectionObserver support
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        // First pass: cache positions for new entries (only on first appearance)
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.staggerPositionCache.has(entry.target)) {
            const rect = entry.target.getBoundingClientRect();
            this.staggerPositionCache.set(entry.target, rect.top);
          }
        });

        // Second pass: sort by cached position and assign stagger delays
        const intersectingEntries = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => {
            const topA = this.staggerPositionCache.get(a.target) ?? 0;
            const topB = this.staggerPositionCache.get(b.target) ?? 0;
            return topA - topB;
          });

        // Assign stagger delays (max 240ms)
        intersectingEntries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (!this.staggerDelayMap.has(el)) {
            const delay = Math.min((this.staggerTick++ % 6) * 40, 240); // Max 240ms
            this.staggerDelayMap.set(el, delay);
          }
          const delay = this.staggerDelayMap.get(el) ?? 0;
          el.style.setProperty('--stagger', `${delay}ms`);
        });

        // Third pass: handle visibility classes with hysteresis
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const intersectionRatio = entry.intersectionRatio;
          
          if (entry.isIntersecting && intersectionRatio >= 0.15) {
            // Entry: only trigger at 0.15 threshold
            el.classList.add('is-visible');
            el.classList.remove('is-hidden');
          } else if (!entry.isIntersecting || intersectionRatio < 0.05) {
            // Exit: trigger at 0.0 threshold (or very low ratio)
            el.classList.add('is-hidden');
            el.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: [0, 0.15, 0.3], // Multiple thresholds for hysteresis
        rootMargin: '10% 0px -15% 0px', // Asymmetric: early entry (top 10%), late exit (bottom -15%)
      }
    );

    // Observe existing card elements
    this.observeCardElements();
  };

  // Initialize separate IntersectionObserver for faster image loading
  private initializeImageObserver = () => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Calculate viewport height in pixels for rootMargin (0.8-1.2x range, default 1.0x)
    // Tune based on WebPageTest/DevTools Network waterfall: if concurrent requests > 6-8, reduce to 0.6-0.8x
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const rootMarginMultiplier = 1.0; // Tune between 0.6-1.2 based on network/main thread balance
    const rootMarginValue = `${Math.round(viewportHeight * rootMarginMultiplier)}px`;

    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const alreadyLoaded = img.dataset.loaded === 'true' || img.getAttribute('data-loaded') === 'true';
            if (!alreadyLoaded && img.dataset.src) {
              img.src = img.dataset.src;
              img.dataset.loaded = 'true';
              // Stop observing once loaded
              this.imageObserver?.unobserve(img);
            }
          }
        });
      },
      {
        threshold: 0, // Trigger immediately when any pixel enters
        rootMargin: rootMarginValue, // Start loading 3x viewport height before entering
      }
    );

    // Observe existing images
    this.observeImages();
  };

  // Observe all card elements with js-observe class
  private observeCardElements = () => {
    if (!this.intersectionObserver || !this.containerRef.current) {
      return;
    }

    // Use setTimeout to ensure DOM is updated after render
    setTimeout(() => {
      const cardElements = this.containerRef.current?.querySelectorAll('.js-observe');
      cardElements?.forEach((el) => {
        this.intersectionObserver?.observe(el);
      });
    }, 0);
  };

  // Observe all images with data-src for faster loading
  private observeImages = () => {
    if (!this.imageObserver || !this.containerRef.current) {
      return;
    }

    // Use requestAnimationFrame batching for performance
    requestAnimationFrame(() => {
      const images = this.containerRef.current?.querySelectorAll('img[data-src]');
      images?.forEach((img) => {
        const alreadyLoaded = img.getAttribute('data-loaded') === 'true';
        if (!alreadyLoaded) {
          // Let IntersectionObserver handle visibility check (no getBoundingClientRect)
          this.imageObserver?.observe(img);
        }
      });
    });
  };

  // Helper method 추가
  private getGridSize = () => {
    const { gridSize } = this.props;
    if (typeof gridSize === 'number') {
      return { width: gridSize, height: gridSize };
    }
    return gridSize;
  };

  // calculateVisiblePositions 수정
  private calculateVisiblePositions = (): Position[] => {
    if (!this.containerRef.current) return [];
    
    const rect = this.containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const { width: gridWidth, height: gridHeight } = this.getGridSize();
    
    const cellsX = Math.ceil(width / gridWidth);
    const cellsY = Math.ceil(height / gridHeight);
    
    const centerX = -Math.round(this.state.offset.x / gridWidth);
    const centerY = -Math.round(this.state.offset.y / gridHeight);
    
    const positions: Position[] = [];
    const halfCellsX = Math.ceil(cellsX / 2);
    const halfCellsY = Math.ceil(cellsY / 2);

    for (let y = centerY - halfCellsY; y <= centerY + halfCellsY; y++) {
      for (let x = centerX - halfCellsX; x <= centerX + halfCellsX; x++) {
        positions.push({ x, y });
      }
    }

    return positions;
  };

  private getItemIndexForPosition = (x: number, y: number): number => {
    // Special case for center
    if (x === 0 && y === 0) return 0;

    // Determine which layer of the spiral we're in
    const layer = Math.max(Math.abs(x), Math.abs(y));

    // Calculate the size of all inner layers
    const innerLayersSize = Math.pow(2 * layer - 1, 2);

    // Calculate position within current layer
    let positionInLayer = 0;

    if (y === 0 && x === layer) {
      // Starting position (middle right)
      positionInLayer = 0;
    } else if (y < 0 && x === layer) {
      // Right side, bottom half
      positionInLayer = -y;
    } else if (y === -layer && x > -layer) {
      // Bottom side
      positionInLayer = layer + (layer - x);
    } else if (x === -layer && y < layer) {
      // Left side
      positionInLayer = 3 * layer + (layer + y);
    } else if (y === layer && x < layer) {
      // Top side
      positionInLayer = 5 * layer + (layer + x);
    } else {
      // Right side, top half (y > 0 && x === layer)
      positionInLayer = 7 * layer + (layer - y);
    }

    const index = innerLayersSize + positionInLayer;
    return index;
  };

  private debouncedStopMoving = debounce(() => {
    this.setState({ isMoving: false, restPos: { ...this.state.offset } });
  }, 200);

  // Filter items based on filter type and search query
  private filterItems = (items: GridItem[]): GridItem[] => {
    const { filter = 'all', searchQuery = '' } = this.props;
    let filtered = items;

    // Apply filter
    if (filter !== 'all') {
      // For now, we'll filter by gridIndex modulo for demo purposes
      // In production, this would filter based on actual item metadata
      filtered = filtered.filter((item) => {
        const mod = item.gridIndex % 6;
        switch (filter) {
          case 'latest':
            return mod === 0;
          case 'clothing':
            return mod === 1;
          case 'accessories':
            return mod === 2;
          case 'shoes':
            return mod === 3;
          case 'bags':
            return mod === 4;
          default:
            return true;
        }
      });
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        // For now, search by gridIndex
        // In production, this would search actual item metadata
        return item.gridIndex.toString().includes(query);
      });
    }

    return filtered;
  };

  private updateGridItems = () => {
    if (!this.isComponentMounted) return;

    const positions = this.calculateVisiblePositions();
    const allItems = positions.map((position) => {
      const gridIndex = this.getItemIndexForPosition(position.x, position.y);
      return {
        position,
        gridIndex,
      };
    });

    // Apply filtering
    const filteredItems = this.filterItems(allItems);

    const distanceFromRest = getDistance(this.state.offset, this.state.restPos);

    this.setState({ gridItems: filteredItems, isMoving: distanceFromRest > 5 }, () => {
      // Observe images immediately after state update
      this.observeImages();
    });

    this.debouncedStopMoving();
  };

  private animate = () => {
    if (!this.isComponentMounted) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastUpdateTime;

    if (deltaTime >= UPDATE_INTERVAL) {
      const { velocity } = this.state;
      const speed = Math.sqrt(
        velocity.x * velocity.x + velocity.y * velocity.y
      );

      if (speed < MIN_VELOCITY) {
        this.setState({ velocity: { x: 0, y: 0 } });
        return;
      }

      // Apply non-linear deceleration based on speed
      let deceleration = FRICTION;
      if (speed < VELOCITY_THRESHOLD) {
        // Apply stronger deceleration at lower speeds for more natural stopping
        deceleration = FRICTION * (speed / VELOCITY_THRESHOLD);
      }

      this.setState(
        (prevState) => ({
          offset: {
            x: prevState.offset.x + prevState.velocity.x,
            y: prevState.offset.y + prevState.velocity.y,
          },
          velocity: {
            x: prevState.velocity.x * deceleration,
            y: prevState.velocity.y * deceleration,
          },
        }),
        this.debouncedUpdateGridItems
      );

      this.lastUpdateTime = currentTime;
    }

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private handleDown = (p: Position) => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.setState({
      isDragging: true,
      startPos: {
        x: p.x - this.state.offset.x,
        y: p.y - this.state.offset.y,
      },
      velocity: { x: 0, y: 0 },
    });

    this.lastPos = { x: p.x, y: p.y };
  };
  private handleMove = (p: Position) => {
    if (!this.state.isDragging) return;

    const currentTime = performance.now();
    const timeDelta = currentTime - this.state.lastMoveTime;

    // Calculate raw velocity based on position and time
    const rawVelocity = {
      x: (p.x - this.lastPos.x) / (timeDelta || 1),
      y: (p.y - this.lastPos.y) / (timeDelta || 1),
    };

    // Add to velocity history and maintain fixed size
    const velocityHistory = [...this.state.velocityHistory, rawVelocity];
    if (velocityHistory.length > VELOCITY_HISTORY_SIZE) {
      velocityHistory.shift();
    }

    // Calculate smoothed velocity using moving average
    const smoothedVelocity = velocityHistory.reduce(
      (acc, vel) => ({
        x: acc.x + vel.x / velocityHistory.length,
        y: acc.y + vel.y / velocityHistory.length,
      }),
      { x: 0, y: 0 }
    );

    this.setState(
      {
        velocity: smoothedVelocity,
        offset: {
          x: p.x - this.state.startPos.x,
          y: p.y - this.state.startPos.y,
        },
        lastMoveTime: currentTime,
        velocityHistory,
      },
      this.updateGridItems
    );

    this.lastPos = { x: p.x, y: p.y };
  };
  private handleUp = () => {
    this.setState({ isDragging: false });
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private handleMouseDown = (e: React.MouseEvent) => {
    this.handleDown({
      x: e.clientX,
      y: e.clientY,
    });
  };

  private handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    this.handleMove({
      x: e.clientX,
      y: e.clientY,
    });
  };

  private handleMouseUp = () => {
    this.handleUp();
  };

  private handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    if (!touch) return;

    this.handleDown({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  private handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];

    if (!touch) return;

    e.preventDefault();
    this.handleMove({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  private handleTouchEnd = () => {
    this.handleUp();
  };

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Get the scroll deltas
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;

    this.setState(
      (prevState) => ({
        offset: {
          x: prevState.offset.x - deltaX,
          y: prevState.offset.y - deltaY,
        },
        velocity: { x: 0, y: 0 }, // Reset velocity when scrolling
      }),
      this.debouncedUpdateGridItems
    );
  };

  render() {
    const { offset, isDragging, gridItems, isMoving } = this.state;
    const { className } = this.props;
    const { width: gridWidth, height: gridHeight } = this.getGridSize();

    // Get container dimensions
    const containerRect = this.containerRef.current?.getBoundingClientRect();
    const containerWidth = containerRect?.width || 0;
    const containerHeight = containerRect?.height || 0;

    return (
      <div
        ref={this.containerRef as React.RefObject<HTMLDivElement>}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          touchAction: "none",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 0,
        }}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchEnd}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
            willChange: "transform",
          }}
        >
          {gridItems.map((item) => {
            const x = item.position.x * gridWidth + containerWidth / 2;
            const y = item.position.y * gridHeight + containerHeight / 2;

            return (
              <div
                key={`${item.position.x}-${item.position.y}`}
                className="js-observe"
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  width: gridWidth,
                  height: gridHeight,
                  transform: `translate3d(${x}px, ${y}px, 0)`,
                  marginLeft: `-${gridWidth / 2}px`,
                  marginTop: `-${gridHeight / 2}px`,
                  willChange: "transform",
                }}
              >
                {typeof this.props.renderItem === "function"
                  ? this.props.renderItem({
                      gridIndex: item.gridIndex,
                      position: item.position,
                      isMoving,
                    })
                  : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ThiingsGrid;
