'use client';

import { useState, useCallback, useRef } from 'react';
import { Activity } from '../types/activity';
import { useWebSocket, WebSocketMessage } from './use-websocket';
import { useDebounce } from '@/lib/hooks/use-debounce';

function convertMessageToActivity(message: WebSocketMessage): Activity | null {
  if (
    message.type !== 'request' || 
    !message.data?.image_url || 
    !message.data?.image_doc_id ||
    typeof message.data?.item_len === 'undefined'
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
}

export function useActivityData(isAnimating: boolean) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const MAX_ACTIVITIES = 100;
  const pendingUpdatesRef = useRef<Activity[]>([]);

  // 디바운스된 업데이트 함수 (더 빠른 응답을 위해 100ms로 변경)
  const debouncedUpdate = useDebounce((updates: Activity[]) => {
    setActivities(prev => {
      const uniqueUpdates = updates.filter(
        update => !prev.some(activity => activity.id === update.id)
      );
      return [...uniqueUpdates, ...prev].slice(0, MAX_ACTIVITIES);
    });
  }, 100);

  // WebSocket 메시지 핸들러
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    const activity = convertMessageToActivity(message);
    if (!activity) return;

    if (isAnimating) {
      // 애니메이션 중일 때만 pending에 추가
      if (!pendingUpdatesRef.current.some(act => act.id === activity.id)) {
        pendingUpdatesRef.current.push(activity);
      }
    } else {
      // 애니메이션 중이 아닐 때는 즉시 업데이트
      setActivities(prev => {
        if (prev.some(existingActivity => existingActivity.id === activity.id)) {
          return prev;
        }
        return [activity, ...prev].slice(0, MAX_ACTIVITIES);
      });
    }
  }, [isAnimating]);

  // 웹소켓 연결
  const { isConnected, connectionStatus } = useWebSocket({ 
    onMessage: handleWebSocketMessage 
  });

  return {
    activities,
    isLoading: connectionStatus === 'connecting',
    isConnected,
    totalActivities: activities.length,
  };
} 