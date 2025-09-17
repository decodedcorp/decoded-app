import React from 'react';
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
 * Intercepting Route를 통한 모달 페이지
 * 채널 페이지에서 콘텐츠 카드 클릭 시 표시됨
 */
export default async function ContentModalPage({ params }: ContentModalPageProps) {
  const { channelId, contentId } = await params;

  // 콘텐츠 데이터 가져오기 및 유효성 검증
  const content = await getContentWithValidation({ channelId, contentId });

  return (
    <Modal
      onCloseHref={`/channels/${channelId}`}
      ariaLabel={`${content.title} 콘텐츠 모달`}
      className="h-[90vh]"
    >
      <ContentBody
        content={content}
        variant="modal"
        channelId={channelId}
      />
    </Modal>
  );
}