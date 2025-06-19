'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebar } from '@/lib/contexts/sidebar-context';

interface ImageHeaderProps {
  onClick: (e: React.MouseEvent) => void;
  isOverlayOpen: boolean;
}

export function ImageHeader({ onClick, isOverlayOpen }: ImageHeaderProps) {
  const { isSidebarOpen } = useSidebar();
  
  // 사이드바가 열려있을 때 헤더 넓이 조정
  const headerWidth = isSidebarOpen ? 'calc(100% - 80px)' : '100%';
  const headerLeft = isSidebarOpen ? '40px' : '0';

  return (
    <div
      className="absolute top-0 left-0 z-30 bg-black/80 backdrop-blur-sm rounded-b-lg cursor-pointer transition-all duration-300 ease-in-out"
      style={{
        width: headerWidth,
        left: headerLeft,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center p-2">
        {isOverlayOpen ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white" />
        )}
      </div>
    </div>
  );
} 