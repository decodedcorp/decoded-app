'use client';

import React, { ReactNode } from 'react';

interface ChannelModalContainerProps {
  children: ReactNode;
}

export function ChannelModalContainer({ children }: ChannelModalContainerProps) {
  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[90vw] xl:w-[90vw] max-w-[1200px] h-[90vh] sm:h-[85vh] md:h-[80vh] lg:h-[80vh] xl:h-[80vh] max-h-[800px] overflow-hidden shadow-2xl flex relative">
      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Area - children을 직접 배치 */}
        {children}
      </div>
    </div>
  );
}
