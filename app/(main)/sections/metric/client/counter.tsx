'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface CounterProps {
  from?: number;
  to: number;
  className?: string;
}

export function Counter({ from = 0, to, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false });
  const count = useMotionValue(from);
  const rounded = useSpring(count, {
    stiffness: 100,
    damping: 20,
    restSpeed: 0.5,
  });

  useEffect(() => {
    if (isInView && to !== undefined) {
      count.set(to);
    }
  }, [isInView, to, count]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [rounded]);

  return <span ref={ref} className={className} />;
}

export default Counter;
