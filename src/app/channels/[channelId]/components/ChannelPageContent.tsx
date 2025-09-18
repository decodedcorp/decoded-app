'use client';

import React, { useState, useMemo, useCallback } from 'react';

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
import CommunityHighlights from '@/domains/channels/components/highlights/CommunityHighlights';
import { HighlightItem } from '@/lib/types/highlightTypes';
import { useCommonTranslation } from '@/lib/i18n/hooks';

import { ChannelPageHeader } from './ChannelPageHeader';

interface ChannelPageContentProps {
  channelId: string;
}

export function ChannelPageContent({ channelId }: ChannelPageContentProps) {
  const router = useRouter();
  const t = useCommonTranslation();
  const openContentModal = useContentModalStore((state) => state.openModal);

  // channelId에서 실제 채널 ID만 추출 (contents/... 부분 제거)
  const actualChannelId = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      console.log('🔍 [ChannelPageContent] pathname:', pathname);

      // URL이 content detail URL인지 확인
      const contentPathMatch = pathname.match(/\/channels\/([^\/]+)\/contents\/([^\/]+)/);
      if (contentPathMatch) {
        const extractedChannelId = contentPathMatch[1];
        console.log(
          '🔍 [ChannelPageContent] Content URL detected, extracted channelId:',
          extractedChannelId,
        );
        return extractedChannelId;
      }

      // 일반 채널 URL인 경우
      const channelMatch = pathname.match(/\/channels\/([^\/]+)/);
      console.log('🔍 [ChannelPageContent] channelMatch:', channelMatch);
      const extractedId = channelMatch?.[1] || channelId;
      console.log('🔍 [ChannelPageContent] extractedId:', extractedId);
      return extractedId;
    }
    console.log('🔍 [ChannelPageContent] SSR mode, using channelId:', channelId);
    return channelId;
  }, [channelId]);

  // 채널 ID로 API 데이터 가져오기
  const { data: apiChannel, isLoading, error } = useChannel(actualChannelId || '');

  // 실제 콘텐츠 수는 API 채널 데이터에서 가져오기 (대용량 API 호출 제거)

  // 디버깅을 위한 로그
  React.useEffect(() => {
    if (apiChannel) {
      console.log('API Channel Data:', apiChannel);
    }
    if (error) {
      console.error('Channel API Error:', error);
    }
    console.log('Channel ID:', actualChannelId);
  }, [apiChannel, error, actualChannelId]);

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
  const handleGoBack = useCallback(() => {
    // 브라우저 히스토리가 있는지 확인하고, 없으면 홈으로 이동
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

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

  // 구독 핸들러
  const handleSubscribe = useCallback((channelId: string) => {
    console.log('Subscribe to channel:', channelId);
    // TODO: Implement subscribe functionality
  }, []);

  // 구독 해제 핸들러
  const handleUnsubscribe = useCallback((channelId: string) => {
    console.log('Unsubscribe from channel:', channelId);
    // TODO: Implement unsubscribe functionality
  }, []);

  // 모바일 필터 토글 핸들러
  const handleMobileFiltersToggle = useCallback(() => {
    // TODO: Implement mobile filters toggle
  }, []);

  // ESC 키로 뒤로가기 기능 제거 - 모달이 열려있을 때만 ESC 키 처리
  // 모달들은 각자의 BaseModal에서 ESC 키를 처리하므로 여기서는 제거

  // URL에서 content 파라미터 감지하여 모달 열기
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const contentId = urlParams.get('content');

      if (contentId && actualChannelId) {
        console.log('Content ID from URL params:', contentId, 'Opening modal...');

        // 콘텐츠 데이터를 가져와서 모달 열기
        const fetchContentAndOpenModal = async () => {
          try {
            // API에서 콘텐츠 데이터 가져오기
            const response = await fetch(`/api/proxy/contents/${contentId}`);
            if (response.ok) {
              const contentData = await response.json();
              // ContentItem 형태로 변환
              const contentItem = {
                id: contentData.id,
                title: contentData.title || '제목 없음',
                description: contentData.description || '',
                thumbnail: contentData.thumbnail || '',
                channel_id: actualChannelId,
                type: contentData.type || 'text', // ContentType 필수 필드 추가
                // 기타 필요한 필드들...
              };

              // 모달 열기
              openContentModal(contentItem, actualChannelId);

              // URL에서 content 파라미터 제거
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete('content');
              window.history.replaceState({}, '', newUrl.toString());
            }
          } catch (error) {
            console.error('Failed to fetch content:', error);
          }
        };

        fetchContentAndOpenModal();
      }
    }
  }, [actualChannelId, openContentModal]);

  // 채널 ID 변경 시 필터 상태 초기화
  React.useEffect(() => {
    setCurrentFilters({
      dataTypes: [],
      categories: [],
      tags: [],
      statuses: ['active'], // 기본값: active 콘텐츠만 표시
    });
  }, [actualChannelId]);

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">{t.status.loading()}</div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{t.status.error()}</div>
          <Button onClick={handleGoBack} variant="primary">
            {t.actions.back()}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex-shrink-0">
        {finalChannel ? (
          <ChannelPageHeader
            channel={finalChannel}
            onGoBack={handleGoBack}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
            isSubscribeLoading={false}
            onMobileFiltersToggle={handleMobileFiltersToggle}
          />
        ) : (
          <ChannelModalSkeleton onClose={handleGoBack} />
        )}
      </div>

      {/* Content - 전체 페이지 스크롤 사용 */}
      <div>
        {error && <div className="text-red-500 text-center p-4">{t.status.error()}</div>}
        {!error && finalChannel && (
          <>
            <ChannelModalContent
              currentFilters={currentFilters}
              channelId={actualChannelId}
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

      {/* Content Modal */}
      <ContentModal />

      {/* Content Upload Modal */}
      <ContentUploadModal />
    </div>
  );
}
