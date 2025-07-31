import React from 'react';
import Image from 'next/image';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';
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

// 개별 콘텐츠 아이템 컴포넌트 (메모이제이션)
const ContentItemCard = React.memo<{
  item: ContentItem;
  onItemClick: (item: ContentItem) => void;
}>(({ item, onItemClick }) => {
  const handleClick = React.useCallback(() => {
    // 클릭 가능한 상태가 아닌 경우 클릭 제한
    if (!isContentClickable(item.status)) {
      return;
    }

    // 링크 콘텐츠인 경우 새 탭에서 URL 열기
    if (item.linkUrl) {
      window.open(item.linkUrl, '_blank');
    } else {
      onItemClick(item);
    }
  }, [item, onItemClick]);

  // 상태별 스타일 가져오기
  const statusStyles = getContentStatusStyles(item.status);
  const showLoadingSpinner = shouldShowLoadingSpinner(item.status);
  const showHoverEffects = shouldShowHoverEffects(item.status);

  if (process.env.NODE_ENV === 'development') {
    console.log('[ContentItemCard] Rendering item:', {
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      hasImage: !!item.imageUrl,
      imageUrl: item.imageUrl,
    });
  }

  return (
    <div
      className={`break-inside-avoid mb-4 group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${statusStyles.container}`}
      onClick={handleClick}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 ${
          item.height || 'h-64'
        }`}
      >
        {/* Content based on type */}
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className={`object-cover transition-transform duration-300 ${
              statusStyles.image ? statusStyles.image : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        )}

        {!item.imageUrl && (
          <div
            className={`w-full h-full bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 flex items-center justify-center p-6 ${
              statusStyles.image || ''
            }`}
          >
            <div className="text-center">
              <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-zinc-300 text-sm">{item.description}</p>
              {item.linkUrl && (
                <div className="mt-3">
                  <span className="text-blue-400 text-xs break-all">{item.linkUrl}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay on hover (호버 효과가 활성화된 경우만) */}
        {showHoverEffects && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end z-10">
            <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-zinc-300 text-xs line-clamp-2">{item.description}</p>
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

  // API에서 채널 콘텐츠 조회 (이미 ContentItem으로 변환됨)
  const {
    data: contentItems,
    isLoading,
    error,
  } = useChannelContentsSinglePage({
    channelId: channelId || '',
    limit: 25,
    enabled: !!channelId,
  });

  if (process.env.NODE_ENV === 'development') {
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
      },
    ],
    [],
  );

  // 콘텐츠 아이템 클릭 핸들러 (메모이제이션)
  const handleItemClick = React.useCallback(
    (item: ContentItem) => {
      openContentModal(item);
    },
    [openContentModal],
  );

  // 콘텐츠 업로드 모달 열기 핸들러 (메모이제이션)
  const handleAddContent = React.useCallback(() => {
    if (channelId) {
      openContentUploadModal(channelId);
    }
  }, [channelId, openContentUploadModal]);

  // 표시할 콘텐츠 결정 (메모이제이션)
  const displayContentItems = React.useMemo(() => {
    if (contentItems && contentItems.length > 0) {
      return contentItems;
    }
    return mockContentItems;
  }, [contentItems, mockContentItems]);

  if (process.env.NODE_ENV === 'development') {
    console.log('[ChannelModalContent] Display items:', {
      displayContentItemsCount: displayContentItems.length,
      displayContentItems: displayContentItems,
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
            {displayContentItems.length} items • {contentItems ? 'Live data' : 'Demo content'}
          </p>
        </div>
        <button
          onClick={handleAddContent}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-3 border border-zinc-700 hover:border-zinc-600 hover:scale-[1.02] font-medium shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Content</span>
        </button>
      </div>

      {/* Masonry Grid Container */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
        {displayContentItems.map((item: ContentItem) => (
          <ContentItemCard key={item.id} item={item} onItemClick={handleItemClick} />
        ))}
      </div>
    </div>
  );
});

ChannelModalContent.displayName = 'ChannelModalContent';
