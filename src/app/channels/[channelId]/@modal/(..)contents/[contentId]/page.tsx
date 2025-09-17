'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { ContentBody } from '@/domains/content/ContentBody';
import { getContentWithValidation } from '@/lib/api/content';

interface ContentModalPageProps {
  params: Promise<{
    channelId: string;
    contentId: string;
  }>;
}

/**
 * Overlay Adapter for Intercept Routes
 * 기존 Modal 컴포넌트는 수정하지 않고, 오버레이 레벨에서만 UX/a11y 처리
 */
export default function ContentOverlay({ params }: ContentModalPageProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [channelId, setChannelId] = React.useState<string>('');
  const [contentId, setContentId] = React.useState<string>('');

  // Params 파싱
  React.useEffect(() => {
    params.then(({ channelId, contentId }) => {
      setChannelId(channelId);
      setContentId(contentId);

      // 콘텐츠 로드
      getContentWithValidation({ channelId, contentId })
        .then(setContent)
        .finally(() => setIsLoading(false));
    });
  }, [params]);

  // 바디 스크롤락 (오버레이일 때만)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 닫기 로직 (히스토리 기반 + 폴백)
  const onClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace(`/channels/${channelId}`);
    }
  };

  // ESC 키 핸들링
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [channelId]);

  if (isLoading || !content) {
    return (
      <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999]"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 기존 Modal 컴포넌트 그대로 사용 */}
      <div className="relative mx-auto my-8 max-w-4xl md:my-12">
        <Modal
          onCloseHref="#"
          ariaLabel={`${content.title} 콘텐츠 모달`}
          className="h-[90vh]"
        >
          <ContentBody
            content={content}
            variant="modal"
            channelId={channelId}
          />
        </Modal>
      </div>
    </div>
  );
}