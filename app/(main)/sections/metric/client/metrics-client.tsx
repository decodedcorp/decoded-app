'use client';

import { MetricItem } from './metric-item';
import { useMetrics } from './hooks/use-metrics';

export function MetricsClient() {
  const { metrics, isLoading } = useMetrics();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <MetricItem
        label="누적 요청 수"
        value={metrics?.total_requests ?? 0}
        suffix="건"
        isLoading={isLoading}
      />
      <MetricItem
        label="누적 제공 수"
        value={metrics?.total_provides ?? 0}
        suffix="건"
        isLoading={isLoading}
      />
      <MetricItem
        label="이미지 요청 수"
        value={metrics?.requests_by_endpoint?.images ?? 0}
        suffix="건"
        isLoading={isLoading}
      />
    </div>
  );
}
