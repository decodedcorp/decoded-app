'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ContentAnalyticsOptions {
  contentId: string;
  channelId?: string;
  variant: 'modal' | 'page';
  title?: string;
}

/**
 * 콘텐츠 조회 Analytics 이벤트 관리
 * 모달/페이지 중복 방지 및 적절한 이벤트 트래킹
 */
export function useContentAnalytics({
  contentId,
  channelId,
  variant,
  title,
}: ContentAnalyticsOptions) {
  const pathname = usePathname();

  useEffect(() => {
    // 개발 환경에서는 콘솔 로그만
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 [Analytics] Content view:', {
        content_id: contentId,
        channel_id: channelId,
        variant,
        pathname,
        title,
      });
    }

    // 페이지뷰는 실제 경로 변경(풀페이지)에서만 트래킹
    if (variant === 'page') {
      // TODO: 실제 Analytics 서비스 연동
      // trackEvent('page_view', {
      //   page_path: pathname,
      //   page_title: title,
      //   content_id: contentId,
      //   channel_id: channelId,
      //   page_type: 'content_detail'
      // });
    }

    // 콘텐츠 오픈 이벤트 (모달/페이지 구분)
    // TODO: 실제 Analytics 서비스 연동
    // trackEvent('content_view', {
    //   content_id: contentId,
    //   channel_id: channelId,
    //   view_type: variant,
    //   content_title: title,
    //   referrer: document.referrer,
    //   timestamp: Date.now()
    // });

  }, [contentId, channelId, variant, pathname, title]);

  // 이벤트 트래킹 함수들 반환 (필요시 컴포넌트에서 직접 호출)
  return {
    trackContentInteraction: (action: string, data?: Record<string, any>) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 [Analytics] Content interaction:', {
          action,
          content_id: contentId,
          channel_id: channelId,
          variant,
          ...data,
        });
      }

      // TODO: 실제 Analytics 서비스 연동
      // trackEvent('content_interaction', {
      //   action,
      //   content_id: contentId,
      //   channel_id: channelId,
      //   view_type: variant,
      //   ...data
      // });
    },

    trackContentShare: (platform: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 [Analytics] Content share:', {
          platform,
          content_id: contentId,
          channel_id: channelId,
          variant,
        });
      }

      // TODO: 실제 Analytics 서비스 연동
      // trackEvent('content_share', {
      //   platform,
      //   content_id: contentId,
      //   channel_id: channelId,
      //   view_type: variant
      // });
    },
  };
}

/**
 * 콘텐츠 카드 클릭 Analytics
 */
export function trackContentCardClick(data: {
  contentId: string;
  channelId: string;
  position?: number;
  source?: string;
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 [Analytics] Content card click:', data);
  }

  // TODO: 실제 Analytics 서비스 연동
  // trackEvent('content_card_click', {
  //   content_id: data.contentId,
  //   channel_id: data.channelId,
  //   position: data.position,
  //   source: data.source || 'channel_grid',
  //   timestamp: Date.now()
  // });
}