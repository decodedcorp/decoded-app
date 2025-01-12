'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import { Activity } from '../types/activity';
import { ImageData, ImageItem } from '../types/image';
import { useWebSocket, WebSocketMessage } from './use-websocket';

interface ActivityFeedState {
  activities: Activity[];
  isLoading: boolean;
  error: Error | null;
  totalActivities: number;
  hasMoreActivities: boolean;
}

const VISIBLE_ACTIVITIES_LIMIT = 6;

const INITIAL_STATE: ActivityFeedState = {
  activities: [],
  isLoading: true,
  error: null,
  totalActivities: 0,
  hasMoreActivities: false,
};

export function useActivityFeed() {
  const [state, setState] = useState<ActivityFeedState>(INITIAL_STATE);
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
        message.type !== 'request' ||
        !message.data?.image_url ||
        !message.data?.image_doc_id
      ) {
        return null;
      }

      return {
        id: `${message.data.image_doc_id}_${Date.now()}`,
        type: 'request',
        data: {
          image_url: message.data.image_url,
          image_doc_id: message.data.image_doc_id,
          item_len: message.data.item_len,
        },
      };
    },
    []
  );

  // WebSocket 메시지 핸들러
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      const activity = transformWebSocketToActivity(message);
      if (activity) {
        setState((prev) => {
          const newActivities = [...prev.activities, activity];
          // VISIBLE_ACTIVITIES_LIMIT를 초과하면 가장 오래된 항목 제거
          if (newActivities.length > VISIBLE_ACTIVITIES_LIMIT) {
            newActivities.shift();
          }

          return {
            ...prev,
            activities: newActivities,
            totalActivities: prev.totalActivities + 1,
            hasMoreActivities: true,
          };
        });
      }
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
        type: 'request',
        data: {
          image_url: image.image_url,
          image_doc_id: image.image_doc_id,
          item_len: image.items,
        },
      };
    },
    []
  );

  // 초기 데이터 로딩
  useEffect(() => {
    async function fetchInitialActivities() {
      try {
        const response = await imagesAPI.getImages();
        const images = response.data?.images;

        if (!images || !Array.isArray(images)) {
          throw new Error('Invalid response format');
        }

        // 최근 VISIBLE_ACTIVITIES_LIMIT 개의 활동만 가져옴
        const initialActivities = images
          .slice(-VISIBLE_ACTIVITIES_LIMIT) // 마지막 6개만 가져옴
          .map(transformImageItemToActivity);

        setState((prev) => ({
          ...prev,
          activities: initialActivities,
          isLoading: false,
          totalActivities: images.length,
          hasMoreActivities: true,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    }

    fetchInitialActivities();
  }, [transformImageItemToActivity]);

  const onAnimationComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasMoreActivities: false,
    }));
  }, []);

  return {
    ...state,
    isConnected,
    onAnimationComplete,
    feedRef,
  };
}
