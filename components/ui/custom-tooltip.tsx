'use client';

import { useState } from 'react';

interface CustomTooltipProps {
  text: string;
  children: React.ReactNode;
}

export function CustomTooltip({ text, children }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <div 
        className={`
          absolute z-50 w-max max-w-[180px] px-2 py-1 text-xs
          bg-[#1A1A1A] text-gray-300 rounded-md
          top-1/2 right-full -translate-y-1/2 mr-2
          pointer-events-none
          transition-opacity duration-150
          ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}
        `}
      >
        {text}
      </div>
    </div>
  );
}
