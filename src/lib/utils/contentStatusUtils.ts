import { ContentStatus } from '@/lib/types/content';

/**
 * 콘텐츠 상태에 따른 스타일 클래스를 반환하는 함수
 */
export const getContentStatusStyles = (status?: ContentStatus) => {
  switch (status) {
    case 'pending':
      return {
        container: 'cursor-not-allowed opacity-60',
        image: 'blur-sm',
        text: 'Processing...',
      };
    case 'approved':
    case 'active': // active 상태도 approved와 동일하게 처리
      return {
        container: 'cursor-pointer',
        image: '',
        text: 'Approved',
      };
    case 'rejected':
      return {
        container: 'cursor-not-allowed opacity-40',
        image: 'blur-sm grayscale',
        text: 'Rejected',
      };
    case 'processing':
      return {
        container: 'cursor-not-allowed opacity-80',
        image: 'blur-sm',
        text: 'Processing...',
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
  // 임시로 모든 상태에서 클릭 가능하도록 설정
  return true;
  // return status === 'approved' || status === 'active';
};

/**
 * 콘텐츠 상태에 따른 로딩 스피너 표시 여부
 */
export const shouldShowLoadingSpinner = (status?: ContentStatus): boolean => {
  return status === 'pending' || status === 'processing';
};

/**
 * 콘텐츠 상태에 따른 호버 효과 표시 여부
 */
export const shouldShowHoverEffects = (status?: ContentStatus): boolean => {
  return status === 'approved' || status === 'active';
};
