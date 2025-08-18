import React from 'react';

import { ContentItem } from '@/store/contentModalStore';

interface ContentModalHeaderProps {
  content: ContentItem;
  onClose: () => void;
}

export function ContentModalHeader({ content, onClose }: ContentModalHeaderProps) {
  const displayTitle = content.title;

  return (
    <div className="bg-zinc-900 p-6 border-b border-zinc-700/30">
      <div className="flex items-start justify-between">
        {/* Left Section: Title and Category */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            {displayTitle}
          </h2>
          
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
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform duration-200">
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
