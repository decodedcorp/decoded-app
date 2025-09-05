'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@decoded/ui';

import type { SidebarFilters } from '@/domains/channels/components/sidebar/ChannelSidebar';
import { ChannelData } from '@/store/channelModalStore';
import { formatDateByContext } from '@/lib/utils/dateUtils';

import { useChannel } from '@/domains/channels/hooks/useChannels';
import { ChannelModalContent } from '@/domains/channels/components/modal/channel/ChannelModalContent';
import { ChannelModalSkeleton } from '@/domains/channels/components/modal/channel/ChannelModalSkeleton';
import { ContentModal } from '@/domains/channels/components/modal/content/ContentModal';
import { ContentUploadModal } from '@/domains/channels/components/modal/content-upload/ContentUploadModal';
import { useChannelContentsSinglePage } from '@/domains/channels/hooks/useChannelContents';
import { useContentModalStore } from '@/store/contentModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { ContentItem } from '@/lib/types/content';

import { ChannelPageHeader } from './ChannelPageHeader';
import CommunityHighlights from '@/domains/channels/components/highlights/CommunityHighlights';
import { HighlightItem } from '@/lib/types/highlightTypes';

interface ChannelPageContentProps {
  channelId: string;
}

export function ChannelPageContent({ channelId }: ChannelPageContentProps) {
  const router = useRouter();
  const openContentModal = useContentModalStore((state) => state.openModal);

  // 채널 ID로 API 데이터 가져오기
  const { data: apiChannel, isLoading, error } = useChannel(channelId || '');

  // 실제 콘텐츠 수는 API 채널 데이터에서 가져오기 (대용량 API 호출 제거)

  // 디버깅을 위한 로그
  React.useEffect(() => {
    if (apiChannel) {
      console.log('API Channel Data:', apiChannel);
    }
    if (error) {
      console.error('Channel API Error:', error);
    }
    console.log('Channel ID:', channelId);
  }, [apiChannel, error, channelId]);

  // URL 파라미터에서 content ID 확인하고 모달 열기
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const contentId = params.get('content');

      if (contentId && apiChannel) {
        console.log('Content ID from URL:', contentId, 'Opening modal...');

        // 채널 콘텐츠를 가져와서 해당 콘텐츠 찾기
        const fetchContentAndOpenModal = async () => {
          try {
            // ContentsService를 사용하여 특정 콘텐츠 가져오기
            const { ContentsService } = await import('@/api/generated/services/ContentsService');
            const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
              channelId,
              0,
              100, // 충분한 수의 콘텐츠 가져오기
            );

            if (result?.contents) {
              const targetContent = result.contents.find((content) => content.id === contentId);
              if (targetContent) {
                // 콘텐츠를 ContentItem으로 변환
                const { unifyContent, convertToContentItem } = await import('@/lib/types/content');
                const unifiedContent = unifyContent(targetContent);
                const contentItem = convertToContentItem(unifiedContent);

                // 콘텐츠 모달 열기
                openContentModal(contentItem);

                // URL에서 content 파라미터 제거
                const url = new URL(window.location.href);
                url.searchParams.delete('content');
                window.history.replaceState({}, '', url.pathname + url.search);
              }
            }
          } catch (error) {
            console.error('Failed to fetch content for modal:', error);
          }
        };

        fetchContentAndOpenModal();
      }
    }
  }, [apiChannel, channelId, openContentModal]);

  // 사이드바 상태 관리
  const [currentFilters, setCurrentFilters] = useState<SidebarFilters>({
    dataTypes: [],
    categories: [],
    tags: [],
    statuses: ['active'], // 기본값: active 콘텐츠만 표시
  });

  const handleFilterChange = (filters: SidebarFilters) => {
    setCurrentFilters(filters);
    console.log('Filters changed:', filters);
    // TODO: Implement filter logic for content
  };

  // 채널 데이터 결정: API 데이터를 직접 사용
  const finalChannel = useMemo((): ChannelData | null => {
    if (apiChannel) {
      return apiChannel;
    }
    return null;
  }, [apiChannel]);

  // 실제 콘텐츠 수 계산 (API 채널 데이터 사용)
  const actualContentCount = useMemo(() => {
    return apiChannel?.content_count || 0;
  }, [apiChannel]);

  // 뒤로가기 핸들러 - 더 스마트한 네비게이션
  const handleGoBack = () => {
    // 브라우저 히스토리가 있는지 확인하고, 없으면 홈으로 이동
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // 하이라이트 클릭 핸들러
  const handleHighlightClick = React.useCallback(
    (highlight: HighlightItem) => {
      if (highlight.clickAction.type === 'content_modal' && highlight.clickAction.data) {
        // ContentItem 데이터로 콘텐츠 모달 열기
        openContentModal(highlight.clickAction.data as ContentItem);
      }
    },
    [openContentModal],
  );

  // ESC 키로 뒤로가기 기능 제거 - 모달이 열려있을 때만 ESC 키 처리
  // 모달들은 각자의 BaseModal에서 ESC 키를 처리하므로 여기서는 제거

  // 채널 ID 변경 시 필터 상태 초기화
  React.useEffect(() => {
    setCurrentFilters({
      dataTypes: [],
      categories: [],
      tags: [],
      statuses: ['active'], // 기본값: active 콘텐츠만 표시
    });
  }, [channelId]);

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading channel...</div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Failed to load channel</div>
          <Button onClick={handleGoBack} variant="primary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content - Full width */}
      <div className="w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          {finalChannel ? (
            <ChannelPageHeader
              channel={finalChannel}
              onGoBack={handleGoBack}
              onSubscribe={(channelId) => {
                console.log('Subscribe to channel:', channelId);
                // TODO: Implement subscribe functionality
              }}
              onUnsubscribe={(channelId) => {
                console.log('Unsubscribe from channel:', channelId);
                // TODO: Implement unsubscribe functionality
              }}
              isSubscribeLoading={false}
              onMobileFiltersToggle={() => {}}
            />
          ) : (
            <ChannelModalSkeleton onClose={handleGoBack} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {error && (
            <div className="text-red-500 text-center p-4">채널 정보를 불러오는데 실패했습니다.</div>
          )}
          {!error && finalChannel && (
            <>
              <ChannelModalContent
                currentFilters={currentFilters}
                channelId={channelId}
                onFilterChange={handleFilterChange}
              />
            </>
          )}
          {!error && !finalChannel && (
            <div className="space-y-6 p-6">
              {/* Stats 스켈레톤 */}
              <div className="space-y-4">
                <div className="flex space-x-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-6 w-12 bg-zinc-700 rounded mx-auto mb-1 animate-pulse" />
                      <div className="h-3 w-10 bg-zinc-800 rounded mx-auto animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Content 스켈레톤 */}
              <div>
                <div className="h-8 w-32 bg-zinc-700 rounded mb-6 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Modal */}
      <ContentModal />

      {/* Content Upload Modal */}
      <ContentUploadModal />
    </div>
  );
}
