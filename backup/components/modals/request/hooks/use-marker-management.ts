import { useState, useEffect } from 'react';
import { StylePoint } from '../types';

export function useMarkerManagement(isMobile: boolean) {
  const [points, setPoints] = useState<StylePoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    if (points.length > 0) {
      const lastIndex = points.length - 1;
      setSelectedPoint(lastIndex);
      
      if (isMobile) {
        setIsBottomSheetOpen(true);
      }
    }
  }, [points.length, isMobile]);

  useEffect(() => {
    if (selectedPoint !== null && isMobile) {
      setIsBottomSheetOpen(true);
      
      requestAnimationFrame(() => {
        const markerElement = document.getElementById(`marker-${selectedPoint}`);
        if (markerElement) {
          markerElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      });
    }
  }, [selectedPoint, isMobile]);

  const handleUpdatePoint = (index: number, updatedPoint: StylePoint) => {
    setPoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = updatedPoint;
      return newPoints;
    });
  };

  const handleDeletePoint = (index: number) => {
    setPoints(prev => prev.filter((_, i) => i !== index));
    if (selectedPoint === index) {
      setSelectedPoint(null);
    }
  };

  return {
    points,
    setPoints,
    selectedPoint,
    setSelectedPoint,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    handleUpdatePoint,
    handleDeletePoint
  };
} 