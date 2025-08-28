'use client';

import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { useContentsByChannel } from '@/domains/contents/hooks/useContents';
import type { ContentListResponse } from '@/api/generated/models/ContentListResponse';
import { useContentModalStore } from '@/store/contentModalStore';
import { convertToContentItem } from '@/lib/types/content';
import type { ContentItem } from '@/lib/types/content';
import { ContentType } from '@/api/generated/models/ContentType';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';

type SortOption = 'hot' | 'new' | 'top';

export function MainFeed() {
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const openModal = useContentModalStore((state) => state.openModal);

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'hot', label: 'Hot', icon: '🔥' },
    { value: 'new', label: 'New', icon: '🆕' },
    { value: 'top', label: 'Top', icon: '⭐' },
  ];

  // 특정 채널의 콘텐츠 가져오기
  const channelId = '688a317213dbcfcd941c85b4'; // 테스트용 채널 ID
  const contentsQuery = useContentsByChannel(channelId, {
    skip: 0,
    limit: 20,
  });

  const feedData = contentsQuery.data?.contents || [];
  const currentQuery = contentsQuery; // 기존 쿼리 인터페이스 유지

  // Content를 PostCard props로 변환하는 함수
  const transformContentItem = (item: Record<string, any>, index: number) => {
    // 여러 가능한 이미지 소스 확인 (API 응답에 맞게 수정)
    const rawThumbnail =
      item.link_preview_metadata?.img_url ||
      item.link_preview_metadata?.downloaded_img_url ||
      item.thumbnail_url ||
      item.image_url ||
      null;

    // 이미지 프록시 처리 적용
    const thumbnail = rawThumbnail ? getThumbnailImageUrl(rawThumbnail) : null;

    // 디버깅을 위한 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('Content item:', {
        id: item.id,
        title: item.link_preview_metadata?.title,
        img_url: item.link_preview_metadata?.img_url,
        downloaded_img_url: item.link_preview_metadata?.downloaded_img_url,
        raw_thumbnail: rawThumbnail,
        thumbnail_url: item.thumbnail_url,
        image_url_direct: item.image_url,
        final_thumbnail: thumbnail,
      });
    }

    return {
      id: index,
      title: item.link_preview_metadata?.title || item.url || 'Untitled',
      description: item.description || item.link_preview_metadata?.description || undefined,
      channel: 'decoded', // 임시로 고정값 사용
      author: item.provider_id || 'anonymous',
      timeAgo: getTimeAgo(item.created_at || new Date().toISOString()),
      upvotes: 0, // 콘텐츠 응답에는 좋아요 수가 없으므로 0으로 설정
      comments: 0, // 콘텐츠 응답에는 댓글 수가 없으므로 0으로 설정
      thumbnail,
      contentType: mapContentType(item.type) || ('link' as const),
      originalItem: item, // 원본 데이터 보조
    };
  };

  // ContentItem으로 변환하는 함수 (API 데이터에 맞게 수정)
  const transformToContentItem = (item: Record<string, any>): ContentItem => {
    // 이미지 URL 찾기 - API 응답 구조에 맞게 수정
    const rawThumbnailUrl =
      item.link_preview_metadata?.img_url ||
      item.link_preview_metadata?.downloaded_img_url ||
      item.thumbnail_url ||
      item.image_url ||
      undefined;

    // 이미지 프록시 처리 적용
    const thumbnailUrl = rawThumbnailUrl ? getThumbnailImageUrl(rawThumbnailUrl) : undefined;

    return {
      id: item.id || Date.now().toString(),
      type: ContentType.LINK,
      title: item.link_preview_metadata?.title || item.url || 'Untitled',
      description: item.description || item.link_preview_metadata?.description || undefined,
      linkUrl: item.url,
      thumbnailUrl,
      author: item.provider_id || 'anonymous',
      date: item.created_at,
      category: item.category,
      status: item.status,
      // AI 생성 메타데이터 - ContentItem 타입에 맞게 매핑
      aiSummary: item.ai_gen_metadata?.summary,
      aiQaList: item.ai_gen_metadata?.qa_list,
      linkPreview: {
        title: item.link_preview_metadata?.title,
        description: item.link_preview_metadata?.description,
        url: item.url,
        imageUrl: thumbnailUrl, // 이미 프록시 처리된 URL
        downloadedImageUrl: item.link_preview_metadata?.downloaded_img_url,
        siteName: item.link_preview_metadata?.site_name,
      },
    };
  };

  // 콘텐츠 타입 매핑
  const mapContentType = (type: string): 'text' | 'image' | 'video' | 'link' => {
    switch (type?.toLowerCase()) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'link':
        return 'link';
      default:
        return 'text';
    }
  };

  // 시간 차이 계산
  const getTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 피드 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">Popular posts</h1>
              <p className="text-gray-400 text-sm">Trending content from the channel</p>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setActiveSort(option.value)}
                  className={`
                    px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
                    ${
                      activeSort === option.value
                        ? 'text-black bg-[#eafd66] shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                    }
                  `}
                >
                  <span className="mr-1.5">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 필터/서브 옵션 */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400">Filter by:</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-md border border-zinc-700 transition-colors">
                Today
              </button>
              <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-md border border-zinc-700 transition-colors">
                This Week
              </button>
              <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-md border border-zinc-700 transition-colors">
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* 로딩 상태 */}
        {currentQuery.isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-zinc-800 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 에러 상태 */}
        {currentQuery.isError && (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Failed to load posts</div>
            <button
              onClick={() => currentQuery.refetch()}
              className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 포스트 목록 */}
        {!currentQuery.isLoading && !currentQuery.isError && (
          <div className="space-y-6">
            {feedData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <div className="text-gray-400 text-lg mb-2">No posts found</div>
                <div className="text-gray-600 text-sm">
                  Try a different filter or check back later!
                </div>
              </div>
            ) : (
              feedData.map((item: Record<string, any>, index: number) => {
                const post = transformContentItem(item, index);
                return (
                  <PostCard
                    key={`${item.id}-${index}`}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    channel={post.channel}
                    author={post.author}
                    timeAgo={post.timeAgo}
                    upvotes={post.upvotes}
                    comments={post.comments}
                    thumbnail={post.thumbnail}
                    contentType={post.contentType}
                    onClick={() => {
                      console.log('Post clicked:', item.id, item.channel_id);
                      // ContentModal에서 콘텐츠 표시
                      const contentItem = transformToContentItem(item);
                      openModal(contentItem);
                    }}
                  />
                );
              })
            )}
          </div>
        )}

        {/* 로드 더 버튼 */}
        {!currentQuery.isLoading && !currentQuery.isError && feedData.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-600 font-medium">
              Load More Posts
            </button>
            <div className="mt-4 text-xs text-gray-500">Showing {feedData.length} posts</div>
          </div>
        )}
      </div>
    </div>
  );
}
