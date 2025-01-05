import { BoxPosition } from './types';
import { BOX_CONTENTS } from './constants';
import { FloatingBox } from './floating-box';
import { useHeroBannerImage } from '@/lib/hooks/heroBannerImage';
import { isEmptyBannerState } from '@/lib/hooks/heroBannerImage';

interface BoxContainerProps {
  positions: BoxPosition;
  leftBoxCount: number;
  rightBoxCount: number;
  onBoxHover?: (
    isHovered: boolean,
    event?: React.MouseEvent,
    isLarge?: boolean
  ) => void;
}

export function BoxContainer({
  positions,
  leftBoxCount,
  rightBoxCount,
  onBoxHover,
}: BoxContainerProps) {
  const { processedImage, loading } = useHeroBannerImage();

  // 이미지가 없거나 로딩 중이면 placeholder를 보여주는 컨테이너 반환
  if (isEmptyBannerState(loading, processedImage)) {
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
              content={BOX_CONTENTS.LEFT_BOTTOM}
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
              content={BOX_CONTENTS.RIGHT_TOP}
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
              content={BOX_CONTENTS.RIGHT_BOTTOM}
              onHover={(isHovered, event) =>
                onBoxHover?.(isHovered, event, false)
              }
            />
          </div>
        )}
      </div>
    );
  }

  // 메인 이미지와 아이템 이미지들
  const { mainImage, itemImages } = processedImage!;

  // 큰 박스 위치 찾기
  const largeBoxPosition =
    leftBoxCount === 1 && rightBoxCount === 2
      ? 'LEFT_TOP'
      : rightBoxCount === 1 && leftBoxCount === 2
      ? 'RIGHT_TOP'
      : null;

  return (
    <div className="relative w-full h-full">
      {/* LEFT_TOP 박스 */}
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
            onHover={(isHovered, event) =>
              onBoxHover?.(
                isHovered,
                event,
                leftBoxCount === 1 && rightBoxCount === 2
              )
            }
            image={largeBoxPosition === 'LEFT_TOP' ? mainImage : itemImages[0]}
          />
        </div>
      )}

      {/* LEFT_BOTTOM 박스 */}
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
            onHover={(isHovered, event) =>
              onBoxHover?.(isHovered, event, false)
            }
            image={itemImages[1]}
          />
        </div>
      )}

      {/* RIGHT_TOP 박스 */}
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
            onHover={(isHovered, event) =>
              onBoxHover?.(
                isHovered,
                event,
                rightBoxCount === 1 && leftBoxCount === 2
              )
            }
            image={
              largeBoxPosition === 'RIGHT_TOP' 
                ? mainImage 
                : itemImages[leftBoxCount === 1 ? 1 : 2]
            }
          />
        </div>
      )}

      {/* RIGHT_BOTTOM 박스 */}
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
            onHover={(isHovered, event) =>
              onBoxHover?.(isHovered, event, false)
            }
            image={itemImages[leftBoxCount === 1 ? 2 : 3]}
          />
        </div>
      )}
    </div>
  );
}
