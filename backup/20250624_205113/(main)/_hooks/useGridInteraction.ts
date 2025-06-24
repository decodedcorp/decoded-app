import { useRef, useCallback, useEffect, useState } from "react";
import { throttle } from 'lodash';
import type { ImageDetail } from "../_types/image-grid";

interface GridInteractionConfig {
  scrollThreshold: number;
  dragSensitivity: number;
  momentumDecay: number;
  momentumMultiplier?: number;
  maxMomentum?: number;
  wheelSensitivity?: number;
}

interface UseGridInteractionProps {
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  contentOffset: { x: number; y: number };
  setContentOffset: (newOffset: { x: number; y: number }) => void;
  fetchImageDetail: (imageDocId: string) => void;
  setScrollingState?: (scrolling: boolean) => void;
  config?: GridInteractionConfig;
  isSidebarOpen: boolean;
}

export function useGridInteraction({
  scrollContainerRef,
  contentOffset,
  setContentOffset,
  fetchImageDetail,
  setScrollingState,
  config = {
    scrollThreshold: 2,
    dragSensitivity: 1.0,
    momentumDecay: 0.95,
    momentumMultiplier: 20,
    maxMomentum: 60,
    wheelSensitivity: 0.8,
  },
  isSidebarOpen
}: UseGridInteractionProps) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialContentOffsetRef = useRef({ x: 0, y: 0 });
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const momentumRef = useRef({ x: 0, y: 0 });
  const lastScrollTimeRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTouchPosRef = useRef({ x: 0, y: 0 });
  const [momentum, setMomentum] = useState({ x: 0, y: 0 });
  const [lastVelocity, setLastVelocity] = useState({ x: 0, y: 0 });
  
  // 모멘텀 애니메이션 프레임
  const momentumAnimationRef = useRef<number | null>(null);

  // 부드러운 스크롤을 위한 throttle
  const throttledSetContentOffset = useRef(
    throttle((newOffset: { x: number; y: number }) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setContentOffset(newOffset);
      });
    }, 16)
  ).current;

  // 스크롤 상태 업데이트
  const updateScrollingState = useCallback((scrolling: boolean) => {
    if (setScrollingState) {
      setScrollingState(scrolling);
    }
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    if (scrolling) {
      scrollTimeoutRef.current = setTimeout(() => {
        if (setScrollingState) {
          setScrollingState(false);
        }
      }, 150);
    }
  }, [setScrollingState]);

  // thiings-grid 스타일의 모멘텀 스크롤링
  const applyMomentum = useCallback(() => {
    if (Math.abs(momentum.x) < 0.1 && Math.abs(momentum.y) < 0.1) {
      setMomentum({ x: 0, y: 0 });
      setIsAnimating(false);
      return;
    }
    
    setContentOffset({
      x: contentOffset.x + momentum.x,
      y: contentOffset.y + momentum.y
    });
    
    setMomentum(prev => ({
      x: prev.x * (config.momentumDecay || 0.92),
      y: prev.y * (config.momentumDecay || 0.92)
    }));
    
    momentumAnimationRef.current = requestAnimationFrame(applyMomentum);
  }, [momentum, setContentOffset, config.momentumDecay, contentOffset]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current || isSidebarOpen) return;

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialContentOffsetRef.current = { ...contentOffset };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    
    if (setScrollingState) {
      setScrollingState(true);
    }

    // 기존 애니메이션 중단
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
    }
    momentumRef.current = { x: 0, y: 0 };
    setIsAnimating(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = (e.clientX - dragStartRef.current.x) * config.dragSensitivity;
      const dy = (e.clientY - dragStartRef.current.y) * config.dragSensitivity;

      const newOffset = {
        x: initialContentOffsetRef.current.x + dx,
        y: initialContentOffsetRef.current.y + dy,
      };

      throttledSetContentOffset(newOffset);
      
      const momentumX = e.clientX - lastMousePosRef.current.x;
      const momentumY = e.clientY - lastMousePosRef.current.y;
      momentumRef.current = { x: momentumX, y: momentumY };

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // 스크롤 시간 업데이트
      lastScrollTimeRef.current = Date.now();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      
      if (setScrollingState) {
        setScrollingState(false);
      }

      // thiings-grid 스타일의 관성 스크롤 적용
      if (Math.abs(momentumRef.current.x) > config.scrollThreshold || 
          Math.abs(momentumRef.current.y) > config.scrollThreshold) {
        
        setIsAnimating(true);
        setMomentum(momentumRef.current);
        momentumAnimationRef.current = requestAnimationFrame(applyMomentum);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scrollContainerRef, contentOffset, setContentOffset, setScrollingState, config, isSidebarOpen, applyMomentum, throttledSetContentOffset]);

  // thiings-grid 스타일의 휠 이벤트
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isSidebarOpen) return;
    
    e.preventDefault();
    
    const deltaX = e.deltaX || 0;
    const deltaY = e.deltaY || 0;
    
    const wheelSensitivity = config.wheelSensitivity || 0.8;
    
    const newOffset = {
      x: contentOffset.x - deltaX * wheelSensitivity,
      y: contentOffset.y - deltaY * wheelSensitivity
    };
    throttledSetContentOffset(newOffset);
    
    // 스크롤 시간 업데이트
    lastScrollTimeRef.current = Date.now();
    
    if (setScrollingState) {
      setScrollingState(true);
    }
    
    // 스크롤 상태 리셋
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (setScrollingState) {
        setScrollingState(false);
      }
    }, 150);
  }, [isSidebarOpen, contentOffset, setContentOffset, setScrollingState, throttledSetContentOffset, config.wheelSensitivity]);

  // thiings-grid 스타일의 터치 이벤트
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current || isSidebarOpen) return;

    const touch = e.touches[0];
    isDraggingRef.current = true;
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    initialContentOffsetRef.current = { ...contentOffset };
    lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
    lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

    if (setScrollingState) {
      setScrollingState(true);
    }

    // 기존 애니메이션 중단
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
    }
    momentumRef.current = { x: 0, y: 0 };
    setIsAnimating(false);
  }, [scrollContainerRef, contentOffset, setScrollingState, isSidebarOpen]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || isSidebarOpen) return;

    e.preventDefault();
    const touch = e.touches[0];
    
    const dx = (touch.clientX - dragStartRef.current.x) * config.dragSensitivity;
    const dy = (touch.clientY - dragStartRef.current.y) * config.dragSensitivity;

    const newOffset = {
      x: initialContentOffsetRef.current.x + dx,
      y: initialContentOffsetRef.current.y + dy,
    };

    throttledSetContentOffset(newOffset);

    const momentumX = touch.clientX - lastMousePosRef.current.x;
    const momentumY = touch.clientY - lastMousePosRef.current.y;
    momentumRef.current = { x: momentumX, y: momentumY };

    lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
    lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
    
    // 스크롤 시간 업데이트
    lastScrollTimeRef.current = Date.now();
  }, [isDraggingRef, isSidebarOpen, config.dragSensitivity, throttledSetContentOffset]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isSidebarOpen) return;
    
    isDraggingRef.current = false;
    
    if (setScrollingState) {
      setScrollingState(false);
    }
    
    // 모멘텀 계산
    if (touchStartRef.current && lastTouchPosRef.current) {
      const currentTime = Date.now();
      const timeDiff = currentTime - touchStartRef.current.time;
      
      if (timeDiff > 0) {
        const velocityX = (lastTouchPosRef.current.x - touchStartRef.current.x) / timeDiff;
        const velocityY = (lastTouchPosRef.current.y - touchStartRef.current.y) / timeDiff;
        
        const momentumX = velocityX * (config.momentumMultiplier || 15);
        const momentumY = velocityY * (config.momentumMultiplier || 15);
        
        // 최대 모멘텀 제한
        const maxMomentum = config.maxMomentum || 50;
        const clampedMomentumX = Math.max(-maxMomentum, Math.min(maxMomentum, momentumX));
        const clampedMomentumY = Math.max(-maxMomentum, Math.min(maxMomentum, momentumY));
        
        setMomentum({ x: clampedMomentumX, y: clampedMomentumY });
        setLastVelocity({ x: velocityX, y: velocityY });
        
        // 모멘텀 애니메이션 시작
        if (momentumAnimationRef.current) {
          cancelAnimationFrame(momentumAnimationRef.current);
        }
        setIsAnimating(true);
        momentumAnimationRef.current = requestAnimationFrame(applyMomentum);
      }
    }
  }, [isSidebarOpen, setScrollingState, config.momentumMultiplier, config.maxMomentum, applyMomentum]);

  const handleMouseEnterItem = useCallback((itemId: string, imageDocId: string) => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 100) {
      // 스크롤 중일 때는 hover 효과 지연
      setTimeout(() => {
        setHoveredItemId(itemId);
        fetchImageDetail(imageDocId);
      }, 150);
    } else {
      setHoveredItemId(itemId);
      fetchImageDetail(imageDocId);
    }
  }, [fetchImageDetail]);

  const handleMouseLeaveItem = useCallback(() => {
    setHoveredItemId(null);
  }, []);

  // 클린업
  useEffect(() => {
    // SSR 안전성 체크
    if (typeof window === 'undefined') {
      return;
    }
    
    const container = scrollContainerRef.current;
    
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      throttledSetContentOffset.cancel();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (momentumAnimationRef.current) {
        cancelAnimationFrame(momentumAnimationRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleWheel, scrollContainerRef, throttledSetContentOffset]);

  return {
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    hoveredItemId,
    handleMouseEnterItem,
    handleMouseLeaveItem,
    isAnimating,
  };
} 