import React from 'react';

import { ContentItem } from '@/lib/types/content';
import { ProxiedImage } from '@/components/ProxiedImage';
import { SummarySection } from './SummarySection';
import { InteractiveQASection } from './InteractiveQASection';
import { LinkPreviewCard } from './LinkPreviewCard';
import { DefaultContentCard } from './DefaultContentCard';
import { ContentMetadata } from './ContentMetadata';

interface ContentModalBodyProps {
  content: ContentItem;
  onClose: () => void;
}

// 공통 버튼 컴포넌트 - 프로젝트 테마에 맞게 개선
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
    className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 font-medium text-sm sm:text-base min-h-[44px] touch-manipulation ${
      variant === 'primary'
        ? 'bg-[#EAFD66] hover:bg-[#EAFD66]/90 text-black hover:scale-105 shadow-lg hover:shadow-xl'
        : 'bg-zinc-800/60 hover:bg-zinc-700/60 text-gray-300 hover:text-white border border-zinc-600/50 hover:border-zinc-500/50 hover:scale-105'
    }`}
  >
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// 공통 이미지 표시 컴포넌트 - 모바일 최적화
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
  <div className="space-y-4 sm:space-y-6">
    <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700/50 shadow-xl">
      <ProxiedImage
        src={src}
        downloadedSrc={downloadedSrc}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto max-h-[70vh] sm:max-h-[75vh] object-contain"
      />
    </div>

    {showInfo && (
      <div className="bg-zinc-800/40 rounded-xl p-4 sm:p-6 border border-zinc-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-zinc-400 mb-3">Image URL:</p>
            <p className="text-[#EAFD66] text-xs sm:text-sm break-all font-mono bg-zinc-900/50 p-3 rounded-lg leading-relaxed">
              {src}
            </p>
          </div>
          <div className="flex-shrink-0 sm:ml-6">
            <ActionButton onClick={() => window.open(src, '_blank')}>Open Image</ActionButton>
          </div>
        </div>
      </div>
    )}
  </div>
);

// 공통 섹션 헤더 컴포넌트 - 모바일 최적화
const SectionHeader = ({
  icon,
  title,
  color = 'blue',
}: {
  icon: React.ReactNode;
  title: string;
  color?: 'blue' | 'green';
}) => (
  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 ${
        color === 'blue' ? 'bg-blue-600' : 'bg-green-600'
      } rounded-xl flex items-center justify-center shadow-lg`}
    >
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
  </div>
);

export function ContentModalBody({ content, onClose }: ContentModalBodyProps) {
  // 디버깅을 위한 콘솔 로그
  console.log('ContentModalBody - content:', content);
  console.log('ContentModalBody - content.type:', content.type);
  console.log('ContentModalBody - content.imageUrl:', content.imageUrl);
  console.log('ContentModalBody - content.linkUrl:', content.linkUrl);

  // Pending 상태인 경우 기본 카드 표시
  if (content.status === 'pending') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-end mb-4 p-3 sm:p-4 pb-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-zinc-800/40 hover:bg-zinc-700/60 transition-all duration-300 group touch-manipulation"
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300 group-hover:text-white transition-colors duration-300"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-2 sm:p-4 pt-0">
          <DefaultContentCard content={content} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main Content Viewer */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 sm:space-y-8">
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
              <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700/50 shadow-xl">
                <ProxiedImage
                  src={content.imageUrl}
                  downloadedSrc={content.linkPreview?.downloadedImageUrl}
                  alt={content.title}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[70vh] sm:max-h-[75vh] object-contain"
                />
                {/* Video Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#EAFD66]/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-[#EAFD66]/30 transition-all duration-300 group touch-manipulation">
                    <div className="w-0 h-0 border-l-[20px] sm:border-l-[24px] border-l-[#EAFD66] border-t-[16px] sm:border-t-[20px] border-t-transparent border-b-[16px] sm:border-b-[20px] border-b-transparent ml-1 group-hover:scale-110 transition-transform duration-300" />
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
              <div className="bg-zinc-800/40 rounded-xl p-6 sm:p-8 border border-zinc-700/40">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-6">
                    {content.description}
                  </p>

                  {/* Link URL Display */}
                  {content.linkUrl && (
                    <div className="mt-6 p-4 sm:p-6 bg-zinc-900/40 rounded-xl border border-zinc-700/40">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-zinc-400 mb-3">
                            Link URL:
                          </p>
                          <p className="text-[#EAFD66] text-xs sm:text-sm break-all font-mono bg-zinc-900/50 p-3 rounded-lg leading-relaxed">
                            {content.linkUrl}
                          </p>
                        </div>
                        <div className="flex-shrink-0 sm:ml-6">
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
            {/* 1. AI Generated Summary - 맨 위 (Mobile only) */}
            {content.aiSummary && (
              <div className="block lg:hidden">
                <SummarySection title="Summary" summary={content.aiSummary} onClose={onClose} />
              </div>
            )}

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

            {/* 3. Interactive Q&A Section - 아래 (Mobile only) */}
            {content.aiQaList && content.aiQaList.length > 0 && (
              <div className="block lg:hidden">
                <InteractiveQASection qaList={content.aiQaList} title="Q&A" />
              </div>
            )}
          </div>
        )}

        {/* AI Generated Summary for non-link content (Mobile only) */}
        {content.type !== 'link' && content.aiSummary && (
          <div className="block lg:hidden">
            <SummarySection title="Summary" summary={content.aiSummary} onClose={onClose} />
          </div>
        )}

        {/* Interactive Q&A Section for non-link content (Mobile only) */}
        {content.type !== 'link' && content.aiQaList && content.aiQaList.length > 0 && (
          <div className="block lg:hidden">
            <InteractiveQASection qaList={content.aiQaList} title="Q&A" />
          </div>
        )}
      </div>

      {/* Content Metadata - Always visible at bottom */}
      <ContentMetadata
        author={content.author}
        date={content.date}
        likes={content.likes}
        views={content.views}
      />
    </div>
  );
}
