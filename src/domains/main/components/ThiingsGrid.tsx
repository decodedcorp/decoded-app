'use client';

import React, { Component } from 'react';

// Grid physics constants - optimized values
const UPDATE_INTERVAL = 16; // 60fps for grid updates (더 부드러운 movement는 직접 DOM으로)
const VELOCITY_HISTORY_SIZE = 3; // Reduced for better performance
const MOVEMENT_THRESHOLD = 10; // px - 이 이상 움직일 때만 grid 업데이트

// Custom debounce implementation
function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number) {
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
  options: { leading?: boolean; trailing?: boolean } = {},
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

type Position = {
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
};

export type ItemConfig = {
  isMoving: boolean;
  position: Position;
  gridIndex: number;
};

export type ThiingsGridProps = {
  gridSize: number;
  renderItem: (itemConfig: ItemConfig) => React.ReactNode;
  className?: string;
  initialPosition?: Position;
  cellWidthRatio?: number; // 셀 가로/세로 비율 (기본값: 1.0 = 정사각형)
};

class ThiingsGrid extends Component<ThiingsGridProps, State> {
  private containerRef: React.RefObject<HTMLElement | null>;
  private innerRef: React.RefObject<HTMLDivElement | null>;
  private lastPos: Position;
  private animationFrame: number | null;
  private isComponentMounted: boolean;
  private debouncedUpdateGridItems: ReturnType<typeof throttle>;
  private view = { x: 0, y: 0, vx: 0, vy: 0, lastTs: 0 };
  private lastGridUpdatePos = { x: 0, y: 0 }; // 마지막 grid 업데이트 위치

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
    };
    this.containerRef = React.createRef();
    this.innerRef = React.createRef();
    this.lastPos = { x: 0, y: 0 };
    this.animationFrame = null;
    this.isComponentMounted = false;
    this.debouncedUpdateGridItems = throttle(this.updateGridItems, UPDATE_INTERVAL, {
      leading: true,
      trailing: true,
    });
  }

  componentDidMount() {
    this.isComponentMounted = true;
    this.view.x = this.state.offset.x;
    this.view.y = this.state.offset.y;
    this.updateGridItems();

    // Add non-passive event listener for wheel
    if (this.containerRef.current) {
      this.containerRef.current.addEventListener('wheel', this.handleWheel, {
        passive: false,
      });
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.debouncedUpdateGridItems.cancel();

    // Remove wheel event listener
    if (this.containerRef.current) {
      this.containerRef.current.removeEventListener('wheel', this.handleWheel);
    }
  }

  public publicGetCurrentPosition = () => {
    return this.state.offset;
  };

  private calculateVisiblePositions = (): Position[] => {
    if (!this.containerRef.current) return [];
    const rect = this.containerRef.current.getBoundingClientRect();
    const { gridSize, cellWidthRatio = 1.0 } = this.props;
    const buffer = 1;

    const cellWidth = gridSize * cellWidthRatio;
    const cellHeight = gridSize;

    const cellsX = Math.ceil(rect.width / cellWidth) + buffer * 2;
    const cellsY = Math.ceil(rect.height / cellHeight) + buffer * 2;

    const centerX = Math.floor(-this.view.x / cellWidth);
    const centerY = Math.floor(-this.view.y / cellHeight);

    // 정확히 cellsX/Y개가 나오도록 좌우/상하 분할
    const left = Math.floor((cellsX - 1) / 2);
    const right = cellsX - 1 - left;
    const top = Math.floor((cellsY - 1) / 2);
    const bottom = cellsY - 1 - top;

    const positions: Position[] = new Array(cellsX * cellsY);
    let i = 0;
    for (let y = centerY - top; y <= centerY + bottom; y++) {
      for (let x = centerX - left; x <= centerX + right; x++) {
        positions[i++] = { x, y };
      }
    }
    return positions;
  };

  private getItemIndexForPosition = (x: number, y: number): number => {
    if (x === 0 && y === 0) return 0;
    const k = Math.max(Math.abs(x), Math.abs(y)); // 레이어
    const s = 2 * k + 1; // 변 길이
    const max = s * s - 1; // 레이어 마지막 인덱스 (0 시작)

    // 아래는 시계 방향: 오른쪽 변(아래→위), 위쪽(우→좌), 왼쪽(위→아래), 아래(좌→우)
    if (x === k && y > -k) return max - (k - y); // Right edge
    if (y === -k && x > -k) return max - (2 * k + (k - x)); // Top edge
    if (x === -k && y < k) return max - (4 * k + (k + y)); // Left edge
    /* y === k && x < k */ return max - (6 * k + (x + k)); // Bottom edge
  };

  private debouncedStopMoving = debounce(() => {
    this.setState({ isMoving: false, restPos: { ...this.state.offset } });
  }, 100); // Reduced from 200ms to 100ms

  private updateGridItems = () => {
    if (!this.isComponentMounted) return;

    const positions = this.calculateVisiblePositions();
    const newItems = positions.map((position) => {
      const gridIndex = this.getItemIndexForPosition(position.x, position.y);
      return {
        position,
        gridIndex,
      };
    });

    const distanceFromRest = getDistance({ x: this.view.x, y: this.view.y }, this.state.restPos);

    this.setState({ gridItems: newItems, isMoving: distanceFromRest > 5 });

    this.debouncedStopMoving();
  };

  private animate = (ts?: number) => {
    if (!this.isComponentMounted) return;
    const now = ts ?? performance.now();
    if (!this.view.lastTs) this.view.lastTs = now;
    const dt = Math.min((now - this.view.lastTs) / 1000, 0.016); // 16ms clamp for stable 60fps
    this.view.lastTs = now;

    const speed = Math.hypot(this.view.vx, this.view.vy);

    // 더 정교한 속도 임계값
    if (speed < 1) {
      this.view.vx = 0;
      this.view.vy = 0;
      // 완전 정지 시 한 번 더 grid 업데이트
      this.lastGridUpdatePos = { x: this.view.x, y: this.view.y };
      this.debouncedUpdateGridItems();
      return; // 애니메이션 종료
    }

    // 물리 기반 마찰
    const frictionPerSec = 8.0; // 더 빠른 감속
    const decay = Math.max(0, 1 - frictionPerSec * dt);
    this.view.vx *= decay;
    this.view.vy *= decay;

    // 위치 업데이트 (프레임율 독립적)
    this.view.x += this.view.vx * dt;
    this.view.y += this.view.vy * dt;

    // DOM 직접 업데이트
    if (this.innerRef.current) {
      this.innerRef.current.style.transform = `translate3d(${this.view.x}px, ${this.view.y}px, 0)`;
    }

    // 스마트 grid 업데이트 (거리 기반)
    const distanceMoved = getDistance(this.view, this.lastGridUpdatePos);
    if (distanceMoved > MOVEMENT_THRESHOLD) {
      this.lastGridUpdatePos = { x: this.view.x, y: this.view.y };
      this.debouncedUpdateGridItems();
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
  private velocityHistory: Position[] = [];
  private lastMoveTime: number = 0;

  private handleMove = (p: Position) => {
    if (!this.state.isDragging) return;
    const now = performance.now();
    const dtMs = now - this.lastMoveTime || 1;

    const raw = {
      x: ((p.x - this.lastPos.x) / dtMs) * 1000, // px/s
      y: ((p.y - this.lastPos.y) / dtMs) * 1000,
    };

    // 인스턴스 변수로 velocity 히스토리 관리 (React 상태 제거)
    this.velocityHistory = [...this.velocityHistory, raw].slice(-VELOCITY_HISTORY_SIZE);

    const smoothed = this.velocityHistory.reduce(
      (acc, v) => ({
        x: acc.x + v.x / this.velocityHistory.length,
        y: acc.y + v.y / this.velocityHistory.length,
      }),
      { x: 0, y: 0 },
    );

    // view에만 반영 (렌더 방지)
    this.view.vx = smoothed.x;
    this.view.vy = smoothed.y;
    this.view.x = p.x - this.state.startPos.x;
    this.view.y = p.y - this.state.startPos.y;

    // transform은 직접 갱신
    if (this.innerRef.current) {
      this.innerRef.current.style.transform = `translate3d(${this.view.x}px, ${this.view.y}px, 0)`;
    }

    // 충분히 움직였을 때만 grid 업데이트 (성능 최적화)
    const distanceMoved = getDistance(this.view, this.lastGridUpdatePos);
    if (distanceMoved > MOVEMENT_THRESHOLD) {
      this.lastGridUpdatePos = { x: this.view.x, y: this.view.y };
      this.debouncedUpdateGridItems();
    }

    // setState 완전 제거 - 인스턴스 변수로 관리
    this.lastMoveTime = now;
    this.lastPos = { ...p };
  };
  private handleUp = () => {
    this.setState({ isDragging: false });
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Get the scroll deltas
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;

    // Update view directly
    this.view.x -= deltaX;
    this.view.y -= deltaY;
    this.view.vx = 0;
    this.view.vy = 0; // Reset velocity when scrolling

    if (this.innerRef.current) {
      this.innerRef.current.style.transform = `translate3d(${this.view.x}px, ${this.view.y}px, 0)`;
    }

    this.debouncedUpdateGridItems();
  };

  render() {
    const { isDragging, gridItems, isMoving } = this.state;
    const { gridSize, className } = this.props;

    // Get container dimensions
    const containerRect = this.containerRef.current?.getBoundingClientRect();
    const containerWidth = containerRect?.width || 0;
    const containerHeight = containerRect?.height || 0;

    return (
      <div
        ref={this.containerRef as React.RefObject<HTMLDivElement>}
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          touchAction: 'none',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => {
          // 카드 클릭을 방해하지 않도록 조건 추가
          if (e.target === e.currentTarget) {
            this.handleDown({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseMove={(e) => {
          // 드래그 중일 때만 이동 처리
          if (this.state.isDragging) {
            this.handleMove({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseUp={(e) => {
          // 드래그 중일 때만 처리
          if (this.state.isDragging) {
            this.handleUp();
          }
        }}
        onMouseLeave={(e) => {
          // 드래그 중일 때만 처리
          if (this.state.isDragging) {
            this.handleUp();
          }
        }}
      >
        <div
          ref={this.innerRef}
          style={{
            position: 'absolute',
            inset: 0,
            // React 렌더와 직접 DOM 조작 분리: 초기값만 설정
            transform: `translate3d(${this.view.x}px, ${this.view.y}px, 0)`,
            willChange: 'transform',
          }}
        >
          {gridItems.map((item) => {
            const { cellWidthRatio = 1.0 } = this.props;
            const cellWidth = gridSize * cellWidthRatio;
            const cellHeight = gridSize;

            const spacingX = cellWidth * 1.1; // 10% 추가 가로 간격
            const spacingY = cellHeight * 1.1; // 10% 추가 세로 간격
            const x = item.position.x * spacingX + containerWidth / 2;
            const y = item.position.y * spacingY + containerHeight / 2;

            return (
              <div
                key={`${item.position.x}-${item.position.y}`}
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  width: cellWidth,
                  height: cellHeight,
                  transform: `translate3d(${x}px, ${y}px, 0)`,
                  marginLeft: `-${cellWidth / 2}px`,
                  marginTop: `-${cellHeight / 2}px`,
                  willChange: 'transform',
                }}
              >
                {this.props.renderItem({
                  gridIndex: item.gridIndex,
                  position: item.position,
                  isMoving,
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ThiingsGrid;
