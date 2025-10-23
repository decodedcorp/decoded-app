'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Calendar, User, Globe, Clock, Tag } from 'lucide-react';
import type { LinkPreview } from '@/lib/services/mockLinkPreview';

interface LinkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview: LinkPreview;
}

export function LinkPreviewModal({ isOpen, onClose, preview }: LinkPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Mock AI generated content for demonstration
  const mockAIContent = {
    summary: `${preview.title}에 대한 상세한 분석 결과입니다. 이 콘텐츠는 ${preview.domain}에서 제공되는 고품질의 정보를 담고 있으며, 사용자에게 실질적인 가치를 제공합니다.`,
    qa_list: [
      {
        question: '이 콘텐츠의 주요 특징은 무엇인가요?',
        answer: '이 콘텐츠는 실용적인 정보와 깊이 있는 분석을 제공하며, 독자들이 쉽게 이해할 수 있도록 구성되어 있습니다.'
      },
      {
        question: '어떤 독자층을 대상으로 하나요?',
        answer: '전문가부터 초보자까지 다양한 수준의 독자들이 활용할 수 있도록 설계되었습니다.'
      },
      {
        question: '이 콘텐츠를 통해 얻을 수 있는 이점은?',
        answer: '실무에 바로 적용 가능한 인사이트와 실용적인 팁을 얻을 수 있습니다.'
      }
    ]
  };

  const handleExternalLink = () => {
    if (preview.url) {
      window.open(preview.url, '_blank');
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-zinc-700 h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 pt-6 border-b border-zinc-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eafd66]/20 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#eafd66]" />
            </div>
          <div>
            <h1 className="text-lg font-semibold text-white line-clamp-1">{preview.title}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>{preview.domain}</span>
              {preview.category && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {preview.category}
                  </span>
                </>
              )}
              {preview.readTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {preview.readTime}
                  </span>
                </>
              )}
            </div>
          </div>
          </div>

          <div className="flex items-center gap-2">
            {/* External Link Button */}
            <button
              onClick={handleExternalLink}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
            >
              <ExternalLink className="w-4 h-4" />
              원본 보기
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/40 hover:bg-zinc-700/60 transition-all duration-300 group"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          {/* Main Image */}
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden">
              {isImageLoading && !imageError && (
                <div className="w-full h-64 bg-zinc-800 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-zinc-600 border-t-[#eafd66] rounded-full animate-spin" />
                </div>
              )}
              <img
                src={preview.image}
                alt={preview.title}
                className={`w-full h-64 object-cover ${isImageLoading ? 'hidden' : ''}`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  setImageError(true);
                }}
              />
              {imageError && (
                <div className="w-full h-64 bg-zinc-800 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                    <p className="text-zinc-400 text-sm">이미지를 불러올 수 없습니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Author and Publication Info */}
          {(preview.author || preview.publishedAt) && (
            <div className="mb-6">
              <div className="bg-zinc-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  {preview.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-300">{preview.author}</span>
                    </div>
                  )}
                  {preview.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-400">
                        {new Date(preview.publishedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              설명
            </h3>
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <p className="text-sm text-zinc-300 leading-relaxed">{preview.description}</p>
            </div>
          </div>

          {/* AI Generated Content */}
          <div className="mb-6">
            <div className="mb-2 text-xs text-[#eafd66] text-right">
              AI 생성 콘텐츠
            </div>

            {/* Summary */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                요약
              </h3>
              <div className="bg-zinc-800/30 rounded-lg p-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {mockAIContent.summary}
                </p>
              </div>
            </div>

            {/* Q&A Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Q&A
              </h3>
              <div className="space-y-3">
                {mockAIContent.qa_list.map((qa, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800/30 rounded-lg p-4 space-y-2"
                  >
                    <div className="text-sm font-medium text-zinc-200">
                      Q. {qa.question}
                    </div>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      A. {qa.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link Info */}
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={preview.favicon}
                  alt={`${preview.domain} favicon`}
                  className="w-5 h-5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-white">{preview.domain}</p>
                  <p className="text-xs text-zinc-400 truncate max-w-xs">{preview.url}</p>
                </div>
              </div>
              <button
                onClick={handleExternalLink}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#eafd66]/20 text-[#eafd66] hover:bg-[#eafd66]/30 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                열기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
