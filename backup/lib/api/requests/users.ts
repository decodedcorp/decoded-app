import { apiClient } from '../client';
import type { UserDoc, GetDocumentResponse } from '../types';
import type { APIResponse } from '../_types/request';
import buildQueryString from '../utils/url';

export const usersService = {
  // 사용자 프로필 조회
  getUserProfile: (userId: string) =>
    apiClient.get<APIResponse<UserDoc>>(`user/${userId}`),

  // 사용자 활동 내역 조회
  getUserActivity: (userId: string, options?: { limit?: number; next_id?: string }) =>
    apiClient.get<APIResponse<GetDocumentResponse>>(
      `user/${userId}/activity${buildQueryString(options || {})}`
    ),

  // 사용자 설정 업데이트
  updateUserSettings: (userId: string, settings: Partial<UserDoc>) =>
    apiClient.patch<APIResponse<UserDoc>>(`user/${userId}/settings`, settings),
}; 