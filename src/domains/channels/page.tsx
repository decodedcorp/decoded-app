'use client';

import React from 'react';
import { ChannelHero } from './components/hero/ChannelHero';
import { MasonryGrid } from './components/category-grid/MasonryGrid';

export default function ChannelPage() {
  return (
    <div className="min-h-screen w-full px-2 md:px-4 py-6">
      <ChannelHero />
      <div className="h-8" />
      <MasonryGrid />
    </div>
  );
}
