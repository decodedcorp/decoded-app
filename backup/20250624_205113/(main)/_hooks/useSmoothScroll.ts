import { useCallback, useRef } from 'react';

interface SmoothScrollConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

export function useSmoothScroll(config: SmoothScrollConfig = {
  damping: 0.8,
  stiffness: 0.1,
  mass: 1
}) {
  const velocityRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const smoothScrollTo = useCallback((
    targetOffset: { x: number; y: number },
    currentOffset: { x: number; y: number },
    setOffset: (offset: { x: number; y: number }) => void
  ) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const dx = targetOffset.x - currentOffset.x;
      const dy = targetOffset.y - currentOffset.y;

      // 스프링 물리 계산
      const springForceX = dx * config.stiffness;
      const springForceY = dy * config.stiffness;

      const dampingForceX = -velocityRef.current.x * config.damping;
      const dampingForceY = -velocityRef.current.y * config.damping;

      const accelerationX = (springForceX + dampingForceX) / config.mass;
      const accelerationY = (springForceY + dampingForceY) / config.mass;

      velocityRef.current.x += accelerationX * deltaTime;
      velocityRef.current.y += accelerationY * deltaTime;

      const newX = currentOffset.x + velocityRef.current.x * deltaTime;
      const newY = currentOffset.y + velocityRef.current.y * deltaTime;

      setOffset({ x: newX, y: newY });

      // 목표에 충분히 가까워지면 애니메이션 중단
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setOffset(targetOffset);
        velocityRef.current = { x: 0, y: 0 };
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [config]);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    velocityRef.current = { x: 0, y: 0 };
    lastTimeRef.current = 0;
  }, []);

  return {
    smoothScrollTo,
    stopAnimation,
  };
} 