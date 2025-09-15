import { useEffect, useState } from 'react';

/**
 * Mobile optimization hook for handling viewport, network, and device-specific optimizations
 */
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('4g');
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    // Check network status
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);

      // @ts-ignore - navigator.connection is not in standard types
      const connection = navigator.connection;
      if (connection) {
        const effectiveType = connection.effectiveType || '4g';
        setConnectionType(effectiveType);
        setIsSlowConnection(effectiveType === 'slow-2g' || effectiveType === '2g');
      }
    };

    // Initial checks
    checkMobile();
    updateNetworkStatus();

    // Event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // @ts-ignore
    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);

      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return {
    isMobile,
    isOnline,
    connectionType,
    isSlowConnection,
    shouldReduceAnimations: isSlowConnection,
    shouldLazyLoadImages: connectionType !== '4g',
  };
};

/**
 * Hook for handling mobile viewport height changes (address bar hiding/showing)
 */
export const useMobileViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    // Initial height
    updateViewportHeight();

    // Listen for resize events (address bar changes)
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  return {
    viewportHeight,
    isViewportStable: viewportHeight > 0,
  };
};

/**
 * Hook for handling touch gestures and preventing conflicts with system gestures
 */
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default for edge swipes to avoid conflicts with system back gesture
    const touch = e.touches[0];
    if (touch.clientX < 20 || touch.clientX > window.innerWidth - 20) {
      e.preventDefault();
    }
  };

  const getSwipeDirection = () => {
    if (!touchStart || !touchEnd) return null;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return Math.abs(deltaX) > minSwipeDistance ? (deltaX > 0 ? 'right' : 'left') : null;
    } else {
      return Math.abs(deltaY) > minSwipeDistance ? (deltaY > 0 ? 'down' : 'up') : null;
    }
  };

  return {
    touchStart,
    touchEnd,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    getSwipeDirection,
  };
};
