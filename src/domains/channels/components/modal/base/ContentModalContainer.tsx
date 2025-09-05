'use client';

import React, { ReactNode } from 'react';

interface ContentModalContainerProps {
  children: ReactNode;
  className?: string;
}

export function ContentModalContainer({ children, className = '' }: ContentModalContainerProps) {
  return (
    <div
      className={`bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-full max-w-[48vw] lg:max-w-[48vw] max-h-[80vh] overflow-hidden animate-scale-in shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}
