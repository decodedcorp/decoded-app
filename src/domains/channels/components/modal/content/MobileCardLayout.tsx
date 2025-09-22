'use client';

import React from 'react';
import { MdFavorite, MdVisibility } from 'react-icons/md';
import { Avatar } from '@decoded/ui';
import { useUserProfile } from '@/domains/users/hooks/useUserProfile';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useTranslation } from 'react-i18next';
import { ContentItem } from '@/lib/types/content';
import { useDateFormatters } from '@/lib/utils/dateUtils';

interface MobileCardLayoutProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  content?: ContentItem;
}

// 모바일 전용 카드 레이아웃 - 새로운 모달 구조 적용
export function MobileCardLayout({ children, title, onClose, content }: MobileCardLayoutProps) {
  // Debug logging
  console.log('MobileCardLayout - content:', content);
  console.log('MobileCardLayout - content.author:', content?.author);
  console.log('MobileCardLayout - content.provider_id:', content?.provider_id);
  console.log('MobileCardLayout - content.channel_id:', content?.channel_id);
  console.log('MobileCardLayout - content.likes:', content?.likes);
  console.log('MobileCardLayout - content.views:', content?.views);

  // Translation hooks
  const { t } = useTranslation('content');
  const { time } = useCommonTranslation();
  const { formatDateByContext } = useDateFormatters();

  // Get user profile using provider_id field (which contains the user ID)
  // Try provider_id first, then author as fallback
  const authorId = content?.provider_id || content?.author;
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

  // Debug condition checks
  const shouldShowInfo =
    content &&
    (channelId || authorId || content.likes !== undefined || content.views !== undefined);
  console.log('🎯 [MobileCardLayout] Debug info:', {
    shouldShowInfo,
    authorId,
    channelId,
    userProfile: userProfile
      ? { aka: userProfile.aka, profile_image_url: userProfile.profile_image_url }
      : null,
    isProfileLoading,
    profileError,
    content: content
      ? {
          id: content.id,
          title: content.title,
          provider_id: content.provider_id,
          author: content.author,
        }
      : null,
  });

  return (
    <div className="bg-zinc-900 rounded-none border-none shadow-2xl h-full w-full flex flex-col">
      {/* Header with title and close button - 고정 헤더 */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 pt-6 border-b border-zinc-700/30">
        <div>
          <h1 className="text-lg font-semibold text-white">{title || 'Content'}</h1>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/40 hover:bg-zinc-700/60 transition-all duration-300 group touch-manipulation"
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
                className="text-gray-300 group-hover:text-white transition-colors duration-200"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main content area - 스크롤 가능한 콘텐츠 */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        {/* Channel & Author Info - 콘텐츠 영역 안에 포함 */}
        {shouldShowInfo && (
          <div className="mb-6 pb-6 border-b border-zinc-700/30">
            <div className="space-y-3">
              {/* Channel Info Row */}
              <div className="flex items-center space-x-3">
                {/* Channel Thumbnail */}
                {channelId && (
                  <div className="flex-shrink-0">
                    {isChannelLoading ? (
                      <div className="w-10 h-10 bg-zinc-700/50 rounded-lg animate-pulse" />
                    ) : (
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden">
                        {channelData?.thumbnail_url ? (
                          <img
                            src={channelData.thumbnail_url}
                            alt={channelData.name || 'Channel'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-400 text-xs font-medium">
                              {channelData?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Channel Name */}
                {channelId && (
                  <div className="font-medium text-white text-sm">
                    {isChannelLoading ? (
                      <div className="h-4 bg-zinc-700/50 rounded animate-pulse w-20" />
                    ) : channelError ? (
                      <span className="text-zinc-400">Channel</span>
                    ) : (
                      channelData?.name || 'Unknown Channel'
                    )}
                  </div>
                )}

                {/* Author Info - 독립적으로 표시 */}
                {authorId && (
                  <div className="flex items-center space-x-2 ml-auto">
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

              {/* Channel Description */}
              {channelId && channelData?.description && (
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {channelData.description}
                </p>
              )}

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

        {/* Children content */}
        {children}
      </div>
    </div>
  );
}
