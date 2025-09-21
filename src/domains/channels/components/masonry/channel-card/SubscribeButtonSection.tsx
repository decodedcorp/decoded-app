'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@decoded/ui';
import { useCommonTranslation } from '@/lib/i18n/hooks';

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
  const t = useCommonTranslation();

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
        zIndex: 'var(--z-base)',
        pointerEvents: 'auto',
      }}
    >
      <Button
        onClick={handleClick}
        type="button"
        variant={isSubscribed ? 'secondary' : 'primary'}
        size="sm"
        style={{
          position: 'relative',
          zIndex: 'var(--z-base)',
          pointerEvents: 'auto',
        }}
        data-testid="subscribe-button"
        data-subscribed={isSubscribed}
      >
        {isSubscribed ? t.states.subscribed() : t.actions.subscribe()}
      </Button>
    </div>
  );
};
