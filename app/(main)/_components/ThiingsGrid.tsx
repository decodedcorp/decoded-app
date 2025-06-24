'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface ItemConfig {
  gridIndex: number;
  position: Position;
  isMoving: boolean;
}

export interface ThiingsGridProps {
  gridWidth: number;
  gridHeight: number;
  renderItem: (config: ItemConfig) => React.ReactNode;
  className?: string;
  initialPosition?: Position;
  viewportMargin?: number;
}

export interface ThiingsGridRef {
  publicGetCurrentPosition: () => Position;
}

// 개별 그리드 아이템을 메모이제이션하여 성능 최적화
const GridItem = React.memo(({ 
  gridX, 
  gridY, 
  gridIndex, 
  isMoving, 
  renderItem, 
  gridWidth, 
  gridHeight 
}: {
  gridX: number;
  gridY: number;
  gridIndex: number;
  isMoving: boolean;
  renderItem: (config: ItemConfig) => React.ReactNode;
  gridWidth: number;
  gridHeight: number;
}) => {
  const config: ItemConfig = {
    gridIndex,
    position: { x: gridX, y: gridY },
    isMoving,
  };

  return (
    <div
      className="absolute"
      style={{
        left: gridX * gridWidth,
        top: gridY * gridHeight,
        width: gridWidth,
        height: gridHeight,
      }}
    >
      {renderItem(config)}
    </div>
  );
});

GridItem.displayName = 'GridItem';

