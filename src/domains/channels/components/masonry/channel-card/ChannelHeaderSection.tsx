'use client';

import React from 'react';

import { Check } from 'lucide-react';

interface ChannelHeaderSectionProps {
  channelName: string;
  description?: string;
  isVerified: boolean;
  extractedColor?: {
    primary: { rgb: string; hex: string; hsl: string };
    vibrant: { rgb: string; hex: string; hsl: string };
    muted: { rgb: string; hex: string; hsl: string };
  } | null;
}

const ChannelHeaderSection: React.FC<ChannelHeaderSectionProps> = ({
  channelName,
  description,
  isVerified,
  extractedColor,
}) => {
  // Enhanced verification badge style based on extracted vibrant color
  const badgeStyle =
    extractedColor && isVerified
      ? {
          backgroundColor: `rgb(${extractedColor.vibrant.rgb})`,
          // 강화된 그림자 효과
          boxShadow: `
          0 2px 8px -1px rgba(${extractedColor.vibrant.rgb}, 0.4),
          0 1px 4px -1px rgba(${extractedColor.vibrant.rgb}, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
          // 호버 시 더 강한 그림자
          '--hover-shadow': `
          0 4px 12px -2px rgba(${extractedColor.vibrant.rgb}, 0.5),
          0 2px 6px -1px rgba(${extractedColor.vibrant.rgb}, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `,
        }
      : {};

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white text-lg font-bold drop-shadow-md">{channelName}</h3>
        {isVerified && (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-[var(--hover-shadow,0_4px_12px_-2px_rgba(0,0,0,0.3))]"
            style={badgeStyle}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      {description && <p className="text-white/80 text-sm drop-shadow-sm mb-3">{description}</p>}
    </>
  );
};

export default ChannelHeaderSection;
