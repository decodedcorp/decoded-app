'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Loader2, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useContentDetails } from '@/hooks/useContentDetails';
import { Avatar } from '@decoded/ui';
import { useUserProfile } from '@/domains/users/hooks/useUserProfile';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useTranslation } from 'react-i18next';
// import { useDateFormatters } from '@/lib/utils/dateUtils';

interface DomeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    src: string;
    alt: string;
    id?: string;
    url?: string;
    channelName?: string;
    title?: string;
    description?: string;
  } | null;
}

export function DomeCardModal({ isOpen, onClose, item }: DomeCardModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [expandedQA, setExpandedQA] = useState(false); // 기본적으로 접힌 상태
  const { t } = useTranslation('common');

  // Fetch content details when modal is open and item has an ID
  const { content, isLoading, isError } = useContentDetails({
    contentId: item?.id || null,
    enabled: isOpen && !!item?.id,
  });

  // Get user profile using provider_id field
  const authorId = content?.provider_id;
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useUserProfile(authorId || '', {
    enabled: !!authorId,
  });

  // Get channel information
  const channelId = content?.channel_id;
  const {
    data: channelData,
    isLoading: isChannelLoading,
    error: channelError,
  } = useChannel(channelId || '', {
    enabled: !!channelId,
  });

  // Simple date formatter
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  if (!isOpen || !item) return null;

  // Use API data if available, otherwise fall back to item data
  const displayTitle =
    content?.link_preview_metadata?.title || item.title || item.alt || t('ui.unknown');
  const displayDescription =
    content?.description || content?.link_preview_metadata?.description || item.description;
  const displayChannelName = item.channelName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-zinc-700 h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button - 고정 헤 */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 pt-6 border-b border-zinc-700/30">
          <div>
            <h1 className="text-lg font-semibold text-white line-clamp-1">{displayTitle}</h1>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/40 hover:bg-zinc-700/60 transition-all duration-300 group touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200" />
          </button>
        </div>

        {/* Main content area - 스크롤 가능한 콘텐츠 */}
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-zinc-400 text-sm">{t('status.error')}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {!isLoading && !isError && (
            <>
              {/* Channel & Author Info - MobileCardLayout 스타일 */}
              {(channelId || authorId) && (
                <div className="mb-6 pb-6 border-b border-zinc-700/30">
                  <div className="space-y-3">
                    {/* Channel Info Row */}
                    <div className="flex gap-3">
                      {/* Channel Thumbnail */}
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
                                  {channelData?.name?.charAt(0) ||
                                    displayChannelName?.charAt(0) ||
                                    'C'}
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
                          {/* Channel Name */}
                          {channelId && (
                            <div className="text-[#eafd66] font-medium text-sm">
                              {isChannelLoading ? (
                                <div className="h-4 bg-zinc-700/50 rounded animate-pulse w-20" />
                              ) : channelError ? (
                                <span className="text-zinc-400">{t('ui.channel')}</span>
                              ) : (
                                channelData?.name ||
                                displayChannelName ||
                                t('ui.unknown') + ' ' + t('ui.channel')
                              )}
                            </div>
                          )}

                          {/* Author Info */}
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
                                    <span className="animate-pulse">{t('status.loading')}</span>
                                  ) : profileError ? (
                                    authorId
                                  ) : (
                                    userProfile?.aka || authorId
                                  )}
                                </span>
                                {content?.created_at && (
                                  <>
                                    <span>•</span>
                                    <span>{formatDate(content.created_at)}</span>
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
                  </div>
                </div>
              )}
              {/* AI Generated Content - Q&A와 요약 통합 */}
              {content && content.ai_gen_metadata && (
                <div className="mb-6">
                  {/* AI 생성 표시 */}
                  <div className="mb-2 text-xs text-[#eafd66] text-right">
                    {t('create.aiGeneratedContent')}
                  </div>

                  {/* 요약 섹션 */}
                  {content.ai_gen_metadata.summary && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white mb-3">
                        {t('ui.description')}
                      </h3>
                      <div className="bg-zinc-800/30 rounded-lg p-3">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {content.ai_gen_metadata.summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Q&A 섹션 */}
                  {content.ai_gen_metadata.qa_list &&
                    content.ai_gen_metadata.qa_list.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Q&A
                          </h3>
                          {content.ai_gen_metadata.qa_list.length > 2 && (
                            <button
                              onClick={() => setExpandedQA(!expandedQA)}
                              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
                            >
                              {expandedQA ? (
                                <>
                                  <span>{t('ui.collapse')}</span>
                                  <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  <span>
                                    +{content.ai_gen_metadata.qa_list.length - 2}
                                    {t('ui.moreItems')}
                                  </span>
                                  <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {expandedQA && (
                          <div className="space-y-3">
                            {content.ai_gen_metadata.qa_list
                              .slice(0, expandedQA ? content.ai_gen_metadata.qa_list.length : 2)
                              .map((qa: any, index: number) => (
                                <div
                                  key={index}
                                  className="bg-zinc-800/30 rounded-lg p-3 space-y-2"
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
                        )}

                        {!expandedQA && (
                          <div className="space-y-3">
                            {content.ai_gen_metadata.qa_list
                              .slice(0, 2)
                              .map((qa: any, index: number) => (
                                <div
                                  key={index}
                                  className="bg-zinc-800/30 rounded-lg p-3 space-y-2"
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
                        )}
                      </div>
                    )}
                </div>
              )}
              {/* Main Image - MobileCardLayout 스타일로 마지막에 배치 */}
              <div className="mb-6">
                <div className="relative rounded-lg overflow-hidden">
                  <img src={item.src} alt={item.alt} className="w-full h-64 object-cover" />
                </div>
              </div>
              {/* Link Preview Image - 추가 이미지가 있는 경우 */}
              {content && content.link_preview_metadata && content.link_preview_metadata.image && (
                <div className="mb-6">
                  <img
                    src={content.link_preview_metadata.image}
                    alt={t('ui.preview')}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
