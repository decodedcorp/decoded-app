import React from 'react';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';
import { useChannelContentsSinglePage } from '@/domains/channels/hooks/useChannelContents';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { ContentType } from '@/api/generated';

export function ChannelModalContent() {
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

  // Enhanced mock data for content items with different sizes and types (fallback)
  const mockContentItems: ContentItem[] = [
    // Large featured items with images
    {
      id: 1,
      type: 'image',
      title: 'Modern Architecture Collection',
      height: 'h-96',
      width: 'col-span-2',
      category: 'Featured',
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=500&fit=crop',
      description: 'Beautiful typography examples and usage',
    },
    {
      id: 7,
      type: 'video',
      title: 'UX Design Workshop',
      height: 'h-64',
      width: 'col-span-1',
      category: 'UX',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      description: 'Interactive UX design workshop session',
    },
    {
      id: 8,
      type: 'image',
      title: 'Brand Identity Collection',
      height: 'h-80',
      width: 'col-span-1',
      category: 'Branding',
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop',
      description: 'Comprehensive brand identity examples',
    },
    {
      id: 9,
      type: 'text',
      title: 'Design Trends 2024',
      height: 'h-40',
      width: 'col-span-1',
      category: 'Trends',
      description: 'Latest design trends and predictions',
    },
    {
      id: 10,
      type: 'image',
      title: 'Digital Art Gallery',
      height: 'h-96',
      width: 'col-span-2',
      category: 'Digital Art',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      description: 'Stunning digital artwork collection',
    },
    {
      id: 11,
      type: 'image',
      title: 'Animation Showcase',
      height: 'h-64',
      width: 'col-span-1',
      category: 'Animation',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      description: 'Creative animation and motion design',
    },
    {
      id: 12,
      type: 'text',
      title: 'Sustainability in Design',
      height: 'h-48',
      width: 'col-span-1',
      category: 'Sustainability',
      description: 'Eco-friendly design practices and materials',
    },
    {
      id: 13,
      type: 'image',
      title: '3D Design Exploration',
      height: 'h-72',
      width: 'col-span-1',
      category: '3D',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop',
      description: 'Innovative 3D design and modeling',
    },
    {
      id: 14,
      type: 'image',
      title: 'Web Design Patterns',
      height: 'h-56',
      width: 'col-span-1',
      category: 'Web Design',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      description: 'Modern web design patterns and layouts',
    },
    {
      id: 15,
      type: 'video',
      title: 'Mobile App Design',
      height: 'h-80',
      width: 'col-span-2',
      category: 'Mobile',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop',
      description: 'Mobile app design best practices',
    },
    {
      id: 16,
      type: 'image',
      title: 'Illustration Portfolio',
      height: 'h-64',
      width: 'col-span-1',
      category: 'Illustration',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      description: 'Beautiful hand-drawn illustrations',
    },
    {
      id: 17,
      type: 'text',
      title: 'Design Systems Guide',
      height: 'h-40',
      width: 'col-span-1',
      category: 'Systems',
      description: 'Building scalable design systems',
    },
    {
      id: 18,
      type: 'image',
      title: 'Photography Collection',
      height: 'h-72',
      width: 'col-span-1',
      category: 'Photography',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop',
      description: 'Professional photography techniques',
    },
    {
      id: 19,
      type: 'image',
      title: 'Product Design Showcase',
      height: 'h-56',
      width: 'col-span-1',
      category: 'Product',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      description: 'Innovative product design examples',
    },
    {
      id: 20,
      type: 'text',
      title: 'Creative Writing Tips',
      height: 'h-48',
      width: 'col-span-1',
      category: 'Writing',
      description: 'Tips for creative content writing',
    },
    {
      id: 21,
      type: 'image',
      title: 'Abstract Art Gallery',
      height: 'h-96',
      width: 'col-span-2',
      category: 'Abstract',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      description: 'Contemporary abstract art collection',
    },
    {
      id: 22,
      type: 'image',
      title: 'UI Component Library',
      height: 'h-64',
      width: 'col-span-1',
      category: 'UI',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      description: 'Comprehensive UI component collection',
    },
    {
      id: 23,
      type: 'video',
      title: 'Design Thinking Process',
      height: 'h-80',
      width: 'col-span-1',
      category: 'Process',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop',
      description: 'Step-by-step design thinking methodology',
    },
    {
      id: 24,
      type: 'text',
      title: 'Design Ethics',
      height: 'h-40',
      width: 'col-span-1',
      category: 'Ethics',
      description: 'Ethical considerations in design',
    },
    {
      id: 25,
      type: 'image',
      title: 'Experimental Design',
      height: 'h-72',
      width: 'col-span-1',
      category: 'Experimental',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=500&fit=crop',
      description: 'Pushing boundaries in design innovation',
    },
  ];

  // API 데이터가 있으면 사용, 없으면 mock 데이터 사용
  const displayContentItems = contentItems || mockContentItems;

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-64 bg-zinc-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
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
          onClick={() => openContentUploadModal(channelId || '')}
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
          <div
            key={item.id}
            className={`break-inside-avoid mb-4 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            onClick={() => {
              // 링크 콘텐츠인 경우 새 탭에서 URL 열기
              if (item.linkUrl) {
                window.open(item.linkUrl, '_blank');
              } else {
                openContentModal(item);
              }
            }}
          >
            <div
              className={`relative overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 ${
                item.height || 'h-64'
              }`}
            >
              {/* Content based on type */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {!item.imageUrl && (
                <div className="w-full h-full bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 flex items-center justify-center p-6">
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

              {/* Type indicator */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                  {item.type}
                </span>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-zinc-300 text-xs line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
