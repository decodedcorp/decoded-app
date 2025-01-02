import { BoxPosition } from './types';
import { BOX_CONTENTS } from './constants';
import { FloatingBox } from './floating-box';

interface BoxContainerProps {
  positions: BoxPosition;
  leftBoxCount: number;
  rightBoxCount: number;
  onBoxHover?: (isHovered: boolean, event?: React.MouseEvent, isLarge?: boolean) => void;
}

export function BoxContainer({ positions, leftBoxCount, rightBoxCount, onBoxHover }: BoxContainerProps) {
  return (
    <div className="relative w-full h-full">
      {positions.LEFT_TOP && (
        <div
          className="absolute"
          style={{
            top: `${positions.LEFT_TOP.top}%`,
            left: `${positions.LEFT_TOP.left}%`,
          }}
        >
          <FloatingBox 
            content={BOX_CONTENTS.LEFT_TOP} 
            isLarge={leftBoxCount === 1 && rightBoxCount === 2}
            onHover={(isHovered, event) => onBoxHover?.(isHovered, event, leftBoxCount === 1 && rightBoxCount === 2)}
          />
        </div>
      )}
      {positions.LEFT_BOTTOM && (
        <div
          className="absolute"
          style={{
            top: `${positions.LEFT_BOTTOM.top}%`,
            left: `${positions.LEFT_BOTTOM.left}%`,
          }}
        >
          <FloatingBox 
            content={BOX_CONTENTS.LEFT_BOTTOM}
            onHover={(isHovered, event) => onBoxHover?.(isHovered, event, false)}
          />
        </div>
      )}
      {positions.RIGHT_TOP && (
        <div
          className="absolute"
          style={{
            top: `${positions.RIGHT_TOP.top}%`,
            right: `${positions.RIGHT_TOP.right}%`,
          }}
        >
          <FloatingBox 
            content={BOX_CONTENTS.RIGHT_TOP}
            isLarge={rightBoxCount === 1 && leftBoxCount === 2}
            onHover={(isHovered, event) => onBoxHover?.(isHovered, event, rightBoxCount === 1 && leftBoxCount === 2)}
          />
        </div>
      )}
      {positions.RIGHT_BOTTOM && (
        <div
          className="absolute"
          style={{
            top: `${positions.RIGHT_BOTTOM.top}%`,
            right: `${positions.RIGHT_BOTTOM.right}%`,
          }}
        >
          <FloatingBox 
            content={BOX_CONTENTS.RIGHT_BOTTOM}
            onHover={(isHovered, event) => onBoxHover?.(isHovered, event, false)}
          />
        </div>
      )}
    </div>
  );
} 