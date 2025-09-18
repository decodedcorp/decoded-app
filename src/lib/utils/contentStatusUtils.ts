import { ContentStatus } from '@/api/generated';

/**
 * 콘텐츠 상태에 따른 스타일 클래스를 반환하는 함수
 */
export const getContentStatusStyles = (status?: ContentStatus) => {
  switch (status) {
    case ContentStatus.PENDING:
      return {
        container: 'cursor-not-allowed',
        image: '',
        text: 'Pending Review',
      };
    case ContentStatus.ACTIVE:
      return {
        container: 'cursor-pointer',
        image: '',
        text: 'Active',
      };
    case ContentStatus.HIDDEN:
      return {
        container: 'cursor-not-allowed opacity-40',
        image: 'blur-sm grayscale',
        text: 'Hidden',
      };
    default:
      return {
        container: 'cursor-pointer',
        image: '',
        text: 'Unknown',
      };
  }
};

/**
 * 콘텐츠 상태에 따라 클릭 가능한지 확인하는 함수
 */
export const isContentClickable = (status?: ContentStatus): boolean => {
  // ACTIVE 상태에서만 클릭 가능
  return status === ContentStatus.ACTIVE;
};

/**
 * 콘텐츠 상태에 따른 호버 효과 표시 여부
 */
export const shouldShowHoverEffects = (status?: ContentStatus): boolean => {
  return status === ContentStatus.ACTIVE;
};

/**
 * 콘텐츠 상태에 따른 Pending 오버레이 표시 여부
 */
export const shouldShowPendingOverlay = (status?: ContentStatus): boolean => {
  return status === ContentStatus.PENDING;
};
