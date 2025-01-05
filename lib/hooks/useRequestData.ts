import { useState, useCallback } from 'react';
import { requestAPI } from '@/lib/api/endpoints/request';
import type { RequestImage } from '@/lib/api/types/request';

interface UseRequestDataReturn {
  isLoading: boolean;
  error: Error | null;
  createRequest: (requestData: RequestImage) => Promise<void>;
  requests: RequestImage[];
  currentRequest: RequestImage | null;
  refreshRequests: () => Promise<void>;
}

export function useRequestData(): UseRequestDataReturn {
  const [requests, setRequests] = useState<RequestImage[]>([]);
  const [currentRequest, setCurrentRequest] = useState<RequestImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRequest = useCallback(async (requestData: RequestImage) => {
    try {
      setIsLoading(true);
      await requestAPI.createImageRequest(requestData);
      await refreshRequests();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create request'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await requestAPI.getImageRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch requests'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createRequest,
    requests,
    currentRequest,
    refreshRequests
  };
} 