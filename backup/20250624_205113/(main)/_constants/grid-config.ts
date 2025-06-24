export const GRID_CONFIG = {
  // 스크롤 설정
  scrollThreshold: 3,
  dragSensitivity: 1.2,
  momentumDecay: 0.92,
  momentumMultiplier: 15,
  maxMomentum: 50,
  
  // 휠 스크롤 설정
  wheelSensitivity: 0.5,
  
  // 뷰포트 설정
  viewportMargin: 600,
  
  // 셀 설정
  cellWidth: 300,
  cellHeight: 300,
  cellGap: 10,
  
  // 성능 설정
  animationFrameRate: 60,
  debounceDelay: 16, // ~60fps
} as const; 