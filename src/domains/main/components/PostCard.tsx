'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  id: number;
  title: string;
  description?: string;
  channel: string;
  channelId: string;
  author: string;
  authorId: string;
  timeAgo: string;
  upvotes: number;
  comments: number;
  thumbnail?: string | null;
  contentType: 'text' | 'image' | 'video' | 'link';
  onPostClick?: () => void;
  onChannelClick?: (channelId: string, channel: string) => void;
  onAuthorClick?: (authorId: string, author: string) => void;
}

// 썸네일 이미지 컴포넌트
function ThumbnailImage({
  src,
  alt,
  getContentIcon,
  getContentTypeColor,
}: {
  src: string;
  alt: string;
  getContentIcon: () => string;
  getContentTypeColor: () => string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-64 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
        <span className={`text-4xl ${getContentTypeColor()}`}>{getContentIcon()}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
      {!imageLoaded && (
        <div className="w-full h-64 bg-zinc-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-zinc-600 rounded-full"></div>
        </div>
      )}
      <div className="p-2 bg-zinc-900">
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-contain rounded-md transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.log('Image failed to load:', src);
            setImageError(true);
          }}
        />
      </div>
      {imageLoaded && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs">
          <span className={`text-xs font-medium ${getContentTypeColor()}`}>{getContentIcon()}</span>
        </div>
      )}
    </div>
  );
}

export function PostCard({
  title,
  description,
  channel,
  channelId,
  author,
  authorId,
  timeAgo,
  upvotes,
  comments,
  thumbnail,
  contentType,
  onPostClick,
  onChannelClick,
  onAuthorClick,
}: PostCardProps) {
  const router = useRouter();
  // 디버깅을 위한 로그
  if (process.env.NODE_ENV === 'development' && thumbnail) {
    console.log('PostCard with thumbnail:', { title, thumbnail, contentType });
  }

  const getContentIcon = () => {
    switch (contentType) {
      case 'image':
        return '📷';
      case 'video':
        return '🎥';
      case 'link':
        return '🔗';
      default:
        return '📝';
    }
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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-200 group">
      <div className="p-4">
        {/* 상단: 채널 정보 및 메타데이터 */}
        <div className="flex items-center gap-3 mb-3">
          {/* 동그란 채널 썸네일 - 클릭 시 채널 페이지로 */}
          <button
            className="w-9 h-9 bg-gradient-to-br from-[#eafd66] to-[#d4e85c] rounded-full flex items-center justify-center flex-shrink-0 hover:from-[#f0ff70] hover:to-[#e0f066] transition-colors cursor-pointer"
            onClick={() => {
              if (onChannelClick) {
                onChannelClick(channelId, channel);
              } else {
                router.push(`/channels/${channelId}`);
              }
            }}
            aria-label={`Go to r/${channel}`}
          >
            <span className="text-zinc-900 font-bold text-sm">r</span>
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
              r/{channel}
            </button>
            <span className="text-zinc-600">•</span>
            <button
              className="hover:text-zinc-300 transition-colors cursor-pointer"
              onClick={() => {
                if (onAuthorClick) {
                  onAuthorClick(authorId, author);
                } else {
                  router.push(`/users/${authorId}`);
                }
              }}
            >
              u/{author}
            </button>
            <span className="text-zinc-600">•</span>
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* 포스트 콘텐츠 영역 - 클릭 시 모달 */}
        <div className="cursor-pointer group/content hover:bg-zinc-900/50 rounded-lg p-2 -m-2 transition-colors" onClick={() => {
          onPostClick?.();
        }}>
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
                getContentIcon={getContentIcon}
                getContentTypeColor={getContentTypeColor}
              />
            </div>
          )}
        </div>

        {/* 포스트 액션 버튼들 */}
        <div className="flex items-center gap-6 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
          <button className="hover:text-orange-400 transition-colors flex items-center gap-2">
            <span className="text-orange-400 text-lg">▲</span>
            <span className="font-medium">{upvotes.toLocaleString()}</span>
          </button>
          <button className="hover:text-blue-400 transition-colors flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span className="font-medium">{comments}</span>
          </button>
          <button className="hover:text-green-400 transition-colors flex items-center gap-2">
            <span className="text-lg">📤</span>
            <span>Share</span>
          </button>
          <button className="hover:text-purple-400 transition-colors flex items-center gap-2">
            <span className="text-lg">🔖</span>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
