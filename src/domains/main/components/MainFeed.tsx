'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Flame, Sparkles, Star, MailOpen } from 'lucide-react';
import { PostCard } from './PostCard';
import { useInfiniteContentsByChannel } from '@/domains/contents/hooks/useInfiniteContentsByChannel';
import { InfiniteScrollLoader } from './InfiniteScrollLoader';
import { PostCardSkeleton } from './PostCardSkeleton';
import type { ContentListResponse } from '@/api/generated/models/ContentListResponse';
import { useContentModalStore } from '@/store/contentModalStore';
import { convertToContentItem } from '@/lib/types/content';
import type { ContentItem } from '@/lib/types/content';
import { ContentType } from '@/api/generated/models/ContentType';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';

type SortOption = 'hot' | 'new' | 'top';

export const MainFeed = React.memo(function MainFeed() {
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const openModal = useContentModalStore((state) => state.openModal);

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { value: 'hot', label: 'Hot', icon: Flame },
    { value: 'new', label: 'New', icon: Sparkles },
    { value: 'top', label: 'Top', icon: Star },
  ];

  // 특정 채널의 콘텐츠 가져오기 - 무한스크롤 사용
  const channelId = '688a317213dbcfcd941c85b4'; // 테스트용 채널 ID
  const infiniteQuery = useInfiniteContentsByChannel(channelId, {
    limit: 20,
    sortBy: activeSort,
  });

  // 모든 페이지의 데이터를 평면화
  const allContents = useMemo(() => {
    return infiniteQuery.data?.pages.flatMap((page) => page.contents) || [];
  }, [infiniteQuery.data]);

  const feedData = allContents;
  const currentQuery = infiniteQuery; // 기존 인터페이스와의 호환성 유지

  // Content를 PostCard props로 변환하는 함수 - 메모화로 성능 최적화
  const transformContentItem = useCallback(
    (item: Record<string, any>, index: number) => {
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
        channelId: item.channel_id || channelId, // API에서 채널 ID 가져오거나 현재 채널 ID 사용
        author: item.provider_id || 'anonymous',
        authorId: item.provider_id || item.created_by || 'anonymous', // 사용자 ID (provider_id 또는 created_by 필드 사용)
        timeAgo: getTimeAgo(item.created_at || new Date().toISOString()),
        upvotes: 0, // 콘텐츠 응답에는 좋아요 수가 없으므로 0으로 설정
        comments: 0, // 콘텐츠 응답에는 댓글 수가 없으므로 0으로 설정
        thumbnail,
        contentType: mapContentType(item.type) || ('link' as const),
        originalItem: item, // 원본 데이터 보조
      };
    },
    [channelId],
  );

  // ContentItem으로 변환하는 함수 (API 데이터에 맞게 수정) - 메모화로 성능 최적화
  const transformToContentItem = useCallback((item: Record<string, any>): ContentItem => {
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
  }, []);

  // 콘텐츠 타입 매핑 - 메모화로 성능 최적화
  const mapContentType = useCallback((type: string): 'text' | 'image' | 'video' | 'link' => {
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
  }, []);

  // 시간 차이 계산 - 메모화로 성능 최적화
  const getTimeAgo = useCallback((createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  }, []);

  return (
    <div className="w-full min-h-screen bg-black">
      <div
        className="max-w-4xl mx-auto px-4 py-6"
        style={{
          scrollBehavior: 'smooth',
          willChange: 'scroll-position',
        }}
      >
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
                  onClick={() => {
                    if (activeSort !== option.value) {
                      setActiveSort(option.value);
                      // 정렬 변경 시 쿼리 리프레시하여 새로운 데이터 로드
                      currentQuery.refetch();
                    }
                  }}
                  className={`
                    px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
                    ${
                      activeSort === option.value
                        ? 'text-black bg-[#eafd66] shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                    }
                  `}
                >
                  <option.icon className="w-4 h-4 mr-1.5" />
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

        {/* 초기 로딩 상태 - 최적화된 스켈레톤 */}
        {currentQuery.isLoading && !currentQuery.data && <PostCardSkeleton count={5} />}

        {/* 에러 상태 */}
        {currentQuery.isError && !currentQuery.data && (
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
        {(!currentQuery.isLoading || currentQuery.data) && !currentQuery.isError && (
          <div className="space-y-6" style={{ containIntrinsicSize: 'auto 500px' }}>
            {feedData.length === 0 && !currentQuery.isLoading ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <MailOpen className="w-16 h-16 mx-auto text-gray-600" />
                </div>
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
                    channelId={post.channelId}
                    author={post.author}
                    authorId={post.authorId}
                    timeAgo={post.timeAgo}
                    upvotes={post.upvotes}
                    comments={post.comments}
                    thumbnail={post.thumbnail}
                    contentType={post.contentType}
                    onPostClick={() => {
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

        {/* 무한스크롤 로더 */}
        {feedData.length > 0 && (
          <InfiniteScrollLoader
            hasNextPage={currentQuery.hasNextPage || false}
            isFetchingNextPage={currentQuery.isFetchingNextPage}
            fetchNextPage={currentQuery.fetchNextPage}
            error={currentQuery.error}
            onRetry={() => currentQuery.refetch()}
            className="mt-12"
          />
        )}

        {/* 포스트 수 표시 */}
        {feedData.length > 0 && (
          <div className="text-center mt-6">
            <div className="text-xs text-gray-500">
              Showing {feedData.length} posts
              {currentQuery.data?.pages?.[0] && (currentQuery.data.pages[0] as any)?.totalCount && (
                <span> of {(currentQuery.data.pages[0] as any).totalCount}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
