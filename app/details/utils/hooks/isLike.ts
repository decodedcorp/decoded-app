import { networkManager } from '@/lib/network/network';

type DocType = 'image' | 'item' | 'images' | 'items';

interface LikeResponse {
  status_code: number;
  description: string;
  data: {
    is_like: boolean;
  };
}

// optimistic ui
export function useIsLike() {

  async function checkInitialLikeStatus(docType: DocType, docId: string, userId: string): Promise<boolean> {
    try {
      const response = await networkManager.request<LikeResponse>(
        `user/${userId}/islike?doc_type=${docType}&doc_id=${docId}`,
        'GET'
      );
      return response.data.is_like;
    } catch (error) {
      console.error('Error fetching like status:', error);
      return false;
    }
  }

  async function toggleLike(docType: DocType, docId: string, userId: string, currentLikeStatus: boolean): Promise<boolean> {
    try {
      const action = currentLikeStatus ? 'unlike' : 'like';
      const response = await networkManager.request<LikeResponse>(
        `user/${userId}/${action}/${docType}/${docId}`,
        'POST'
      );
      
      // API 응답 구조 확인 및 안전한 처리
      if (response?.data?.is_like !== undefined) {
      return response.data.is_like;
      }
      return currentLikeStatus; 
    } catch (error) {
      return currentLikeStatus;
    }
  }

  return {
    checkInitialLikeStatus,
    toggleLike,
  };
}
