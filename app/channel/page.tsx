'use client';

import React from 'react';
import { ChannelHero } from './components/hero/ChannelHero';
import { SimpleGrid } from './components/category-grid/SimpleGrid';

export default function ChannelPage() {
  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-6">
      <ChannelHero />
      <div className="h-8" />
      <SimpleGrid />
    </div>
  );
} 