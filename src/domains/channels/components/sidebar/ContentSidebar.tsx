'use client';

import React from 'react';

import { ContentItem } from '@/lib/types/content';
import { ProxiedImage } from '@/components/ProxiedImage';
import { useContentById } from '@/domains/channels/hooks/useContentById';
import { useChannelContents } from '@/domains/channels/hooks/useChannelContents';
import ReactBitsMasonry from '@/components/ReactBitsMasonry';

interface ContentSidebarProps {
  isOpen: boolean;
  content: ContentItem | null;
  onClose: () => void;
}

type TabType = 'summary' | 'related';

export function ContentSidebar({ isOpen, content, onClose }: ContentSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('summary');

  // 콘텐츠 ID로 실제 API 요청
  const {
    content: fetchedContent,
    isLoading,
    error,
  } = useContentById({
    contentId: content?.id?.toString() || '',
    enabled: isOpen && !!content?.id,
  });

  // 실제 API에서 가져온 콘텐츠 또는 props로 받은 콘텐츠 사용
  const displayContent = fetchedContent || content;

  // ESC 키로 사이드바 닫기
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 사이드바 외부 클릭으로 닫기
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !displayContent) {
    return null;
  }

  // 로딩 상태 표시
  if (isLoading) {
    return <LoadingSidebar onClose={onClose} />;
  }

  // 에러 상태 표시
  if (error) {
    return <ErrorSidebar error={error} onClose={onClose} />;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={handleOverlayClick}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-[500px] bg-zinc-900/95 border-l border-zinc-700/30 shadow-2xl backdrop-blur-md transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          top: '60px', // 헤더 높이만큼 아래로 이동
          height: 'calc(100dvh - 60px)', // 헤더 높이를 제외한 높이
        }}
      >
        {/* Header */}
        <SidebarHeader content={displayContent} onClose={onClose} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="h-full overflow-y-auto bg-zinc-900">
          {activeTab === 'summary' ? (
            <SummaryContent content={displayContent} />
          ) : (
            <RelatedContent content={displayContent} activeTab={activeTab} />
          )}
        </div>
      </div>
    </>
  );
}

