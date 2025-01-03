import { useState, useEffect, useCallback } from 'react';
import { requestAPI } from '@/lib/api/request';
import { ImageRequest, RequestImage, Point, RequestedItem } from '@/types/model';
import { arrayBufferToBase64 } from '@/common/util';

// Error messages as constants
const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch request data',
  CREATE_FAILED: 'Failed to create request',
  UPDATE_FAILED: 'Failed to update request',
  LOGIN_REQUIRED: '로그인이 필요합니다.',
} as const;

interface RequestLoadingState {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
}

interface UseRequestDataReturn {
  requestData: ImageRequest | null;
  loadingState: RequestLoadingState;
  error: Error | null;
  createRequest: (
    imageFile: File, 
    points: Point[], 
    options?: { 
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => Promise<void>;
  updateRequest: (
    imageId: string, 
    data: Partial<RequestImage>,
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => Promise<void>;
  resetError: () => void;
}

export function useRequestData(imageId?: string): UseRequestDataReturn {
  const [loadingState, setLoadingState] = useState<RequestLoadingState>({
    isFetching: false,
    isCreating: false,
    isUpdating: false,
  });
  const [error, setError] = useState<Error | null>(null);
  const [requestData, setRequestData] = useState<ImageRequest | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const updateLoadingState = useCallback((key: keyof RequestLoadingState, value: boolean) => {
    setLoadingState(prev => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    async function fetchRequestData() {
      if (!imageId) return;
      
      try {
        updateLoadingState('isFetching', true);
        const data = await requestAPI.getImageRequest(imageId);
        setRequestData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(ERROR_MESSAGES.FETCH_FAILED));
      } finally {
        updateLoadingState('isFetching', false);
      }
    }

    fetchRequestData();
  }, [imageId, updateLoadingState]);

  const createRequest = useCallback(async (
    imageFile: File, 
    points: Point[],
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    try {
      updateLoadingState('isCreating', true);
      
      // Convert points to RequestedItems
      const items: RequestedItem[] = points.map(point => ({
        position: {
          top: point.y.toString(),
          left: point.x.toString(),
        },
        context: point.context,
      }));

      // Convert image file to base64
      const buffer = await imageFile.arrayBuffer();
      const base64Image = arrayBufferToBase64(buffer);

      // Get requester ID
      const requestBy = sessionStorage.getItem('USER_DOC_ID');
      if (!requestBy) {
        throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED);
      }

      // Create request data
      const requestImage: RequestImage = {
        requestedItems: items,
        requestBy,
        imageFile: base64Image,
        metadata: {},
      };

      await requestAPI.createImageRequest(requestImage);
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.CREATE_FAILED);
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      updateLoadingState('isCreating', false);
    }
  }, [updateLoadingState]);

  const updateRequest = useCallback(async (
    imageId: string, 
    data: Partial<RequestImage>,
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    try {
      updateLoadingState('isUpdating', true);
      await requestAPI.updateImageRequest(imageId, data);
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.UPDATE_FAILED);
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      updateLoadingState('isUpdating', false);
    }
  }, [updateLoadingState]);

  return {
    requestData,
    loadingState,
    error,
    createRequest,
    updateRequest,
    resetError
  };
} 