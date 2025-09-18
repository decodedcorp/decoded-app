'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import {
  Camera,
  Video,
  Link as LinkIcon,
  FileText,
  MessageCircle,
  Share,
  Bookmark,
  Pin,
} from 'lucide-react';
import { CardMediaWithFallback } from '@/components/CardMedia/CardMedia';
import { usePostCardTranslation } from '@/lib/i18n/hooks';
import { useTogglePin } from '@/domains/channels/hooks/useChannelPins';
import { useBookmark } from '@/domains/users/hooks/useBookmark';
import { useCommentStats } from '@/domains/comments/hooks/useComments';
import { useContentLike } from '@/domains/interactions/hooks/useContentLike';
import { useCommentsModal } from '@/hooks/useCommentsModal';

export interface PostCardProps {
  id: number;
  title: string;
  description?: string;
  channel: string;
  channelId: string;
  channelThumbnail?: string | null;
  author: string;
  authorId: string;
  userAvatar?: string | null;
  userAka?: string | null;
  timeAgo: string;
  pins: number;
  comments: number;
  thumbnail?: string | null;
  mediaWidth?: number; // Original width for aspect calculation
  mediaHeight?: number; // Original height for aspect calculation
  blurDataURL?: string; // Blur placeholder for better loading
  contentType: 'text' | 'image' | 'video' | 'link';
  badge?: string | null;
  onPostClick?: () => void;
  onChannelClick?: (channelId: string, channel: string) => void;
  onAuthorClick?: (authorId: string, author: string) => void;
  className?: string;
  // API 연결을 위한 추가 props
  contentId?: string; // 실제 콘텐츠 ID (API 호출용)
  isPinned?: boolean; // 핀 상태 (선택적, 없으면 API에서 조회)
  isBookmarked?: boolean; // 북마크 상태 (선택적, 없으면 API에서 조회)
  isLiked?: boolean; // 좋아요 상태 (선택적, 없으면 API에서 조회)
  likeCount?: number; // 좋아요 수 (선택적, 없으면 API에서 조회)
}

// 썸네일 이미지 컴포넌트 - 새로운 CardMedia 사용
function ThumbnailImage({
  src,
  alt,
  width,
  height,
  blurDataURL,
  getContentIcon,
  getContentTypeColor,
  getContentType,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  getContentIcon: () => React.ReactNode;
  getContentTypeColor: () => string;
  getContentType: () => 'image' | 'video' | 'link' | 'text';
}) {
  // 디버깅을 위한 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('ThumbnailImage render:', {
      src,
      alt,
      width,
      height,
      hasSrc: !!src,
      srcType: typeof src,
    });
  }

  return (
    <div className="relative w-full">
      <CardMediaWithFallback
        src={src}
        alt={alt}
        width={width}
        height={height}
        blurDataURL={blurDataURL}
        className="w-full"
        fitPolicy="cover"
        contentType={getContentType()}
        fallbackIcon={
          <div className={`${getContentTypeColor()}`} style={{ fontSize: '4rem' }}>
            {getContentIcon()}
          </div>
        }
      />
      {/* 콘텐츠 타입 배지 */}
      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs">
        <div className={`text-xs font-medium ${getContentTypeColor()}`}>{getContentIcon()}</div>
      </div>
    </div>
  );
}

