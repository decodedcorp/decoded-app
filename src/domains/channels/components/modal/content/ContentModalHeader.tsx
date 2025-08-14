import React from 'react';

import { ContentItem } from '@/store/contentModalStore';

interface ContentModalHeaderProps {
  content: ContentItem;
  onClose: () => void;
}

export function ContentModalHeader({ content, onClose }: ContentModalHeaderProps) {
  // 링크 콘텐츠의 경우 linkUrl이 있으면 링크 아이콘을 표시
  const displayTitle = content.title;

  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
      {/* Left Section: Title, Category and Type */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white truncate">{displayTitle}</h2>
        </div>

        {/* Category Badge */}
        {content.category && (
          <span className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-full flex-shrink-0">
            {content.category}
          </span>
        )}

        {/* Content Type Icon */}
        <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
          {content.type === 'image' && (
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
          {content.type === 'video' && (
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
          {content.type === 'text' && (
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
          {(content.type === 'link' || content.linkUrl) && (
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Right Section: Close Button */}
      <button
        onClick={onClose}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors flex-shrink-0 ml-4"
        aria-label="Close modal"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
