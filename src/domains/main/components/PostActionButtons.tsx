'use client';

import React from 'react';
import { MessageCircle, Share, Bookmark, Pin } from 'lucide-react';
import { usePostCardTranslation } from '@/lib/i18n/hooks';
import { useTogglePin } from '@/domains/channels/hooks/useChannelPins';
import { useBookmark } from '@/domains/users/hooks/useBookmark';
import { useCommentStats } from '@/domains/comments/hooks/useComments';
import { useContentLike } from '@/domains/interactions/hooks/useContentLike';
import { useCommentsModal } from '@/hooks/useCommentsModal';

export interface PostActionButtonsProps {
  contentId?: string;
  channelId: string;
  pins: number;
  comments: number;
  // API 연결을 위한 추가 props
  isPinned?: boolean;
  isBookmarked?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}

export const PostActionButtons = React.memo<PostActionButtonsProps>(function PostActionButtons({
  contentId,
  channelId,
  pins,
  comments,
  isPinned: propIsPinned,
  isBookmarked: propIsBookmarked,
  isLiked: propIsLiked,
  likeCount: propLikeCount,
}: PostActionButtonsProps) {
  const { actions, accessibility } = usePostCardTranslation();
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
          title: 'Post',
          text: 'Check out this post',
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
    <div className="flex items-center gap-2 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
      {/* Pin 버튼 */}
      <button
        onClick={handlePinClick}
        disabled={!contentId || isPinLoading}
        className={`transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
          actualIsPinned
            ? 'text-zinc-200 bg-zinc-800/50 border border-zinc-700'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 hover:border-zinc-700 border border-transparent'
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
            ? 'text-zinc-200 bg-zinc-800/50 border border-zinc-700'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 hover:border-zinc-700 border border-transparent'
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
        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 hover:border-zinc-700 border border-transparent transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
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
        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 hover:border-zinc-700 border border-transparent transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
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
            ? 'text-zinc-200 bg-zinc-800/50 border border-zinc-700'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 hover:border-zinc-700 border border-transparent'
        } ${isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={accessibility.savePost()}
      >
        <Bookmark className={`w-4 h-4 ${actualIsBookmarked ? 'fill-current' : ''}`} />
        <span>{actions.save()}</span>
      </button>
    </div>
  );
});

