import { cn } from '@/lib/utils/style';
import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { networkManager } from '@/lib/network/network';

interface MetricItemProps {
  label: string;
  value: number;
  suffix?: string;
}

interface CounterProps {
  from?: number;
  to: number;
  className?: string;
}

export function Counter({ from = 0, to, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const rounded = useSpring(count, {
    stiffness: 100,
    damping: 20,
    restSpeed: 0.5,
  });

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [isInView, to, count]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [rounded]);

  return <span ref={ref} className={className} />;
}

function MetricItem({ label, value, suffix = '' }: MetricItemProps) {
  return (
    <div className="text-center px-4">
      <div className="flex items-baseline justify-center gap-1">
        <Counter
          from={0}
          to={value}
          className={cn(
            'text-3xl md:text-4xl font-bold',
            'bg-gradient-to-b from-[#EAFD66] to-[#EAFD66]/70',
            'bg-clip-text text-transparent'
          )}
        />
        {suffix && <span className="text-xl text-[#EAFD66]/70">{suffix}</span>}
      </div>
      <p className="text-sm md:text-base text-zinc-400 mt-2">{label}</p>
    </div>
  );
}

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

export function MetricsSection() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await networkManager.request('metrics/decoded', 'GET');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  // 메트릭 계산
  const calculatedMetrics = {
    totalRequests: metrics?.daily.total_requests ?? 0,
    todayRequests: metrics?.hourly.total_requests ?? 0,
    successRate: metrics
      ? Math.round(
          (metrics.daily.total_provides / metrics.daily.total_requests) * 100
        ) || 0
      : 0,
    responseTime: 24, // 고정값 또는 별도 계산 필요
  };

  return (
    <section
      className={cn(
        'container mx-auto px-4 py-16',
        'border-y border-zinc-800',
        'bg-zinc-900/30'
      )}
    >
      <div
        className={cn(
          'grid grid-cols-2 md:grid-cols-3 gap-8',
          'max-w-4xl mx-auto'
        )}
      >
        <MetricItem
          label="누적 요청 수"
          value={calculatedMetrics.totalRequests}
          suffix="건"
        />
        <MetricItem
          label="금일 요청 수"
          value={calculatedMetrics.todayRequests}
          suffix="건"
        />
        <MetricItem
          label="이미지 요청 수"
          value={metrics?.daily.requests_by_endpoint.images ?? 0}
          suffix="건"
        />
      </div>
    </section>
  );
}
