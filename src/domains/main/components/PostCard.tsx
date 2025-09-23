'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Camera, Video, Link as LinkIcon, FileText, Bookmark, BookmarkCheck } from 'lucide-react';
import { CardMediaWithFallback } from '@/components/CardMedia/CardMedia';
import { usePostCardTranslation } from '@/lib/i18n/hooks';
import { useTranslation } from 'react-i18next';
import { useBookmarkStatus, useBookmark } from '@/domains/users/hooks/useBookmark';
import { useAuthStatus } from '@/domains/auth/hooks/useAuth';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useCommentsModal } from '@/hooks/useCommentsModal';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useDateFormatters } from '@/lib/utils/dateUtils';
// import { useCommentStats } from '@/domains/comments/hooks/useComments';
// import { useTogglePin } from '@/domains/channels/hooks/useChannelPins';
// import { useBookmark } from '@/domains/users/hooks/useBookmark';
// import { useCommentStats } from '@/domains/comments/hooks/useComments';
// import { useContentLike } from '@/domains/interactions/hooks/useContentLike';
// import { useCommentsModal } from '@/hooks/useCommentsModal';
// import { PostActionButtons } from './PostActionButtons';

export interface PostCardProps {
  id: number;
  title: string;
  description?: string;
  channel: string;
  channelId: string;
  channelThumbnail?: string | null;
  channelDescription?: string; // 채널 설명 추가
  author: string;
  authorId: string;
  userAvatar?: string | null;
  userAka?: string | null;
  createdAt: string | Date; // ISO string or Date object
  pins: number;
  comments: number;
  thumbnail?: string | null;
  mediaWidth?: number; // Original width for aspect calculation
  mediaHeight?: number; // Original height for aspect calculation
  blurDataURL?: string; // Blur placeholder for better loading
  contentType: 'text' | 'image' | 'video' | 'link';
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
  channelDescription,
  author,
  authorId,
  userAvatar,
  userAka,
  createdAt,
  pins,
  comments,
  thumbnail,
  mediaWidth,
  mediaHeight,
  blurDataURL,
  contentType,
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
  const { t } = useTranslation('common');
  const { formatDateByContext } = useDateFormatters();

