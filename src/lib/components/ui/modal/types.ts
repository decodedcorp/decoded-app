/**
 * 통합 모달 시스템 타입 정의
 *
 * 특징:
 * - variant 기반 레이아웃 (center, drawer-right, sheet-bottom)
 * - 반응형 size 매핑 (auto, sm, md, lg, xl)
 * - 접근성 완전 지원 (ARIA, 포커스 트랩, 키보드 네비게이션)
 * - 모바일 최적화 (세이프 에어리어, visualViewport, 키보드 대응)
 */

export type ModalVariant = 'center' | 'drawer-right' | 'sheet-bottom';
export type ModalSize = 'auto' | 'sm' | 'md' | 'lg' | 'xl';
export type ModalCloseReason = 'overlay' | 'escape' | 'close-button' | 'programmatic' | 'gesture';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean, reason?: ModalCloseReason) => void;
  variant?: ModalVariant;
  size?: ModalSize;
  dismissible?: boolean; // overlay 클릭/ESC 허용 여부
  keepMounted?: boolean; // exit animation 보장
  ariaLabel?: string; // 없는 경우 title id 연결
  className?: string;
  children: React.ReactNode;
}

export interface ModalOverlayProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface ModalContentProps {
  variant?: ModalVariant;
  size?: ModalSize;
  className?: string;
  children: React.ReactNode;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export interface ModalHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface ModalBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface ModalFooterProps {
  className?: string;
  children: React.ReactNode;
}

export interface ModalCloseProps {
  className?: string;
  'aria-label'?: string;
  onClick?: () => void;
}

// 내부 상태 관리용 타입
export interface ModalContextValue {
  open: boolean;
  onClose: (reason?: ModalCloseReason) => void;
  variant: ModalVariant;
  size: ModalSize;
  dismissible: boolean;
}

// 반응형 매핑 규칙
export interface ResponsiveMapping {
  variant: ModalVariant;
  breakpoint: 'sm' | 'md' | 'lg';
  fallbackVariant?: ModalVariant;
  fallbackSize?: ModalSize;
}

// 키보드 및 접근성 설정
export interface AccessibilityConfig {
  restoreFocus: boolean;
  trapFocus: boolean;
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
  preventScroll: boolean;
}

// 애니메이션 설정
export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
  respectReducedMotion: boolean;
}

// 모바일 최적화 설정
export interface MobileOptimization {
  handleVisualViewport: boolean;
  respectSafeArea: boolean;
  preventZoom: boolean;
  touchOptimized: boolean;
}