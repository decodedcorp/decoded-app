'use client';

import React, { ReactNode } from 'react';

interface ChannelModalContainerProps {
  children: ReactNode;
}

export function ChannelModalContainer({
  children,
}: ChannelModalContainerProps) {
  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[70vw] max-w-[1000px] h-[70vh] overflow-hidden animate-bounce-in shadow-2xl flex">
      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Area - children을 직접 배치 */}
        {children}
      </div>
    </div>
  );
}
