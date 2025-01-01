'use client';

import { useState } from 'react';
import { GridBackground } from './grid-background';
import ScrollIndicator from './scroll-indicator';
import { HeroContent } from './components/hero-content';
import { FloatingBoxes } from './components/floating-boxes';

export function Hero() {
  const [gridSize, setGridSize] = useState({ cols: 20, rows: 12 });

  const handleGridSizeChange = (newSize: { cols: number; rows: number }) => {
    setGridSize(newSize);
  };

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden">
      {/* Grid Background Layer */}
      <div className="absolute inset-0">
        <GridBackground onGridSizeChange={handleGridSizeChange} />
      </div>

      {/* Content Layer */}
      <div className="relative h-full flex flex-col z-10">
        <HeroContent />
        <div className="relative h-24 flex items-center justify-center">
          <ScrollIndicator />
        </div>
      </div>

      {/* Floating Boxes Layer */}
      <FloatingBoxes />
    </section>
  );
}
