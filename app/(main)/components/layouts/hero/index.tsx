'use client';

import { useState } from 'react';
import { GridBackground } from './components/grid';
import { FloatingBoxes } from './components/floating-boxes';
import { BoxPosition } from './components/floating-boxes/types';
import { HeroContent } from './components/hero-content';
import ScrollIndicator from './components/scroll-indicator';

export function Hero() {
  const [positions, setPositions] = useState<BoxPosition>({});
  const [isBoxHovered, setIsBoxHovered] = useState(false);
  const [highlightArea, setHighlightArea] = useState<{ x: number; y: number; radius: number } | undefined>();

  const handleBoxHover = (isHovered: boolean, x?: number, y?: number, isLarge?: boolean) => {
    setIsBoxHovered(isHovered);
    if (isHovered && x !== undefined && y !== undefined) {
      const radius = isLarge ? 300 : 240;
      setHighlightArea({ x, y, radius });
    } else {
      setHighlightArea(undefined);
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Layer - z-0 */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Grid Layer - z-1 */}
      <div className="absolute inset-0 z-[1]">
        <GridBackground 
          isHighlighted={isBoxHovered} 
          highlightArea={highlightArea}
        />
      </div>
      
      {/* Floating Boxes - z-2 */}
      <div className="absolute inset-0 z-[2]">
        <FloatingBoxes 
          onPositionsChange={setPositions} 
          onHoverChange={handleBoxHover}
        />
      </div>
      
      {/* Hero Content - z-3 */}
      <div className="absolute inset-0 z-[3] flex flex-col min-h-screen pointer-events-none">
        <div className="flex-1 flex items-center justify-center">
          <div className="pointer-events-auto">
            <HeroContent />
          </div>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="pointer-events-auto">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  );
}
