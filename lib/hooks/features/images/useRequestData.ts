import { useState, useCallback } from 'react';
import { requestAPI } from '@/lib/api/endpoints/request';
import type { RequestImage, APIResponse } from '@/lib/api/_types/request';

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

  const createRequest = async (data: RequestImage, userDocId: string): Promise<APIResponse<void>> => {
    try {
      console.log('=== Create Request Debug ===');
      console.log('User Doc ID:', userDocId);
      console.log('Request Data:', data);

      return await requestAPI.createImageRequest(userDocId, data);
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