const ThiingsGrid = forwardRef<ThiingsGridRef, ThiingsGridProps>(
  ({ 
    gridWidth, 
    gridHeight, 
    renderItem, 
    className = '', 
    initialPosition = { x: 0, y: 0 },
    viewportMargin = 600
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>(initialPosition);
    const [isMoving, setIsMoving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 });
    const [lastDragTime, setLastDragTime] = useState(0);
    const [lastDragPosition, setLastDragPosition] = useState<Position>({ x: 0, y: 0 });

    // Expose public methods
    useImperativeHandle(ref, () => ({
      publicGetCurrentPosition: () => position,
    }));

    // Calculate grid dimensions with viewport optimization
    const containerWidth = containerRef.current?.clientWidth || 0;
    const containerHeight = containerRef.current?.clientHeight || 0;
    
    // 뷰포트 마진을 포함한 렌더링 영역 계산
    const renderWidth = containerWidth + viewportMargin * 2;
    const renderHeight = containerHeight + viewportMargin * 2;
    
    const cols = Math.ceil(renderWidth / gridWidth) + 2;
    const rows = Math.ceil(renderHeight / gridHeight) + 2;
    
    const startCol = Math.floor(-position.x / gridWidth);
    const startRow = Math.floor(-position.y / gridHeight);

    // 뷰포트 내 아이템만 렌더링하기 위한 필터링 함수 (메모이제이션)
    const isItemInViewport = useCallback((gridX: number, gridY: number) => {
      const itemLeft = gridX * gridWidth;
      const itemTop = gridY * gridHeight;
      const itemRight = itemLeft + gridWidth;
      const itemBottom = itemTop + gridHeight;
      
      // 뷰포트 마진을 포함한 영역
      const viewportLeft = -position.x - viewportMargin;
      const viewportTop = -position.y - viewportMargin;
      const viewportRight = -position.x + containerWidth + viewportMargin;
      const viewportBottom = -position.y + containerHeight + viewportMargin;
      
      return (
        itemRight > viewportLeft &&
        itemLeft < viewportRight &&
        itemBottom > viewportTop &&
        itemTop < viewportBottom
      );
    }, [position, containerWidth, containerHeight, gridWidth, gridHeight, viewportMargin]);

    // Generate grid indices
    const generateGridIndex = useCallback((x: number, y: number): number => {
      // Use a custom algorithm to generate unique indices
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const maxCoord = Math.max(absX, absY);
      const ring = maxCoord;
      
      if (ring === 0) return 0;
      
      let index = (ring - 1) * 8;
      
      if (y === -ring && x < ring) {
        // Top edge
        index += x + ring;
      } else if (x === ring && y < ring) {
        // Right edge
        index += ring * 2 + y + ring;
      } else if (y === ring && x > -ring) {
        // Bottom edge
        index += ring * 4 + ring - x;
      } else {
        // Left edge
        index += ring * 6 + ring - y;
      }
      
      return index;
    }, []);

    // 뷰포트 내 아이템들만 메모이제이션하여 계산
    const visibleItems = useMemo(() => {
      const items: Array<{
        gridX: number;
        gridY: number;
        gridIndex: number;
      }> = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const gridX = startCol + col;
          const gridY = startRow + row;
          
          // 뷰포트 내 아이템만 포함
          if (isItemInViewport(gridX, gridY)) {
            const gridIndex = generateGridIndex(gridX, gridY);
            items.push({ gridX, gridY, gridIndex });
          }
        }
      }

      return items;
    }, [rows, cols, startCol, startRow, isItemInViewport, generateGridIndex]);

    // Mouse event handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setIsMoving(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      setVelocity({ x: 0, y: 0 });
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging) return;
      
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      
      setPosition(newPosition);
      
      const now = Date.now();
      if (now - lastDragTime > 16) { // ~60fps
        const deltaTime = now - lastDragTime;
        const deltaX = newPosition.x - lastDragPosition.x;
        const deltaY = newPosition.y - lastDragPosition.y;
        
        setVelocity({
          x: deltaX / deltaTime * 16,
          y: deltaY / deltaTime * 16,
        });
        
        setLastDragTime(now);
        setLastDragPosition(newPosition);
      }
    }, [isDragging, dragStart, lastDragTime, lastDragPosition]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setIsMoving(false);
      
      // Apply momentum
      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
        let currentVelocity = { ...velocity };
        let currentPosition = { ...position };
        
        const animate = () => {
          currentVelocity.x *= 0.95;
          currentVelocity.y *= 0.95;
          
          currentPosition.x += currentVelocity.x;
          currentPosition.y += currentVelocity.y;
          
          setPosition(currentPosition);
          
          if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, [velocity, position]);

    // Touch event handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setIsMoving(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      setVelocity({ x: 0, y: 0 });
    }, [position]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const newPosition = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      };
      
      setPosition(newPosition);
      
      const now = Date.now();
      if (now - lastDragTime > 16) {
        const deltaTime = now - lastDragTime;
        const deltaX = newPosition.x - lastDragPosition.x;
        const deltaY = newPosition.y - lastDragPosition.y;
        
        setVelocity({
          x: deltaX / deltaTime * 16,
          y: deltaY / deltaTime * 16,
        });
        
        setLastDragTime(now);
        setLastDragPosition(newPosition);
      }
    }, [isDragging, dragStart, lastDragTime, lastDragPosition]);

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
      setIsMoving(false);
      
      // Apply momentum
      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
        let currentVelocity = { ...velocity };
        let currentPosition = { ...position };
        
        const animate = () => {
          currentVelocity.x *= 0.95;
          currentVelocity.y *= 0.95;
          
          currentPosition.x += currentVelocity.x;
          currentPosition.y += currentVelocity.y;
          
          setPosition(currentPosition);
          
          if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, [velocity, position]);

    // Wheel event handler
    const handleWheel = useCallback((e: React.WheelEvent) => {
      e.preventDefault();
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }, []);

    // Event listeners
    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="absolute origin-center"
          style={{
            willChange: 'transform',
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            backfaceVisibility: 'hidden',
            perspective: '1000px',
          }}
        >
          {/* 뷰포트 내 아이템들만 렌더링 */}
          {visibleItems.map(({ gridX, gridY, gridIndex }) => (
            <GridItem
              key={`${gridX}-${gridY}`}
              gridX={gridX}
              gridY={gridY}
              gridIndex={gridIndex}
              isMoving={isMoving}
              renderItem={renderItem}
              gridWidth={gridWidth}
              gridHeight={gridHeight}
            />
          ))}
        </div>
      </div>
    );
  }
);

ThiingsGrid.displayName = 'ThiingsGrid';

export default ThiingsGrid; 