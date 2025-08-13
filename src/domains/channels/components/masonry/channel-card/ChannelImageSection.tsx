'use client';

import React from 'react';

interface ChannelImageSectionProps {
  imageUrl: string;
  channelName: string;
  colorShiftOnHover?: boolean;
}

const ChannelImageSection: React.FC<ChannelImageSectionProps> = ({
  imageUrl,
  channelName,
  colorShiftOnHover = false,
}) => {
  return (
    <div className="absolute inset-0">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={channelName}
        className="w-full h-full object-cover"
      />
      
      {/* Enhanced Gradient Overlay with Blur Effect */}
      <div className="absolute inset-0">
        {/* Primary gradient - 자연스러운 하단 그라디언트 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(0,0,0,0.03) 55%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.8) 95%, rgba(0,0,0,0.9) 100%)',
          }}
        />
        
        {/* Subtle backdrop blur for text readability */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 backdrop-blur-[1px]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 70%)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
          }}
        />
        
        {/* Ultra-light atmospheric effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-[0.5px]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, transparent 100%)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        />
      </div>
      
      {/* 색상 시프트 오버레이 (호버 시) */}
      {colorShiftOnHover && (
        <div className="color-overlay absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500/30 to-sky-500/30 opacity-0 pointer-events-none transition-opacity duration-300" />
      )}
    </div>
  );
};

export default ChannelImageSection;
