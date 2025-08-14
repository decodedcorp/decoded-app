/**
 * Content status mapping utilities
 */
import { ContentStatus } from '@/api/generated';

import { ContentStatusType } from './contentTypes';

/**
 * 새로운 API 구조에 맞는 상태 매핑 함수
 */
export const mapContentStatus = (
  dbStatus?: string,
): ContentStatusType => {
  // 새로운 API의 ContentStatus enum 사용
  if (!dbStatus) {
    return ContentStatus.PENDING;
  }

  // DB 상태를 새로운 enum으로 매핑
  switch (dbStatus.toLowerCase()) {
    case 'active':
      return ContentStatus.ACTIVE;
    case 'hidden':
      return ContentStatus.HIDDEN;
    case 'pending':
    default:
      return ContentStatus.PENDING;
  }
};