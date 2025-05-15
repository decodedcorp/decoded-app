import { useState, useRef, useEffect } from 'react';

export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentDragY, setCurrentDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY;
    if (deltaY > 0) {
      const dampedDeltaY = deltaY * 0.8;
      setCurrentDragY(dampedDeltaY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (currentDragY > 100) {
      setIsOpen(false);
    }
    setIsDragging(false);
    setCurrentDragY(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - dragStartY;
    if (deltaY > 0) {
      const dampedDeltaY = deltaY * 0.8;
      setCurrentDragY(dampedDeltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (currentDragY > 100) {
      setIsOpen(false);
    }
    setIsDragging(false);
    setCurrentDragY(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return {
    isOpen,
    setIsOpen,
    isDragging,
    currentDragY,
    bottomSheetRef,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
} 