'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { MailOpen, Info, TrendingUp, Clock } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useContentDetail } from '@/domains/contents/hooks/useContentDetail';
import { ChannelsService } from '@/api/generated/services/ChannelsService';
import { UsersService } from '@/api/generated/services/UsersService';
import { useContentModalStore } from '@/store/contentModalStore';
import type { ContentItem } from '@/lib/types/content';
import { ContentType } from '@/lib/types/ContentType';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';
import type { TrendingContentItem } from '@/api/generated/models/TrendingContentItem';

import { useTrendingContents } from '../hooks/useTrendingContents';

import { PostCardSkeleton } from './PostCardSkeleton';
import { InfiniteScrollLoader } from './InfiniteScrollLoader';
import { PostCard } from './PostCard';
import { FeedGrid, FeedGridItem } from '@/components/FeedGrid/FeedGrid';

type SortOption = 'hot' | 'new' | 'top';

export const MainFeed = React.memo(function MainFeed() {
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
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
      openModal(contentItem);
      // 모달이 열린 후 선택된 콘텐츠 ID 초기화
      setSelectedContentId(null);
    }
  }, [contentDetail, isContentLoading, openModal, convertApiResponseToContentItem]);

  const sortOptions: {
    value: SortOption;
    label: string;
    tooltip: string;
  }[] = [
    { value: 'hot', label: t.feed.sort.hot(), tooltip: t.feed.sort.hotTooltip() },
    { value: 'new', label: t.feed.sort.new(), tooltip: t.feed.sort.newTooltip() },
    { value: 'top', label: t.feed.sort.top(), tooltip: t.feed.sort.topTooltip() },
  ];

  // Trending contents 가져오기 - popular와 trending 병렬 호출
  const { popularContents, trendingContents, isLoading, isError, error, refetch } =
    useTrendingContents({
      limit: 20,
      enabled: true,
    });

  // 디버깅을 위한 로그 - API 응답 확인
  if (process.env.NODE_ENV === 'development') {
    console.log('Trending API Response:', {
      popularContents,
      trendingContents,
      isLoading,
      isError,
      error,
    });
  }

  // 정렬 옵션에 따라 적절한 데이터 선택
  const feedData = useMemo(() => {
    if (activeSort === 'hot') {
      return popularContents?.content || [];
    } else if (activeSort === 'new') {
      return trendingContents?.content || [];
    } else {
      // 'top'의 경우 popular와 trending를 합쳐서 정렬
      const popular = popularContents?.content || [];
      const trending = trendingContents?.content || [];
      return [...popular, ...trending].slice(0, 20);
    }
  }, [activeSort, popularContents, trendingContents]);

  // 고유한 채널 ID들 추출 - feedData의 길이와 ID들만 의존성으로 설정
  const uniqueChannelIds = useMemo(() => {
    const channelIds = new Set<string>();
    feedData.forEach((item) => {
      if (item.channel_id) {
        channelIds.add(item.channel_id);
      }
    });
    return Array.from(channelIds);
  }, [feedData.length, feedData.map((item) => item.channel_id).join(',')]);

  // 고유한 유저 ID들 추출 - feedData의 길이와 ID들만 의존성으로 설정
  const uniqueUserIds = useMemo(() => {
    const userIds = new Set<string>();
    feedData.forEach((item) => {
      if (item.provider_id) {
        userIds.add(item.provider_id);
      }
    });
    return Array.from(userIds);
  }, [feedData.length, feedData.map((item) => item.provider_id).join(',')]);

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

  // 기존 인터페이스와의 호환성을 위한 mock query 객체
  const currentQuery = {
    isLoading,
    isError,
    error,
    data: { pages: [{ contents: feedData }] },
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
    refetch,
  };

  // TrendingContentItem을 PostCard props로 변환하는 함수 - 메모화로 성능 최적화
  const transformContentItem = useCallback((item: TrendingContentItem, index: number) => {
    // 임시로 이미지 프록시 우회 - 직접 URL 사용
    const thumbnail = item.thumbnail_url || null;

    // 디버깅을 위한 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('Trending content item:', {
        id: item.id,
        title: item.title,
        thumbnail_url: item.thumbnail_url,
        raw_thumbnail: item.thumbnail_url,
        final_thumbnail: thumbnail,
        channel_name: item.channel_name,
        provider_id: item.provider_id,
        type: item.type,
        url: item.url,
        hasThumbnail: !!item.thumbnail_url,
        thumbnailAfterProxy: thumbnail,
      });
    }

    // 제목이 없을 때 URL에서 도메인 추출하여 표시
    const getDisplayTitle = () => {
      if (item.title) return item.title;
      if (item.url) {
        try {
          const url = new URL(item.url);
          return url.hostname.replace('www.', '');
        } catch {
          return 'Untitled';
        }
      }
      return 'Untitled';
    };

    // 배지 결정 로직
    const getBadge = () => {
      if (index < 3) return t.feed.badge.trending(); // 상위 3개는 급상승
      if (index < 6) return t.feed.badge.justIn(); // 4-6번째는 방금
      return null;
    };

    return {
      id: index,
      title: getDisplayTitle(),
      description: item.description || undefined,
      channel: item.channel_name || 'Unknown Channel',
      channelId: item.channel_id,
      author: item.provider_id || 'anonymous',
      authorId: item.provider_id || 'anonymous',
      timeAgo: 'Trending', // Trending 콘텐츠임을 명시
      pins: 0, // 실제 데이터가 없으므로 0으로 설정
      comments: 0, // 실제 데이터가 없으므로 0으로 설정
      thumbnail,
      contentType: mapContentType(item.type) || ('link' as const),
      originalItem: item, // 원본 데이터 보조
      badge: getBadge(), // 배지 추가
    };
  }, []);

  // TrendingContentItem을 ContentItem으로 변환하는 함수 - 메모화로 성능 최적화
  const transformToContentItem = useCallback((item: TrendingContentItem): ContentItem => {
    // 이미지 프록시 처리 적용
    const thumbnailUrl = item.thumbnail_url ? getThumbnailImageUrl(item.thumbnail_url) : undefined;

    return {
      id: item.id,
      type: ContentType.LINK,
      title: item.title || item.url || 'Untitled',
      description: item.description || undefined,
      linkUrl: item.url || undefined,
      thumbnailUrl,
      author: item.provider_id || 'anonymous',
      date: new Date().toISOString(), // TrendingContentItem에는 시간 정보가 없으므로 현재 시간 사용
      category: undefined,
      status: undefined,
      // AI 생성 메타데이터는 TrendingContentItem에 없으므로 undefined
      aiSummary: undefined,
      aiQaList: undefined,
      linkPreview: {
        title: item.title || undefined,
        description: item.description || undefined,
        url: item.url || undefined,
        imageUrl: thumbnailUrl,
        downloadedImageUrl: undefined,
        siteName: undefined,
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

  return (
    <div className="w-full min-h-screen bg-black">
      {/* 메인 피드 (primary) - 기본 여백 유지 */}
      <section data-role="primary-feed" className="layout-edge">
        <div
          className="w-full py-6"
          style={{
            scrollBehavior: 'smooth',
            willChange: 'scroll-position',
          }}
        >
          {/* 피드 헤더 */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{t.feed.section.header()}</h1>
                <p className="text-gray-400 text-sm">{t.feed.section.sub()}</p>
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
                    title={option.tooltip}
                    className={`
                    px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
                    ${
                      activeSort === option.value
                        ? 'text-black bg-[#eafd66] shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                    }
                  `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 메타라인 */}
            <div className="mb-4">
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
            </div>

            {/* 필터/서브 옵션 */}
            <div className="flex items-center gap-3 text-sm">
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
            </div>
          </div>

          {/* 초기 로딩 상태 - 최적화된 스켈레톤 */}
          {currentQuery.isLoading && !currentQuery.data && <PostCardSkeleton count={5} />}

          {/* 에러 상태 */}
          {currentQuery.isError && !currentQuery.data && (
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">{t.feed.failedToLoadPosts()}</div>
              <button
                onClick={() => currentQuery.refetch()}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
              >
                {t.feed.tryAgain()}
              </button>
            </div>
          )}

          {/* 포스트 목록 - FeedGrid 사용 */}
          {(!currentQuery.isLoading || currentQuery.data) && !currentQuery.isError && (
            <>
              {feedData.length === 0 && !currentQuery.isLoading ? (
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
                <div className="max-w-4xl mx-auto">
                  <FeedGrid
                    columns={{
                      mobile: 1,
                      tablet: 1,
                      desktop: 1,
                      wide: 1,
                    }}
                    className="mt-6"
                  >
                    {feedData.map((item: TrendingContentItem, index: number) => {
                      const post = transformContentItem(item, index);
                      const isSelected = selectedContentId === item.id;
                      return (
                        <FeedGridItem key={`${item.id}-${index}`}>
                          <PostCard
                            id={post.id}
                            title={post.title}
                            description={post.description}
                            channel={post.channel}
                            channelId={post.channelId}
                            channelThumbnail={channelThumbnails[item.channel_id]}
                            author={post.author}
                            authorId={post.authorId}
                            userAvatar={userAvatars[item.provider_id]}
                            userAka={userAkas[item.provider_id]}
                            timeAgo={post.timeAgo}
                            pins={post.pins}
                            comments={post.comments}
                            thumbnail={post.thumbnail}
                            // TODO: 실제 데이터에서 가져와야 함
                            // 임시로 다양한 aspect ratio 테스트를 위한 값
                            mediaWidth={[800, 1200, 1600, 2000, 2400][index % 5]} // 다양한 너비
                            mediaHeight={[600, 800, 1200, 1500, 1800][index % 5]} // 다양한 높이
                            blurDataURL={undefined}
                            contentType={post.contentType}
                            badge={post.badge}
                            onPostClick={() => {
                              // 콘텐츠 ID를 설정하여 상세 정보 가져오기
                              setSelectedContentId(item.id);
                            }}
                            // 로딩 상태 표시
                            className={
                              isSelected && isContentLoading ? 'opacity-50 pointer-events-none' : ''
                            }
                          />
                        </FeedGridItem>
                      );
                    })}
                  </FeedGrid>
                </div>
              )}
            </>
          )}

          {/* 콘텐츠 로딩 오버레이 */}
          {isContentLoading && selectedContentId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-zinc-900 rounded-lg p-6 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#eafd66] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white">{t.feed.loadingContent()}</span>
              </div>
            </div>
          )}

          {/* 무한스크롤 로더 */}
          {feedData.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <InfiniteScrollLoader
                hasNextPage={currentQuery.hasNextPage || false}
                isFetchingNextPage={currentQuery.isFetchingNextPage}
                fetchNextPage={currentQuery.fetchNextPage}
                error={currentQuery.error}
                onRetry={() => currentQuery.refetch()}
                className="mt-12"
              />
            </div>
          )}

          {/* 포스트 수 표시 */}
          {feedData.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mt-6">
                <div className="text-xs text-gray-500">
                  {t.feed.showingPosts({ count: feedData.length })}
                  {currentQuery.data?.pages?.[0] &&
                    (currentQuery.data.pages[0] as any)?.totalCount && (
                      <span>
                        {' '}
                        {t.feed.of({ total: (currentQuery.data.pages[0] as any).totalCount })}
                      </span>
                    )}
                </div>
              </div>
            </div>
          )}
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

