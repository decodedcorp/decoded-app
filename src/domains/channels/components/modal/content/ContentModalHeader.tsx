import React from 'react';

import { ContentItem } from '@/store/contentModalStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ContentModalHeaderProps {
  content: ContentItem;
  onClose: () => void;
}

// Helper function to extract title based on content type
const getContentTitle = (content: any): string => {
  // Link content - linkPreview를 먼저 체크 (우선순위 높음)
  if (content.linkPreview?.title) {
    return content.linkPreview.title;
  }

  // Link content - link_preview_metadata도 체크
  if (content.link_preview_metadata?.title) {
    return content.link_preview_metadata.title;
  }

  // Video content - title이 "Untitled"가 아닌 경우만 사용
  if (content.title && content.title !== 'Untitled') {
    return content.title;
  }

  // AI generated content might have title in ai_gen_metadata
  if (content.ai_gen_metadata?.title) {
    return content.ai_gen_metadata.title;
  }

  // AI summary도 체크
  if (content.aiSummary) {
    // Summary의 첫 줄이나 첫 문장을 title로 사용할 수도 있음
    const firstLine = content.aiSummary.split('\n')[0];
    if (firstLine && firstLine.length < 100) {
      return firstLine;
    }
  }

  // Image content or fallback
  return 'Untitled';
};

export function ContentModalHeader({ content, onClose }: ContentModalHeaderProps) {
  const displayTitle = getContentTitle(content);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="bg-zinc-900 p-4 border-b border-zinc-700/30">
        <div className="flex items-start justify-between">
          {/* Left Section: Title and Category */}
          <div className="flex-1 min-w-0 pr-3">
            {/* Title */}
            <h2 className="text-lg font-bold text-white mb-2 leading-tight">{displayTitle}</h2>

            {/* Category and Type Info */}
            <div className="flex items-center space-x-2">
              {content.category && (
                <span className="px-2 py-1 bg-zinc-800/50 text-gray-400 text-xs font-medium rounded-md">
                  {content.category}
                </span>
              )}
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                {content.type}
              </span>
            </div>
          </div>

          {/* Right Section: Close Button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/30 hover:bg-zinc-700/50 transition-all duration-200 flex-shrink-0 group"
            aria-label="Close modal"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 group-hover:text-white transition-colors duration-200"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-6 border-b border-zinc-700/30">
      <div className="flex items-start justify-between">
        {/* Left Section: Title and Category */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{displayTitle}</h2>

          {/* Category and Type Info */}
          <div className="flex items-center space-x-3">
            {content.category && (
              <span className="px-3 py-1.5 bg-zinc-800/50 text-gray-400 text-sm font-medium rounded-lg">
                {content.category}
              </span>
            )}
            <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
              {content.type}
            </span>
          </div>
        </div>

        {/* Right Section: Close Button */}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/30 hover:bg-zinc-700/50 transition-all duration-200 flex-shrink-0 group"
          aria-label="Close modal"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            className="group-hover:scale-110 transition-transform duration-200"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-white transition-colors duration-200"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