// React.memo로 성능 최적화
export const PostCard = React.memo<PostCardProps>(function PostCard({
  title,
  description,
  channel,
  channelId,
  channelThumbnail,
  author,
  authorId,
  userAvatar,
  userAka,
  timeAgo,
  pins,
  comments,
  thumbnail,
  mediaWidth,
  mediaHeight,
  blurDataURL,
  contentType,
  badge,
  onPostClick,
  onChannelClick,
  onAuthorClick,
  className = '',
  // API 연결을 위한 추가 props
  contentId,
  isPinned: propIsPinned,
  isBookmarked: propIsBookmarked,
  isLiked: propIsLiked,
  likeCount: propLikeCount,
}: PostCardProps) {
  const router = useRouter();
  const { actions, contentType: contentTypeLabels, accessibility } = usePostCardTranslation();
  const { open: openComments } = useCommentsModal();

  // API 훅들 - contentId가 있을 때만 활성화
  const { togglePin, isLoading: isPinLoading } = useTogglePin();
  const {
    addBookmark,
    removeBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmark(contentId || '');
  const {
    isLiked,
    likeCount,
    toggleLike,
    isLoading: isLikeLoading,
  } = useContentLike(contentId || '');
  const { data: commentStats, isLoading: isCommentStatsLoading } = useCommentStats(
    contentId || '',
    !!contentId,
  );

  // 실제 상태값들 (props 우선, 없으면 API에서 가져온 값 사용)
  const actualIsPinned = propIsPinned ?? false; // TODO: useIsContentPinned 훅 사용 예정
  const actualIsBookmarked = propIsBookmarked ?? false; // TODO: useBookmarkStatus 훅 사용 예정
  const actualIsLiked = propIsLiked ?? isLiked;
  const actualLikeCount = propLikeCount ?? likeCount;
  const actualCommentCount = comments ?? commentStats?.total_comments ?? 0;

  // 디버깅을 위한 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('PostCard render:', {
      title,
      thumbnail,
      contentType,
      hasThumbnail: !!thumbnail,
      thumbnailType: typeof thumbnail,
      contentId,
      actualIsPinned,
      actualIsBookmarked,
      actualIsLiked,
      actualLikeCount,
    });
  }

  const getContentIcon = () => {
    switch (contentType) {
      case 'image':
        return <Camera className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentType = () => {
    return contentType;
  };

  const getContentTypeColor = () => {
    switch (contentType) {
      case 'image':
        return 'text-blue-400';
      case 'video':
        return 'text-red-400';
      case 'link':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  // 액션 핸들러들
  const handlePinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId || isPinLoading) return;

    try {
      await togglePin(contentId, channelId, actualIsPinned);
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId || isBookmarkLoading) return;

    try {
      if (actualIsBookmarked) {
        removeBookmark();
      } else {
        addBookmark();
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId || isLikeLoading) return;

    try {
      await toggleLike();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId) return;

    openComments(contentId);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description || title,
          url: window.location.href,
        });
      } else {
        // 브라우저가 Web Share API를 지원하지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        // TODO: 토스트 메시지 표시
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-200 group max-w-4xl mx-auto relative ${className}`}
    >
      {/* 배지 - 카드 오른쪽 상단 */}
      {badge && (
        <div className="absolute top-3 right-3 bg-[#eafd66] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
          {badge}
        </div>
      )}
      <div className="p-4">
        {/* 상단: 채널 정보 및 메타데이터 */}
        <div className="flex items-center gap-3 mb-3">
          {/* 동그란 채널 썸네일 - 클릭 시 채널 페이지로 */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
            onClick={() => {
              if (onChannelClick) {
                onChannelClick(channelId, channel);
              } else {
                router.push(`/channels/${channelId}`);
              }
            }}
            aria-label={accessibility.goToChannel(channel)}
          >
            {channelThumbnail ? (
              <img
                src={channelThumbnail}
                alt={`${channel} channel`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로딩 실패 시 기본 아이콘으로 폴백
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-br from-[#eafd66] to-[#d4e85c] rounded-full flex items-center justify-center ${
                channelThumbnail ? 'hidden' : 'flex'
              }`}
            >
              <span className="text-zinc-900 font-bold text-sm">
                {channel.charAt(0).toUpperCase()}
              </span>
            </div>
          </button>

          {/* 채널명, 작성자, 시간 */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <button
              className="text-[#eafd66] hover:text-white font-medium transition-colors cursor-pointer"
              onClick={() => {
                if (onChannelClick) {
                  onChannelClick(channelId, channel);
                } else {
                  router.push(`/channels/${channelId}`);
                }
              }}
            >
              {channel}
            </button>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1">
              {/* 유저 아바타 */}
              <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={`${author} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로딩 실패 시 기본 아이콘으로 폴백
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-zinc-600 rounded-full flex items-center justify-center ${
                    userAvatar ? 'hidden' : 'flex'
                  }`}
                >
                  <span className="text-zinc-300 text-xs font-medium">
                    {author.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                className="hover:text-zinc-300 transition-colors cursor-pointer"
                onClick={() => {
                  if (onAuthorClick) {
                    onAuthorClick(authorId, author);
                  } else {
                    router.push(`/users/${authorId}`);
                  }
                }}
                aria-label={accessibility.goToAuthor(userAka || author)}
              >
                {userAka || author}
              </button>
            </div>
            <span className="text-zinc-600">•</span>
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* 포스트 콘텐츠 영역 - 클릭 시 모달 */}
        <div
          className="cursor-pointer group/content hover:bg-zinc-900/50 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => {
            onPostClick?.();
          }}
          role="button"
          tabIndex={0}
          aria-label={accessibility.openPost()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPostClick?.();
            }
          }}
        >
          {/* 제목 */}
          <h3 className="text-white font-semibold mb-3 line-clamp-2 leading-tight text-lg group-hover/content:text-[#eafd66] transition-colors">
            {title}
          </h3>

          {/* 설명 */}
          {description && (
            <p className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">{description}</p>
          )}

          {/* 이미지 (있는 경우) */}
          {thumbnail && (
            <div className="mb-4">
              <ThumbnailImage
                src={thumbnail}
                alt={title}
                width={mediaWidth}
                height={mediaHeight}
                blurDataURL={blurDataURL}
                getContentIcon={getContentIcon}
                getContentTypeColor={getContentTypeColor}
                getContentType={getContentType}
              />
            </div>
          )}
        </div>

        {/* 포스트 액션 버튼들 */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
          {/* Pin 버튼 */}
          <button
            onClick={handlePinClick}
            disabled={!contentId || isPinLoading}
            className={`transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
              actualIsPinned
                ? 'text-primary bg-primary/10 border border-primary/20'
                : 'text-zinc-400 hover:text-primary hover:bg-primary/5 hover:border-primary/10 border border-transparent'
            } ${isPinLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={accessibility.pinPost()}
          >
            <Pin className={`w-4 h-4 ${actualIsPinned ? 'fill-current' : ''}`} />
            <span className="font-medium">{pins > 0 ? pins.toLocaleString() : actions.pin()}</span>
          </button>

          {/* Like 버튼 */}
          <button
            onClick={handleLikeClick}
            disabled={!contentId || isLikeLoading}
            className={`transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
              actualIsLiked
                ? 'text-red-500 bg-red-500/10 border border-red-500/20'
                : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/10 border border-transparent'
            } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={actualIsLiked ? 'Unlike this post' : 'Like this post'}
          >
            <svg
              className="w-4 h-4"
              fill={actualIsLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">
              {actualLikeCount > 0 ? actualLikeCount.toLocaleString() : 'Like'}
            </span>
          </button>

          {/* Comment 버튼 */}
          <button
            onClick={handleCommentClick}
            disabled={!contentId}
            className="text-zinc-400 hover:text-blue-500 hover:bg-blue-500/5 hover:border-blue-500/10 border border-transparent transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
            aria-label={accessibility.commentOnPost()}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">
              {actualCommentCount > 0 ? actualCommentCount.toLocaleString() : actions.comment()}
            </span>
          </button>

          {/* Share 버튼 */}
          <button
            onClick={handleShareClick}
            className="text-zinc-400 hover:text-green-500 hover:bg-green-500/5 hover:border-green-500/10 border border-transparent transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
            aria-label={accessibility.sharePost()}
          >
            <Share className="w-4 h-4" />
            <span>{actions.share()}</span>
          </button>

          {/* Bookmark 버튼 */}
          <button
            onClick={handleBookmarkClick}
            disabled={!contentId || isBookmarkLoading}
            className={`transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
              actualIsBookmarked
                ? 'text-purple-500 bg-purple-500/10 border border-purple-500/20'
                : 'text-zinc-400 hover:text-purple-500 hover:bg-purple-500/5 hover:border-purple-500/10 border border-transparent'
            } ${isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={accessibility.savePost()}
          >
            <Bookmark className={`w-4 h-4 ${actualIsBookmarked ? 'fill-current' : ''}`} />
            <span>{actions.save()}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
