'use client';

import { BoxSizeMode } from '../../utils/types';
import { BoxContainer } from './box-container';
import type { RandomImageResource, RandomItemResource } from '@/lib/api/client/images';

interface FloatingBoxesProps {
  sizeMode: BoxSizeMode;
  onHoverChange?: () => void;
  initialResources: (RandomImageResource | RandomItemResource)[];
}

export function FloatingBoxes({ sizeMode, onHoverChange, initialResources }: FloatingBoxesProps) {
  return (
    <BoxContainer
      sizeMode={sizeMode}
      onBoxHover={onHoverChange}
      resources={initialResources}
    />
  );
}

export * from '../../utils/types';
export * from '../../utils/constants';
