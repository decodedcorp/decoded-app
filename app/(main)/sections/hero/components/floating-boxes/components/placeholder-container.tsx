import { BoxPosition } from '../../../utils/types';
import { FloatingBox } from '../floating-box';
import type { ImageDoc } from '@/lib/api/types';

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

const PLACEHOLDER_RESOURCE: ImageDoc = {
  _id: 'placeholder',
  title: 'Placeholder',
  img_url: '',
  description: '',
  like: 0,
  style: null,
  source: null,
  upload_by: 'system',
  requested_items: {},
};

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
            resource={PLACEHOLDER_RESOURCE}
            initialDelay={0}
            depthLevel={2}
            position={{ x: 0, y: 0 }}
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
            resource={PLACEHOLDER_RESOURCE}
            initialDelay={0}
            depthLevel={rightBoxCount === 1 && leftBoxCount === 2 ? 1 : 2}
            position={{ x: 0, y: 0 }}
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
            resource={PLACEHOLDER_RESOURCE}
            initialDelay={0}
            depthLevel={2}
            position={{ x: 0, y: 0 }}
            onHover={(isHovered, event) =>
              onBoxHover?.(isHovered, event, false)
            }
          />
        </div>
      )}
    </div>
  );
}
