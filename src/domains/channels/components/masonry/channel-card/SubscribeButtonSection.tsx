'use client';

import React, { useState } from 'react';

interface SubscribeButtonSectionProps {
  onSubscribe?: (isSubscribed: boolean) => void;
  extractedColor?: {
    primary: { rgb: string; hex: string; hsl: string };
    vibrant: { rgb: string; hex: string; hsl: string };
    muted: { rgb: string; hex: string; hsl: string };
  } | null;
}

const SubscribeButtonSection: React.FC<SubscribeButtonSectionProps> = ({
  onSubscribe,
  extractedColor,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    const newState = !isSubscribed;
    setIsSubscribed(newState);
    onSubscribe?.(newState);
  };

  // Enhanced dynamic button style based on extracted colors
  const buttonStyle = isSubscribed && extractedColor
    ? {
        // 구독 상태: Vibrant 색상으로 강렬한 효과
        backgroundColor: `rgba(${extractedColor.vibrant.rgb}, 0.25)`,
        borderColor: `rgba(${extractedColor.vibrant.rgb}, 0.6)`,
        color: 'white',
        // 강화된 그림자 효과
        boxShadow: `
          0 4px 12px -2px rgba(${extractedColor.vibrant.rgb}, 0.4),
          0 2px 6px -1px rgba(${extractedColor.vibrant.rgb}, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        // 호버 시 더 강한 그림자
        '--hover-shadow': `
          0 6px 16px -3px rgba(${extractedColor.vibrant.rgb}, 0.5),
          0 3px 8px -1px rgba(${extractedColor.vibrant.rgb}, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,
      }
    : extractedColor
    ? {
        // 기본 상태: Muted 색상으로 자연스러운 그림자
        boxShadow: `
          0 2px 8px -1px rgba(${extractedColor.muted.rgb}, 0.2),
          0 1px 4px -1px rgba(${extractedColor.muted.rgb}, 0.1)
        `,
        // 호버 시 Primary 색상으로 강화
        '--hover-shadow': `
          0 4px 12px -2px rgba(${extractedColor.primary.rgb}, 0.3),
          0 2px 6px -1px rgba(${extractedColor.primary.rgb}, 0.2)
        `,
      }
    : {};

  return (
    <button
      onClick={handleSubscribe}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105 ${
        isSubscribed
          ? 'border hover:shadow-[var(--hover-shadow,0_6px_16px_-3px_rgba(0,0,0,0.3))]'
          : 'bg-white text-gray-900 hover:bg-white/95 hover:shadow-[var(--hover-shadow,0_4px_12px_-2px_rgba(0,0,0,0.2))]'
      }`}
      style={buttonStyle}
    >
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
};

export default SubscribeButtonSection;
