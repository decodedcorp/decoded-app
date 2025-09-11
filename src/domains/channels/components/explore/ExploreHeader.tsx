'use client';

import React from 'react';

import { useCommonTranslation } from '@/lib/i18n/hooks';

interface ExploreHeaderProps {
  className?: string;
}



export function ExploreHeader({
  className = '',
}: ExploreHeaderProps) {
  const t = useCommonTranslation();

  return (
    <div className={`bg-black/80 backdrop-blur-sm ${className}`}>
      <div className="px-4 md:px-8 py-6">
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold text-white">CHANNELS</h1>
          <p className="text-zinc-500 text-sm mt-1">{t.ui.discoverChannels()}</p>
        </div>
      </div>
    </div>
  );
}
