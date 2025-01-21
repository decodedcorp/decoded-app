import { useState, useCallback } from 'react';
import { requestAPI } from '@/lib/api/endpoints/request';
import type { RequestImage } from '@/lib/api/types/request';

interface UseRequestDataReturn {
  isLoading: boolean;
  error: Error | null;
  createRequest: (requestData: RequestData) => Promise<void>;
  requests: RequestImage[];
  currentRequest: RequestImage | null;
  refreshRequests: () => Promise<void>;
}

interface RequestData {
  requested_items: Array<{
    item_class: string;
    item_sub_class: string;
    category: string;
    sub_category: string;
    product_type: string;
    context: string;
    position: {
      left: string;
      top: string;
    };
  }>;
  request_by: string;
  image_file: string;
  metadata: {
    additionalProp1?: string;
    additionalProp2?: string;
  };
}

export function useRequestData(userId: string): UseRequestDataReturn {
  const [requests, setRequests] = useState<RequestImage[]>([]);
  const [currentRequest, setCurrentRequest] = useState<RequestImage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRequest = useCallback(async (requestData: RequestData) => {
    try {
      setIsLoading(true);
      const formattedData: RequestImage = {
        requestedItems: requestData.requested_items,
        requestBy: requestData.request_by,
        imageFile: requestData.image_file,
        metadata: requestData.metadata
      };
      await requestAPI.createImageRequest(userId, formattedData);
      await refreshRequests();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to create request')
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refreshRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await requestAPI.getImageRequests(userId);
      setRequests(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch requests')
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    isLoading,
    error,
    createRequest,
    requests,
    currentRequest,
    refreshRequests,
  };
}
