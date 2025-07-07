'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { debounce } from 'lodash';

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
  viewportMargin?: number;
  onScrollStateChange?: (isScrolling: boolean) => void;
  selectedImagePosition?: Position | null;
  onImageCentered?: () => void;
  isSidebarOpen?: boolean;
  enableZoom?: boolean;
  onZoomChange?: (zoomLevel: number) => void;
}

export interface ThiingsGridRef {
  publicGetCurrentPosition: () => Position;
  centerOnPosition: (position: Position) => void;
  resetZoom: () => void;
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
        willChange: 'transform',
        backfaceVisibility: 'hidden',
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
    viewportMargin = 800,
    onScrollStateChange,
    selectedImagePosition,
    onImageCentered,
    isSidebarOpen = false,
    enableZoom = false,
    onZoomChange
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [debouncedPosition, setDebouncedPosition] = useState<Position>({ x: 0, y: 0 });
    const [isMoving, setIsMoving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 });
    const [lastDragTime, setLastDragTime] = useState(0);
    const [lastDragPosition, setLastDragPosition] = useState<Position>({ x: 0, y: 0 });
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    
    // 중앙 이동 애니메이션을 위한 상태 추가
    const [isCentering, setIsCentering] = useState(false);
    const [centerAnimationStart, setCenterAnimationStart] = useState<Position>({ x: 0, y: 0 });
    const [centerAnimationTarget, setCenterAnimationTarget] = useState<Position>({ x: 0, y: 0 });
    const [centerAnimationProgress, setCenterAnimationProgress] = useState(0);

    // 줌 상태 관리
    const [zoomLevel, setZoomLevel] = useState(1);
    const [targetZoomLevel, setTargetZoomLevel] = useState(1);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomAnimationProgress, setZoomAnimationProgress] = useState(0);
    const [zoomAnimationStart, setZoomAnimationStart] = useState(1);

    // Expose public methods
    useImperativeHandle(ref, () => ({
      publicGetCurrentPosition: () => position,
      centerOnPosition: (targetPosition: Position) => {
        if (isCentering || isDragging) return;
        
        setIsCentering(true);
        setIsZooming(true);
        setCenterAnimationStart({ ...position });
        setCenterAnimationTarget(targetPosition);
        setCenterAnimationProgress(0);
        
        // 줌 애니메이션 설정
        setZoomAnimationStart(zoomLevel); // 현재 줌 레벨을 시작점으로 설정
        setTargetZoomLevel(enableZoom ? 1.5 : 1); // 줌이 활성화되어 있으면 1.5배, 아니면 1배
        setZoomAnimationProgress(0);
        
        // 스크롤 상태 변경 알림
        onScrollStateChange?.(true);
        
        // 애니메이션 시작
        const startTime = Date.now();
        const duration = 800; // 800ms 애니메이션
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // 부드러운 이징 함수 (ease-out)
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          setCenterAnimationProgress(easedProgress);
          setZoomAnimationProgress(easedProgress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // 애니메이션 완료
            setIsCentering(false);
            setIsZooming(false);
            setPosition(targetPosition);
            setDebouncedPosition(targetPosition);
            setZoomLevel(targetZoomLevel);
            onZoomChange?.(targetZoomLevel);
            onScrollStateChange?.(false);
            onImageCentered?.();
          }
        };
        
        requestAnimationFrame(animate);
      },
      resetZoom: () => {
        setIsCentering(true);
        setIsZooming(true);
        setCenterAnimationStart({ ...position });
        setCenterAnimationTarget({ x: 0, y: 0 });
        setCenterAnimationProgress(0);
        setZoomAnimationStart(zoomLevel); // 현재 줌 레벨을 시작점으로 설정
        setTargetZoomLevel(1);
        setZoomAnimationProgress(0);
        
        // 스크롤 상태 변경 알림
        onScrollStateChange?.(true);
        
        // 애니메이션 시작
        const startTime = Date.now();
        const duration = 600; // 600ms 애니메이션
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // 부드러운 이징 함수 (ease-out)
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          setCenterAnimationProgress(easedProgress);
          setZoomAnimationProgress(easedProgress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // 애니메이션 완료
            setIsCentering(false);
            setIsZooming(false);
            setPosition({ x: 0, y: 0 });
            setDebouncedPosition({ x: 0, y: 0 });
            setZoomLevel(1);
            onZoomChange?.(1);
            onScrollStateChange?.(false);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }));

    // 디바운스된 position 업데이트
    const debouncedSetPosition = useMemo(
      () => debounce((newPosition: Position) => {
        setDebouncedPosition(newPosition);
      }, isDragging ? 16 : 50), // 더 빠른 디바운싱 (60fps)
      [isDragging]
    );

    // position이 변경될 때 디바운스된 업데이트
    useEffect(() => {
      if (!isCentering) {
        debouncedSetPosition(position);
      }
    }, [position, debouncedSetPosition, isCentering]);

    // 중앙 이동 애니메이션 중 position 업데이트
    useEffect(() => {
      if (isCentering && centerAnimationProgress > 0) {
        const newX = centerAnimationStart.x + (centerAnimationTarget.x - centerAnimationStart.x) * centerAnimationProgress;
        const newY = centerAnimationStart.y + (centerAnimationTarget.y - centerAnimationStart.y) * centerAnimationProgress;
        setPosition({ x: newX, y: newY });
      }
    }, [isCentering, centerAnimationProgress, centerAnimationStart, centerAnimationTarget]);

    // 줌 애니메이션 중 zoom 업데이트
    useEffect(() => {
      if (isZooming && zoomAnimationProgress > 0) {
        const currentZoom = zoomAnimationStart + (targetZoomLevel - zoomAnimationStart) * zoomAnimationProgress;
        setZoomLevel(currentZoom);
        onZoomChange?.(currentZoom);
      }
    }, [isZooming, zoomAnimationProgress, zoomAnimationStart, targetZoomLevel, onZoomChange]);

    // selectedImagePosition이 변경될 때 자동으로 중앙 이동
    useEffect(() => {
      if (selectedImagePosition && containerDimensions.width > 0 && containerDimensions.height > 0) {
        // 사이드바를 고려한 중앙 위치 계산
        const availableWidth = isSidebarOpen ? containerDimensions.width * 0.65 : containerDimensions.width; // 사이드바가 열려있으면 65%만 사용
        const sidebarOffset = isSidebarOpen ? containerDimensions.width * 0.005 : 0; // 사이드바 오프셋을 0.175에서 0.1로 줄여서 더 중앙에 가깝게
        
        // 이미지 위치를 사이드바를 고려한 중앙으로 이동시키는 계산
        const targetX = -(selectedImagePosition.x * gridWidth) + (availableWidth - gridWidth) / 2 - sidebarOffset;
        const targetY = -(selectedImagePosition.y * gridHeight) + (containerDimensions.height - gridHeight) / 2;
        
        // 현재 ref를 통해 centerOnPosition 호출
        if (ref && typeof ref === 'object' && ref.current) {
          ref.current.centerOnPosition({ x: targetX, y: targetY });
        }
      }
    }, [selectedImagePosition, containerDimensions, gridWidth, gridHeight, ref, isSidebarOpen]);

    // 컨테이너 크기 감지 및 업데이트
    useEffect(() => {
      const updateContainerDimensions = () => {
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setContainerDimensions({ width: clientWidth, height: clientHeight });
        }
      };

      updateContainerDimensions();
      
      const resizeObserver = new ResizeObserver(updateContainerDimensions);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // 뷰포트 마진을 포함한 렌더링 영역 계산 (최적화)
    const gridDimensions = useMemo(() => {
      const { width: containerWidth, height: containerHeight } = containerDimensions;
      
      if (containerWidth === 0 || containerHeight === 0) {
        return { cols: 0, rows: 0, startCol: 0, startRow: 0 };
      }
      
      // 뷰포트 마진을 포함한 렌더링 영역 계산
      const renderWidth = containerWidth + viewportMargin * 2;
      const renderHeight = containerHeight + viewportMargin * 2;
      
      const cols = Math.ceil(renderWidth / gridWidth) + 4; // 여유분 단축
      const rows = Math.ceil(renderHeight / gridHeight) + 4; // 여유분 단축
      
      // 스크롤 중일 때는 position을 직접 사용, 정지 상태일 때는 debouncedPosition 사용
      const currentPosition = isDragging ? position : debouncedPosition;
      const startCol = Math.floor(-currentPosition.x / gridWidth) - 2; // 여유분 단축
      const startRow = Math.floor(-currentPosition.y / gridHeight) - 2; // 여유분 단축
      
      return { cols, rows, startCol, startRow };
    }, [containerDimensions, position, debouncedPosition, isDragging, gridWidth, gridHeight, viewportMargin]);

    // Generate grid indices (메모이제이션)
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

    // 뷰포트 내 아이템들만 메모이제이션하여 계산 (부드러운 스크롤 최적화)
    const visibleItems = useMemo(() => {
      const { cols, rows, startCol, startRow } = gridDimensions;
      
      if (cols === 0 || rows === 0) return [];
      
      const items: Array<{
        gridX: number;
        gridY: number;
        gridIndex: number;
      }> = [];

      // 스크롤 중일 때는 모든 아이템을 렌더링하여 부드러운 스크롤 보장
      if (isDragging) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const gridX = startCol + col;
            const gridY = startRow + row;
            const gridIndex = generateGridIndex(gridX, gridY);
            items.push({ gridX, gridY, gridIndex });
          }
        }
      } else {
        // 정지 상태일 때만 간단한 뷰포트 체크
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const gridX = startCol + col;
            const gridY = startRow + row;
            
            // 간단한 거리 기반 체크로 성능 향상
            const itemCenterX = (gridX + 0.5) * gridWidth;
            const itemCenterY = (gridY + 0.5) * gridHeight;
            const currentPosition = debouncedPosition;
            
            const distanceX = Math.abs(itemCenterX + currentPosition.x);
            const distanceY = Math.abs(itemCenterY + currentPosition.y);
            const maxDistance = Math.max(containerDimensions.width, containerDimensions.height) + viewportMargin * 0.3; // 더 작은 거리로 최적화
            
            if (distanceX < maxDistance && distanceY < maxDistance) {
              const gridIndex = generateGridIndex(gridX, gridY);
              items.push({ gridX, gridY, gridIndex });
            }
          }
        }
      }

      return items;
    }, [gridDimensions, generateGridIndex, isDragging, debouncedPosition, containerDimensions, gridWidth, gridHeight, viewportMargin]);

    // Mouse event handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (isCentering) return; // 중앙 이동 중에는 드래그 방지
      
      e.preventDefault();
      setIsDragging(true);
      setIsMoving(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      setVelocity({ x: 0, y: 0 });
      onScrollStateChange?.(true);
    }, [position, onScrollStateChange, isCentering]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging || isCentering) return;
      
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      
      setPosition(newPosition);
      
      const now = Date.now();
      if (now - lastDragTime > 8) { // ~120fps로 향상
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
    }, [isDragging, isCentering, dragStart, lastDragTime, lastDragPosition]);

    const handleMouseUp = useCallback(() => {
      if (isCentering) return; // 중앙 이동 중에는 드래그 종료 방지
      
      setIsDragging(false);
      setIsMoving(false);
      onScrollStateChange?.(false);
      
      // Apply momentum with smoother deceleration
      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
        let currentVelocity = { ...velocity };
        let currentPosition = { ...position };
        
        const animate = () => {
          currentVelocity.x *= 0.92; // 더 부드러운 감속
          currentVelocity.y *= 0.92; // 더 부드러운 감속
          
          currentPosition.x += currentVelocity.x;
          currentPosition.y += currentVelocity.y;
          
          setPosition(currentPosition);
          
          if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, [velocity, position, onScrollStateChange, isCentering]);

    // Touch event handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (isCentering) return; // 중앙 이동 중에는 터치 방지
      
      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setIsMoving(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      setVelocity({ x: 0, y: 0 });
      onScrollStateChange?.(true);
    }, [position, onScrollStateChange, isCentering]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (!isDragging || isCentering) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const newPosition = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      };
      
      setPosition(newPosition);
      
      const now = Date.now();
      if (now - lastDragTime > 8) { // ~120fps로 향상
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
    }, [isDragging, isCentering, dragStart, lastDragTime, lastDragPosition]);

    const handleTouchEnd = useCallback(() => {
      if (isCentering) return; // 중앙 이동 중에는 터치 종료 방지
      
      setIsDragging(false);
      setIsMoving(false);
      onScrollStateChange?.(false);
      
      // Apply momentum with smoother deceleration
      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
        let currentVelocity = { ...velocity };
        let currentPosition = { ...position };
        
        const animate = () => {
          currentVelocity.x *= 0.92; // 더 부드러운 감속
          currentVelocity.y *= 0.92; // 더 부드러운 감속
          
          currentPosition.x += currentVelocity.x;
          currentPosition.y += currentVelocity.y;
          
          setPosition(currentPosition);
          
          if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, [velocity, position, onScrollStateChange, isCentering]);

    // Wheel event handler
    const handleWheel = useCallback((e: React.WheelEvent) => {
      if (isCentering) return; // 중앙 이동 중에는 휠 스크롤 방지
      
      e.preventDefault();
      onScrollStateChange?.(true);
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
      
      // 휠 이벤트 후 스크롤 상태 해제
      setTimeout(() => {
        onScrollStateChange?.(false);
      }, 100);
    }, [onScrollStateChange, isCentering]);

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
        style={{ 
          cursor: isDragging ? 'grabbing' : isCentering ? 'default' : 'grab',
          pointerEvents: isCentering ? 'none' : 'auto'
        }}
      >
        <div
          className="absolute origin-center"
          style={{
            willChange: 'transform',
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoomLevel})`,
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            // 중앙 이동 중일 때는 트랜지션 제거, 정지 시에만 부드러운 트랜지션
            transition: isDragging || isCentering ? 'none' : 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {/* 뷰포트 내 아이템들만 렌더링 */}
          {visibleItems.map(({ gridX, gridY, gridIndex }) => (
            <GridItem
              key={`${gridX}-${gridY}`}
              gridX={gridX}
              gridY={gridY}
              gridIndex={gridIndex}
              isMoving={isMoving || isCentering}
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