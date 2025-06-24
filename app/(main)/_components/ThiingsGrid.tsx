'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

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
}

export interface ThiingsGridRef {
  publicGetCurrentPosition: () => Position;
}

const ThiingsGrid = forwardRef<ThiingsGridRef, ThiingsGridProps>(
  ({ gridWidth, gridHeight, renderItem, className = '', initialPosition = { x: 0, y: 0 } }, ref) => {
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

    // Calculate grid dimensions
    const containerWidth = containerRef.current?.clientWidth || 0;
    const containerHeight = containerRef.current?.clientHeight || 0;
    
    const cols = Math.ceil(containerWidth / gridWidth) + 2;
    const rows = Math.ceil(containerHeight / gridHeight) + 2;
    
    const startCol = Math.floor(-position.x / gridWidth);
    const startRow = Math.floor(-position.y / gridHeight);

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
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => {
              const gridX = startCol + col;
              const gridY = startRow + row;
              const gridIndex = generateGridIndex(gridX, gridY);
              
              return (
                <div
                  key={`${gridX}-${gridY}`}
                  className="absolute"
                  style={{
                    left: gridX * gridWidth,
                    top: gridY * gridHeight,
                    width: gridWidth,
                    height: gridHeight,
                  }}
                >
                  {renderItem({
                    gridIndex,
                    position: { x: gridX, y: gridY },
                    isMoving,
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);

ThiingsGrid.displayName = 'ThiingsGrid';

export default ThiingsGrid; 