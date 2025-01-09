'use client';

import { useEffect, useState } from 'react';
import { BoxPosition } from '../../utils/types';
import { BOX_POSITION_SETS } from '../../utils/constants';
import { SpotlightMask } from './spotlight-mask';
import { BoxContainer } from './box-container';

interface FloatingBoxesProps {
  onPositionsChange?: (positions: BoxPosition) => void;
  onHoverChange?: (
    isHovered: boolean,
    x?: number,
    y?: number,
    isLarge?: boolean
  ) => void;
}

export function FloatingBoxes({
  onPositionsChange,
  onHoverChange,
}: FloatingBoxesProps) {
  const [positions, setPositions] = useState<BoxPosition>(BOX_POSITION_SETS[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BOX_POSITION_SETS.length);
    const newPositions = BOX_POSITION_SETS[randomIndex];
    setPositions(newPositions);
    onPositionsChange?.(newPositions);
  }, [onPositionsChange]);

  // 왼쪽과 오른쪽 각각의 박스 개수를 계산
  const leftBoxCount =
    (positions.LEFT_TOP ? 1 : 0) + (positions.LEFT_BOTTOM ? 1 : 0);
  const rightBoxCount =
    (positions.RIGHT_TOP ? 1 : 0) + (positions.RIGHT_BOTTOM ? 1 : 0);

  const handleBoxHover = (
    isHovered: boolean,
    event?: React.MouseEvent,
    isLarge?: boolean
  ) => {
    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      onHoverChange?.(isHovered, centerX, centerY, isLarge);
    } else {
      onHoverChange?.(isHovered);
    }
  };

  return (
    <div className="absolute inset-0 z-modalOverlay pointer-events-auto">
      <SpotlightMask
        positions={positions}
        leftBoxCount={leftBoxCount}
        rightBoxCount={rightBoxCount}
      />
      <BoxContainer
        positions={positions}
        leftBoxCount={leftBoxCount}
        rightBoxCount={rightBoxCount}
        onBoxHover={handleBoxHover}
      />
    </div>
  );
}

export * from '../../utils/types';
export * from '../../utils/constants';
