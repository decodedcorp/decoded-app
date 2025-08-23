import React from 'react';

import { ContentItem } from '@/store/contentModalStore';

interface ContentModalFooterProps {
  content: ContentItem;
  onClose: () => void;
}

export function ContentModalFooter({ content, onClose }: ContentModalFooterProps) {
  return (
    <div className="bg-zinc-900 p-6 border-t border-zinc-700/30">
      <div className="flex items-center justify-between">
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600/50 group">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">Like</span>
          </button>

          <button className="flex items-center space-x-2 px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600/50 group">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367 2.684z"
              />
            </svg>
            <span className="font-medium">Share</span>
          </button>

          <button className="flex items-center space-x-2 px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600/50 group">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="font-medium">Save</span>
          </button>
        </div>

        {/* Right Section: Close Button and Additional Info */}
        <div className="flex items-center space-x-6">
          {/* Additional Info */}
          <div className="flex items-center space-x-6 text-sm text-zinc-500">
            <span className="font-mono">ID: {content.id}</span>
            <span className="uppercase tracking-wider font-medium">Type: {content.type}</span>
          </div>

          {/* Close Button */}
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
    </div>
  );
}
