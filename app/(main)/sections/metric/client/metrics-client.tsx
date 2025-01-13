'use client';

import { MetricItem } from './metric-item';
import { useMetrics } from './hooks/use-metrics';
import { pretendardExtraBold } from '@/lib/constants/fonts';
import { cn } from '@/lib/utils/style';

export function MetricsClient() {
  const { metrics, isLoading } = useMetrics();

  return (
    <div className="relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,253,102,0.03),transparent_70%)]" />

      <div className="relative flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 w-full max-w-7xl">
        {/* Left Side - Title and Navigation */}
        <div className="w-full space-y-6 text-center lg:text-left">
          {/* Main Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#EAFD66]/70 justify-center lg:justify-start">
              <div className="w-2 h-2 rounded-full bg-[#EAFD66] animate-pulse" />
              <span className="text-sm tracking-wider">REAL-TIME</span>
            </div>

            <h1
              className={cn(
                pretendardExtraBold.className,
                'text-5xl lg:text-7xl text-gray-400 leading-tight tracking-wide'
              )}
            >
              Metrics
            </h1>
          </div>

          {/* Request Button */}
          <div className="pt-8 lg:pt-12">
            <button className="text-[#EAFD66]/60 hover:text-[#EAFD66] transition-colors cursor-pointer group flex items-center gap-2 mx-auto lg:mx-0">
              <span className="text-lg">→ Request now</span>
            </button>
          </div>
        </div>

        {/* Right Side - Metrics */}
        <div className="w-full  px-4 lg:px-0">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <MetricItem
              label="Total Requests"
              value={metrics?.all_time?.total_requests ?? 0}
              isLoading={isLoading}
            />
            <MetricItem
              label="Total Provides"
              value={metrics?.all_time?.total_provides ?? 0}
              isLoading={isLoading}
            />
            <MetricItem
              label="Today's Requests"
              value={1}
              isLoading={isLoading}
            />
            <MetricItem
              label="Today's Provides"
              value={1}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
