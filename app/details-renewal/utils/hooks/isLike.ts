'use client';

import { networkManager } from '@/lib/network/network';
import { useCallback } from 'react';

// islike 엔드포인트용 DocType
type IsLikeDocType = 'images' | 'items';
// like/unlike 엔드포인트용 DocType
type LikeDocType = 'image' | 'item';

interface LikeResponse {
  status_code: number;
  description: string;
  data: null;  // 서버 응답이 항상 null을 반환하므로 타입을 수정
}

interface IsLikeResponse {
  status_code: number;
  description: string;
  data: {
    is_like: boolean;
  };
}

interface NetworkError {
  errorCode: string;
  errorMessage: string;
  method: string;
  url: string;
  responseStatus?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초

// 재시도 로직을 위한 유틸리티 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 네트워크 에러인지 확인하는 함수
const isNetworkError = (error: any): error is NetworkError => {
  return (
    error?.errorCode === 'ERR_NETWORK' || 
    error?.status === 500 ||
    error?.responseStatus === 500
  );
};

// optimistic ui
export function useIsLike() {
  const checkInitialLikeStatus = useCallback(async (
    docType: LikeDocType, 
    docId: string, 
    userId: string
  ): Promise<boolean> => {
    let retries = 0;
    
    // docType 변환 (image -> images, item -> items)
    const islikeDocType: IsLikeDocType = `${docType}s` as IsLikeDocType;
    
    while (retries < MAX_RETRIES) {
      try {
        console.log(`Checking like status (attempt ${retries + 1}/${MAX_RETRIES})...`);
        const response = await networkManager.request<IsLikeResponse>(
          `user/${userId}/islike?doc_type=${islikeDocType}&doc_id=${docId}`,
          'GET'
        );

        if (!response) {
          console.warn('No response received from islike endpoint');
          throw new Error('No response received');
        }

        if (response.status_code !== 200) {
          console.warn(`Invalid status code from islike endpoint: ${response.status_code}`);
          throw new Error(`Invalid status code: ${response.status_code}`);
        }

        console.log('Successfully fetched like status:', response.data);
        return response.data.is_like;
      } catch (error: any) {
        console.error('Error details:', {
          error,
          attempt: retries + 1,
          endpoint: `user/${userId}/islike?doc_type=${islikeDocType}&doc_id=${docId}`,
          status: error?.responseStatus
        });

        if (isNetworkError(error)) {
          retries++;
          if (retries < MAX_RETRIES) {
            const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
            console.warn(`Retrying islike request in ${waitTime}ms (${retries}/${MAX_RETRIES})...`);
            await delay(waitTime);
            continue;
          }
        }
        
        console.error('Failed to fetch like status after retries or non-network error');
        return false;
      }
    }
    
    return false;
  }, []);

  const toggleLike = useCallback(async (
    docType: LikeDocType, 
    docId: string, 
    userId: string, 
    currentLikeStatus: boolean
  ): Promise<boolean> => {
    let retries = 0;
    
    try {
      // POST 요청은 단수형 사용
      const endpoint = currentLikeStatus 
        ? `user/${userId}/unlike/${docType}/${docId}`
        : `user/${userId}/like/${docType}/${docId}`;

      while (retries < MAX_RETRIES) {
        try {
          console.log(`Attempting to ${currentLikeStatus ? 'unlike' : 'like'} (attempt ${retries + 1}/${MAX_RETRIES})...`);
          console.log('Sending request to:', endpoint);
          
          const response = await networkManager.request<LikeResponse>(
            endpoint,
            'POST'
          );

          if (!response) {
            console.warn('No response received from like/unlike endpoint');
            throw new Error('No response received');
          }

          if (response.status_code !== 200) {
            console.warn(`Invalid status code from like/unlike endpoint: ${response.status_code}`);
            throw new Error(`Invalid status code: ${response.status_code}`);
          }

          // 성공적으로 처리된 경우 반대 상태를 반환
          console.log('Successfully toggled like status');
          return !currentLikeStatus;
        } catch (error: any) {
          console.error('Error details:', {
            error,
            attempt: retries + 1,
            endpoint,
            docType,
            isLiked: currentLikeStatus,
            status: error?.status || error?.responseStatus
          });

          if (isNetworkError(error)) {
            retries++;
            if (retries < MAX_RETRIES) {
              const waitTime = RETRY_DELAY * Math.pow(2, retries - 1);
              console.warn(`Retrying like/unlike request in ${waitTime}ms (${retries}/${MAX_RETRIES})...`);
              await delay(waitTime);
              continue;
            }
          }
          
          throw error;
        }
      }
      
      throw new Error('Failed to toggle like status after max retries');
    } catch (error) {
      console.error('Error toggling like status:', error);
      throw error;
    }
  }, []);

  return {
    checkInitialLikeStatus,
    toggleLike,
  };
}