  // 디버깅 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('PostCard date debug:', {
      title,
      createdAt,
      createdAtType: typeof createdAt,
      formattedTime: formatDateByContext(createdAt, 'list'),
    });
  }

  // const { open: openComments } = useCommentsModal();

  // 북마크 관련 상태 및 훅
  const isAuthenticated = useAuthStatus();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { open: openComments } = useCommentsModal();
  // const {
  //   open: openComments,
  //   close: closeComments,
  //   isOpen: isCommentsModalOpen,
  // } = useCommentsModal();
  // const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  // 채널 정보 가져오기 (채널 설명을 위해)
  const { data: channelData } = useChannel(channelId, { enabled: !!channelId });

  // contentId가 있을 때만 북마크 훅 활성화
  const { data: bookmarkStatus } = useBookmarkStatus(contentId || '');
  const {
    addBookmark,
    removeBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmark(contentId || '');

  // 댓글 모달이 닫힐 때 URL 복원
  // useEffect(() => {
  //   if (!isCommentsModalOpen && previousUrl && typeof window !== 'undefined') {
  //     console.log('PostCard: Restoring URL to:', previousUrl);
  //     window.history.replaceState({}, '', previousUrl);
  //     setPreviousUrl(null);
  //   }
  // }, [isCommentsModalOpen, previousUrl]);

  // 댓글 통계 가져오기 (contentId가 있을 때만) - 나중에 구현
  // const { data: commentStats } = useCommentStats(contentId || '', !!contentId);

  // API 훅들 - contentId가 있을 때만 활성화 (주석처리)
  // const { togglePin, isLoading: isPinLoading } = useTogglePin();
  // const {
  //   addBookmark,
  //   removeBookmark,
  //   isLoading: isBookmarkLoading,
  // } = useBookmark(contentId || '');
  // const {
  //   isLiked,
  //   likeCount,
  //   toggleLike,
  //   isLoading: isLikeLoading,
  // } = useContentLike(contentId || '');
  // const { data: commentStats, isLoading: isCommentStatsLoading } = useCommentStats(
  //   contentId || '',
  //   !!contentId,
  // );

  // 실제 상태값들 (props 우선, 없으면 API에서 가져온 값 사용) (주석처리)
  // const actualIsPinned = propIsPinned ?? false; // TODO: useIsContentPinned 훅 사용 예정
  // const actualIsBookmarked = propIsBookmarked ?? false; // TODO: useBookmarkStatus 훅 사용 예정
  // const actualIsLiked = propIsLiked ?? isLiked;
  // const actualLikeCount = propLikeCount ?? likeCount;
  // const actualCommentCount = comments ?? commentStats?.total_comments ?? 0;

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

  // 북마크 핸들러
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!contentId || isBookmarkLoading) return;

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

  // 댓글 클릭 핸들러
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId) {
      console.log('PostCard: No contentId for comments');
      return;
    }

    // 현재 URL 저장
    // if (typeof window !== 'undefined') {
    //   setPreviousUrl(window.location.href);
    // }

    console.log('PostCard: Opening comments modal for contentId:', contentId);
    openComments(contentId);
  };

  // 액션 핸들러들 (주석처리)
  // const handlePinClick = async (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (!contentId || isPinLoading) return;

  //   try {
  //     await togglePin(contentId, channelId, actualIsPinned);
  //   } catch (error) {
  //     console.error('Failed to toggle pin:', error);
  //   }
  // };

  // const handleLikeClick = async (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (!contentId || isLikeLoading) return;

  //   try {
  //     await toggleLike();
  //   } catch (error) {
  //     console.error('Failed to toggle like:', error);
  //   }
  // };

  // const handleCommentClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (!contentId) return;

  //   openComments(contentId);
  // };

  // const handleShareClick = async (e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: title,
  //         text: description || title,
  //         url: window.location.href,
  //       });
  //     } else {
  //       // 브라우저가 Web Share API를 지원하지 않는 경우 클립보드에 복사
  //       await navigator.clipboard.writeText(window.location.href);
  //       // TODO: 토스트 메시지 표시
  //     }
  //   } catch (error) {
  //     console.error('Failed to share:', error);
  //   }
  // };

  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-200 group max-w-4xl mx-auto relative animate-fade-in-up ${className}`}
    >
      <div className="p-2 md:p-4">
        {/* 상단: 채널 정보 및 메타데이터 */}
        <div className="mb-3">
          {/* 채널 정보 영역: 채널 썸네일이 두 줄에 걸쳐 배치 */}
          <div className="flex gap-3">
            {/* 채널 썸네일 - 두 줄 높이 */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden self-start"
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

            {/* 오른쪽 컨텐츠 영역 */}
            <div className="flex-1">
              {/* 첫 번째 줄: 채널명, 작성자 */}
              <div className="flex items-center gap-2">
                {/* 채널명 */}
                <button
                  className="text-[#eafd66] hover:text-white font-medium transition-colors cursor-pointer text-left"
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

                {/* 작성자 */}
                <div className="flex items-center gap-2">
                  {/* 유저 아바타 */}
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
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
                      className={`w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-full flex items-center justify-center ${
                        userAvatar ? 'hidden' : 'flex'
                      }`}
                    >
                      <span className="text-zinc-200 text-xs font-semibold">
                        {(userAka || author).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="hover:text-zinc-300 transition-colors cursor-pointer text-left text-sm font-medium text-zinc-400"
                    onClick={() => {
                      if (onAuthorClick) {
                        onAuthorClick(authorId, author);
                      } else {
                        router.push(`/profile/${authorId}`);
                      }
                    }}
                    aria-label={accessibility.goToAuthor(userAka || author)}
                  >
                    {userAka || author}
                  </button>
                </div>
              </div>

              {/* 두 번째 줄: 채널 설명 */}
              {(channelDescription || channelData?.description) && (
                <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                  {channelDescription || channelData?.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 포스트 콘텐츠 영역 - 클릭 시 모달 */}
        <div
          className="cursor-pointer group/content hover:bg-zinc-900/50 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => {
            if (contentId && channelId) {
              // 현재 URL 저장 (댓글 모달용)
              // if (typeof window !== 'undefined') {
              //   setPreviousUrl(window.location.href);
              // }

              // onPostClick을 먼저 호출하여 로딩 상태 표시
              onPostClick?.();
              // URL만 변경 (라우터 push 없이)
              // const newUrl = `/channels/${channelId}?content=${contentId}`;
              // window.history.pushState({}, '', newUrl);
              // URL 변경 이벤트 발생시키기
              // window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
              onPostClick?.();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={accessibility.openPost()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (contentId && channelId) {
                // 현재 URL 저장 (댓글 모달용)
                // if (typeof window !== 'undefined') {
                //   setPreviousUrl(window.location.href);
                // }

                // onPostClick을 먼저 호출하여 로딩 상태 표시
                onPostClick?.();
                // URL만 변경 (라우터 push 없이)
                // const newUrl = `/channels/${channelId}?content=${contentId}`;
                // window.history.pushState({}, '', newUrl);
                // URL 변경 이벤트 발생시키기
                // window.dispatchEvent(new PopStateEvent('popstate'));
              } else {
                onPostClick?.();
              }
            }
          }}
        >
          {/* 제목 */}
          <h3 className="text-white font-semibold mb-3 line-clamp-2 leading-tight text-lg group-hover/content:text-[#eafd66] transition-colors">
            {title}
          </h3>

          {/* 설명 */}
          {description && (
            <div className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
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
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center space-x-4">
            {/* 북마크 버튼 - contentId가 있을 때만 활성화 */}
            {contentId ? (
              <button
                onClick={handleBookmarkClick}
                disabled={isBookmarkLoading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800/30 hover:bg-zinc-700/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={bookmarkStatus?.is_bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {bookmarkStatus?.is_bookmarked ? (
                  <BookmarkCheck className="w-4 h-4" style={{ color: '#EAFD66' }} />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>{bookmarkStatus?.is_bookmarked ? '저장됨' : actions.save()}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-2 text-sm text-zinc-500 bg-zinc-800/20 rounded-lg">
                <Bookmark className="w-4 h-4" />
                <span>{actions.save()}</span>
              </div>
            )}

            {/* 댓글 - 클릭 가능 */}
            <button
              onClick={handleCommentClick}
              disabled={!contentId}
              className="flex items-center space-x-1 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{actions.comment()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
});
