import React from 'react';
import deepEqual from 'fast-deep-equal';
import Link from 'next/link';

import Image from 'next/image';
import { Button } from '@decoded/ui';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';
import { ContentStatus } from '@/api/generated';
import { useChannelContentsSinglePage } from '@/domains/channels/hooks/useChannelContents';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { ContentType } from '@/lib/types/ContentType';
import { LoadingSkeleton } from '@/shared/components/loading/LoadingSkeleton';
import {
  useChannelContentFiltering,
  useChannelFilters,
} from '@/domains/channels/hooks/useChannelFilters';
import {
  getContentStatusStyles,
  isContentClickable,
  shouldShowHoverEffects,
  shouldShowPendingOverlay,
} from '@/lib/utils/contentStatusUtils';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { isValidImageUrl, handleImageError } from '@/lib/utils/imageUtils';
import { ProxiedImage } from '@/components/ProxiedImage';
import Masonry from '@/components/ReactBitsMasonry';
import CommunityHighlights from '@/domains/channels/components/highlights/CommunityHighlights';
import { HighlightItem } from '@/lib/types/highlightTypes';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { canPinContent } from '@/lib/utils/channelPermissions';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useChannelTranslation } from '@/lib/i18n/hooks';
import { toContentHref, getContentLinkProps } from '@/lib/routing';

import { ContentFiltersBar } from '../filters/ContentFiltersBar';
import { PinButton, PinIndicator } from '../../pin/PinButton';
import { ChannelPinnedSection } from '../../pin/ChannelPinnedSection';
import { useChannel } from '../../../hooks/useChannels';

