import React from 'react';
import { ContentItem } from '@/store/contentModalStore';

interface ContentModalBodyProps {
  content: ContentItem;
}

export function ContentModalBody({ content }: ContentModalBodyProps) {
  // 디버깅을 위한 콘솔 로그
  console.log('ContentModalBody - content:', content);
  console.log('ContentModalBody - content.type:', content.type);
  console.log('ContentModalBody - content.imageUrl:', content.imageUrl);
  console.log('ContentModalBody - content.linkUrl:', content.linkUrl);

  return (
    <div className="p-6">
      {/* Content Title */}
      <h2 className="text-2xl font-bold text-white mb-4">{content.title}</h2>

      {/* Content Description */}
      {content.description && (
        <p className="text-zinc-300 text-lg mb-6 leading-relaxed">{content.description}</p>
      )}

      {/* Content Display */}
      <div className="mb-6">
        {content.type === 'image' && content.imageUrl && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-zinc-800/50">
              <img
                src={content.imageUrl}
                alt={content.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-2">Image URL:</p>
                  <p className="text-blue-400 text-sm break-all font-mono">{content.imageUrl}</p>
                </div>
                <button
                  onClick={() => window.open(content.imageUrl, '_blank')}
                  className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Open Image</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {content.type === 'video' && content.imageUrl && (
          <div className="relative rounded-xl overflow-hidden bg-zinc-800/50">
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            {/* Video Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
              </div>
            </div>
          </div>
        )}

        {content.type === 'text' && (
          <div className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700/50">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-white mb-4">{content.title}</h3>
              <p className="text-zinc-300 leading-relaxed mb-4">{content.description}</p>

              {/* Link URL Display */}
              {content.linkUrl && (
                <div className="mt-6 p-4 bg-zinc-700/30 rounded-lg border border-zinc-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-400 mb-2">Link URL:</p>
                      <p className="text-blue-400 text-sm break-all font-mono">{content.linkUrl}</p>
                    </div>
                    <button
                      onClick={() => window.open(content.linkUrl, '_blank')}
                      className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>Open Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
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
    </div>
  );
}
