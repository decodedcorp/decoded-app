'use client';

import React, { ReactNode } from 'react';

interface ChannelModalContainerProps {
  children: ReactNode;
}

export function ChannelModalContainer({ children }: ChannelModalContainerProps) {
  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[90vw] xl:w-[90vw] max-w-[1200px] h-[98vh] sm:h-[93vh] md:h-[88vh] lg:h-[88vh] xl:h-[88vh] max-h-[950px] overflow-hidden md:overflow-hidden shadow-2xl flex relative">
      {/* Main Content - Full Width with mobile scroll */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:overflow-y-auto">
        {/* Content Area - children을 직접 배치 */}
        {children}
      </div>
    </div>
  );
}
