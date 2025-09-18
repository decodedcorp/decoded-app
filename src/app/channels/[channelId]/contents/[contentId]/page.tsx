import React from 'react';
import type { Metadata, Viewport } from 'next';
import { ContentBody } from '@/domains/content/ContentBody';
import { StructuredData } from '@/components/StructuredData';
import { getContentWithValidation } from '@/lib/api/content';
import { generateContentMetadata } from '@/lib/metadata';
import { toContentHref } from '@/lib/routing';

interface ContentPageProps {
  params: Promise<{
    channelId: string;
    contentId: string;
  }>;
}

/**
 * 직접 링크로 접근하는 콘텐츠 풀페이지
 */
export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#000000',
    colorScheme: 'dark',
  };
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { channelId, contentId } = await params;

  try {
    const content = await getContentWithValidation({ channelId, contentId });
    const baseMetadata = generateContentMetadata(content, channelId);
    const canonicalUrl = toContentHref({ channelId, contentId });

    return {
      ...baseMetadata,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        ...baseMetadata.openGraph,
        url: canonicalUrl,
      },
      twitter: {
        ...baseMetadata.twitter,
      },
    };
  } catch (error) {
    // 에러 시 기본 메타데이터 반환
    const canonicalUrl = toContentHref({ channelId, contentId });
    return {
      title: 'Content | Decoded',
      description: 'Decoded 콘텐츠 페이지',
      alternates: {
        canonical: canonicalUrl,
      },
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

      {/* 채널 컨텍스트를 포함한 풀페이지 레이아웃 */}
      <div className="flex h-screen overflow-hidden">
        {/* Main Content - Full width */}
        <div className="w-full flex flex-col overflow-hidden">
          {/* Content Header - 채널 정보 포함 */}
          <div className="flex-shrink-0 border-b border-zinc-800">
            <div className="px-4 py-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="뒤로가기"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-white">콘텐츠</h1>
                  <p className="text-sm text-zinc-400">채널: {channelId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto">
            <ContentBody content={content} variant="page" channelId={channelId} />
          </div>
        </div>
      </div>
    </div>
  );
}
