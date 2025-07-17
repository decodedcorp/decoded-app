import { useState, useCallback } from 'react';
import { requestAPI } from '@/lib/api/endpoints/request';
import type { RequestImage, APIResponse } from '@/lib/api/_types/request';
import { useStatusMessage } from '@/components/ui/modal/status-modal/utils/use-status-message';

interface UseRequestDataReturn {
  isLoading: boolean;
  error: Error | null;
  createRequest: (data: RequestImage, userDocId: string) => Promise<APIResponse<void>>;
  requests: RequestImage[];
  currentRequest: RequestImage | null;
  refreshRequests: () => Promise<void>;
}

export function useRequestData(initialData: any): UseRequestDataReturn {
  const [requests, setRequests] = useState<RequestImage[]>([]);
  const [currentRequest, setCurrentRequest] = useState<RequestImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showLoadingStatus } = useStatusMessage();

  const createRequest = async (data: RequestImage, userDocId: string): Promise<APIResponse<void>> => {
    try {
      console.log('=== Create Request Debug ===');
      console.log('User Doc ID:', userDocId);
      
      // 포지션 값 확인을 위한 로깅 추가
      if (data.requestedItems && data.requestedItems.length > 0) {
        console.log('Position values being sent:', 
          data.requestedItems.map(item => ({
            left: item.position?.left,
            top: item.position?.top
          }))
        );
      }
      
      // 이미지 데이터 길이 확인
      console.log('Image data length:', data.image_file ? data.image_file.length : 'No image data');
      
      // API 요청 전 전체 데이터 검증
      const preparedData = {
        image_file: data.image_file,
        request_by: userDocId,
        context: data.context,
        source: data.source,
        metadata: data.metadata || {},
        requested_items: data.requestedItems?.map(item => ({
          ...item,
          position: {
            left: typeof item.position?.left === 'string' 
              ? item.position.left.replace('%', '') 
              : String(item.position?.left || 0),
            top: typeof item.position?.top === 'string' 
              ? item.position.top.replace('%', '') 
              : String(item.position?.top || 0)
          }
        }))
      };
      
      console.log('Validated request data:', preparedData);

      return await showLoadingStatus(
        requestAPI.createImageRequest(userDocId, preparedData as any),
        { type: 'success', messageKey: 'request' }
      );
    } catch (error) {
      console.error('Request Error Details:', error);
      throw error;
    }
  };

  const refreshRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('=== Refresh Requests Debug ===');
      console.log('Fetching requests for user:', initialData.userId);
      
      const response = await requestAPI.getImageRequests(initialData.userId);
      console.log('Refresh Response:', response);
      
      setRequests(response.data || []);
    } catch (err) {
      console.error('Refresh Error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch requests'));
    } finally {
      setIsLoading(false);
    }
  }, [initialData.userId]);

  return {
    isLoading,
    error,
    createRequest,
    requests,
    currentRequest,
    refreshRequests,
  };
}
