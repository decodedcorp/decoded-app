export const ITEM_WIDTH = 369;
export const ITEM_HEIGHT = ITEM_WIDTH * (5 / 4);
export const GAP = 15;
export const CELL_WIDTH = ITEM_WIDTH + GAP;
export const CELL_HEIGHT = ITEM_HEIGHT + GAP;
export const LOAD_THRESHOLD = Math.max(CELL_WIDTH, CELL_HEIGHT) * 2;

// 줌 관련 상수 추가
export const ZOOM_LEVELS = {
  MIN: 0.5,
  MAX: 3.0,
  DEFAULT: 1.0,
  STEP: 0.25,
} as const;

const BASE_URL = process.env.NODE_ENV === "development" 
  ? "https://dev.decoded.style/image"
  : "https://api.decoded.style/image";

export const API_BASE_URL = BASE_URL; 