// 개별 콘텐츠 아이템 컴포넌트 (고도화된 메모이제이션)
const ContentItemCard = React.memo<{
  item: ContentItem;
  channelId: string;
  channel?: any;
}>(({ item, channelId, channel }) => {
  const t = useCommonTranslation();
  // Link 컴포넌트가 네비게이션을 처리하므로 클릭 핸들러 제거

  // 상태별 스타일 가져오기
  const statusStyles = getContentStatusStyles(item.status);
  const showHoverEffects = shouldShowHoverEffects(item.status);
  const showPendingOverlay = shouldShowPendingOverlay(item.status);

  const hasLinkPreview = item.linkPreview;

  // 개발 모드에서만 로깅 (빈도 제한)
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.02) {
    // 2% 확률로만 로깅
    console.log('[ContentItemCard] Rendering item:', {
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      hasImage: !!item.imageUrl,
      imageUrl: item.imageUrl,
      hasLinkPreviewImage: !!item.linkPreview?.imageUrl,
      linkPreviewImageUrl: item.linkPreview?.imageUrl,
      linkPreviewTitle: item.linkPreview?.title,
      linkPreviewSiteName: item.linkPreview?.siteName,
      hasLinkPreview,
      aiSummary: item.aiSummary,
      aiQaListCount: item.aiQaList?.length || 0,
    });
  }

  // 이미지 URL 결정 (다운로드된 이미지 우선, 링크 프리뷰 이미지, 없으면 기본 이미지)
  const imageUrl = item.linkPreview?.imageUrl || item.imageUrl;
  const downloadedImageUrl = item.linkPreview?.downloadedImageUrl;

  // 이미지가 있는지 확인 (LinkPreviewCard와 동일한 로직)
  const hasValidImage = !!imageUrl;

  const linkProps = getContentLinkProps({ channelId, contentId: String(item.id) });

  return (
    <div
      className={`w-full h-full group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl cursor-pointer ${statusStyles.container}`}
      aria-label={`${item.title} 콘텐츠 보기`}
      onClick={() => {
        // TODO: 콘텐츠 모달 라우팅을 나중에 다시 활성화할 예정
        // 임시로 콘텐츠를 직접 열기 (URL 변경 없이)
        console.log('Channel modal content clicked:', item);
      }}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 w-full h-full`}
      >
        {/* Pin Button - hover 시 표시 */}
        {channel && (
          <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <PinButton
              contentId={String(item.id)}
              channelId={channelId}
              channel={channel}
              size="sm"
              className="backdrop-blur-sm"
            />
          </div>
        )}
        {/* 이미지가 있는 경우: 이미지만 전체 표시 */}
        {hasValidImage ? (
          <ProxiedImage
            src={imageUrl}
            downloadedSrc={downloadedImageUrl} // 백엔드에서 다운로드한 이미지 URL 사용
            alt={item.title}
            width={400}
            height={256}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              statusStyles.image ? statusStyles.image : 'group-hover:scale-105'
            }`}
            quality={95}
            loading="lazy"
            imageType="news"
            onError={() => {
              console.error('[ContentItemCard] Image failed to load:', imageUrl);
            }}
          />
        ) : (
          /* 이미지가 없는 경우: 텍스트 fallback */
          <div
            className={`w-full h-full min-h-[200px] bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 flex items-center justify-center p-6 ${
              statusStyles.image || ''
            }`}
          >
            {/* Pending 상태가 아닌 경우에만 텍스트 표시 */}
            {item.status !== 'pending' && (
              <div className="text-center">
                {/* 링크 콘텐츠인 경우 링크 프리뷰 정보 우선 표시 */}
                {item.type === 'link' && item.linkPreview ? (
                  <>
                    <h4 className="text-white font-semibold text-lg mb-2">
                      {item.linkPreview.title}
                    </h4>
                    <p className="text-zinc-300 text-sm mb-3 line-clamp-2">
                      {item.linkPreview.description}
                    </p>
                    {item.linkPreview.siteName && (
                      <div className="mb-3">
                        <span className="text-zinc-400 text-xs font-medium">
                          {item.linkPreview.siteName}
                        </span>
                      </div>
                    )}
                    {item.linkUrl && (
                      <div className="mt-3">
                        <span className="text-blue-400 text-xs break-all">{item.linkUrl}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-zinc-300 text-sm">{item.description}</p>
                    {item.linkUrl && (
                      <div className="mt-3">
                        <span className="text-blue-400 text-xs break-all">{item.linkUrl}</span>
                      </div>
                    )}
                    {/* 링크 프리뷰 정보 표시 */}
                    {item.linkPreview?.title && (
                      <div className="mt-2">
                        <p className="text-zinc-400 text-xs font-medium">
                          {item.linkPreview.title}
                        </p>
                      </div>
                    )}
                    {item.linkPreview?.siteName && (
                      <div className="mt-1">
                        <p className="text-zinc-500 text-xs">{item.linkPreview.siteName}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pending 상태 오버레이 (중앙 배치) */}
        {item.status === 'pending' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 group">
            <div
              className="bg-yellow-500/90 text-white px-2 py-1.5 rounded-full font-medium flex items-center space-x-1 cursor-help relative shadow-lg"
              title={t.status.pending()}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">{t.status.pending()}</span>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-zinc-900/95 text-white text-xs rounded-lg shadow-xl border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div className="text-center">
                  <div className="font-medium mb-1">{t.status.pending()}</div>
                  <div className="text-zinc-400">{t.status.processing()}</div>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-zinc-900/95"></div>
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 배지 */}
        {item.category && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-zinc-800/80 text-gray-400 text-xs px-2 py-1 rounded-full font-medium">
              {item.category}
            </div>
          </div>
        )}

        {/* Overlay on hover (호버 효과가 활성화된 경우만) */}
        {showHoverEffects && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end z-10">
            <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              {/* 타이틀 표시 */}
              <h4 className="text-white font-semibold text-sm mb-2">
                {item.linkPreview?.title || item.title}
              </h4>

              {/* AI 생성 요약 표시 (이미지가 있는 경우에만 호버에서 표시) */}
              {hasValidImage && item.aiSummary && (
                <div className="mb-2">
                  <p className="text-[#EAFD66] text-xs line-clamp-2 font-medium">
                    {item.aiSummary}
                  </p>
                </div>
              )}

              {/* 링크 메타데이터 표시 */}
              {item.linkPreview?.siteName && (
                <p className="text-zinc-300 text-xs mb-1">{item.linkPreview.siteName}</p>
              )}

              {/* 메타데이터 표시 */}
              {item.metadata?.game && <p className="text-blue-400 text-xs">{item.metadata.game}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ContentItemCard.displayName = 'ContentItemCard';

// 메인 컴포넌트 (메모이제이션)
export const ChannelModalContent = React.memo<{
  currentFilters?: {
    dataTypes: string[];
    categories: string[];
    tags: string[];
    statuses?: string[];
  };
  channelId?: string; // URL에서 전달받는 채널 ID
  onFilterChange?: (filters: any) => void;
}>(({ currentFilters, channelId: propChannelId, onFilterChange }) => {
  const t = useCommonTranslation();
  const { states } = useChannelTranslation();
  const openContentModal = useContentModalStore((state) => state.openModal);
  const selectedChannelId = useChannelModalStore((state) => state.selectedChannelId);
  const selectedChannel = useChannelModalStore((state) => state.selectedChannel);
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);

  // 채널 ID 결정: Props > selectedChannelId > selectedChannel.id 순서로 우선순위
  const channelId = propChannelId || selectedChannelId || selectedChannel?.id || '';

  // 채널 정보 가져오기
  const { data: channelData } = useChannel(channelId);

  // 채널의 실제 필터 데이터 가져오기
  const { dataTypes, categories, isLoading: isFiltersLoading } = useChannelFilters(channelId);

  // 필터가 있으면 필터링된 콘텐츠 사용, 없으면 기본 콘텐츠 사용
  const shouldUseFiltering =
    currentFilters &&
    (currentFilters.dataTypes.length > 0 ||
      currentFilters.categories.length > 0 ||
      currentFilters.tags.length > 0 ||
      (currentFilters.statuses &&
        currentFilters.statuses.length > 0 &&
        currentFilters.statuses.length < 3)); // 3개 모두 선택되지 않은 경우 필터링으로 간주

  // 기본 콘텐츠 조회 (필터가 없을 때)
  const {
    data: allContentItems,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useChannelContentsSinglePage({
    channelId: channelId,
    limit: 25,
    enabled: !!channelId && !shouldUseFiltering,
    enableSmartPolling: false, // 폴링 비활성화
  });

  // 필터링된 콘텐츠 조회 (필터가 있을 때)
  const {
    filteredContent,
    totalCount,
    filteredCount,
    isLoading: isLoadingFiltered,
    error: errorFiltered,
    refetch: refetchFiltered,
  } = useChannelContentFiltering(channelId, {
    dataTypes: currentFilters?.dataTypes || [],
    categories: currentFilters?.categories || [],
    tags: currentFilters?.tags || [],
    statuses: currentFilters?.statuses || ['active'],
  });

  // 사용할 데이터 결정
  const contentItems = shouldUseFiltering ? filteredContent : allContentItems;
  const isLoading = shouldUseFiltering ? isLoadingFiltered : isLoadingAll;
  const error = shouldUseFiltering ? errorFiltered : errorAll;
  const refetch = shouldUseFiltering ? refetchFiltered : refetchAll;

  // 새로고침 버튼을 위한 로컬 상태 관리
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // 개발 모드에서만 로깅 (빈도 제한)
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) {
    // 1% 확률로만 로깅
    console.log('[ChannelModalContent] State:', {
      channelId,
      isLoading,
      hasError: !!error,
      contentItemsCount: contentItems?.length || 0,
      contentItems: contentItems,
    });
  }

  // 콘텐츠 아이템 클릭 핸들러는 Link 컴포넌트가 처리하므로 제거
  // 기존 모달 스토어는 외부 링크나 특별한 경우에만 사용

  // 콘텐츠 업로드 모달 열기 핸들러 (메모이제이션)
  const handleAddContent = React.useCallback(() => {
    if (channelId) {
      openContentUploadModal(channelId);
    }
  }, [channelId, openContentUploadModal]);

  // 하이라이트 클릭 핸들러 (메모이제이션)
  const handleHighlightClick = React.useCallback(
    (highlight: HighlightItem) => {
      if (highlight.clickAction.type === 'content_modal' && highlight.clickAction.data) {
        // ContentItem 데이터로 콘텐츠 모달 열기
        openContentModal(highlight.clickAction.data as ContentItem);
      }
      // 향후 다른 action type들 (external_link, internal_link) 추가 가능
    },
    [openContentModal],
  );

  // 표시할 콘텐츠 결정 (실제 API 데이터만 사용)
  const displayContentItems = React.useMemo(() => {
    return contentItems || [];
  }, [contentItems]);

  // 리렌더링 방지를 위한 이전 값 참조
  const prevDisplayContentItemsRef = React.useRef<ContentItem[] | null>(null);

  // 최종 메모이제이션된 표시 콘텐츠
  const finalDisplayContentItems = React.useMemo(() => {
    // 이전 값과 깊은 비교
    if (
      prevDisplayContentItemsRef.current &&
      deepEqual(prevDisplayContentItemsRef.current, displayContentItems)
    ) {
      return prevDisplayContentItemsRef.current;
    }

    // 새로운 값 저장
    prevDisplayContentItemsRef.current = displayContentItems;
    return displayContentItems;
  }, [displayContentItems]);

  // PENDING 상태 콘텐츠 개수 계산
  const pendingCount = React.useMemo(() => {
    return (
      contentItems?.filter((item: ContentItem) => item.status === ContentStatus.PENDING).length || 0
    );
  }, [contentItems]);

  // 개발 모드에서만 로깅 (빈도 제한)
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) {
    // 1% 확률로만 로깅
    console.log('[ChannelModalContent] Display items:', {
      displayContentItemsCount: finalDisplayContentItems.length,
      displayContentItems: finalDisplayContentItems,
      pendingCount,
    });
  }

  // 로딩 상태 - 스켈레톤 사용
  if (isLoading) {
    return (
      <div className="h-full p-6">
        <LoadingSkeleton kind="grid" rows={4} className="w-full" />
      </div>
    );
  }

  // 에러 상태 - ChannelMainContent와 동일한 패턴
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <svg
            className="w-16 h-16 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.664 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div className="text-red-500 text-lg mb-2">{states.loadError()}</div>
          <div className="text-zinc-500">{states.loadErrorSubtitle()}</div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 rounded-lg transition-colors duration-200"
          >
            {t.actions.refresh()}
          </button>
        </div>
      </div>
    );
  }

  const handleDataTypesChange = (dataTypes: string[]) => {
    onFilterChange?.({ ...currentFilters, dataTypes });
  };

  const handleCategoriesChange = (categories: string[]) => {
    onFilterChange?.({ ...currentFilters, categories });
  };

  return (
    <div className="relative h-full overflow-hidden bg-black">
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="pb-12">
          {/* Community Highlights */}
          <CommunityHighlights channelId={channelId} onItemClick={handleHighlightClick} />

          {/* Header */}
          <div className="flex items-center justify-between pt-2 px-4">
            <div>
              {/* 콘텐츠 개수 및 상태 필터 */}
              <div className="flex items-center gap-3 mb-2">
                {/* <p className="text-gray-500">
              {totalCount || 0} {t.ui.contentItems()}
            </p> */}

                {/* 상태 필터 버튼들 */}
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const newFilters = { ...currentFilters, statuses: ['active'] };
                      onFilterChange?.(newFilters);
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentFilters?.statuses?.includes('active') &&
                      currentFilters.statuses.length === 1
                        ? 'bg-zinc-700 text-gray-300'
                        : 'bg-zinc-800/50 text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    {t.ui.active()}
                  </button>
                  <button
                    onClick={() => {
                      const newFilters = { ...currentFilters, statuses: ['pending'] };
                      onFilterChange?.(newFilters);
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentFilters?.statuses?.includes('pending') &&
                      currentFilters.statuses.length === 1
                        ? 'bg-zinc-700 text-gray-300'
                        : 'bg-zinc-800/50 text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    {t.status.pending()}
                  </button>
                  <button
                    onClick={() => {
                      const newFilters = { ...currentFilters, statuses: ['active', 'pending'] };
                      onFilterChange?.(newFilters);
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentFilters?.statuses?.length !== 1
                        ? 'bg-zinc-700 text-gray-300'
                        : 'bg-zinc-800/50 text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    {t.ui.all()}
                  </button>
                </div>
              </div>

              {/* PENDING 상태 콘텐츠 개수 표시 */}
              {pendingCount > 0 && (
                <button
                  onClick={() => {
                    // Toggle pending filter
                    const newFilters =
                      currentFilters && currentFilters.statuses?.includes('pending')
                        ? { ...currentFilters, statuses: ['active'] }
                        : { ...currentFilters, statuses: ['pending'] };
                    // Note: This would need to be connected to the actual filter change handler
                    console.log('Toggle pending filter:', newFilters);
                  }}
                  className="text-sm text-yellow-400 hover:text-yellow-300 mt-1 flex items-center space-x-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {pendingCount} {t.ui.contentItems()} {t.status.processing()}
                  </span>
                </button>
              )}

              {/* 데이터 상태 표시 */}
              {!isLoading && !error && finalDisplayContentItems.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {shouldUseFiltering ? t.feed.noPostsFound() : t.feed.noPostsFound()}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* 새로고침 버튼 */}
              <button
                onClick={async () => {
                  if (isRefreshing) return; // 중복 클릭 방지

                  try {
                    setIsRefreshing(true);
                    console.log('[ChannelModalContent] Refreshing data...');

                    // React Query의 refetch는 Promise를 반환합니다
                    const result = await refetch();

                    if (result?.error) {
                      console.error('[ChannelModalContent] Refetch returned error:', result.error);
                    } else {
                      console.log('[ChannelModalContent] Data refreshed successfully');
                    }
                  } catch (error) {
                    console.error('[ChannelModalContent] Failed to refresh data:', error);
                    // 에러가 발생해도 사용자에게 피드백 제공
                  } finally {
                    setIsRefreshing(false);
                  }
                }}
                disabled={isLoading || isRefreshing}
                className="px-1.5 py-1 md:px-3 md:py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed text-gray-400 hover:text-white rounded-md transition-all duration-200 flex items-center space-x-1 md:space-x-1.5 border border-zinc-700 hover:border-zinc-600 text-xs md:text-sm"
                title={isLoading || isRefreshing ? t.status.loading() : t.actions.refresh()}
              >
                <svg
                  className={`w-3 h-3 ${isLoading || isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{isLoading || isRefreshing ? t.status.loading() : t.actions.refresh()}</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="px-4">
            <ContentFiltersBar
              selectedDataTypes={currentFilters?.dataTypes || []}
              selectedCategories={currentFilters?.categories || []}
              onDataTypesChange={handleDataTypesChange}
              onCategoriesChange={handleCategoriesChange}
              dataTypes={dataTypes}
              categories={categories}
              isLoading={isFiltersLoading}
            />
          </div>

          {/* Masonry Grid Container */}
          <div className="px-4 pb-6">
            {finalDisplayContentItems.length > 0 ? (
              <Masonry
                items={finalDisplayContentItems.map((item: ContentItem, idx: number) => {
                  // 이미지가 있는 경우 고정 높이, 없는 경우 텍스트에 맞는 높이
                  const imageUrl = item.linkPreview?.imageUrl || item.imageUrl;
                  const isWebPageUrl =
                    imageUrl &&
                    (imageUrl.includes('youtube.com') ||
                      imageUrl.includes('instagram.com') ||
                      imageUrl.includes('blog.naver.com') ||
                      imageUrl.includes('khan.co.kr') ||
                      imageUrl.includes('watch?v=') ||
                      imageUrl.includes('/shorts/') ||
                      imageUrl.includes('/article/'));
                  const hasValidImage = imageUrl && !isWebPageUrl;

                  // 이미지가 있으면 더 큰 높이, 없으면 최소 높이 보장
                  const height = hasValidImage ? 280 : 220; // 이미지: 280px, 텍스트: 220px (더 컴팩트한 높이)

                  return {
                    id: item.id.toString(),
                    img: item.imageUrl || '',
                    height: height,
                    title: item.title,
                    category: item.category,
                    type: item.type,
                    status: item.status,
                  };
                })}
                ease="power3.out"
                duration={0.4}
                stagger={0.03}
                animateFrom="bottom"
                scaleOnHover={false}
                hoverScale={1.0}
                blurToFocus={false}
                colorShiftOnHover={false}
                className="w-full min-h-[400px]"
                onItemClick={(item) => {
                  const contentItem = finalDisplayContentItems.find(
                    (ci: ContentItem) => ci.id.toString() === item.id,
                  );
                  if (contentItem) {
                    // 작가 정보를 포함한 콘텐츠 데이터 생성
                    const contentWithAuthor = {
                      ...contentItem,
                      // 채널 소유자를 작가로 설정
                      provider_id: channelData?.owner_id,
                      author: channelData?.owner_id,
                      // 채널 ID와 생성 시간 추가
                      channel_id: channelId,
                      date: contentItem.date || channelData?.created_at || new Date().toISOString(),
                    };

                    console.log('🎯 [ChannelModalContent] Content clicked with author info:', {
                      contentId: contentWithAuthor.id,
                      title: contentWithAuthor.title,
                      provider_id: contentWithAuthor.provider_id,
                      author: contentWithAuthor.author,
                      channel_id: contentWithAuthor.channel_id,
                      date: contentWithAuthor.date,
                    });

                    // Zustand store를 사용해서 모달 열기
                    const { openModal } = useContentModalStore.getState();
                    openModal(contentWithAuthor, channelId);
                  }
                }}
                renderItem={(gridItem) => {
                  const contentItem = finalDisplayContentItems.find(
                    (ci: ContentItem) => ci.id.toString() === gridItem.id,
                  );
                  if (!contentItem) return null;

                  return (
                    <div className="w-full h-full">
                      <ContentItemCard
                        item={contentItem}
                        channelId={channelId}
                        channel={channelData}
                      />
                    </div>
                  );
                }}
              />
            ) : (
              // 빈 상태 UI - ChannelMainContent와 동일한 패턴
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <svg
                    className="w-16 h-16 text-zinc-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <div className="text-zinc-400 text-lg mb-2">{states.empty()}</div>
                  <div className="text-zinc-500">{states.emptySubtitle()}</div>
                  <button
                    onClick={handleAddContent}
                    className="mt-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>{t.create.createNewContent()}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChannelModalContent.displayName = 'ChannelModalContent';
