'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import { Activity } from '../utils/types';
import { ImageData, ImageItem } from '../utils/types/image';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { WebSocketMessage } from '@/lib/websocket/types';

interface ActivityFeedReturn {
  activities: Activity[];
  isLoading: boolean;
  isConnected: boolean;
  totalActivities: number;
  hasMoreActivities: boolean;
  onAnimationComplete: () => void;
  feedRef: React.MutableRefObject<HTMLDivElement | null>;
  error?: Error;
}

const VISIBLE_ACTIVITIES_LIMIT = 6;

const INITIAL_STATE: Omit<ActivityFeedReturn, 'feedRef'> = {
  activities: [],
  isLoading: true,
  isConnected: false,
  totalActivities: 0,
  hasMoreActivities: false,
  onAnimationComplete: () => {},
};

export function useActivityFeed(): ActivityFeedReturn {
  const [state, setState] = useState(INITIAL_STATE);
  const feedRef = useRef<HTMLDivElement>(null);

  // 스크롤 위치 설정
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, []);

  // WebSocket 메시지를 Activity로 변환
  const transformWebSocketToActivity = useCallback(
    (message: WebSocketMessage): Activity | null => {
      if (
        !['request', 'confirm_request_image'].includes(message.type) ||
        !message.data?.image_url ||
        !message.data?.image_doc_id ||
        typeof message.data?.item_len === 'undefined'
      ) {
        console.warn('Invalid message format:', message);
        return null;
      }

      return {
        id: `${message.data.image_doc_id}_${Date.now()}`,
        type: 'confirm_request_image',
        data: {
          image_url: message.data.image_url,
          image_doc_id: message.data.image_doc_id,
          item_len: message.data.item_len,
          at: message.data.at || new Date().toISOString(),
        },
      };
    },
    []
  );

  // WebSocket 메시지 핸들러
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      const activity = transformWebSocketToActivity(message);
      if (!activity) return;

      setState((prev) => {
        const isDuplicate = prev.activities.some(
          (existing) =>
            existing.data.image_doc_id === activity.data.image_doc_id
        );
        if (isDuplicate) return prev;

        const newActivities = [...prev.activities, activity] // 최신 항목을 뒤에 추가
          .slice(-VISIBLE_ACTIVITIES_LIMIT); // 앞쪽 항목들을 제거

        return {
          ...prev,
          activities: newActivities,
          totalActivities: prev.totalActivities + 1,
          hasMoreActivities: true,
        };
      });
    },
    [transformWebSocketToActivity]
  );

  const { isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  // API 응답을 Activity로 변환
  const transformImageItemToActivity = useCallback(
    (image: ImageItem): Activity => {
      return {
        id: `${image.image_doc_id}_${Date.now()}`,
        type: 'confirm_request_image',
        data: {
          image_url: image.image_url,
          image_doc_id: image.image_doc_id,
          item_len: image.items,
          at: image.at,
        },
      };
    },
    []
  );

  // 초기 데이터 로딩
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialActivities() {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: undefined }));

        const response = await imagesAPI.getImages();
        const images = response.data?.images;

        if (!isMounted) return;

        if (!images || !Array.isArray(images)) {
          throw new Error('Invalid response format');
        }

        const initialActivities = images
          .slice(-VISIBLE_ACTIVITIES_LIMIT) // 마지막 LIMIT개 가져오기
          .map(transformImageItemToActivity);

        console.log(initialActivities);
        console.log(images);
        
        setState((prev) => ({
          ...prev,
          activities: initialActivities,
          isLoading: false,
          totalActivities: images.length,
          hasMoreActivities: images.length > VISIBLE_ACTIVITIES_LIMIT,
        }));
      } catch (error) {
        if (!isMounted) return;

        console.error('Failed to fetch initial activities:', error);
        setState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    }

    fetchInitialActivities();

    return () => {
      isMounted = false;
    };
  }, [transformImageItemToActivity]);

  const onAnimationComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasMoreActivities: false,
    }));
  }, []);

  return {
    ...state,
    feedRef,
    isConnected,
    onAnimationComplete,
  };
}
