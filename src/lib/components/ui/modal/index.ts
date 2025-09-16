/**
 * 통합 모달 시스템 - 메인 진입점
 *
 * variant 옵션: 'center' | 'drawer-right' | 'sheet-bottom'
 * size 옵션: 'auto' | 'sm' | 'md' | 'lg' | 'xl'
 */

// 컴포넌트 내보내기
export { ModalRoot as Modal } from './ModalRoot';
export { ModalOverlay } from './ModalOverlay';
export { ModalContent } from './ModalContent';
export { ModalHeader } from './ModalHeader';
export { ModalBody } from './ModalBody';
export { ModalFooter } from './ModalFooter';
export { ModalClose } from './ModalClose';

// 편의성 컴포넌트
export { SimpleModal } from './SimpleModal';

// 타입 내보내기
export type {
  ModalProps,
  ModalVariant,
  ModalSize,
  ModalOverlayProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseProps,
} from './types';

// 편의성 훅
export { useModalContext } from './ModalRoot';
