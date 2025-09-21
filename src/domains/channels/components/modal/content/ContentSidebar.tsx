'use client';

import React, { useState } from 'react';

import {
  MdClose,
  MdFavorite,
  MdShare,
  MdVisibility,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdBookmark,
  MdBookmarkBorder,
} from 'react-icons/md';
import { HiSparkles as Sparkles } from 'react-icons/hi2';
import { ContentItem } from '@/lib/types/content';
import { CommentSection } from '@/domains/comments/components/CommentSection';
import { useBookmarkStatus, useBookmark } from '@/domains/users/hooks/useBookmark';
import { useUserProfile } from '@/domains/users/hooks/useUserProfile';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@decoded/ui';

import { SummarySection } from './SummarySection';
import { InteractiveQASection } from './InteractiveQASection';

interface ContentSidebarProps {
  content: ContentItem;
  onClose: () => void;
}

// Helper function to extract title based on content type
const getContentTitle = (content: any, t: (key: string) => string): string => {
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
  return t('metadata.noTitle');
};

export function ContentSidebar({ content, onClose }: ContentSidebarProps) {
  const contentId = typeof content.id === 'string' ? content.id : content.id.toString();
  const { data: bookmarkStatus } = useBookmarkStatus(contentId);
  const { addBookmark, removeBookmark, isLoading: isBookmarkLoading } = useBookmark(contentId);

  // Get user profile using author field (which contains the user ID)
  const authorId = content.author;
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useUserProfile(authorId || '', {
    enabled: !!authorId,
  });

  // Translation hooks
  const { t } = useTranslation('content');
  const { actions, time } = useCommonTranslation();

  // Format date function (same as CommentItem)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 0 ? '방금 전' : `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Add shimmer animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }
      .animate-shimmer {
        background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
        background-size: 200px 100%;
        animation: shimmer 1.5s ease-in-out infinite;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const title = getContentTitle(content, t);
  const [isQAExpanded, setIsQAExpanded] = useState(false);
  const [isAIOverviewExpanded, setIsAIOverviewExpanded] = useState(true);
  const [isAIGenerating, setIsAIGenerating] = useState(true);
  const [isDescriptionSectionExpanded, setIsDescriptionSectionExpanded] = useState(true);
  const [isDescriptionContentExpanded, setIsDescriptionContentExpanded] = useState(false);

  // AI 콘텐츠가 있는지 확인
  const hasAIContent = content.aiSummary || (content.aiQaList && content.aiQaList.length > 0);

  // AI 생성 애니메이션 효과
  React.useEffect(() => {
    if (isAIOverviewExpanded && hasAIContent) {
      setIsAIGenerating(true);
      const timer = setTimeout(() => {
        setIsAIGenerating(false);
      }, 800); // 0.8초 애니메이션

      return () => clearTimeout(timer);
    }
  }, [isAIOverviewExpanded, hasAIContent]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with close button */}
      <div className="p-4 border-b border-zinc-700/50">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold text-white leading-tight flex-1 pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-200 group lg:hidden flex-shrink-0"
            aria-label={t('sidebar.closeModal')}
          >
            <MdClose className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Action buttons in title section */}
        <div className="flex items-center space-x-2 justify-end">
          {/* Save button */}
          <button
            onClick={() => {
              if (bookmarkStatus?.is_bookmarked) {
                removeBookmark();
              } else {
                addBookmark();
              }
            }}
            disabled={isBookmarkLoading}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-zinc-400 hover:text-white bg-zinc-800/30 hover:bg-zinc-700/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookmarkStatus?.is_bookmarked ? (
              <MdBookmark className="w-4 h-4 text-blue-400" />
            ) : (
              <MdBookmarkBorder className="w-4 h-4" />
            )}
            <span>{bookmarkStatus?.is_bookmarked ? t('actions.saved') : t('actions.save')}</span>
          </button>

          {/* Share button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: title,
                  text: content.description || title,
                  url: content.linkUrl || window.location.href,
                });
              } else {
                // 브라우저가 Web Share API를 지원하지 않는 경우 클립보드에 복사
                navigator.clipboard.writeText(content.linkUrl || window.location.href);
              }
            }}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-zinc-400 hover:text-white bg-zinc-800/30 hover:bg-zinc-700/50 rounded-lg transition-colors cursor-pointer"
          >
            <MdShare className="w-4 h-4" />
            <span>{t('actions.share')}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Profile & Content Info */}
        {(content.author || content.likes !== undefined || content.views !== undefined) && (
          <div className="p-4 border-b border-zinc-700/50">
            {/* Author Info */}
            {authorId && (
              <div className="flex items-center space-x-3 mb-3">
                <Avatar
                  userId={authorId}
                  src={userProfile?.profile_image_url || undefined}
                  size="lg"
                  className="flex-shrink-0"
                />
                <div>
                  <div className="font-medium text-white">
                    {isProfileLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : profileError ? (
                      authorId // API 에러 시 authorId 표시
                    ) : (
                      userProfile?.aka || authorId
                    )}
                  </div>
                  {content.date && (
                    <div className="text-xs text-zinc-400">{formatDate(content.date)}</div>
                  )}
                </div>
              </div>
            )}

            {/* Interaction Stats */}
            {(content.likes !== undefined || content.views !== undefined) && (
              <div className="flex items-center space-x-4 text-sm text-zinc-400">
                {content.likes !== undefined && (
                  <div className="flex items-center space-x-1">
                    <MdFavorite className="w-4 h-4" />
                    <span>{content.likes}</span>
                  </div>
                )}
                {content.views !== undefined && (
                  <div className="flex items-center space-x-1">
                    <MdVisibility className="w-4 h-4" />
                    <span>{content.views}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Overview Section - Desktop only */}
        {hasAIContent && (
          <div className="hidden lg:block border-b border-zinc-700/50">
            {/* Toggle Header */}
            <div className="p-2 pt-2">
              <button
                onClick={() => setIsAIOverviewExpanded(!isAIOverviewExpanded)}
                className="flex items-center justify-between w-full text-left group hover:bg-zinc-800/30 rounded-lg px-2 py-1 transition-colors"
              >
                <h4 className="text-base font-medium text-white">{t('sidebar.aiOverview')}</h4>
                <div className="text-zinc-400 group-hover:text-white transition-colors">
                  {isAIOverviewExpanded ? (
                    <MdKeyboardArrowUp className="w-5 h-5" />
                  ) : (
                    <MdKeyboardArrowDown className="w-5 h-5" />
                  )}
                </div>
              </button>
            </div>

            {/* Expandable Content */}
            {isAIOverviewExpanded && (
              <div className="px-4 pb-4 space-y-4">
                {/* AI Generation Loading State */}
                {isAIGenerating ? (
                  <div className="space-y-4">
                    {/* Shimmer Loading */}
                    <div className="animate-pulse space-y-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs text-zinc-400">{t('sidebar.aiAnalyzing')}</span>
                      </div>

                      {/* Summary Skeleton */}
                      {content.aiSummary && (
                        <div className="space-y-2">
                          <div className="h-3 bg-zinc-700/50 rounded w-16" />
                          <div className="space-y-1">
                            <div className="h-2 bg-zinc-700/30 rounded w-full animate-shimmer" />
                            <div className="h-2 bg-zinc-700/30 rounded w-4/5 animate-shimmer" />
                            <div className="h-2 bg-zinc-700/30 rounded w-3/4 animate-shimmer" />
                          </div>
                        </div>
                      )}

                      {/* Q&A Skeleton */}
                      {content.aiQaList && content.aiQaList.length > 0 && (
                        <div className="space-y-2">
                          <div className="h-3 bg-zinc-700/50 rounded w-8" />
                          <div className="space-y-1">
                            <div className="h-2 bg-zinc-700/30 rounded w-full animate-shimmer" />
                            <div className="h-2 bg-zinc-700/30 rounded w-5/6 animate-shimmer" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Actual Content */
                  <div className="animate-fadeIn space-y-4">
                    {/* Summary */}
                    {content.aiSummary && (
                      <div>
                        <h5 className="text-xs font-medium text-zinc-400 mb-2">
                          {t('sidebar.summary')}
                        </h5>
                        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {content.aiSummary}
                        </p>
                      </div>
                    )}

                    {/* Q&A */}
                    {content.aiQaList && content.aiQaList.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-zinc-400 mb-2">
                          {t('sidebar.qa')}
                        </h5>
                        <div className="text-xs space-y-2">
                          {/* First Q&A always shown */}
                          <div>
                            <p className="text-zinc-200 font-medium mb-1">
                              Q: {content.aiQaList[0].question}
                            </p>
                            <p className="text-zinc-400 whitespace-pre-wrap">
                              A: {content.aiQaList[0].answer}
                            </p>
                          </div>

                          {/* Additional Q&As when expanded */}
                          {isQAExpanded &&
                            content.aiQaList.slice(1).map((qa, index) => (
                              <div key={index + 1}>
                                <p className="text-zinc-200 font-medium mb-1">Q: {qa.question}</p>
                                <p className="text-zinc-400 whitespace-pre-wrap">A: {qa.answer}</p>
                              </div>
                            ))}

                          {/* Toggle button for additional Q&As */}
                          {content.aiQaList.length > 1 && (
                            <button
                              onClick={() => setIsQAExpanded(!isQAExpanded)}
                              className="text-zinc-500 hover:text-zinc-300 mt-1 cursor-pointer transition-colors"
                            >
                              {isQAExpanded
                                ? t('sidebar.showLess')
                                : t('sidebar.moreQuestions', {
                                    count: content.aiQaList.length - 1,
                                  })}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content Description - Moved below AI Overview */}
        {content.description && (
          <div className="border-b border-zinc-700/50">
            {/* Toggle Header */}
            <div className="p-2 pt-2">
              <button
                onClick={() => setIsDescriptionSectionExpanded(!isDescriptionSectionExpanded)}
                className="flex items-center justify-between w-full text-left group hover:bg-zinc-800/30 rounded-lg px-2 py-1 transition-colors"
              >
                <h5 className="text-base font-medium text-white">{t('sidebar.description')}</h5>
                <div className="text-zinc-400 group-hover:text-white transition-colors">
                  {isDescriptionSectionExpanded ? (
                    <MdKeyboardArrowUp className="w-5 h-5" />
                  ) : (
                    <MdKeyboardArrowDown className="w-5 h-5" />
                  )}
                </div>
              </button>
            </div>

            {/* Expandable Content */}
            {isDescriptionSectionExpanded && (
              <div className="px-4 pb-4">
                {/* Show full content when section is expanded */}
                {isDescriptionContentExpanded ? (
                  <div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {content.description}
                    </p>
                    {/* Show Less Button for Long Descriptions */}
                    {content.description && content.description.length > 100 && (
                      <button
                        onClick={() => setIsDescriptionContentExpanded(false)}
                        className="text-zinc-500 hover:text-zinc-300 mt-2 text-sm cursor-pointer transition-colors"
                      >
                        {t('sidebar.showLessDescription')}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Show preview for long descriptions */
                  <div>
                    {content.description && content.description.length > 100 ? (
                      <>
                        <p
                          className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {content.description}
                        </p>
                        <button
                          onClick={() => setIsDescriptionContentExpanded(true)}
                          className="text-zinc-500 hover:text-zinc-300 mt-2 text-sm cursor-pointer transition-colors"
                        >
                          {t('sidebar.showMore')}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {content.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comments Section - Hidden on mobile, shown in separate modal */}
        <div className="min-h-0 hidden lg:block">
          <CommentSection contentId={contentId} />
        </div>
      </div>
    </div>
  );
}
