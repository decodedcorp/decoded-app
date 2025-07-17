'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomTooltipProps {
  text: string;
  children: React.ReactNode;
}

export function CustomTooltip({ text, children }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 왼쪽에 공간이 부족한 경우
      if (triggerRect.left < tooltipRect.width + 10) {
        setPosition('right');
      }
      // 오른쪽에 공간이 부족한 경우
      else if (triggerRect.right + tooltipRect.width > viewportWidth) {
        setPosition('left');
      }
      // 위쪽에 공간이 부족한 경우
      else if (triggerRect.top < tooltipRect.height + 10) {
        setPosition('bottom');
      }
      // 아래쪽에 공간이 부족한 경우
      else if (triggerRect.bottom + tooltipRect.height > viewportHeight) {
        setPosition('top');
      }
    }
  }, [isVisible]);

  const getPositionClasses = () => {
    switch (position) {
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      default:
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <div 
        ref={tooltipRef}
        className={`
          absolute z-50 w-max max-w-[180px] px-2 py-1 text-xs
          bg-[#1A1A1A] text-gray-300 rounded-md
          pointer-events-none
          transition-opacity duration-150
          ${getPositionClasses()}
          ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}
        `}
      >
        {text}
      </div>
    </div>
  );
}
