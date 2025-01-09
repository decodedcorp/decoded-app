'use client';

import { useState } from 'react';
import { GridBackground } from './components/grid';
import { FloatingBoxes } from './components/floating-boxes';
import { BoxPosition } from './utils/types';
import ScrollIndicator from './components/scroll-indicator';

export function HeroClient() {
  const [positions, setPositions] = useState<BoxPosition>({});
  const [isBoxHovered, setIsBoxHovered] = useState(false);
  const [highlightArea, setHighlightArea] = useState<
    { x: number; y: number; radius: number } | undefined
  >();

  const handleBoxHover = (
    isHovered: boolean,
    x?: number,
    y?: number,
    isLarge?: boolean
  ) => {
    setIsBoxHovered(isHovered);
    if (isHovered && x !== undefined && y !== undefined) {
      setHighlightArea({ x, y, radius: isLarge ? 300 : 240 });
    } else {
      setHighlightArea(undefined);
    }
  };

  return (
    <>
      {/* Interactive Layers */}
      <div className="absolute inset-0 z-base">
        <GridBackground
          isHighlighted={isBoxHovered}
          highlightArea={highlightArea}
        />
      </div>

      <div className="absolute inset-0 z-overlay pointer-events-auto">
        <FloatingBoxes
          onPositionsChange={setPositions}
          onHoverChange={handleBoxHover}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute inset-x-0 bottom-0 z-modalContent h-24 flex items-center justify-center pointer-events-auto">
        <ScrollIndicator />
      </div>
    </>
  );
}
