'use client';

import React, { useState } from 'react';

import {
  MdClose,
  MdShare,
  MdBookmark,
  MdBookmarkBorder,
  MdFavorite,
  MdVisibility,
} from 'react-icons/md';
import { ContentItem } from '@/lib/types/content';
import { CommentSection } from '@/domains/comments/components/CommentSection';
import { useBookmarkStatus, useBookmark } from '@/domains/users/hooks/useBookmark';
import { useUserProfile } from '@/domains/users/hooks/useUserProfile';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@decoded/ui';
import { useAuthStatus } from '@/domains/auth/hooks/useAuth';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useDateFormatters } from '@/lib/utils/dateUtils';

type TabType = 'content' | 'log';

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
  const isAuthenticated = useAuthStatus();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { t } = useTranslation('content');
  const { formatDateByContext } = useDateFormatters();

  // Get user profile using author field (which contains the user ID)
  const authorId = content.author;
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useUserProfile(authorId || '', {
    enabled: !!authorId,
  });

  // Get channel information
  const channelId = content.channel_id;
  const {
    data: channelData,
    isLoading: isChannelLoading,
    error: channelError,
  } = useChannel(channelId || '', {
    enabled: !!channelId,
  });

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
  const [activeTab, setActiveTab] = useState<TabType>('content');

  // 북마크 버튼 클릭 핸들러
  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (bookmarkStatus?.is_bookmarked) {
      removeBookmark();
    } else {
      addBookmark();
    }
  };

  // 로그인 성공 핸들러
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  // 로그인 모달 닫기 핸들러
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // Handle keyboard navigation for tabs (⌥+→/←)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'content' ? 'log' : 'content'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with Assistant title, tabs, and actions */}
      <div className="border-b border-zinc-700/50">
        {/* Top row: Title with action buttons at bottom right */}
        <div className="p-4 pb-2 relative">
          <div className="flex items-start justify-between">
            {/* Title */}
            <h2 className="text-lg font-semibold text-white leading-tight flex-1 pr-2">{title}</h2>

            {/* Close button (mobile only) */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-200 group lg:hidden flex-shrink-0"
              aria-label={t('sidebar.closeModal')}
            >
              <MdClose className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </button>
          </div>

          {/* Action buttons at bottom right of title area */}
          <div className="flex items-center space-x-2 justify-end mt-1">
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
                  navigator.clipboard.writeText(content.linkUrl || window.location.href);
                }
              }}
              className="flex items-center space-x-1.5 px-2 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800/30 hover:bg-zinc-700/50 rounded-lg transition-colors cursor-pointer"
              aria-label={t('actions.share')}
            >
              <MdShare className="w-3.5 h-3.5" />
              <span>{t('actions.share')}</span>
            </button>

            {/* Save button */}
            <button
              onClick={handleBookmarkClick}
              disabled={isBookmarkLoading}
              className="flex items-center space-x-1.5 px-2 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800/30 hover:bg-zinc-700/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={bookmarkStatus?.is_bookmarked ? t('actions.saved') : t('actions.save')}
            >
              {bookmarkStatus?.is_bookmarked ? (
                <MdBookmark className="w-3.5 h-3.5" style={{ color: '#EAFD66' }} />
              ) : (
                <MdBookmarkBorder className="w-3.5 h-3.5" />
              )}
              <span>{bookmarkStatus?.is_bookmarked ? t('actions.saved') : t('actions.save')}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-700/50">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'content'
                ? 'text-[#EAFD66] border-b-2 border-[#EAFD66]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
            }`}
            aria-label="Content tab"
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'log'
                ? 'text-[#EAFD66] border-b-2 border-[#EAFD66]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
            }`}
            aria-label="Log tab"
          >
            Log
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'content' ? (
        /* Content Tab - Read-only view of accepted content */
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Channel & Author Info - PostCard 스타일 적용 */}
          {(channelId ||
            content.author ||
            content.likes !== undefined ||
            content.views !== undefined) && (
            <div className="p-4 border-b border-zinc-800/30">
              <div className="space-y-3">
                {/* Channel Info Row - PostCard 스타일로 변경 */}
                <div className="flex gap-3">
                  {/* Channel Thumbnail - PostCard 스타일 적용 */}
                  {channelId && (
                    <div className="flex-shrink-0">
                      {isChannelLoading ? (
                        <div className="w-10 h-10 bg-zinc-700/50 rounded-full animate-pulse" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                          {channelData?.thumbnail_url ? (
                            <img
                              src={channelData.thumbnail_url}
                              alt={channelData.name || 'Channel'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full bg-gradient-to-br from-[#eafd66] to-[#d4e85c] rounded-full flex items-center justify-center ${
                              channelData?.thumbnail_url ? 'hidden' : 'flex'
                            }`}
                          >
                            <span className="text-zinc-900 font-bold text-sm">
                              {channelData?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 오른쪽 컨텐츠 영역 */}
                  <div className="flex-1">
                    {/* 첫 번째 줄: 채널명, 작성자 */}
                    <div className="flex items-center gap-2">
                      {/* Channel Name - PostCard 스타일 적용 */}
                      {channelId && (
                        <div className="text-[#eafd66] font-medium text-sm">
                          {isChannelLoading ? (
                            <div className="h-4 bg-zinc-700/50 rounded animate-pulse w-20" />
                          ) : channelError ? (
                            <span className="text-zinc-400">Channel</span>
                          ) : (
                            channelData?.name || 'Unknown Channel'
                          )}
                        </div>
                      )}

                      {/* Author Info - 오른쪽 정렬 */}
                      {authorId && (
                        <div className="flex items-center gap-2 ml-auto">
                          {/* Author Avatar */}
                          <Avatar
                            userId={authorId}
                            src={userProfile?.profile_image_url || undefined}
                            size="sm"
                            className="flex-shrink-0"
                          />

                          {/* Author & Time */}
                          <div className="flex items-center space-x-1 text-xs text-zinc-400">
                            <span>
                              {isProfileLoading ? (
                                <span className="animate-pulse">Loading...</span>
                              ) : profileError ? (
                                authorId
                              ) : (
                                userProfile?.aka || authorId
                              )}
                            </span>
                            {content.date && (
                              <>
                                <span>•</span>
                                <span>{formatDateByContext(content.date, 'list')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 두 번째 줄: 채널 설명 */}
                    {channelId && channelData?.description && (
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mt-1">
                        {channelData.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interaction Stats */}
                {(content.likes !== undefined || content.views !== undefined) && (
                  <div className="flex items-center space-x-4 text-xs text-zinc-400 mt-3">
                    {content.likes !== undefined && (
                      <div className="flex items-center space-x-1">
                        <MdFavorite className="w-3 h-3" />
                        <span>{content.likes}</span>
                      </div>
                    )}
                    {content.views !== undefined && (
                      <div className="flex items-center space-x-1">
                        <MdVisibility className="w-3 h-3" />
                        <span>{content.views}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary Card */}
          {content.aiSummary && (
            <div className="p-4 border-b border-zinc-700/50">
              <h3 className="text-base font-medium text-white mb-2">Summary</h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-2">
                {content.aiSummary.length > 300
                  ? `${content.aiSummary.substring(0, 300)}...`
                  : content.aiSummary}
              </p>
              {content.aiSummary.length > 300 && (
                <button className="text-xs text-zinc-400 hover:text-zinc-300">더보기</button>
              )}
              <div className="text-xs text-zinc-500 mt-2">
                by Skill: Summarize v1 · Updated 3m ago · Version #1
              </div>
            </div>
          )}

          {/* Key Points Card */}
          <div className="p-4 border-b border-zinc-700/50">
            <h3 className="text-base font-medium text-white mb-2">Key Points</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>핵심 포인트 1</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>핵심 포인트 2</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>핵심 포인트 3</span>
              </li>
            </ul>
          </div>

          {/* Q&A Highlight Card */}
          {content.aiQaList && content.aiQaList.length > 0 && (
            <div className="p-4 border-b border-zinc-700/50">
              <h3 className="text-base font-medium text-white mb-2">Q&A</h3>
              <div className="space-y-3">
                {content.aiQaList.slice(0, 3).map((qa, index) => (
                  <div key={index}>
                    <p className="text-sm font-medium text-zinc-200 mb-1">Q: {qa.question}</p>
                    <p className="text-sm text-zinc-400 whitespace-pre-wrap">A: {qa.answer}</p>
                  </div>
                ))}
                {content.aiQaList.length > 3 && (
                  <button
                    onClick={() => setActiveTab('log')}
                    className="text-xs text-zinc-400 hover:text-zinc-300"
                  >
                    자세히 보기 →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tags Card */}
          <div className="p-4 border-b border-zinc-700/50">
            <h3 className="text-base font-medium text-white mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-300">태그1</span>
              <span className="px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-300">태그2</span>
              <span className="px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-300">태그3</span>
            </div>
          </div>

          {/* Sources Card */}
          <div className="p-4 border-b border-zinc-700/50">
            <h3 className="text-base font-medium text-white mb-2">Sources</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white"
              >
                <span>🌐</span>
                <span>example.com</span>
              </a>
            </div>
          </div>

          {/* Comments Section */}
          <div className="min-h-0">
            <CommentSection contentId={contentId} />
          </div>
        </div>
      ) : (
        /* Log Tab - Read-only timeline view */
        <div className="flex flex-col flex-1 min-h-0">
          {/* Timeline */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {/* Dummy log messages - Read-only */}
            <div className="border-l-2 border-zinc-700/50 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-zinc-500">user</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-500">2m ago</span>
              </div>
              <p className="text-sm text-zinc-300">Summarize this content</p>
            </div>

            <div className="border-l-2 border-zinc-700/50 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-zinc-500">assistant</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-500">1m ago</span>
                <span className="px-2 py-0.5 bg-zinc-800/50 rounded text-xs text-zinc-400">
                  Summarize
                </span>
              </div>
              <p className="text-sm text-zinc-300">{content.aiSummary || 'Summary...'}</p>
            </div>
          </div>

          {/* Used Skills Section (Fixed at bottom) */}
          <div className="border-t border-zinc-700/50 p-4 bg-zinc-900/50">
            <h4 className="text-sm font-medium text-white mb-3">사용된 스킬</h4>
            <div className="flex flex-wrap gap-2">
              {/* Dummy skills - will be replaced with actual data */}
              <span className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-300">
                Summarize
              </span>
              <span className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-300">
                Tag
              </span>
              <span className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-300">
                Q&A
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
