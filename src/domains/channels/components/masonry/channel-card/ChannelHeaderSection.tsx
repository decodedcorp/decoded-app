'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ChannelHeaderSectionProps {
  channelName: string;
  category?: string;
  isVerified: boolean;
}

const ChannelHeaderSection: React.FC<ChannelHeaderSectionProps> = ({
  channelName,
  category,
  isVerified,
}) => {
  return (
    <>
      {/* Channel Name and Verification */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold text-white line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          {channelName}
        </h3>
        {isVerified && (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      
      {/* Category */}
      {category && (
        <p className="text-white/95 text-sm leading-relaxed mb-4 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          {category}
        </p>
      )}
    </>
  );
};

export default ChannelHeaderSection;
