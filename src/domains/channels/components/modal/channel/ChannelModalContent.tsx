import React from 'react';
import deepEqual from 'fast-deep-equal';

import Image from 'next/image';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';
import { ContentStatus } from '@/api/generated';
import { useChannelContentsSinglePage } from '@/domains/channels/hooks/useChannelContents';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { ContentType } from '@/api/generated';
import { useChannelContentFiltering } from '@/domains/channels/hooks/useChannelFilters';
import {
  getContentStatusStyles,
  isContentClickable,
  shouldShowLoadingSpinner,
  shouldShowHoverEffects,
} from '@/lib/utils/contentStatusUtils';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { isValidImageUrl, handleImageError } from '@/lib/utils/imageUtils';
import { ProxiedImage } from '@/components/ProxiedImage';
import Masonry from '@/components/ReactBitsMasonry';

// 개별 콘텐츠 아이템 컴포넌트 (고도화된 메모이제이션)
const ContentItemCard = React.memo<{
  item: ContentItem;
  onItemClick: (item: ContentItem) => void;
}>(({ item, onItemClick }) => {
  const handleClick = React.useCallback(() => {
    // 클릭 가능한 상태가 아닌 경우 클릭 제한
    if (!isContentClickable(item.status)) {
      return;
    }

    // 모든 콘텐츠 타입에 대해 모달 열기
    onItemClick(item);
  }, [item, onItemClick]);

  // 상태별 스타일 가져오기
  const statusStyles = getContentStatusStyles(item.status);
  const showLoadingSpinner = shouldShowLoadingSpinner(item.status);
  const showHoverEffects = shouldShowHoverEffects(item.status);

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

  // 웹페이지 URL이 아닌 실제 이미지인지 확인
  const isWebPageUrl =
    imageUrl &&
    (imageUrl.includes('youtube.com') ||
      imageUrl.includes('instagram.com') ||
      imageUrl.includes('blog.naver.com') ||
      imageUrl.includes('khan.co.kr') ||
      imageUrl.includes('watch?v=') ||
      imageUrl.includes('/shorts/') ||
      imageUrl.includes('/article/'));

  // 실제 이미지가 있는지 확인
  const hasValidImage = imageUrl && !isWebPageUrl;

  return (
    <div
      className={`w-full h-full group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${statusStyles.container}`}
      onClick={handleClick}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 w-full h-full`}
      >
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
            fallbackSrc=""
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
                        📄 {item.linkPreview.siteName}
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
                      <p className="text-zinc-400 text-xs font-medium">{item.linkPreview.title}</p>
                    </div>
                  )}
                  {item.linkPreview?.siteName && (
                    <div className="mt-1">
                      <p className="text-zinc-500 text-xs">📄 {item.linkPreview.siteName}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Pending 상태 배지 */}
        {item.status === 'pending' && (
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-yellow-500/90 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Pending</span>
            </div>
          </div>
        )}

        {/* 카테고리 배지 */}
        {item.category && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
              {item.category}
            </div>
          </div>
        )}

        {/* Overlay on hover (호버 효과가 활성화된 경우만) */}
        {showHoverEffects && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end z-10">
            <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              {/* 링크 콘텐츠인 경우 링크 프리뷰 정보 우선 표시 */}
              {item.type === 'link' && item.linkPreview ? (
                <>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {item.linkPreview.title}
                  </h4>
                  {item.linkPreview.description && (
                    <p className="text-zinc-300 text-xs line-clamp-2 mb-2">
                      {item.linkPreview.description}
                    </p>
                  )}
                  {item.linkPreview.siteName && (
                    <p className="text-zinc-400 text-xs mb-2">📄 {item.linkPreview.siteName}</p>
                  )}
                </>
              ) : (
                <>
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-zinc-300 text-xs line-clamp-2 mb-2">{item.description}</p>
                  )}
                </>
              )}

              {/* AI 생성 요약 표시 */}
              {item.aiSummary && (
                <div className="mb-2">
                  <p className="text-green-300 text-xs line-clamp-2 font-medium">
                    🤖 {item.aiSummary}
                  </p>
                </div>
              )}

              {/* 링크 프리뷰 메타데이터 표시 (링크 콘텐츠가 아닌 경우) */}
              {item.type !== 'link' && item.linkPreview?.siteName && (
                <p className="text-zinc-400 text-xs">📄 {item.linkPreview.siteName}</p>
              )}

              {/* 메타데이터 표시 */}
              {item.metadata?.game && (
                <p className="text-blue-300 text-xs">🎮 {item.metadata.game}</p>
              )}
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {showLoadingSpinner && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
              <p className="text-white text-sm font-medium">{statusStyles.text}</p>
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
  };
  channelId?: string; // URL에서 전달받는 채널 ID
}>(({ currentFilters, channelId: propChannelId }) => {
  const openContentModal = useContentModalStore((state) => state.openModal);
  const selectedChannelId = useChannelModalStore((state) => state.selectedChannelId);
  const selectedChannel = useChannelModalStore((state) => state.selectedChannel);
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);

  // 채널 ID 결정: Props > selectedChannelId > selectedChannel.id 순서로 우선순위
  const channelId = propChannelId || selectedChannelId || selectedChannel?.id || '';

  // 필터가 있으면 필터링된 콘텐츠 사용, 없으면 기본 콘텐츠 사용
  const shouldUseFiltering = currentFilters && (
    currentFilters.dataTypes.length > 0 ||
    currentFilters.categories.length > 0 ||
    currentFilters.tags.length > 0 ||
    (currentFilters.statuses?.length > 0 && currentFilters.statuses.length < 3) // 3개 모두 선택되지 않은 경우 필터링으로 간주
  );

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
  } = useChannelContentFiltering(
    channelId,
    currentFilters || { dataTypes: [], categories: [], tags: [], statuses: ['active'] }
  );

  // 사용할 데이터 결정
  const contentItems = shouldUseFiltering ? filteredContent : allContentItems;
  const isLoading = shouldUseFiltering ? isLoadingFiltered : isLoadingAll;
  const error = shouldUseFiltering ? errorFiltered : errorAll;
  const refetch = shouldUseFiltering ? refetchFiltered : refetchAll;

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

  // 콘텐츠 아이템 클릭 핸들러 (메모이제이션)
  const handleItemClick = React.useCallback(
    (item: ContentItem) => {
      // URL 타입이면 콘텐츠 모달 열기
      if (item.type === 'link') {
        openContentModal(item);
      } else {
        // 다른 타입들은 기존 로직 유지
        openContentModal(item);
      }
    },
    [openContentModal],
  );

  // 콘텐츠 업로드 모달 열기 핸들러 (메모이제이션)
  const handleAddContent = React.useCallback(() => {
    if (channelId) {
      openContentUploadModal(channelId);
    }
  }, [channelId, openContentUploadModal]);

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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Channel Content</h3>
            <p className="text-zinc-400">Loading content...</p>
          </div>
        </div>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <div className="h-64 bg-zinc-800/50 border border-zinc-700/50 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Channel Content</h3>
            <p className="text-zinc-400">Error loading content</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Content</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            There was an error loading the channel content. Please try again.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left max-w-2xl mx-auto">
              <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-400">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-3 bg-zinc-900/50 rounded text-xs text-red-400 overflow-auto">
                {error.message || 'Unknown error'}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Channel Content</h3>
          
          {/* 필터 상태 표시 */}
          {shouldUseFiltering && (
            <div className="flex items-center gap-2 mb-2">
              <p className="text-zinc-400">
                {finalDisplayContentItems?.length || 0} of {totalCount || 0} items
              </p>
              <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full">
                Filtered
              </span>
            </div>
          )}
          
          {!shouldUseFiltering && (
            <p className="text-zinc-400">{finalDisplayContentItems?.length || 0} items</p>
          )}
          
          {/* 활성 필터 표시 */}
          {shouldUseFiltering && currentFilters && (
            <div className="flex flex-wrap gap-1 mt-1">
              {currentFilters.dataTypes.length > 0 && (
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                  {currentFilters.dataTypes.length} data type{currentFilters.dataTypes.length > 1 ? 's' : ''}
                </span>
              )}
              {currentFilters.categories.length > 0 && (
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                  {currentFilters.categories.length} categor{currentFilters.categories.length > 1 ? 'ies' : 'y'}
                </span>
              )}
              {currentFilters.tags.length > 0 && (
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                  {currentFilters.tags.length} tag{currentFilters.tags.length > 1 ? 's' : ''}
                </span>
              )}
              {currentFilters.statuses?.length > 0 && currentFilters.statuses.length < 3 && (
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                  {currentFilters.statuses.join(', ')} status
                </span>
              )}
            </div>
          )}
          
          {/* PENDING 상태 콘텐츠 개수 표시 */}
          {pendingCount > 0 && (
            <p className="text-sm text-yellow-400 mt-1">{pendingCount} items being processed</p>
          )}
          
          {/* 데이터 상태 표시 */}
          {!isLoading && !error && finalDisplayContentItems.length === 0 && (
            <p className="text-sm text-blue-400 mt-1">
              {shouldUseFiltering ? 'No content matches current filters' : 'No content available'}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* 새로고침 버튼 */}
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-500 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 border border-zinc-700 hover:border-zinc-600 font-medium"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
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
            <span>Refresh</span>
          </button>

          {/* 콘텐츠 추가 버튼 */}
          <button
            onClick={handleAddContent}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-3 border border-zinc-700 hover:border-zinc-600 hover:scale-[1.02] font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Content</span>
          </button>
        </div>
      </div>

      {/* Masonry Grid Container */}
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
            const height = hasValidImage ? 320 : 240; // 이미지: 320px, 텍스트: 240px (최소 높이 보장)

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
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.98}
          blurToFocus={true}
          colorShiftOnHover={false}
          className="w-full min-h-[600px]"
          onItemClick={(item) => {
            const contentItem = finalDisplayContentItems.find(
              (ci: ContentItem) => ci.id.toString() === item.id,
            );
            if (contentItem) {
              handleItemClick(contentItem);
            }
          }}
          renderItem={(gridItem) => {
            const contentItem = finalDisplayContentItems.find(
              (ci: ContentItem) => ci.id.toString() === gridItem.id,
            );
            if (!contentItem) return null;

            return (
              <div className="w-full h-full">
                <ContentItemCard item={contentItem} onItemClick={handleItemClick} />
              </div>
            );
          }}
        />
      ) : (
        // 빈 상태 UI
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800/50 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-zinc-600"
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
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Content Yet</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            This channel doesn't have any content yet. Be the first to add something!
          </p>
          <button
            onClick={handleAddContent}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-3 mx-auto hover:scale-[1.02] font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add First Content</span>
          </button>
        </div>
      )}
    </div>
  );
});

ChannelModalContent.displayName = 'ChannelModalContent';
