import { useEffect, useState } from 'react';
import { BoxPosition } from './types';
import { BOX_CONTENTS, BOX_POSITION_SETS } from './constants';
import { FloatingBox } from './floating-box';

export function FloatingBoxes() {
  const [positions, setPositions] = useState<BoxPosition>(BOX_POSITION_SETS[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BOX_POSITION_SETS.length);
    setPositions(BOX_POSITION_SETS[randomIndex]);
  }, []);

  // 왼쪽과 오른쪽 각각의 박스 개수를 계산
  const leftBoxCount = (positions.LEFT_TOP ? 1 : 0) + (positions.LEFT_BOTTOM ? 1 : 0);
  const rightBoxCount = (positions.RIGHT_TOP ? 1 : 0) + (positions.RIGHT_BOTTOM ? 1 : 0);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
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
          <FloatingBox content={BOX_CONTENTS.LEFT_BOTTOM} />
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
          <FloatingBox content={BOX_CONTENTS.RIGHT_BOTTOM} />
        </div>
      )}
    </div>
  );
}

export * from './types';
export * from './constants'; 