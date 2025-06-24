import { useState, useRef, useCallback, useEffect } from 'react';

interface Camera {
  x: number;
  y: number;
  scale: number;
}

interface UseCameraProps {
  initialX?: number;
  initialY?: number;
  initialScale?: number;
}

export function useCamera({
  initialX = 0,
  initialY = 0,
  initialScale = 1,
}: UseCameraProps = {}) {
  const [camera, setCamera] = useState<Camera>({
    x: initialX,
    y: initialY,
    scale: initialScale,
  });

  const lastCameraRef = useRef<Camera>(camera);
  const animationFrameRef = useRef<number | null>(null);

  // 부드러운 카메라 이동
  const animateTo = useCallback((targetCamera: Partial<Camera>, duration = 500) => {
    const startCamera = { ...camera };
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 이징 함수 (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const newCamera = {
        x: startCamera.x + (targetCamera.x ?? startCamera.x - startCamera.x) * easeProgress,
        y: startCamera.y + (targetCamera.y ?? startCamera.y - startCamera.y) * easeProgress,
        scale: startCamera.scale + (targetCamera.scale ?? startCamera.scale - startCamera.scale) * easeProgress,
      };

      setCamera(newCamera);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [camera]);

  // 특정 위치로 이동
  const panTo = useCallback((x: number, y: number, animate = true) => {
    if (animate) {
      animateTo({ x, y });
    } else {
      setCamera(prev => ({ ...prev, x, y }));
    }
  }, [animateTo]);

  // 줌
  const zoomTo = useCallback((scale: number, animate = true) => {
    const clampedScale = Math.max(0.1, Math.min(5, scale));
    if (animate) {
      animateTo({ scale: clampedScale });
    } else {
      setCamera(prev => ({ ...prev, scale: clampedScale }));
    }
  }, [animateTo]);

  // 카메라 리셋
  const resetCamera = useCallback(() => {
    animateTo({ x: initialX, y: initialY, scale: initialScale });
  }, [animateTo, initialX, initialY, initialScale]);

  // 뷰포트 계산
  const getViewportBounds = useCallback(() => {
    const { x, y, scale } = camera;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    return {
      left: -x / scale,
      top: -y / scale,
      right: (-x + viewportWidth) / scale,
      bottom: (-y + viewportHeight) / scale,
    };
  }, [camera]);

  useEffect(() => {
    lastCameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    camera,
    setCamera,
    animateTo,
    panTo,
    zoomTo,
    resetCamera,
    getViewportBounds,
  };
} 