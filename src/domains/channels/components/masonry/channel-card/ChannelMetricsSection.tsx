'use client';

import React from 'react';

import { Users, Heart } from 'lucide-react';

interface ChannelMetricsSectionProps {
  subscribers: number;
  contents: number;
}

const ChannelMetricsSection: React.FC<ChannelMetricsSectionProps> = ({
  subscribers,
  contents,
}) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5 text-white/95 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
        <Users className="w-4 h-4" />
        <span>{subscribers.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 text-white/95 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
        <Heart className="w-4 h-4" />
        <span>{contents}</span>
      </div>
    </div>
  );
};

export default ChannelMetricsSection;
