'use client';

import { useState, useEffect, useCallback } from 'react';
import { networkManager } from '@/lib/network/network';
import { ImageDocument } from '@/types/model.d';
import { convertKeysToCamelCase } from '@/lib/utils/object/object';
import { Activity } from '../types';
import { useWebSocket } from './use-websocket';

function convertImageToActivity(image: ImageDocument): Activity {
  return {
    id: `${image.docId}_${Date.now()}`,
    type: 'request_image' as const,
    data: {
      image_url: image.imgUrl,
      image_doc_id: image.docId,
      item_len: Object.values(image.items).reduce(
        (sum, items) => sum + items.length,
        0
      ),
    },
    timestamp: image.uploadBy || new Date().toISOString(),
  };
}

export function useActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleNewActivity = useCallback((newActivity: Activity) => {
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const { isConnected } = useWebSocket(handleNewActivity);

  useEffect(() => {
    async function fetchInitialActivities() {
      try {
        const response = await networkManager.request('images', 'GET');
        
        if (!response.data?.images || !Array.isArray(response.data.images)) {
          throw new Error('Invalid response format');
        }

        const initialActivities = convertKeysToCamelCase(response.data.images)
          .map((image: ImageDocument) => convertImageToActivity(image));

        setActivities(initialActivities);
      } catch (error) {
        console.error('Failed to fetch initial activities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialActivities();
  }, []);

  return {
    activities,
    isLoading,
    isConnected
  };
}
