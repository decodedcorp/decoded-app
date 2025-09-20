'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { ContentItem } from '@/lib/types/contentTypes';
import { useContentAnalytics } from '@/hooks/useContentAnalytics';

// 기존 컴포넌트들 import
import { ContentModalBody } from '@/domains/channels/components/modal/content/ContentModalBody';
import dynamic from 'next/dynamic';

// 사이드바 동적 import (성능 최적화)
const ContentSidebar = dynamic(
  () => import('@/domains/channels/components/modal/content/ContentSidebar').then(mod => ({ default: mod.ContentSidebar })),
  {
    ssr: false,
    loading: () => <SidebarSkeleton />
  }
);

// 로딩 컴포넌트 import
import { SidebarSkeleton } from '@/components/loading/SidebarSkeleton';

interface ContentBodyProps {
  content: ContentItem;
  variant: 'modal' | 'page';
  channelId: string;
}

/**
 * 모달과 페이지에서 공통으로 사용하는 콘텐츠 바디
 * 기존 모달 컴포넌트를 재사용하되 레이아웃만 variant에 따라 조정
 */
export function ContentBody({ content, variant, channelId }: ContentBodyProps) {
  const isModal = variant === 'modal';
  const mainRef = useRef<HTMLElement>(null);

  // Analytics 트래킹
  const { trackContentInteraction } = useContentAnalytics({
    contentId: String(content.id),
    channelId,
    variant,
    title: content.title,
  });

  // 페이지 모드에서 첫 포커스 설정 (접근성)
  useEffect(() => {
    if (!isModal && mainRef.current) {
      mainRef.current.focus();
    }
  }, [isModal]);

  return (
    <div
      className={cn(
        "flex h-full",
        isModal
          ? "relative w-full"
          : "mx-auto max-w-7xl grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_400px]"
      )}
    >
      {/* 메인 콘텐츠 영역 */}
      <main
        ref={mainRef}
        className={cn(
          isModal ? "w-full" : "min-w-0", // min-w-0으로 overflow 방지
          "focus:outline-none"
        )}
        tabIndex={-1}
        aria-label={`${content.title} 콘텐츠`}
      >
        {/* 기존 ContentModalBody 재사용 */}
        <ContentModalBody
          content={content}
          onClose={() => {
            // 모달에서는 실제 닫기, 페이지에서는 빈 함수
            if (isModal) {
              // router.back() 처리는 Modal 컴포넌트에서 처리됨
            }
          }}
        />
      </main>

      {/* 사이드바 */}
      <aside
        className={cn(
          isModal
            ? "hidden lg:block ml-4 w-[400px] flex-shrink-0"
            : "w-full md:w-[400px] flex-shrink-0"
        )}
        aria-label="콘텐츠 정보 및 댓글"
      >
        <div
          className={cn(
            "h-full overflow-hidden",
            isModal
              ? "bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl"
              : "bg-zinc-900 border border-zinc-700/50 rounded-2xl"
          )}
        >
          <ContentSidebar
            content={content}
            onClose={() => {
              // 사이드바에서 닫기는 모달에서만 의미있음
            }}
          />
        </div>
      </aside>
    </div>
  );
}