import { BoxPosition } from './types';

interface SpotlightMaskProps {
  positions: BoxPosition;
  leftBoxCount: number;
  rightBoxCount: number;
}

export function SpotlightMask({ positions, leftBoxCount, rightBoxCount }: SpotlightMaskProps) {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <filter id="blur-filter">
          <feGaussianBlur stdDeviation="80" />
        </filter>
        <radialGradient id="spotlight-gradient">
          <stop offset="0%" stopColor="black" stopOpacity="1" />
          <stop offset="15%" stopColor="black" stopOpacity="0.95" />
          <stop offset="30%" stopColor="black" stopOpacity="0.8" />
          <stop offset="50%" stopColor="black" stopOpacity="0.6" />
          <stop offset="70%" stopColor="black" stopOpacity="0.3" />
          <stop offset="85%" stopColor="black" stopOpacity="0.1" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          {positions.LEFT_TOP && (
            <circle
              cx={`${positions.LEFT_TOP.left + (leftBoxCount === 1 && rightBoxCount === 2 ? 13 : 6.5)}%`}
              cy={`${positions.LEFT_TOP.top + (leftBoxCount === 1 && rightBoxCount === 2 ? 13 : 6.5)}%`}
              r={leftBoxCount === 1 && rightBoxCount === 2 ? "400" : "250"}
              fill="url(#spotlight-gradient)"
              filter="url(#blur-filter)"
            />
          )}
          {positions.LEFT_BOTTOM && (
            <circle
              cx={`${positions.LEFT_BOTTOM.left + 6.5}%`}
              cy={`${positions.LEFT_BOTTOM.top + 6.5}%`}
              r="250"
              fill="url(#spotlight-gradient)"
              filter="url(#blur-filter)"
            />
          )}
          {positions.RIGHT_TOP && (
            <circle
              cx={`${100 - positions.RIGHT_TOP.right + (rightBoxCount === 1 && leftBoxCount === 2 ? -13 : -6.5)}%`}
              cy={`${positions.RIGHT_TOP.top + (rightBoxCount === 1 && leftBoxCount === 2 ? 13 : 6.5)}%`}
              r={rightBoxCount === 1 && leftBoxCount === 2 ? "400" : "250"}
              fill="url(#spotlight-gradient)"
              filter="url(#blur-filter)"
            />
          )}
          {positions.RIGHT_BOTTOM && (
            <circle
              cx={`${100 - positions.RIGHT_BOTTOM.right - 6.5}%`}
              cy={`${positions.RIGHT_BOTTOM.top + 6.5}%`}
              r="250"
              fill="url(#spotlight-gradient)"
              filter="url(#blur-filter)"
            />
          )}
        </mask>
      </defs>
      {/* 검은 배경에 마스크 적용 */}
      <rect width="100%" height="100%" fill="black" opacity="0.98" mask="url(#spotlight-mask)" />
    </svg>
  );
} 