'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ContentsCard } from '@/components/ContentsCard';
import { useSearchContents } from '@/domains/search/hooks/useSearch';

interface ContentSearchResultsProps {
  query: string;
}

export function ContentSearchResults({ query }: ContentSearchResultsProps) {
  const router = useRouter();

  // 실제 검색 API 사용
  const {
    data: searchData,
    isLoading,
    error,
    isFetching,
  } = useSearchContents({
    query,
    limit: 20,
    enabled: query.trim().length >= 2,
    debounceMs: 300,
  });

  // 디버깅: API 응답 확인
  React.useEffect(() => {
    console.log('🔍 [ContentSearchResults] Search API response:', {
      query,
      searchData,
      isLoading,
      error,
      hasImage: searchData?.image?.length || 0,
      hasVideo: searchData?.video?.length || 0,
      hasLink: searchData?.link?.length || 0,
      // 전체 응답 구조 확인
      fullResponse: searchData,
      imageData: searchData?.image,
      videoData: searchData?.video,
      linkData: searchData?.link,
    });
  }, [query, searchData, isLoading, error]);

  const contents = [
    ...(searchData?.image || []),
    ...(searchData?.video || []),
    ...(searchData?.link || []),
  ];

  // 디버깅: 콘텐츠 데이터 확인
  React.useEffect(() => {
    console.log('🔍 [ContentSearchResults] Contents data:', {
      totalCount: contents.length,
      contents,
      imageCount: searchData?.image?.length || 0,
      videoCount: searchData?.video?.length || 0,
      linkCount: searchData?.link?.length || 0,
      // API 응답 구조 상세 분석
      apiResponseStructure: {
        hasSearchData: !!searchData,
        searchDataType: typeof searchData,
        imageType: typeof searchData?.image,
        videoType: typeof searchData?.video,
        linkType: typeof searchData?.link,
        imageLength: searchData?.image?.length,
        videoLength: searchData?.video?.length,
        linkLength: searchData?.link?.length,
      },
      // 개별 콘텐츠 타입별 상세 정보
      imageContents: searchData?.image?.slice(0, 2), // 처음 2개만
      videoContents: searchData?.video?.slice(0, 2), // 처음 2개만
      linkContents: searchData?.link?.slice(0, 2), // 처음 2개만
    });
  }, [contents, searchData]);

  const handleContentClick = (contentId: string, channelId: string) => {
    // 콘텐츠 클릭 시 해당 채널 페이지로 이동하면서 콘텐츠 모달 열기
    router.push(`/channels/${channelId}?content=${contentId}`);
  };

  if (isLoading && !contents.length) {
    return (
      <div className="text-center py-16">
        <div className="text-zinc-400">
          <div className="animate-spin w-16 h-16 border-4 border-zinc-600 border-t-blue-500 rounded-full mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-3">Searching content...</h3>
          <p className="text-zinc-500 text-lg">Looking for content matching "{query}"</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-900/20 rounded-full flex items-center justify-center border border-red-700/30">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Search error</h3>
          <p className="text-zinc-500 text-lg">Failed to search content. Please try again.</p>
        </div>
      </div>
    );
  }

  if (contents.length === 0 && !isLoading) {
    // 개별 No Results 메시지는 제거 - SearchResults에서 통합 처리
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Content</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full">
              {contents.length} found
            </span>
            {isFetching && (
              <span className="px-3 py-1 bg-blue-900/20 text-blue-400 text-xs rounded-full border border-blue-700/30 animate-pulse">
                Updating...
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 w-full auto-rows-fr">
        {contents.map((content, index) => {
          // 콘텐츠 타입에 따른 데이터 매핑
          let cardData;
          let channelId = '';

          // 디버깅: 개별 콘텐츠 데이터 확인
          console.log('🔍 [ContentSearchResults] Processing content:', {
            contentId: content.id,
            content,
            hasUrl: 'url' in content,
            hasVideoUrl: 'video_url' in content,
            hasLinkPreview: 'link_preview_metadata' in content,
          });

          // 타입 가드를 더 명확하게 정의
          const isImageContent =
            'url' in content && !('video_url' in content) && !('link_preview_metadata' in content);
          const isVideoContent = 'video_url' in content;
          const isLinkContent = 'link_preview_metadata' in content;

          if (isImageContent) {
            // Image content
            const imageContent = content as any;
            cardData = {
              id: imageContent.id,
              thumbnailUrl: imageContent.url || '',
              type: 'image' as const,
              metadata: {
                title: imageContent.title || `Image ${imageContent.id}`,
                author: {
                  name: imageContent.author_name || imageContent.channel_name || 'Unknown',
                },
              },
            };
            channelId = imageContent.channel_id || '';
          } else if (isVideoContent) {
            // Video content
            const videoContent = content as any; // 타입 단언으로 해결
            cardData = {
              id: videoContent.id,
              thumbnailUrl: videoContent.thumbnail_url || videoContent.video_url || '',
              type: 'video' as const,
              metadata: {
                title: videoContent.title || `Video ${videoContent.id}`,
                author: {
                  name: videoContent.author_name || videoContent.channel_name || 'Unknown',
                },
              },
            };
            channelId = videoContent.channel_id || '';
          } else if (isLinkContent) {
            // Link content
            const linkContent = content as any; // 타입 단언으로 해결
            cardData = {
              id: linkContent.id,
              thumbnailUrl: linkContent.link_preview_metadata?.img_url || '',
              type: 'card' as const,
              metadata: {
                title:
                  linkContent.link_preview_metadata?.title ||
                  linkContent.title ||
                  linkContent.url ||
                  'Link Content',
                author: {
                  name: linkContent.author_name || linkContent.channel_name || 'Unknown',
                },
              },
            };
            channelId = linkContent.channel_id || '';
          } else {
            // Fallback - 모든 가능한 필드 확인
            const fallbackContent = content as any;
            cardData = {
              id: fallbackContent.id,
              thumbnailUrl:
                fallbackContent.thumbnail_url ||
                fallbackContent.url ||
                fallbackContent.image_url ||
                '',
              type: 'card' as const,
              metadata: {
                title:
                  fallbackContent.title || fallbackContent.name || `Content ${fallbackContent.id}`,
                author: {
                  name: fallbackContent.author_name || fallbackContent.channel_name || 'Unknown',
                },
              },
            };
            channelId = fallbackContent.channel_id || '';
          }

          // 디버깅: 최종 카드 데이터 확인
          console.log('🔍 [ContentSearchResults] Final card data:', {
            contentId: content.id,
            cardData,
            thumbnailUrl: cardData.thumbnailUrl,
            hasThumbnail: !!cardData.thumbnailUrl && cardData.thumbnailUrl.trim() !== '',
            metadata: cardData.metadata,
          });

          // ContentsCard 사용 (에러 발생 시 디버깅)
          try {
            return (
              <div
                key={content.id}
                onClick={() => handleContentClick(content.id, channelId)}
                className="w-full h-full flex items-center justify-center"
              >
                <ContentsCard
                  card={cardData}
                  onCardClick={() => handleContentClick(content.id, channelId)}
                  uniqueId={`search-content-${content.id}`}
                  gridIndex={index}
                  className="w-full h-full" // 적절한 크기 설정
                />
              </div>
            );
          } catch (error) {
            console.error('🔍 [ContentSearchResults] ContentsCard render error:', {
              contentId: content.id,
              cardData,
              error,
            });

            // 에러 발생 시 기본 카드 UI로 폴백
            return (
              <div
                key={content.id}
                onClick={() => handleContentClick(content.id, channelId)}
                className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:bg-zinc-700 transition-colors w-full h-full min-h-[300px]"
              >
                {/* 썸네일 */}
                <div className="aspect-video bg-zinc-700 relative overflow-hidden">
                  {cardData.thumbnailUrl ? (
                    <img
                      src={cardData.thumbnailUrl}
                      alt={cardData.metadata?.title || 'Content'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn('🔍 [ContentSearchResults] Image load error:', {
                          contentId: content.id,
                          thumbnailUrl: cardData.thumbnailUrl,
                          error: e,
                        });
                        // 에러 시 기본 배경색 표시
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-600 flex items-center justify-center">
                      <div className="text-zinc-400 text-4xl">📷</div>
                    </div>
                  )}

                  {/* 타입 배지 */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {cardData.type}
                  </div>
                </div>

                {/* 콘텐츠 정보 */}
                <div className="p-4">
                  <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                    {cardData.metadata?.title || `Content ${content.id}`}
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    by {cardData.metadata?.author?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Loading indicator for additional results */}
      {isFetching && contents.length > 0 && (
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
            <div className="w-4 h-4 border border-zinc-400 border-t-transparent rounded-full animate-spin" />
            <span>Updating results...</span>
          </div>
        </div>
      )}
    </div>
  );
}
