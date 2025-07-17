'use client';

import { useState, useCallback, useRef } from 'react';
import { Activity } from '../utils/types';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { WebSocketMessage } from '@/lib/websocket/websocket';
import { useDebounce } from '@/lib/hooks/use-debounce';

function convertMessageToActivity(message: WebSocketMessage): Activity | null {
  if (
    message.type !== 'confirm_request_image' ||
    !message.data?.image_url ||
    !message.data?.image_doc_id ||
    typeof message.data?.item_len === 'undefined'
  ) {
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
}

export function useActivityData(isAnimating: boolean) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const MAX_ACTIVITIES = 100;
  const pendingUpdatesRef = useRef<Activity[]>([]);

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      const activity = convertMessageToActivity(message);
      if (!activity) return;

      if (isAnimating) {
        if (!pendingUpdatesRef.current.some((act) => act.id === activity.id)) {
          pendingUpdatesRef.current.push(activity);
        }
      } else {
        setActivities((prev) => {
          if (
            prev.some((existingActivity) => existingActivity.id === activity.id)
          ) {
            return prev;
          }
          return [activity, ...prev].slice(0, MAX_ACTIVITIES);
        });
      }
    },
    [isAnimating]
  );

  const { isConnected, connectionStatus } = useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  return {
    activities,
    isLoading: connectionStatus === 'connecting',
    isConnected,
    totalActivities: activities.length,
  };
}
