'use client';

import { useEffect, useRef, useState } from 'react';
import { networkManager } from '@/lib/network/network';

interface Metrics {
  hourly: {
    provides_by_item: Record<string, any>;
    requests_by_endpoint: {
      items: number;
      images: number;
    };
    timestamp: string;
    total_provides: number;
    total_requests: number;
  };
  daily: {
    provides_by_item: Record<string, any>;
    requests_by_endpoint: {
      items: number;
      images: number;
    };
    timestamp: string;
    total_provides: number;
    total_requests: number;
  };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    hourly: {
      provides_by_item: {},
      requests_by_endpoint: {
        items: 0,
        images: 0,
      },
      timestamp: new Date().toISOString(),
      total_provides: 0,
      total_requests: 0,
    },
    daily: {
      provides_by_item: {},
      requests_by_endpoint: {
        items: 0,
        images: 0,
      },
      timestamp: new Date().toISOString(),
      total_provides: 0,
      total_requests: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await networkManager.request('metrics/decoded', 'GET');

      if (response.data?.hourly && response.data?.daily) {
        const hasChanged =
          response.data.hourly.timestamp !== metrics.hourly.timestamp ||
          response.data.daily.timestamp !== metrics.daily.timestamp ||
          response.data.hourly.total_requests !==
            metrics.hourly.total_requests ||
          response.data.hourly.total_provides !==
            metrics.hourly.total_provides ||
          response.data.daily.total_requests !== metrics.daily.total_requests ||
          response.data.daily.total_provides !== metrics.daily.total_provides ||
          JSON.stringify(response.data.hourly.requests_by_endpoint) !==
            JSON.stringify(metrics.hourly.requests_by_endpoint) ||
          JSON.stringify(response.data.daily.requests_by_endpoint) !==
            JSON.stringify(metrics.daily.requests_by_endpoint);

        if (hasChanged) {
          setMetrics(response.data);
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
