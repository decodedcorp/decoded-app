/**
 * Z-Index 토큰 시스템 - CSS 변수 기반 통합 관리
 *
 * 특징:
 * - CSS 변수로 일원화 (--z-overlay, --z-modal)
 * - 테스트에서 overlay < modal 관계 검증 가능
 * - 모든 하드코딩된 z-index 값을 토큰으로 교체
 */

export const Z_INDEX_TOKENS = {
  // Base layers
  base: 0,
  content: 1,
  elevated: 10,

  // Interactive elements
  dropdown: 50,
  sticky: 55,

  // Overlays and modals (통합된 모달 시스템용)
  overlay: 50, // 모달 오버레이
  modal: 60, // 모달 콘텐츠
  'modal-root': 70, // 모달 루트 컨테이너

  // Legacy compatibility (기존 코드 호환)
  'modal-legacy': 1000,
  'content-modal': 1100,
  
  // 새로운 댓글 시스템 (기존 모달보다 위에 표시)
  'comments-modal': 1200,
  'comments-sheet': 1200,

  // System overlays
  popover: 70,
  tooltip: 80,

  // Notifications
  toast: 90,
  debug: 99,
} as const;

export type ZIndexToken = keyof typeof Z_INDEX_TOKENS;

/**
 * CSS 변수 생성 (tailwind.config.ts에서 주입)
 */
export const Z_INDEX_CSS_VARS = Object.entries(Z_INDEX_TOKENS).reduce((acc, [key, value]) => {
  acc[`--z-${key}`] = value.toString();
  return acc;
}, {} as Record<string, string>);

/**
 * 하위 호환성을 위한 기존 Z_INDEX (점진적 교체 예정)
 */
export const Z_INDEX = {
  BACKGROUND: Z_INDEX_TOKENS.base,
  CONTENT: Z_INDEX_TOKENS.content,
  DROPDOWN: Z_INDEX_TOKENS.dropdown,
  STICKY_HEADER: Z_INDEX_TOKENS.sticky,
  TOOLTIP: Z_INDEX_TOKENS.tooltip,

  // 기존 모달 시스템 (마이그레이션 후 제거 예정)
  MODAL_BACKGROUND_BLUR: 999,
  MODAL_OVERLAY: Z_INDEX_TOKENS['modal-legacy'],
  MODAL_CONTENT: Z_INDEX_TOKENS['modal-legacy'] + 10,
  CONTENT_MODAL_OVERLAY: Z_INDEX_TOKENS['content-modal'],
  CONTENT_MODAL_CONTENT: Z_INDEX_TOKENS['content-modal'] + 10,

  TOAST: Z_INDEX_TOKENS.toast,
  DEBUG: Z_INDEX_TOKENS.debug,
} as const;

// Helper functions for consistent z-index usage
export const getZIndex = (layer: keyof typeof Z_INDEX): number => Z_INDEX[layer];

/**
 * 새 모달 시스템용 Tailwind 클래스 (CSS 변수 기반)
 */
export const Z_INDEX_CLASSES = {
  // 새 모달 시스템
  OVERLAY: 'z-[var(--z-overlay)]',
  MODAL: 'z-[var(--z-modal)]',
  POPOVER: 'z-[var(--z-popover)]',
  TOOLTIP: 'z-[var(--z-tooltip)]',
  TOAST: 'z-[var(--z-toast)]',

  // 기존 시스템 (하위 호환)
  BACKGROUND: 'z-0',
  CONTENT: 'z-10',
  DROPDOWN: 'z-[50]',
  STICKY_HEADER: 'z-[55]',
  MODAL_BACKGROUND_BLUR: 'z-[999]',
  MODAL_OVERLAY: 'z-[1000]',
  MODAL_CONTENT: 'z-[1010]',
  CONTENT_MODAL_OVERLAY: 'z-[1100]',
  CONTENT_MODAL_CONTENT: 'z-[1110]',
  
  // 새로운 댓글 시스템
  COMMENTS_MODAL_OVERLAY: 'z-[1200]',
  COMMENTS_MODAL_CONTENT: 'z-[1210]',
  COMMENTS_SHEET_OVERLAY: 'z-[1200]',
  COMMENTS_SHEET_CONTENT: 'z-[1210]',
  
  DEBUG: 'z-[99]',
} as const;
