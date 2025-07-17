import { apiClient } from '../client';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import type { RequestImage, RequestAddItem } from '../types';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';

function checkAuth(userId?: string) {
  if (!userId) {
    useStatusStore.setState({
      isOpen: true,
      type: 'warning',
      messageKey: 'login',
      message: '로그인이 필요한 서비스입니다.'
    });
    throw new Error('Unauthorized');
  }
}

export const protectedService = {
  // 이미지 업로드 요청
  requestImageUpload: (userId: string | undefined, data: RequestImage) => {
    checkAuth(userId);
    return apiClient.post<Response_GetDocumentResponse_>(
      `user/${userId}/image/request`,
      data
    );
  },

  // 이미지에 아이템 추가 요청
  requestAddItem: (userId: string | undefined, imageId: string, data: RequestAddItem) => {
    checkAuth(userId);
    return apiClient.post<Response_GetDocumentResponse_>(
      `user/${userId}/image/${imageId}/request/add`,
      data
    );
  },

  // 좋아요 관련
  likeItem: (userId: string | undefined, itemId: string) => {
    checkAuth(userId);
    return apiClient.post(`user/${userId}/like/item/${itemId}`);
  },
    
  likeImage: (userId: string | undefined, imageId: string) => {
    checkAuth(userId);
    return apiClient.post(`user/${userId}/like/image/${imageId}`);
  },

  // 마이페이지 관련
  getMyPageHome: (userId: string | undefined, options?: { limit?: number; next_id?: string }) => {
    checkAuth(userId);
    return apiClient.get(
      `user/${userId}/mypage/home${buildQueryString(options || {})}`
    );
  },

  getMyRequests: (userId: string | undefined, options?: { limit?: number; next_id?: string }) => {
    checkAuth(userId);
    return apiClient.get(
      `user/${userId}/mypage/requests${buildQueryString(options || {})}`
    );
  }
}; 