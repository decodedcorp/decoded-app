'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import type { ImageItemData } from '../_types/image-grid';

interface Camera {
  x: number;
  y: number;
  scale: number;
}

interface CanvasWrapperProps {
  children: React.ReactNode;
  onCameraChange: (camera: Camera) => void;
  camera: Camera;
  onItemClick?: (item: ImageItemData) => void;
}

export function CanvasWrapper({
  children,
  onCameraChange,
  camera,
  onItemClick,
}: CanvasWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, cameraX: 0, cameraY: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // 좌클릭만 처리
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
    };
    
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [camera]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    const newCamera = {
      x: dragStartRef.current.cameraX + deltaX,
      y: dragStartRef.current.cameraY + deltaY,
      scale: camera.scale,
    };
    
    onCameraChange(newCamera);
  }, [isDragging, camera.scale, onCameraChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, camera.scale * scaleChange));
    
    // 마우스 포인터 위치를 중심으로 줌
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const scaleRatio = newScale / camera.scale;
      const newX = mouseX - (mouseX - camera.x) * scaleRatio;
      const newY = mouseY - (mouseY - camera.y) * scaleRatio;
      
      onCameraChange({
        x: newX,
        y: newY,
        scale: newScale,
      });
    }
  }, [camera, onCameraChange]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="w-full h-full overflow-hidden relative cursor-grab"
      style={{
        touchAction: 'none',
      }}
    >
      <div
        className="absolute origin-center"
        style={{
          transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`,
          willChange: 'transform',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
} 