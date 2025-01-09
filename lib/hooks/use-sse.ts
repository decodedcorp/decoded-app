"use client";

import { useEffect, useRef, useState } from "react";
import { SSEClient } from "../network/sse";

interface UseSSEOptions {
  path: string;
  enabled?: boolean;
}

export function useSSE<T = any>(options: UseSSEOptions) {
  const { path, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const sseClientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    sseClientRef.current = new SSEClient({
      path,
      onMessage: (newData) => {
        setData(newData);
      },
      onError: (err) => {
        setError(err);
        setIsConnected(false);
      },
      onOpen: () => {
        setError(null);
        setIsConnected(true);
      },
    });

    sseClientRef.current.connect();

    return () => {
      sseClientRef.current?.disconnect();
    };
  }, [path, enabled]);

  return {
    data,
    error,
    isConnected,
  };
} 