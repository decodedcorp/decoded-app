'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, WebSocketMessage } from '../types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL + '/subscribe/decoded/events';
const RECONNECT_DELAY = 3000;

export function useWebSocket(onNewActivity: (activity: Activity) => void) {
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {      
      const parsedData = JSON.parse(event.data) as WebSocketMessage;
      console.log('Received WebSocket message:', parsedData);

      // Ignore system messages
      if (
        parsedData.type === 'ping' ||
        parsedData.type === 'pong' ||
        parsedData.action === 'built' ||
        parsedData.action === 'sync' ||
        parsedData.action === 'reload'
      ) {
        console.log('Ignoring system message:', parsedData.type || parsedData.action);
        return;
      }

      // Handle new image request
      if (parsedData.event === 'request' && parsedData.data) {
        console.log('Processing image request:', parsedData.data);
        
        if (!parsedData.data.img_url || !parsedData.data.doc_id) {
          console.warn('Missing required fields in image request:', parsedData.data);
          return;
        }

        const newActivity: Activity = {
          id: `${parsedData.data.doc_id}_${Date.now()}`,
          type: 'request_image',
          data: {
            image_url: parsedData.data.img_url,
            image_doc_id: parsedData.data.doc_id,
            item_len: parsedData.data.items 
              ? Object.values(parsedData.data.items).reduce(
                  (sum: number, items: any) => 
                    sum + (Array.isArray(items) ? items.length : 0),
                  0
                )
              : 0,
          },
          timestamp: parsedData.timestamp || new Date().toISOString(),
        };

        console.log('Created new activity:', newActivity);
        onNewActivity(newActivity);
      } else {
        console.log('Unhandled message type:', parsedData.event);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }, [onNewActivity]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;
    let isUnmounted = false;

    function connect() {
      try {
        ws = new WebSocket(WS_URL);

        // Add test function to window object for browser console testing
        (window as any).testWebSocket = function(imageUrl = "https://example.com/test.jpg") {
          if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected!");
            return;
          }

          const testMessage = {
            event: "request",
            data: {
              doc_id: `test_${Date.now()}`,
              img_url: imageUrl,
              items: {
                category1: ["item1", "item2"],
                category2: ["item3"]
              }
            },
            timestamp: new Date().toISOString()
          };

          console.log("Sending test message:", testMessage);
          ws.send(JSON.stringify(testMessage));
        };

        ws.onopen = () => {
          setIsConnected(true);
          console.log("WebSocket connected! You can now use window.testWebSocket() to send test messages");
        };

        ws.onmessage = (event) => {
          console.log('=== WebSocket Message Received ===');
          console.log('Raw message:', event.data);
          try {
            const parsed = JSON.parse(event.data);
            console.log('Parsed message:', {
              event: parsed.event,
              data: parsed.data,
              timestamp: parsed.timestamp,
              type: parsed.type,
              action: parsed.action
            });
            if (parsed.event === 'request') {
              console.log('Request event details:', {
                doc_id: parsed.data?.doc_id,
                img_url: parsed.data?.img_url,
                items: parsed.data?.items
              });
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
          handleMessage(event);
        };

        ws.onclose = () => {
          setIsConnected(false);
          if (!isUnmounted) {
            reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Connection establishment failed:', error);
        if (!isUnmounted) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
        }
      }
    }

    connect();

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimer);
      
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Component unmounted');
        }
      }
    };
  }, [handleMessage]);

  return { isConnected };
} 