import { BoxPosition } from '../../../utils/types';
import { FloatingBox } from '../floating-box';

interface PlaceholderContainerProps {
  positions: BoxPosition;
  leftBoxCount: number;
  rightBoxCount: number;
  onBoxHover?: (
    isHovered: boolean,
    event?: React.MouseEvent,
    isLarge?: boolean
  ) => void;
}

export function PlaceholderContainer({
  positions,
  leftBoxCount,
  rightBoxCount,
  onBoxHover,
}: PlaceholderContainerProps) {
  return (
    <div className="relative w-full h-full">
      {positions.LEFT_BOTTOM && (
        <div
          className="absolute"
          style={{
            top: `${positions.LEFT_BOTTOM.top}%`,
            left: `${positions.LEFT_BOTTOM.left}%`,
          }}
        >
          <FloatingBox
            onHover={(isHovered, event) =>
              onBoxHover?.(isHovered, event, false)
            }
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
            isLarge={rightBoxCount === 1 && leftBoxCount === 2}
            onHover={(isHovered, event) =>
              onBoxHover?.(
                isHovered,
                event,
                rightBoxCount === 1 && leftBoxCount === 2
              )
            }
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
            onHover={(isHovered, event) =>
              onBoxHover?.(isHovered, event, false)
            }
          />
        </div>
      )}
    </div>
  );
}
