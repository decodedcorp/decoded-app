'use client';

import { useEffect, useRef, useState } from 'react';
import { networkManager } from '@/lib/network/network';

interface Metrics {
  total_requests: number;
  total_provides: number;
  requests_by_endpoint: {
    items: number;
    images: number;
  };
  timestamp: string;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    total_requests: 0,
    total_provides: 0,
    requests_by_endpoint: {
      items: 0,
      images: 0,
    },
    timestamp: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await networkManager.request('metrics/decoded', 'GET');

      if (response.data?.all_time) {
        const hasChanged =
          response.data.all_time.timestamp !== metrics.timestamp ||
          response.data.all_time.total_requests !== metrics.total_requests ||
          response.data.all_time.total_provides !== metrics.total_provides ||
          JSON.stringify(response.data.all_time.requests_by_endpoint) !==
            JSON.stringify(metrics.requests_by_endpoint);

        if (hasChanged) {
          setMetrics(response.data.all_time);
        }
      }

      retryCount.current = 0;
    } catch (error) {
      console.error('Failed to fetch metrics:', {
        timestamp: new Date().toISOString(),
        error,
        retryCount: retryCount.current,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      if (retryCount.current < 3) {
        retryCount.current += 1;
        setTimeout(fetchMetrics, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { metrics, isLoading };
}
