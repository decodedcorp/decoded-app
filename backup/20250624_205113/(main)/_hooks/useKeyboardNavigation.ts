import { useCallback, useEffect, useRef } from 'react';
import type { ImageItemData } from '../_types/image-grid';

interface UseKeyboardNavigationProps {
  images: ImageItemData[];
  contentOffset: { x: number; y: number };
  setContentOffset: (offset: { x: number; y: number }) => void;
  gridConfig: {
    cellWidth: number;
    cellHeight: number;
    gap: number;
  };
  onImageSelect?: (image: ImageItemData) => void;
}

export function useKeyboardNavigation({
  images,
  contentOffset,
  setContentOffset,
  gridConfig,
  onImageSelect,
}: UseKeyboardNavigationProps) {
  const selectedImageIndexRef = useRef(0);
  const { cellWidth, cellHeight, gap } = gridConfig;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!images.length) return;

    const currentIndex = selectedImageIndexRef.current;
    const currentImage = images[currentIndex];
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        const upIndex = Math.max(0, currentIndex - Math.ceil(images.length / 10));
        selectedImageIndexRef.current = upIndex;
        const upImage = images[upIndex];
        setContentOffset({
          x: -upImage.left + window.innerWidth / 2 - cellWidth / 2,
          y: -upImage.top + window.innerHeight / 2 - cellHeight / 2,
        });
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        const downIndex = Math.min(images.length - 1, currentIndex + Math.ceil(images.length / 10));
        selectedImageIndexRef.current = downIndex;
        const downImage = images[downIndex];
        setContentOffset({
          x: -downImage.left + window.innerWidth / 2 - cellWidth / 2,
          y: -downImage.top + window.innerHeight / 2 - cellHeight / 2,
        });
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        const leftIndex = Math.max(0, currentIndex - 1);
        selectedImageIndexRef.current = leftIndex;
        const leftImage = images[leftIndex];
        setContentOffset({
          x: -leftImage.left + window.innerWidth / 2 - cellWidth / 2,
          y: -leftImage.top + window.innerHeight / 2 - cellHeight / 2,
        });
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        const rightIndex = Math.min(images.length - 1, currentIndex + 1);
        selectedImageIndexRef.current = rightIndex;
        const rightImage = images[rightIndex];
        setContentOffset({
          x: -rightImage.left + window.innerWidth / 2 - cellWidth / 2,
          y: -rightImage.top + window.innerHeight / 2 - cellHeight / 2,
        });
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onImageSelect) {
          onImageSelect(images[currentIndex]);
        }
        break;
    }
  }, [images, setContentOffset, cellWidth, cellHeight, onImageSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    selectedImageIndex: selectedImageIndexRef.current,
  };
} 