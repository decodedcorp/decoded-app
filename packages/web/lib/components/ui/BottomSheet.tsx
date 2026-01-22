"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";

interface BottomSheetProps {
  isOpen: boolean;
  snapPoints?: number[]; // [0.3, 0.6, 0.9]
  defaultSnapPoint?: number; // 0.3 (30%)
  children: ReactNode;
  header?: ReactNode;
  onSnapChange?: (snapPoint: number) => void;
}

/**
 * BottomSheet - 모바일용 바텀 시트 컴포넌트
 *
 * - 드래그 핸들
 * - snap 포인트 지원 (기본: 30%, 60%, 90%)
 * - 부드러운 애니메이션
 */
export function BottomSheet({
  isOpen,
  snapPoints = [0.3, 0.6, 0.9],
  defaultSnapPoint = 0.3,
  children,
  header,
  onSnapChange,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSnap, setCurrentSnap] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startSnapRef = useRef(0);

  // Find nearest snap point
  const findNearestSnap = useCallback(
    (value: number): number => {
      return snapPoints.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
    },
    [snapPoints]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      startYRef.current = clientY;
      startSnapRef.current = currentSnap;
    },
    [currentSnap]
  );

  // Handle drag move
  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;

      const deltaY = startYRef.current - clientY;
      const viewportHeight = window.innerHeight;
      const deltaPercent = deltaY / viewportHeight;

      let newSnap = startSnapRef.current + deltaPercent;
      newSnap = Math.max(snapPoints[0], Math.min(snapPoints.at(-1)!, newSnap));

      setCurrentSnap(newSnap);
    },
    [isDragging, snapPoints]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const nearestSnap = findNearestSnap(currentSnap);
    setCurrentSnap(nearestSnap);
    onSnapChange?.(nearestSnap);
  }, [isDragging, currentSnap, findNearestSnap, onSnapChange]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientY);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse event handlers (for desktop testing)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientY);
    },
    [handleDragStart]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Reset to default snap when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(defaultSnapPoint);
    }
  }, [isOpen, defaultSnapPoint]);

  if (!isOpen) return null;

  const sheetHeight = `${currentSnap * 100}%`;

  return (
    <div
      ref={sheetRef}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-background rounded-t-2xl
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
        ${isDragging ? "" : "transition-[height] duration-300 ease-out"}
      `}
      style={{
        height: sheetHeight,
        maxHeight: "90vh",
      }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Header */}
      {header && (
        <div className="px-4 pb-3 border-b border-border">{header}</div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="h-[calc(100%-48px)] overflow-y-auto overscroll-contain"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
