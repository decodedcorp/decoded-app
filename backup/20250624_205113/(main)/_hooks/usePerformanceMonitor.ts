import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  apiCallCount: number;
  visibleImageCount: number;
  totalImageCount: number;
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    apiCallCount: 0,
    visibleImageCount: 0,
    totalImageCount: 0,
  });

  const renderStartTimeRef = useRef<number>(0);

  const startRender = () => {
    renderStartTimeRef.current = performance.now();
  };

  const endRender = (visibleCount: number, totalCount: number) => {
    const renderTime = performance.now() - renderStartTimeRef.current;
    const metrics = metricsRef.current;
    
    metrics.renderCount++;
    metrics.averageRenderTime = 
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;
    metrics.visibleImageCount = visibleCount;
    metrics.totalImageCount = totalCount;

    // 성능 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', {
        renderTime: `${renderTime.toFixed(2)}ms`,
        visibleImages: visibleCount,
        totalImages: totalCount,
        renderRatio: `${((visibleCount / totalCount) * 100).toFixed(1)}%`,
      });
    }
  };

  const incrementApiCall = () => {
    metricsRef.current.apiCallCount++;
  };

  return {
    startRender,
    endRender,
    incrementApiCall,
    getMetrics: () => metricsRef.current,
  };
} 