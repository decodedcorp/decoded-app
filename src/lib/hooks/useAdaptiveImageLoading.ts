import { useState, useEffect } from 'react';

import { ImageSize, ImageQuality } from '@/lib/utils/imageProxy';

interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
}

interface AdaptiveImageOptions {
  quality: ImageQuality;
  size: ImageSize;
  progressive: boolean;
}

/**
 * 네트워크 상태와 디바이스에 따른 적응형 이미지 로딩 옵션 제공
 */
export const useAdaptiveImageLoading = (containerWidth?: number): AdaptiveImageOptions => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  useEffect(() => {
    // 네트워크 정보 감지
    if ('connection' in navigator && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      });

      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        });
      };

      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // 적응형 옵션 계산 (품질 우선 모드)
  const getAdaptiveOptions = (): AdaptiveImageOptions => {
    // 기본값 - 품질 우선
    let quality: ImageQuality = 'max';
    let size: ImageSize = 'large';
    let progressive = false;

    // 네트워크 상태 기반 최적화 (품질은 유지하면서 사이즈만 조정)
    if (networkInfo) {
      switch (networkInfo.effectiveType) {
        case 'slow-2g':
        case '2g':
          quality = 'medium'; // low → medium으로 품질 향상
          size = 'medium'; // small → medium으로 크기 향상
          progressive = true;
          break;
        case '3g':
          quality = 'high'; // low → high로 품질 향상
          size = 'medium';
          progressive = true;
          break;
        case '4g':
          quality = 'max'; // high → max로 최고 품질
          size = 'large';
          progressive = false;
          break;
        default:
          quality = 'max'; // high → max로 최고 품질
          size = 'large';
          progressive = false;
      }

      // 낮은 대역폭인 경우에도 품질은 최대한 유지
      if (networkInfo.downlink < 1.5) {
        quality = 'medium'; // low → medium으로 품질 향상
        size = 'medium'; // small → medium으로 크기 향상
        progressive = true;
      }
    }

    // 컨테이너 크기 기반 사이즈 조정
    if (containerWidth) {
      if (containerWidth <= 200) {
        size = 'thumb';
      } else if (containerWidth <= 400) {
        size = 'small';
      } else if (containerWidth <= 800) {
        size = 'medium';
      } else {
        size = 'large';
      }
    }

    return { quality, size, progressive };
  };

  return getAdaptiveOptions();
};

/**
 * 이미지 로딩 상태 추적
 */
export const useImageLoadingState = (src: string) => {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [loadTime, setLoadTime] = useState<number>(0);

  useEffect(() => {
    if (!src) return;

    setState('loading');
    const startTime = Date.now();

    const img = new Image();
    
    img.onload = () => {
      setState('loaded');
      setLoadTime(Date.now() - startTime);
    };
    
    img.onerror = () => {
      setState('error');
      setLoadTime(Date.now() - startTime);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { state, loadTime };
};

/**
 * 이미지 우선순위 기반 로딩 스케줄링
 */
export const useImagePriority = (priority: 'high' | 'medium' | 'low' = 'medium') => {
  const [shouldLoad, setShouldLoad] = useState(priority === 'high');

  useEffect(() => {
    if (priority === 'high') {
      setShouldLoad(true);
      return;
    }

    // 우선순위가 낮은 이미지는 지연 로딩
    const delay = priority === 'medium' ? 100 : 500;
    const timer = setTimeout(() => setShouldLoad(true), delay);

    return () => clearTimeout(timer);
  }, [priority]);

  return shouldLoad;
};