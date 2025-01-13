"use client";

import { useEffect, useRef, useState } from "react";
import { networkManager } from "@/lib/network/network";

interface MetricData {
  total_requests: number;
  total_provides: number;
  requests_by_endpoint: {
    items: number;
    images: number;
  };
  timestamp: string;
}

interface Metrics {
  all_time: MetricData;
  daily: MetricData;
}

const initialMetricData: MetricData = {
  total_requests: 0,
  total_provides: 0,
  requests_by_endpoint: {
    items: 0,
    images: 0,
  },
  timestamp: new Date().toISOString(),
};

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    all_time: initialMetricData,
    daily: initialMetricData,
  });
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await networkManager.request("metrics/decoded", "GET");
      console.log(response.data);
      if (response.data) {
        const hasChanged =
          response.data.all_time.timestamp !== metrics.all_time.timestamp ||
          response.data.all_time.total_requests !==
            metrics.all_time.total_requests ||
          response.data.all_time.total_provides !==
            metrics.all_time.total_provides ||
          JSON.stringify(response.data.all_time.requests_by_endpoint) !==
            JSON.stringify(metrics.all_time.requests_by_endpoint) ||
          response.data.daily.timestamp !== metrics.daily.timestamp;

        if (hasChanged) {
          setMetrics(response.data);
        }
      }

      retryCount.current = 0;
    } catch (error) {
      console.error("Failed to fetch metrics:", {
        timestamp: new Date().toISOString(),
        error,
        retryCount: retryCount.current,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
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
