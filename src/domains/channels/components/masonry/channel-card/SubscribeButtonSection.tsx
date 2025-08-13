'use client';

import React, { useState } from 'react';

interface SubscribeButtonSectionProps {
  onSubscribe?: (isSubscribed: boolean) => void;
}

const SubscribeButtonSection: React.FC<SubscribeButtonSectionProps> = ({
  onSubscribe,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 onClick 이벤트 버블링 방지
    const newState = !isSubscribed;
    setIsSubscribed(newState);
    onSubscribe?.(newState);
  };

  return (
    <button
      onClick={handleSubscribe}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg ${
        isSubscribed
          ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
          : 'bg-white text-gray-900 hover:bg-white/95 shadow-xl'
      }`}
    >
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
};

export default SubscribeButtonSection;
