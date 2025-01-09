import { BoxPosition } from './types';

// 그리드 설정
export const CELL_SIZE = 56;
export const GAP_SIZE = 0;
export const GRID_COLS = 13;

// 공통 스타일 상수
export const GRID_STYLES = {
  BORDER: {
    DEFAULT: 'border-[1.25px] border-white/[0.08]',
    HOVER: 'hover:border-primary',
    ACTIVE: 'active:border-primary',
    HIGHLIGHTED: 'border-primary/50',
  },
  ANIMATION: {
    TRANSITION: 'transition-all duration-300 ease-in-out',
    HOVER_SCALE: 'hover:scale-[1.02]',
  },
} as const;

export const BOX_POSITION_SETS: BoxPosition[] = [
  // Set 1 - 왼쪽 2개, 오른쪽 1개(큰 박스)
  {
    LEFT_TOP: { top: 15, left: 15 },
    LEFT_BOTTOM: { top: 55, left: 22 },
    RIGHT_TOP: { top: 32, right: 15 },
  },
  // Set 2 - 왼쪽 1개(큰 박스), 오른쪽 2개
  {
    LEFT_TOP: { top: 32, left: 15 },
    RIGHT_TOP: { top: 15, right: 18 },
    RIGHT_BOTTOM: { top: 55, right: 22 },
  },
];
