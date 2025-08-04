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

        {content.type === 'link' && (
          <div className="space-y-6">
            {/* AI Generated Summary */}
            {content.aiSummary && (
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-700/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">AI Generated Summary</h3>
                </div>
                <p className="text-zinc-200 leading-relaxed text-lg">{content.aiSummary}</p>
              </div>
            )}

            {/* AI Generated Q&A */}
            {content.aiQaList && content.aiQaList.length > 0 && (
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-700/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">AI Generated Q&A</h3>
                </div>
                <div className="space-y-4">
                  {content.aiQaList.map((qa, index) => (
                    <div key={index} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-zinc-300 font-medium mb-2">{qa.question}</p>
                          <p className="text-zinc-400 text-sm">{qa.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Original Link Information */}
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Original Link</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">URL:</p>
                  <p className="text-blue-400 text-sm break-all font-mono bg-zinc-900/50 p-3 rounded-lg border border-zinc-700/50">
                    {content.linkUrl}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => window.open(content.linkUrl, '_blank')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>Open Original Link</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (content.linkUrl) {
                          navigator.clipboard.writeText(content.linkUrl);
                          // TODO: Add toast notification
                        }
                      }}
                      className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy URL</span>
                    </button>
                  </div>
                </div>
              </div>
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
