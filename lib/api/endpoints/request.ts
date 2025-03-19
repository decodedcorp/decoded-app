import { networkManager } from '@/lib/network/network';
import type { RequestImage, APIResponse } from '../_types/request';

export const requestAPI = {
  // Create image request
  createImageRequest: async (
    userDocId: string,
    data: RequestImage
  ): Promise<APIResponse<void>> => {
    // 액세스 토큰 가져오기
    const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
    
    if (!accessToken) {
      throw new Error('Authentication token is missing');
    }
    
    try {
      console.log('RequestAPI: Sending request to URL:', 
                 `/user/${userDocId}/image/request`);
      console.log('RequestAPI: Using token:', accessToken ? 'Yes (token exists)' : 'No (missing)');
      
      // 데이터 크기 계산 및 로깅 (디버깅용)
      const dataSize = JSON.stringify(data).length;
      console.log(`RequestAPI: Data size: ${Math.floor(dataSize / 1024)}KB`);
      
      // 토큰을 포함하여 요청
      const response = await networkManager.request<APIResponse<void>>(
        `/user/${userDocId}/image/request`,
        'POST',
        data,
        3, // 재시도 횟수
        accessToken // 액세스 토큰 추가
      );

      if (!response) {
        throw new Error('Request failed with empty response');
      }

      return response;
    } catch (error: any) {
      console.error('RequestAPI: Error in createImageRequest:', error);
      
      // 네트워크 에러인 경우 대체 방법으로 fetch API 사용
      if (error.message === 'Network Error') {
        console.log('RequestAPI: Trying alternative fetch API method');
        try {
          const fetchResponse = await fetch(`https://dev.decoded.style/user/${userDocId}/image/request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
          });
          
          if (!fetchResponse.ok) {
            throw new Error(`Fetch API failed with status: ${fetchResponse.status}`);
          }
          
          const responseData = await fetchResponse.json();
          console.log('RequestAPI: Fetch API successful:', responseData);
          return responseData;
        } catch (fetchError) {
          console.error('RequestAPI: Fetch API also failed:', fetchError);
          throw fetchError;
        }
      }
      
      throw error;
    }
  },

  // Add request to existing image
  addImageRequest: async (
    userId: string,
    imageId: string,
    requestData: RequestImage
  ): Promise<APIResponse<void>> => {
    try {
      const response = await networkManager.request(
        `user/${userId}/image/${imageId}/request/add`,
        'POST',
        requestData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get image request list for user
  getImageRequests: async (userId: string): Promise<APIResponse<RequestImage[]>> => {
    try {
      const response = await networkManager.request(
        `user/${userId}/requests`,
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 