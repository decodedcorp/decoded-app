'use client';

import { useState, useEffect, useMemo } from 'react';
import { throttle } from 'lodash';

interface ScrollConfig {
  threshold?: number;
  throttleMs?: number;
  isHome?: boolean;
}

function useScroll({
  threshold = 300,
  throttleMs = 200,
  isHome = true,
}: ScrollConfig = {}) {
  const [isScrolled, setIsScrolled] = useState(!isHome);

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > threshold);
      }, throttleMs),
    [threshold, throttleMs]
  );

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, isHome]);

  return isScrolled;
}

export default useScroll;
