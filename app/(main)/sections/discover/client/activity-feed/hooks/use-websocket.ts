'use client';

import { useState, useEffect, useCallback } from 'react';
import { networkManager } from '@/lib/network/network';

export interface WebSocketMessage {
  type: 'request';
  data: {
    image_url: string;
    image_doc_id: string;
    item_len: number;
  };
  timestamp?: string;
}

interface UseWebSocketOptions {
  onMessage: (message: WebSocketMessage) => void;
}

export function useWebSocket({ onMessage }: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');

  const connect = useCallback(async () => {
    setConnectionStatus('connecting');
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const tokenId = localStorage.getItem('token_id');
    const token = localStorage.getItem('token');
    let tempToken = localStorage.getItem('temp_token');

    if (!wsUrl) {
      console.error('WebSocket URL is not configured');
      return () => {};
    }

    // 항상 새로운 임시 토큰을 요청
    if (!tokenId) {
      try {
        console.log('[WebSocket] Requesting new temporary token');
        // 기존 임시 토큰 제거
        localStorage.removeItem('temp_token');
        tempToken = await networkManager.getTempToken();
        localStorage.setItem('temp_token', tempToken);
      } catch (error) {
        console.error('[WebSocket] Failed to get temporary token:', error);
        setIsConnected(false);
        return () => {};
      }
    }

    // HTTP/HTTPS를 WS/WSS로 변환
    const wsEndpoint = wsUrl
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');

    try {
      const wsUrl = `${wsEndpoint}/subscribe/decoded/events?token=${encodeURIComponent(
        tempToken!
      )}`;

      console.log('[WebSocket] Attempting connection with token');

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          onMessage(message);
        } catch (error) {
          console.error('[WebSocket] Message parsing error:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
        });

        setIsConnected(false);
        setConnectionStatus('disconnected');

        // Handle specific close codes
        switch (event.code) {
          case 1000:
            console.log('[WebSocket] Normal closure');
            break;
          case 1006:
            console.log(
              '[WebSocket] Abnormal closure - will attempt reconnect with new token'
            );
            // 임시 토큰 제거 후 재연결 시도
            localStorage.removeItem('temp_token');
            setTimeout(() => connect(), 3000);
            break;
          case 4001:
            console.error(
              '[WebSocket] Authentication failed - will attempt with new token'
            );
            localStorage.removeItem('temp_token');
            setTimeout(() => connect(), 3000);
            break;
          default:
            console.log('[WebSocket] Unexpected close code:', event.code);
            setTimeout(() => connect(), 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error occurred:', {
          error,
          readyState: ws.readyState,
          timestamp: new Date().toISOString(),
        });
        setIsConnected(false);
        setConnectionStatus('disconnected');
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Component unmounted');
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      return () => {};
    }
  }, [onMessage]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // IIFE to handle async connect
    (async () => {
      cleanup = await connect();
    })();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [connect]);

  return {
    isConnected,
    connectionStatus,
  };
}
