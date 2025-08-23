'use client';

import React, { ReactNode } from 'react';

interface ContentModalContainerProps {
  children: ReactNode;
  className?: string;
}

export function ContentModalContainer({ children, className = '' }: ContentModalContainerProps) {
  return (
    <div
      className={`bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl max-w-[48vw] w-full max-h-[95vh] overflow-hidden animate-scale-in shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}