// Loading Sidebar Component
function LoadingSidebar({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-[500px] bg-zinc-900/95 border-l border-zinc-700/30 shadow-2xl backdrop-blur-md transform transition-transform duration-300 ease-out z-50 translate-x-0"
        style={{
          top: '60px',
          height: 'calc(100dvh - 60px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/30 bg-zinc-800/30">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white">Loading...</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg hover:bg-zinc-700/50 transition-colors duration-200 text-zinc-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Loading Content */}
        <div className="h-full overflow-y-auto bg-zinc-900">
          <div className="p-6 space-y-6 pb-16">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#eafd66]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Error Sidebar Component
function ErrorSidebar({ error, onClose }: { error: Error; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-[500px] bg-zinc-900/95 border-l border-zinc-700/30 shadow-2xl backdrop-blur-md transform transition-transform duration-300 ease-out z-50 translate-x-0"
        style={{
          top: '60px',
          height: 'calc(100dvh - 60px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/30 bg-zinc-800/30">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white">Error</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg hover:bg-zinc-700/50 transition-colors duration-200 text-zinc-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Error Content */}
        <div className="h-full overflow-y-auto bg-zinc-900">
          <div className="p-6 space-y-6 pb-16">
            <div className="bg-red-900/30 border border-red-700/30 rounded-xl p-6">
              <p className="text-red-300 text-sm">Failed to load content: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Sidebar Header Component
function SidebarHeader({ content, onClose }: { content: ContentItem; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/30 bg-zinc-800/30">
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-white truncate">
          {content.linkPreview?.description || content.title}
        </h2>
        {content.description && (
          <p className="text-sm text-zinc-400 mt-1 truncate">{content.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="ml-4 p-2 rounded-lg hover:bg-zinc-700/50 transition-colors duration-200 text-zinc-400 hover:text-white"
        aria-label="Close sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  return (
    <div className="flex border-b border-zinc-700/30 bg-zinc-800/30">
      <button
        onClick={() => onTabChange('summary')}
        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
          activeTab === 'summary'
            ? 'text-[#eafd66] border-b-2 border-[#eafd66] bg-zinc-800/50'
            : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30'
        }`}
      >
        Summary
      </button>
      <button
        onClick={() => onTabChange('related')}
        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
          activeTab === 'related'
            ? 'text-[#eafd66] border-b-2 border-[#eafd66] bg-zinc-800/50'
            : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30'
        }`}
      >
        Related
      </button>
    </div>
  );
}

// Summary Tab Content Component
function SummaryContent({ content }: { content: ContentItem }) {
  return (
    <div className="p-6 space-y-6 pb-24">
      <ImageDisplay content={content} />
      <AISummary content={content} />
      <AIQASection content={content} />
      <LinkPreview content={content} />
      <ContentMetadata content={content} />
    </div>
  );
}

// Image Display Component
function ImageDisplay({ content }: { content: ContentItem }) {
  const imageUrl = content.linkPreview?.imageUrl || content.imageUrl;

  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700/30 shadow-lg">
        <ProxiedImage
          src={imageUrl}
          alt={content.title || 'Content image'}
          width={500}
          height={400}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Content Link Info */}
      <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400 mb-2">
              {content.linkUrl ? 'Content Link:' : 'Image URL:'}
            </p>
            <p className="text-[#eafd66] text-xs break-all font-mono bg-zinc-900/50 p-2 rounded-lg">
              {content.linkUrl || content.imageUrl}
            </p>
            {content.linkPreview && (
              <p className="text-zinc-500 text-xs mt-1 break-all">
                {content.linkPreview.description}
              </p>
            )}
          </div>
          <div className="ml-3">
            <button
              onClick={() => {
                const targetUrl = content.linkUrl || content.imageUrl;
                if (targetUrl) {
                  window.open(targetUrl, '_blank');
                }
              }}
              className="px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium bg-[#eafd66] hover:bg-[#eafd66]/80 text-black hover:scale-105 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>{content.linkUrl ? 'Open Link' : 'Open Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Summary Component
function AISummary({ content }: { content: ContentItem }) {
  if (!content.aiSummary) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">AI 생성 요약</h3>
      </div>
      <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
        <p className="text-gray-300 leading-relaxed text-sm">{content.aiSummary}</p>
      </div>
    </div>
  );
}

// AI Q&A Section Component
function AIQASection({ content }: { content: ContentItem }) {
  if (!content.aiQaList || content.aiQaList.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">AI 질문 & 답변</h3>
      </div>
      <div className="space-y-3">
        {content.aiQaList.map((qa, index) => (
          <div
            key={index}
            className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 hover:bg-zinc-800/40 transition-colors duration-200"
          >
            <div className="mb-3">
              <p className="text-sm font-medium text-zinc-300">Q: {qa.question}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">{qa.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Link Preview Component
function LinkPreview({ content }: { content: ContentItem }) {
  if (!content.linkPreview) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-.758l1.102-1.101a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l1.102-1.101"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">링크 미리보기</h3>
      </div>
      <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4">
        <div className="space-y-2">
          <h4 className="font-medium text-white text-sm">{content.linkPreview.title}</h4>
          <p className="text-gray-300 text-xs">{content.linkPreview.description}</p>
          <p className="text-zinc-400 text-xs">{content.linkPreview.siteName}</p>
        </div>
      </div>
    </div>
  );
}

// Content Metadata Component
function ContentMetadata({ content }: { content: ContentItem }) {
  const hasMetadata =
    content.author ||
    content.date ||
    content.likes !== undefined ||
    content.views !== undefined ||
    content.category ||
    content.metadata;

  if (!hasMetadata) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">콘텐츠 정보</h3>
      <BasicMetadata content={content} />
      <CategoryMetadata content={content} />
      <AdditionalMetadata content={content} />
    </div>
  );
}

// Basic Metadata Component
function BasicMetadata({ content }: { content: ContentItem }) {
  const hasBasicMetadata =
    content.author || content.date || content.likes !== undefined || content.views !== undefined;

  if (!hasBasicMetadata) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-700/30">
      {content.author && (
        <div className="flex items-center space-x-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{new Date(content.date).toLocaleDateString()}</span>
        </div>
      )}
      {content.likes !== undefined && (
        <div className="flex items-center space-x-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}

// Category Metadata Component
function CategoryMetadata({ content }: { content: ContentItem }) {
  if (!content.category) return null;

  return (
    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
      <div className="flex items-center space-x-2">
        <svg
          className="w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span className="text-sm text-zinc-300">카테고리: {content.category}</span>
      </div>
    </div>
  );
}

// Additional Metadata Component
function AdditionalMetadata({ content }: { content: ContentItem }) {
  if (!content.metadata) return null;

  return (
    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
      <h4 className="text-sm font-medium text-zinc-300 mb-3">추가 상세 정보</h4>
      <div className="space-y-2">
        {content.metadata.game && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">게임:</span>
            <span className="text-xs text-zinc-300">{content.metadata.game}</span>
          </div>
        )}
        {content.metadata.topics && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">주제:</span>
            <span className="text-xs text-zinc-300">{content.metadata.topics}</span>
          </div>
        )}
        {content.metadata.platforms && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">플랫폼:</span>
            <span className="text-xs text-zinc-300">{content.metadata.platforms}</span>
          </div>
        )}
        {content.metadata.contentType && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">콘텐츠 타입:</span>
            <span className="text-xs text-zinc-300">{content.metadata.contentType}</span>
          </div>
        )}
        {content.metadata.releaseYear && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">출시 연도:</span>
            <span className="text-xs text-zinc-300">{content.metadata.releaseYear}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Related Tab Content Component
function RelatedContent({ content, activeTab }: { content: ContentItem; activeTab: TabType }) {
  // 현재 콘텐츠의 채널 ID를 추출 (예시 - 실제 구조에 맞게 수정 필요)
  // ContentItem 타입에 channelId가 없다면 다른 방법으로 채널 ID를 얻어야 함
  const channelId = (content as any).channelId || (content as any).metadata?.channelId || '';

  // 채널 콘텐츠 API 호출
  const {
    contents: relatedContents,
    isLoading,
    error,
  } = useChannelContents({
    channelId: channelId.toString(),
    enabled: !!channelId && activeTab === 'related',
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 pb-24">
        <RelatedHeader />
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#eafd66]"></div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-6 space-y-6 pb-24">
        <RelatedHeader />
        <div className="bg-red-900/30 border border-red-700/30 rounded-xl p-6">
          <p className="text-red-300 text-sm">
            관련 콘텐츠를 불러오는데 실패했습니다: {error.message}
          </p>
        </div>
      </div>
    );
  }

  // 채널 ID가 없는 경우
  if (!channelId) {
    return (
      <div className="p-6 space-y-6 pb-24">
        <RelatedHeader />
        <EmptyRelatedContent message="채널 정보를 찾을 수 없습니다" />
      </div>
    );
  }

  // 관련 콘텐츠가 없는 경우
  if (!relatedContents || relatedContents.length === 0) {
    return (
      <div className="p-6 space-y-6 pb-24">
        <RelatedHeader />
        <EmptyRelatedContent message="이 채널에 관련 콘텐츠가 없습니다" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <RelatedHeader />
      <RelatedMasonryGrid contents={relatedContents} />
    </div>
  );
}

// Related Header Component
function RelatedHeader() {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white">관련 콘텐츠</h3>
    </div>
  );
}

// Related Masonry Grid Component using ReactBitsMasonry
function RelatedMasonryGrid({ contents }: { contents: ContentItem[] }) {
  // ReactBitsMasonry에 전달할 아이템들을 변환
  const masonryItems = contents.map((content) => ({
    id: content.id.toString(), // 항상 문자열로 변환
    img: content.imageUrl || content.linkPreview?.imageUrl || '',
    height: 200, // 기본 높이 설정
    title: content.title || '제목 없음',
    category: content.category || '기타',
    description: content.description || '',
    author: content.author || '',
    date: content.date || '',
    likes: content.likes || 0,
    views: content.views || 0,
  }));

  return (
    <div className="w-full">
      <ReactBitsMasonry
        items={masonryItems}
        renderItem={(gridItem) => {
          // GridItem에서 필요한 데이터 추출 (Item의 확장 속성들)
          const item = {
            id: gridItem.id,
            img: gridItem.img,
            title: gridItem.title || '',
            category: gridItem.category || '',
            description: (gridItem as any).description,
            author: (gridItem as any).author,
            likes: (gridItem as any).likes || 0,
            views: (gridItem as any).views || 0,
          };
          return <RelatedMasonryCard item={item} />;
        }}
        className="w-full"
      />
    </div>
  );
}

// Related Masonry Card Component
function RelatedMasonryCard({
  item,
}: {
  item: {
    id: string;
    img: string;
    title: string;
    category: string;
    description?: string;
    author?: string;
    likes: number;
    views: number;
  };
}) {
  const hasImage = item.img && item.img.trim() !== '';

  return (
    <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden hover:bg-zinc-800/40 transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      {hasImage && (
        <div className="relative">
          <ProxiedImage
            src={item.img}
            alt={item.title}
            width={300}
            height={200}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-xs text-white font-medium">{item.category}</span>
          </div>
        </div>
      )}

      <div className="p-3">
        <h4 className="text-sm font-medium text-white truncate mb-2">{item.title}</h4>

        {item.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-zinc-500">
          {item.author && <span className="truncate flex-1">{item.author}</span>}

          <div className="flex items-center space-x-3 ml-2">
            {item.likes > 0 && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{item.likes}</span>
              </div>
            )}

            {item.views > 0 && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span>{item.views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty Related Content Component
function EmptyRelatedContent({ message = '관련 콘텐츠가 없습니다' }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="text-zinc-500 text-sm">{message}</p>
    </div>
  );
}
