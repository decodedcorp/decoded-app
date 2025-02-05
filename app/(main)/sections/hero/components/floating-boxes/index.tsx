'use client';

import { BoxSizeMode } from '../../utils/types';
import { BoxContainer } from './box-container';
import type { ItemDoc, ImageDoc } from '@/lib/api/types';

interface FloatingBoxesProps {
  sizeMode: BoxSizeMode;
  onHoverChange?: () => void;
  initialResources: Array<ItemDoc | ImageDoc>;
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
