'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  WebSocketMessage,
  WebSocketConnectionStatus,
  WebSocketOptions,
} from './types';
import { TokenManager } from './token';

export function useWebSocket({
  onMessage,
  onStatusChange,
}: WebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketConnectionStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(async () => {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
      if (!wsUrl) throw new Error('WebSocket URL is not configured');

      setConnectionStatus('connecting');

      // 임시 토큰 가져오기
      const token = await TokenManager.getTempToken();

      // WebSocket URL 생성
      const wsEndpoint = wsUrl.replace(/^http/, 'ws');
      const fullWsUrl = `${wsEndpoint}/subscribe/decoded/events?token=${encodeURIComponent(
        token
      )}`;

      // WebSocket 연결
      wsRef.current = new WebSocket(fullWsUrl);

      wsRef.current.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
        onStatusChange?.('connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          onMessage?.(message);
        } catch (error) {
          console.error('[WebSocket] Message parsing error:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', event);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onStatusChange?.('disconnected');

        // 연결 실패시 재연결
        if (event.code === 1006) {
          TokenManager.clearToken();
          reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onStatusChange?.('disconnected');
      };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      setConnectionStatus('disconnected');
      onStatusChange?.('disconnected');
    }
  }, [onMessage, onStatusChange]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    isConnected,
    connectionStatus,
    ws: wsRef.current,
  };
}
