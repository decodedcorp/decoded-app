import React from 'react';
import Image from 'next/image';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';
import { ContentStatus } from '@/api/generated';
import { useChannelContentsSinglePage } from '@/domains/channels/hooks/useChannelContents';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { ContentType } from '@/api/generated';
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
import deepEqual from 'fast-deep-equal';

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

  // 이미지 URL 결정 (링크 프리뷰 이미지 우선, 없으면 기본 이미지)
  const imageUrl = item.linkPreview?.imageUrl || item.imageUrl;

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
            alt={item.title}
            width={400}
            height={256}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              statusStyles.image ? statusStyles.image : 'group-hover:scale-105'
            }`}
            quality={95}
            loading="lazy"
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
export const ChannelModalContent = React.memo(() => {
  const openContentModal = useContentModalStore((state) => state.openModal);
  const channelId = useChannelModalStore((state) => state.selectedChannelId);
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);

  // 채널 콘텐츠 조회 (폴링 비활성화)
  const {
    data: contentItems,
    isLoading,
    error,
    refetch,
  } = useChannelContentsSinglePage({
    channelId: channelId || '',
    limit: 25,
    enabled: !!channelId,
    enableSmartPolling: false, // 폴링 비활성화
  });

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

  // Enhanced mock data for content items with different sizes and types (fallback)
  const mockContentItems: ContentItem[] = React.useMemo(
    () => [
      // Large featured items with images
      {
        id: 1,
        type: 'image',
        title: 'Modern Architecture Collection',
        height: 'h-96',
        width: 'col-span-2',
        category: 'Featured',
        imageUrl:
          'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
        description: 'Stunning modern architecture from around the world',
        author: 'Alex Chen',
        date: '2024-01-15',
        likes: 1247,
        views: 8923,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 2,
        type: 'video',
        title: 'Design Process Documentary',
        height: 'h-80',
        width: 'col-span-1',
        category: 'Video',
        imageUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop',
        description: 'Behind the scenes of creative design process',
        author: 'Sarah Kim',
        date: '2024-01-12',
        likes: 892,
        views: 5678,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 3,
        type: 'image',
        title: 'Minimalist Interior Design',
        height: 'h-64',
        width: 'col-span-1',
        category: 'Interior',
        imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        description: 'Clean and modern interior spaces',
        author: 'Emma Davis',
        date: '2024-01-08',
        likes: 678,
        views: 3456,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 4,
        type: 'text',
        title: 'Design Principles Guide',
        height: 'h-48',
        width: 'col-span-1',
        category: 'Guide',
        description: 'Essential principles for effective design',
        author: 'Mike Johnson',
        date: '2024-01-10',
        likes: 456,
        views: 2345,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 5,
        type: 'image',
        title: 'Color Theory in Practice',
        height: 'h-72',
        width: 'col-span-2',
        category: 'Color',
        imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=500&fit=crop',
        description: 'Understanding color psychology and application',
        author: 'David Park',
        date: '2024-01-05',
        likes: 945,
        views: 6789,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 6,
        type: 'image',
        title: 'Typography Showcase',
        height: 'h-56',
        width: 'col-span-1',
        category: 'Typography',
        imageUrl:
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        description: 'Beautiful typography examples and techniques',
        author: 'Lisa Wang',
        date: '2024-01-03',
        likes: 567,
        views: 3456,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 7,
        type: 'video',
        title: 'UI/UX Design Trends 2024',
        height: 'h-64',
        width: 'col-span-2',
        category: 'Trends',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
        description: 'Latest trends in user interface and experience design',
        author: 'Tom Chen',
        date: '2024-01-01',
        likes: 1234,
        views: 7890,
        status: ContentStatus.ACTIVE,
      },
      {
        id: 8,
        type: 'image',
        title: 'Brand Identity Design',
        height: 'h-48',
        width: 'col-span-1',
        category: 'Branding',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop',
        description: 'Creating memorable brand identities',
        author: 'Anna Lee',
        date: '2023-12-28',
        likes: 789,
        views: 4567,
        status: ContentStatus.ACTIVE,
      },
    ],
    [],
  );

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

  // 표시할 콘텐츠 결정 (고도화된 메모이제이션)
  const displayContentItems = React.useMemo(() => {
    if (contentItems && contentItems.length > 0) {
      return contentItems;
    }
    return mockContentItems;
  }, [contentItems, mockContentItems]);

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
            <p className="text-zinc-400">Demo content</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to load content</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
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
          <p className="text-zinc-400">
            {finalDisplayContentItems?.length || 0} items •{' '}
            {contentItems ? 'Live data' : 'Demo content'}
          </p>
          {/* PENDING 상태 콘텐츠 개수 표시 */}
          {pendingCount > 0 && (
            <p className="text-sm text-yellow-400 mt-1">{pendingCount} items being processed</p>
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
    </div>
  );
});

ChannelModalContent.displayName = 'ChannelModalContent';
