import React from 'react';

import { ContentItem } from '@/lib/types/content';
import { ProxiedImage } from '@/components/ProxiedImage';
import { SummarySection } from './SummarySection';
import { InteractiveQASection } from './InteractiveQASection';
import { LinkPreviewCard } from './LinkPreviewCard';
import { DefaultContentCard } from './DefaultContentCard';

interface ContentModalBodyProps {
  content: ContentItem;
}

// 공통 버튼 컴포넌트
const ActionButton = ({
  onClick,
  children,
  variant = 'primary',
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium ${
      variant === 'primary'
        ? 'bg-[#eafd66] hover:bg-[#eafd66]/80 text-black hover:scale-105'
        : 'bg-zinc-800/50 hover:bg-zinc-700/50 text-gray-400 hover:text-white border border-zinc-700/50 hover:border-zinc-600/50'
    }`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
    <span>{children}</span>
  </button>
);

// 공통 이미지 표시 컴포넌트
const ImageDisplay = ({
  src,
  alt,
  downloadedSrc,
  showInfo = true,
}: {
  src: string;
  alt: string;
  downloadedSrc?: string;
  showInfo?: boolean;
}) => (
  <div className="space-y-6">
    <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700/50 shadow-lg">
      <ProxiedImage
        src={src}
        downloadedSrc={downloadedSrc}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto max-h-[70vh] object-contain"
      />
    </div>

    {showInfo && (
      <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400 mb-3">Image URL:</p>
            <p className="text-[#eafd66] text-sm break-all font-mono bg-zinc-900/50 p-3 rounded-lg">
              {src}
            </p>
          </div>
          <div className="ml-6">
            <ActionButton onClick={() => window.open(src, '_blank')}>Open Image</ActionButton>
          </div>
        </div>
      </div>
    )}
  </div>
);

// 공통 섹션 헤더 컴포넌트
const SectionHeader = ({
  icon,
  title,
  color = 'blue',
}: {
  icon: React.ReactNode;
  title: string;
  color?: 'blue' | 'green';
}) => (
  <div className="flex items-center space-x-3 mb-4">
    <div
      className={`w-8 h-8 ${
        color === 'blue' ? 'bg-blue-600' : 'bg-green-600'
      } rounded-lg flex items-center justify-center`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
  </div>
);

export function ContentModalBody({ content }: ContentModalBodyProps) {
  // 디버깅을 위한 콘솔 로그
  console.log('ContentModalBody - content:', content);
  console.log('ContentModalBody - content.type:', content.type);
  console.log('ContentModalBody - content.imageUrl:', content.imageUrl);
  console.log('ContentModalBody - content.linkUrl:', content.linkUrl);

  // Pending 상태인 경우 기본 카드 표시
  if (content.status === 'pending') {
    return (
      <div className="p-8">
        <DefaultContentCard content={content} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Main Content Viewer */}
      <div>
        {/* Image Content */}
        {content.type === 'image' && (
          <>
            {content.imageUrl ? (
              <ImageDisplay
                src={content.imageUrl}
                downloadedSrc={content.linkPreview?.downloadedImageUrl}
                alt={content.title}
              />
            ) : (
              /* 이미지 URL이 없는 경우 기본 카드 표시 */
              <DefaultContentCard content={content} />
            )}
          </>
        )}

        {/* Video Content */}
        {content.type === 'video' && (
          <>
            {content.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700/50 shadow-lg">
                <ProxiedImage
                  src={content.imageUrl}
                  downloadedSrc={content.linkPreview?.downloadedImageUrl}
                  alt={content.title}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                {/* Video Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-20 h-20 bg-[#eafd66]/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-[#eafd66]/30 transition-all duration-200 group">
                    <div className="w-0 h-0 border-l-[16px] border-l-[#eafd66] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ) : (
              /* 비디오 썸네일이 없는 경우 기본 카드 표시 */
              <DefaultContentCard content={content} />
            )}
          </>
        )}

        {/* Text Content */}
        {content.type === 'text' && (
          <>
            {content.description ? (
              <div className="bg-zinc-800/30 rounded-xl p-8 border border-zinc-700/30">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-400 leading-relaxed text-lg mb-6">{content.description}</p>

                  {/* Link URL Display */}
                  {content.linkUrl && (
                    <div className="mt-8 p-6 bg-zinc-900/30 rounded-xl border border-zinc-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-400 mb-3">Link URL:</p>
                          <p className="text-[#eafd66] text-sm break-all font-mono bg-zinc-900/50 p-3 rounded-lg">
                            {content.linkUrl}
                          </p>
                        </div>
                        <div className="ml-6">
                          <ActionButton onClick={() => window.open(content.linkUrl, '_blank')}>
                            Open Link
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 텍스트 설명이 없는 경우 기본 카드 표시 */
              <DefaultContentCard content={content} />
            )}
          </>
        )}

        {/* Link Content */}
        {content.type === 'link' && (
          <div className="space-y-8">
            {/* 1. AI Generated Summary - 맨 위 */}
            {content.aiSummary && <SummarySection title="Summary" summary={content.aiSummary} />}

            {/* 2. Link Preview Card - 중간 (LinkPreview가 있는 경우) */}
            {content.linkPreview ? (
              <LinkPreviewCard
                title={content.linkPreview.title}
                description={content.linkPreview.description}
                imageUrl={content.linkPreview.imageUrl}
                downloadedImageUrl={content.linkPreview.downloadedImageUrl}
                siteName={content.linkPreview.siteName}
                url={content.linkUrl || ''}
              />
            ) : (
              /* LinkPreview가 없는 경우 기본 카드 표시 */
              <DefaultContentCard content={content} />
            )}

            {/* 3. Interactive Q&A Section - 아래 */}
            {content.aiQaList && content.aiQaList.length > 0 && (
              <InteractiveQASection qaList={content.aiQaList} title="Q&A" />
            )}
          </div>
        )}
      </div>

      {/* AI Generated Summary for non-link content */}
      {content.type !== 'link' && content.aiSummary && (
        <SummarySection title="Summary" summary={content.aiSummary} />
      )}

      {/* Interactive Q&A Section for non-link content */}
      {content.type !== 'link' && content.aiQaList && content.aiQaList.length > 0 && (
        <InteractiveQASection qaList={content.aiQaList} title="Q&A" />
      )}

      {/* Content Metadata */}
      {(content.author ||
        content.date ||
        content.likes !== undefined ||
        content.views !== undefined) && (
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 pt-6 border-t border-zinc-700/30">
          {content.author && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{content.author}</span>
            </div>
          )}

          {content.date && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{content.date}</span>
            </div>
          )}

          {content.likes !== undefined && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{content.likes}</span>
            </div>
          )}

          {content.views !== undefined && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{content.views}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
