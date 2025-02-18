'use client';

import { networkManager } from '@/lib/network/network';
import { useCallback } from 'react';

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
  const checkInitialLikeStatus = useCallback(async (
    docType: DocType, 
    docId: string, 
    userId: string
  ): Promise<boolean> => {
    try {
      const response = await networkManager.request<LikeResponse>(
        `user/${userId}/islike?doc_type=${docType}&doc_id=${docId}`,
        'GET'
      );
      return response?.data.is_like ?? false;
    } catch (error) {
      console.error('Error fetching like status:', error);
      return false;
    }
  }, []); // 의존성 없음

  const toggleLike = useCallback(async (
    docType: DocType, 
    docId: string, 
    userId: string, 
    currentLikeStatus: boolean
  ): Promise<boolean> => {
    try {
      const action = currentLikeStatus ? 'unlike' : 'like';
      const response = await networkManager.request<LikeResponse>(
        `user/${userId}/${action}/${docType}/${docId}`,
        'POST'
      );
      
      return response?.data?.is_like ?? !currentLikeStatus;
    } catch (error) {
      console.error('Error toggling like status:', error);
      return currentLikeStatus;
    }
  }, []); // 의존성 없음

  return {
    checkInitialLikeStatus,
    toggleLike,
  };
}
