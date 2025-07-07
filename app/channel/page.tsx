'use client';

import React from 'react';
import { ChannelHero } from './components/hero/ChannelHero';
import { SimpleGrid } from './components/category-grid/SimpleGrid';

export default function ChannelPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <ChannelHero />
      {/* Category Grid Section */}
      <SimpleGrid />
    </div>
  );
} 