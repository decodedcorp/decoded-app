'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { MailOpen, Flame, Clock } from 'lucide-react';
// import { TrendingUp } from 'lucide-react'; // Currently disabled
import { useQueries } from '@tanstack/react-query';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useContentDetail } from '@/domains/contents/hooks/useContentDetail';
import { ChannelsService } from '@/api/generated/services/ChannelsService';
import { UsersService } from '@/api/generated/services/UsersService';
import { useContentModalStore } from '@/store/contentModalStore';
import type { ContentItem } from '@/lib/types/content';
import { ContentType } from '@/lib/types/ContentType';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';

import { useFeedContents } from '../hooks/useFeedContents';
import { DEFAULT_CHANNEL_ID } from '../data/channelCardsProvider';
import type { FeedItem, SortOption } from '../types/feedTypes';

import { PostCardSkeleton } from './PostCardSkeleton';
import { InfiniteScrollLoader } from './InfiniteScrollLoader';
import { PostCard } from './PostCard';
import { FeedGrid, FeedGridItem } from '@/components/FeedGrid/FeedGrid';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export const MainFeed = React.memo(function MainFeed() {
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [channelThumbnails, setChannelThumbnails] = useState<Record<string, string>>({});
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const [userAkas, setUserAkas] = useState<Record<string, string>>({});
  const openModal = useContentModalStore((state) => state.openModal);
  const t = useCommonTranslation();

  // 선택된 콘텐츠의 상세 정보 가져오기
  const { data: contentDetail, isLoading: isContentLoading } = useContentDetail({
    contentId: selectedContentId || '',
    enabled: !!selectedContentId,
  });

  // API 응답을 ContentItem으로 변환하는 함수
  const convertApiResponseToContentItem = useCallback(
    (apiResponse: Record<string, any>): ContentItem => {
      // 이미지 URL 찾기
      const rawThumbnailUrl =
        apiResponse.link_preview_metadata?.img_url ||
        apiResponse.link_preview_metadata?.downloaded_img_url ||
        apiResponse.thumbnail_url ||
        undefined;

      // 이미지 프록시 처리 적용
      const thumbnailUrl = rawThumbnailUrl ? getThumbnailImageUrl(rawThumbnailUrl) : undefined;

      return {
        id: apiResponse.id || Date.now().toString(),
        type: ContentType.LINK,
        title: apiResponse.link_preview_metadata?.title || apiResponse.url || 'Untitled',
        description:
          apiResponse.description || apiResponse.link_preview_metadata?.description || undefined,
        linkUrl: apiResponse.url,
        thumbnailUrl,
        author: apiResponse.provider_id || 'anonymous',
        channel_id: apiResponse.channel_id, // channel_id 추가
        date: apiResponse.created_at || new Date().toISOString(),
        category: apiResponse.category,
        status: apiResponse.status,
        // AI 생성 메타데이터
        aiSummary: apiResponse.ai_gen_metadata?.summary,
        aiQaList: apiResponse.ai_gen_metadata?.qa_list,
        linkPreview: {
          title: apiResponse.link_preview_metadata?.title,
          description: apiResponse.link_preview_metadata?.description,
          url: apiResponse.url,
          imageUrl: thumbnailUrl,
          downloadedImageUrl: apiResponse.link_preview_metadata?.downloaded_img_url,
          siteName: apiResponse.link_preview_metadata?.site_name,
        },
      };
    },
    [],
  );

  // 콘텐츠 상세 정보가 로드되면 모달 열기
  useEffect(() => {
    if (contentDetail && !isContentLoading) {
      // API 응답을 ContentItem으로 변환
      const contentItem = convertApiResponseToContentItem(contentDetail);
      // channelId를 전달하여 URL 업데이트
      openModal(contentItem, DEFAULT_CHANNEL_ID);
      // 모달이 열린 후 선택된 콘텐츠 ID와 로딩 상태 초기화
      setSelectedContentId(null);
      setIsLoadingContent(false);
    }
  }, [contentDetail, isContentLoading, openModal, convertApiResponseToContentItem]);

  // 선택된 콘텐츠 ID가 변경될 때 로딩 상태 관리
  useEffect(() => {
    if (selectedContentId) {
      setIsLoadingContent(true);
    } else {
      setIsLoadingContent(false);
    }
  }, [selectedContentId]);

  const sortOptions: {
    value: SortOption;
    label: string;
    tooltip: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 'hot',
      label: t.feed.sort.hot(),
      tooltip: t.feed.sort.hotTooltip(),
      icon: <Flame className="w-4 h-4" />,
    },
    {
      value: 'new',
      label: t.feed.sort.new(),
      tooltip: t.feed.sort.newTooltip(),
      icon: <Clock className="w-4 h-4" />,
    },
    // Top sort option - Currently disabled
    // {
    //   value: 'top',
    //   label: t.feed.sort.top(),
    //   tooltip: t.feed.sort.topTooltip(),
    //   icon: <TrendingUp className="w-4 h-4" />,
    // },
  ];

  // Enhanced infinite scroll feed with hybrid API strategy
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
    error,
    refetch,
    allItems,
    totalItems,
  } = useFeedContents({
    sort: activeSort,
    limit: 20,
  });

  // Flatten all items from all pages
  const feedData = useMemo(() => allItems, [allItems]);

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Enhanced Feed State:', {
      sort: activeSort,
      totalPages: data?.pages?.length || 0,
      totalItems,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
      error,
    });
  }

  // 고유한 채널 ID들 추출 - feedData의 길이와 ID들만 의존성으로 설정
  const uniqueChannelIds = useMemo(() => {
    const channelIds = new Set<string>();
    feedData.forEach((item) => {
      if (item.channelId) {
        channelIds.add(item.channelId);
      }
    });
    return Array.from(channelIds);
  }, [feedData.length, feedData.map((item) => item.channelId).join(',')]);

  // 고유한 유저 ID들 추출 - feedData의 길이와 ID들만 의존성으로 설정
  const uniqueUserIds = useMemo(() => {
    const userIds = new Set<string>();
    feedData.forEach((item) => {
      if (item.providerId) {
        userIds.add(item.providerId);
      }
    });
    return Array.from(userIds);
  }, [feedData.length, feedData.map((item) => item.providerId).join(',')]);

  // 모든 채널의 썸네일 가져오기
  const channelQueries = uniqueChannelIds.map((channelId) => ({
    queryKey: ['channel', channelId],
    queryFn: () => ChannelsService.getChannelChannelsChannelIdGet(channelId),
    enabled: !!channelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  }));

  const channelResults = useQueries({
    queries: channelQueries,
  });

  // 모든 유저의 프로필 가져오기
  const userQueries = uniqueUserIds.map((userId) => ({
    queryKey: ['user', 'profile', userId],
    queryFn: () => UsersService.getProfileUsersUserIdProfileGet(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  }));

  const userResults = useQueries({
    queries: userQueries,
  });

  // 채널 썸네일 상태 업데이트
  useEffect(() => {
    const newThumbnails: Record<string, string> = {};
    channelResults.forEach((result, index) => {
      if (result.data?.thumbnail_url) {
        newThumbnails[uniqueChannelIds[index]] = result.data.thumbnail_url;
      }
    });

    if (Object.keys(newThumbnails).length > 0) {
      setChannelThumbnails((prev) => {
        // 이미 존재하는 썸네일과 비교하여 실제로 변경된 것만 업데이트
        const hasChanges = Object.entries(newThumbnails).some(
          ([key, value]) => prev[key] !== value,
        );

        if (!hasChanges) {
          return prev;
        }

        return {
          ...prev,
          ...newThumbnails,
        };
      });
    }
  }, [channelResults, uniqueChannelIds]);

  // 유저 아바타 및 aka 상태 업데이트
  useEffect(() => {
    const newAvatars: Record<string, string> = {};
    const newAkas: Record<string, string> = {};

    userResults.forEach((result, index) => {
      const userId = uniqueUserIds[index];
      if (result.data) {
        if (result.data.profile_image_url) {
          newAvatars[userId] = result.data.profile_image_url;
        }
        if (result.data.aka) {
          newAkas[userId] = result.data.aka;
        }
      }
    });

    if (Object.keys(newAvatars).length > 0) {
      setUserAvatars((prev) => {
        // 이미 존재하는 아바타와 비교하여 실제로 변경된 것만 업데이트
        const hasChanges = Object.entries(newAvatars).some(([key, value]) => prev[key] !== value);

        if (!hasChanges) {
          return prev;
        }

        return {
          ...prev,
          ...newAvatars,
        };
      });
    }

    if (Object.keys(newAkas).length > 0) {
      setUserAkas((prev) => {
        // 이미 존재하는 aka와 비교하여 실제로 변경된 것만 업데이트
        const hasChanges = Object.entries(newAkas).some(([key, value]) => prev[key] !== value);

        if (!hasChanges) {
          return prev;
        }

        return {
          ...prev,
          ...newAkas,
        };
      });
    }
  }, [userResults, uniqueUserIds]);

  // FeedItem을 PostCard props로 변환하는 함수 - 메모화로 성능 최적화
  const transformFeedItem = useCallback((item: FeedItem, index: number) => {
    // FeedItem은 이미 정규화된 데이터이므로 직접 사용
    const thumbnail = item.imageUrl || null;

    const transformed = {
      id: index,
      title: item.title || 'Untitled',
      description: item.description || undefined,
      channel: item.channelName || 'Unknown Channel',
      channelId: item.channelId,
      author: item.providerName || 'anonymous',
      authorId: item.providerId || 'anonymous',
      timeAgo: 'Recent', // 간단한 시간 표시
      createdAt: item.createdAt || new Date().toISOString(), // PostCard에서 사용할 createdAt 추가
      pins: item.metadata?.pins || 0,
      comments: item.metadata?.comments || 0,
      thumbnail,
      contentType: item.type || 'link',
      badge: item.metadata?.badge || null,
    };

    // 디버깅을 위한 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('transformFeedItem:', {
        itemId: item.id,
        title: item.title,
        originalCreatedAt: item.createdAt,
        transformedCreatedAt: transformed.createdAt,
        createdAtType: typeof item.createdAt,
        metadata: item.metadata,
        comments: transformed.comments,
        pins: transformed.pins,
      });
    }

    return transformed;
  }, []);

  // FeedItem을 ContentItem으로 변환하는 함수 (모달용)
  const transformToContentItem = useCallback((item: FeedItem): ContentItem => {
    return {
      id: item.id,
      type: ContentType.LINK,
      title: item.title || 'Untitled',
      description: item.description || undefined,
      linkUrl: item.linkUrl || undefined,
      thumbnailUrl: item.imageUrl,
      author: item.providerName || 'anonymous',
      date: item.createdAt,
      category: undefined,
      status: item.status as any,
      aiSummary: undefined,
      aiQaList: undefined,
      linkPreview: {
        title: item.title || undefined,
        description: item.description || undefined,
        url: item.linkUrl || undefined,
        imageUrl: item.imageUrl,
        downloadedImageUrl: undefined,
        siteName: undefined,
      },
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black">
      {/* 메인 피드 (primary) - 기본 여백 유지 */}
      <section data-role="primary-feed" className="layout-edge">
        <div
          className="w-full py-6 infinite-scroll-container"
          style={{
            scrollBehavior: 'smooth',
            willChange: 'scroll-position',
          }}
        >
          {/* 피드 헤더 */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-xl font-bold mb-1">{t.feed.section.header()}</h1>
                <p className="text-gray-400 text-xs">{t.feed.section.sub()}</p>
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
                        refetch();
                      }
                    }}
                    title={option.tooltip}
                    className={`
                    px-2 md:px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
                    ${
                      activeSort === option.value
                        ? 'text-black bg-[#eafd66] shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                    }
                  `}
                  >
                    {/* 모바일에서는 아이콘만, 데스크톱에서는 텍스트만 */}
                    <span className="md:hidden">{option.icon}</span>
                    <span className="hidden md:inline">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 메타라인 */}
            {/* <div className="mb-4">
              <div className="text-xs text-gray-500">
                {t.feed.meta.line({
                  range: t.feed.filter.today(),
                  sort:
                    activeSort === 'hot'
                      ? t.feed.sort.hot()
                      : activeSort === 'new'
                      ? t.feed.sort.new()
                      : t.feed.sort.top(),
                  count: feedData.length,
                })}
              </div>
            </div> */}

            {/* 필터/서브 옵션 */}
            {/* <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">{t.feed.filter.by()}</span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-md border border-zinc-700 transition-colors">
                  {t.feed.filter.today()}
                </button>
                <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-md border border-zinc-700 transition-colors">
                  {t.feed.filter.thisWeek()}
                </button>
                <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-md border border-zinc-700 transition-colors">
                  {t.feed.filter.allTime()}
                </button>
              </div>
            </div> */}
          </div>

          {/* 초기 로딩 상태 - 최적화된 스켈레톤 */}
          {isLoading && !data && <PostCardSkeleton count={5} />}

          {/* 에러 상태 */}
          {isError && !data && (
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">{t.feed.failedToLoadPosts()}</div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
              >
                {t.feed.tryAgain()}
              </button>
            </div>
          )}

          {/* 포스트 목록 - FeedGrid 사용 */}
          {(!isLoading || data) && !isError && (
            <>
              {feedData.length === 0 && !isLoading ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <MailOpen className="w-16 h-16 mx-auto text-gray-600" />
                  </div>
                  <div className="text-gray-400 text-lg mb-2">{t.feed.noPostsFound()}</div>
                  <div className="text-gray-600 text-sm mb-4">{t.feed.tryDifferentFilter()}</div>
                  <button className="px-4 py-2 bg-[#eafd66] text-black rounded hover:bg-[#d4e85a] transition-colors font-medium">
                    {t.feed.exploreChannelsCta()}
                  </button>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <FeedGrid
                    columns={{
                      mobile: 1,
                      tablet: 1,
                      desktop: 1,
                      wide: 1,
                    }}
                    className="mt-6"
                  >
                    {feedData.map((item: FeedItem, index: number) => {
                      const post = transformFeedItem(item, index);
                      const isSelected = selectedContentId === item.id;

                      return (
                        <React.Fragment key={`${item.id}-${index}`}>
                          <FeedGridItem>
                            <PostCard
                              id={post.id}
                              title={post.title}
                              description={post.description}
                              channel={post.channel}
                              channelId={post.channelId || ''}
                              channelThumbnail={
                                channelThumbnails[item.channelId || ''] || undefined
                              }
                              author={post.author}
                              authorId={post.authorId}
                              userAvatar={userAvatars[item.providerId || '']}
                              userAka={userAkas[item.providerId || '']}
                              createdAt={post.createdAt}
                              pins={post.pins}
                              comments={post.comments}
                              thumbnail={post.thumbnail}
                              // Use metadata from FeedItem if available
                              mediaWidth={
                                item.metadata?.mediaWidth ||
                                [800, 1200, 1600, 2000, 2400][index % 5]
                              }
                              mediaHeight={
                                item.metadata?.mediaHeight ||
                                [600, 800, 1200, 1500, 1800][index % 5]
                              }
                              blurDataURL={undefined}
                              contentType={post.contentType}
                              contentId={item.id} // 북마크 기능을 위한 contentId 추가
                              onPostClick={() => {
                                // 콘텐츠 ID를 설정하여 상세 정보 가져오기
                                setSelectedContentId(item.id);
                              }}
                              // 로딩 상태 표시
                              className={
                                isSelected && (isContentLoading || isLoadingContent)
                                  ? 'opacity-50 pointer-events-none'
                                  : ''
                              }
                            />
                          </FeedGridItem>
                        </React.Fragment>
                      );
                    })}
                  </FeedGrid>
                </div>
              )}
            </>
          )}

          {/* 콘텐츠 로딩 오버레이 */}
          <LoadingOverlay
            isLoading={isLoadingContent || (isContentLoading && !!selectedContentId)}
            message={t.feed.loadingContent()}
            spinnerSize="md"
            useBrandColor={true}
          />

          {/* 무한스크롤 로더 */}
          {feedData.length > 0 && (
            <div className="max-w-3xl mx-auto relative">
              <InfiniteScrollLoader
                hasNextPage={hasNextPage || false}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                error={error}
                onRetry={() => refetch()}
                className="mt-12"
                scrollRoot={null} // Use window as scroll container
                rootMargin="400px" // 스크롤 유도 UI가 보이도록 거리 조정
                threshold={0.1}
              />
            </div>
          )}

          {/* 포스트 수 표시 */}
          {/* {feedData.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mt-6">
                <div className="text-xs text-gray-500">
                  {t.feed.showingPosts({ count: feedData.length })}
                  {data?.pages?.[0] && (data.pages[0] as any)?.totalCount && (
                    <span> {t.feed.of({ total: (data.pages[0] as any).totalCount })}</span>
                  )}
                </div>
              </div>
            </div>
          )} */}
        </div>
      </section>

      {/* 보조 섹션들 (dense) - 향후 추가 시 거의 무여백 적용 */}
      {/*
      <section data-role="secondary-grid" className="layout-edge--dense">
        <SecondaryGrid />
      </section>
      <section data-role="recommend" className="px-[var(--edge-x-dense)]">
        <RecommendList />
      </section>
      */}
    </div>
  );
});
