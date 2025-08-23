'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface SubscribeButtonSectionProps {
  onSubscribe?: (isSubscribed: boolean) => void;
  initialIsSubscribed?: boolean;
  extractedColor?: {
    primary: { rgb: string; hex: string; hsl: string };
    vibrant: { rgb: string; hex: string; hsl: string };
    muted: { rgb: string; hex: string; hsl: string };
  } | null;
}

export const SubscribeButtonSection: React.FC<SubscribeButtonSectionProps> = ({
  onSubscribe,
  initialIsSubscribed = false,
  extractedColor,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);

  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
  }, [initialIsSubscribed]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // 모든 이벤트 전파 중단
      event.stopPropagation();
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();

      console.log('🔴 SubscribeButton CLICKED!');
      console.log('🔴 Event details:', {
        type: event.type,
        target: event.target,
        currentTarget: event.currentTarget,
        isPropagationStopped: event.isPropagationStopped(),
        defaultPrevented: event.defaultPrevented,
      });

      const newState = !isSubscribed;
      console.log('🔴 Changing subscription from', isSubscribed, 'to', newState);

      // 상태 업데이트
      setIsSubscribed(newState);

      // 콜백 호출
      if (onSubscribe) {
        console.log('🔴 Calling onSubscribe with:', newState);
        try {
          onSubscribe(newState);
          console.log('🔴 onSubscribe completed successfully');
        } catch (error) {
          console.error('🔴 Error in onSubscribe:', error);
        }
      } else {
        console.warn('🔴 No onSubscribe callback provided');
      }
    },
    [isSubscribed, onSubscribe],
  );

  return (
    <div
      className="subscribe-button-wrapper"
      style={{
        position: 'relative',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      <button
        onClick={handleClick}
        type="button"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        style={{
          position: 'relative',
          zIndex: 10000,
          pointerEvents: 'auto',
        }}
        data-testid="subscribe-button"
        data-subscribed={isSubscribed}
      >
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
};
