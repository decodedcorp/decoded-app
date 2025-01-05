// 그리드 설정
export const CELL_SIZE = 56;
export const GAP_SIZE = 0.5;
export const GRID_COLS = 13;

// 공통 스타일 상수
export const COMMON_STYLES = {
  BORDER: {
    DEFAULT: 'border-[1.25px] border-white/[0.08]',
    HOVER: 'hover:border-primary',
    ACTIVE: 'active:border-primary',
    HIGHLIGHTED: 'border-primary/50'
  },
  ANIMATION: {
    TRANSITION: 'transition-all duration-300 ease-in-out',
    HOVER_SCALE: 'hover:scale-[1.02]'
  }
} as const; 