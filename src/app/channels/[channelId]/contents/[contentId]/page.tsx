import React from 'react';
import type { Metadata } from 'next';
import { ContentBody } from '@/domains/content/ContentBody';
import { StructuredData } from '@/components/StructuredData';
import { getContentWithValidation } from '@/lib/api/content';
import { generateContentMetadata } from '@/lib/metadata';

interface ContentPageProps {
  params: Promise<{
    channelId: string;
    contentId: string;
  }>;
}

/**
 * 직접 링크로 접근하는 콘텐츠 풀페이지
 */
export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { channelId, contentId } = await params;

  try {
    const content = await getContentWithValidation({ channelId, contentId });
    return generateContentMetadata(content, channelId);
  } catch (error) {
    // 에러 시 기본 메타데이터 반환
    return {
      title: 'Content | Decoded',
      description: 'Decoded 콘텐츠 페이지',
    };
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { channelId, contentId } = await params;

  // 콘텐츠 데이터 가져오기 및 유효성 검증
  const content = await getContentWithValidation({ channelId, contentId });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 구조화된 데이터 */}
      <StructuredData content={content} channelId={channelId} />

      {/* 메인 콘텐츠 */}
      <ContentBody
        content={content}
        variant="page"
        channelId={channelId}
      />
    </div>
  );
}