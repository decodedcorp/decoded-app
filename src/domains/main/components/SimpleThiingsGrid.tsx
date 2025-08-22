'use client';

import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import ThiingsGrid, { type ItemConfig } from './ThiingsGrid';
import { useChannelContents } from '../hooks/useChannelContents';
import { useImageColor } from '../hooks';
import { DEFAULT_CHANNEL_ID } from '../data/channelCardsProvider';
import { useContentModalStore } from '@/store/contentModalStore';
import { useContentSidebarStore } from '@/store/contentSidebarStore';

// 고급 카드 컴포넌트 - 색상 추출 및 동적 스타일링 적용
const SimpleCard = memo(
  ({
    card,
    isMoving,
    onCardClick,
    isSelected = false,
    isBlurred = false,
    uniqueId,
    gridIndex,
  }: {
    card: any;
    isMoving: boolean;
    onCardClick?: (card: any) => void;
    isSelected?: boolean;
    isBlurred?: boolean;
    uniqueId: string;
    gridIndex: number;
  }) => {
    // 디버깅: 카드 데이터 로깅
    console.log('🔍 [SimpleCard] Rendering card:', {
      id: card.id,
      thumbnailUrl: card.thumbnailUrl,
      hasMetadata: !!card.metadata,
      metadataTitle: card.metadata?.title,
      type: card.type,
    });

    const { extractedColor, isExtracting, extractFromImgEl } = useImageColor();
    const [hasProcessedColor, setHasProcessedColor] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // 색상 추출 콜백 (메모이제이션으로 성능 최적화)
    // isMoving 중에는 색상 추출을 방지하여 성능 향상
    const handleColorExtracted = useCallback(async () => {
      if (imgRef.current && !hasProcessedColor && !isMoving) {
        setHasProcessedColor(true);
        try {
          await extractFromImgEl(imgRef.current);
        } catch (error) {
          console.warn('Color extraction failed:', error);
          setHasProcessedColor(false); // 실패 시 재시도 허용
        }
      }
    }, [extractFromImgEl, hasProcessedColor, isMoving]);

    // 움직임이 멈췄을 때 색상 추출 재시도
    useEffect(() => {
      if (
        !isMoving &&
        !extractedColor &&
        !isExtracting &&
        imgRef.current?.complete &&
        !hasProcessedColor
      ) {
        const timeoutId = setTimeout(handleColorExtracted, 100);
        return () => clearTimeout(timeoutId);
      }
    }, [isMoving, extractedColor, isExtracting, hasProcessedColor, handleColorExtracted]);

    // 동적 스타일 (색상 추출 기반) - 애니메이션 분리
    const cardStyle = useMemo(() => {
      const baseStyle = {
        width: '100%',
        height: '100%',
        // 변형 애니메이션 최적화
        transform: `scale(${isMoving ? 0.98 : isSelected ? 1.05 : 1})`,
        // 블러와 오파시티 분리 - 성능 최적화
        opacity: isMoving ? 0.9 : 1,
        zIndex: isSelected ? 10 : 1,
        // GPU 가속을 위한 별도 레이어 생성
        willChange: isSelected || isMoving ? 'transform, opacity, filter' : 'auto',
        // 트랜지션 최적화 - transform과 opacity만
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, z-index 0s',
      };

      if (extractedColor) {
        return {
          ...baseStyle,
          // 강화된 테두리: Vibrant 색상으로 더 선명하게
          borderColor: `rgba(${extractedColor.vibrant.rgb}, 0.6)`,
          borderWidth: '2px',
          borderStyle: 'solid',

          // 다층 드롭 셔도우: Primary + Vibrant 조합으로 깊이감 극대화
          boxShadow: `
          0 8px 32px -8px rgba(${extractedColor.primary.rgb}, 0.4),
          0 4px 16px -4px rgba(${extractedColor.vibrant.rgb}, 0.3),
          0 2px 8px -2px rgba(${extractedColor.vibrant.rgb}, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,

          // CSS 변수로 호버 효과 정의
          '--hover-shadow': `
          0 20px 40px -10px rgba(${extractedColor.primary.rgb}, 0.5),
          0 10px 20px -5px rgba(${extractedColor.vibrant.rgb}, 0.4),
          0 4px 12px -2px rgba(${extractedColor.vibrant.rgb}, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,
          '--focus-ring': `rgba(${extractedColor.vibrant.rgb}, 0.8)`,
          '--inner-glow': `rgba(${extractedColor.primary.rgb}, 0.08)`,
        };
      }

      return {
        ...baseStyle,
        // 기본 스타일 (색상 추출 전)
        borderColor: 'rgba(100, 116, 139, 0.4)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
        0 6px 20px -6px rgba(0, 0, 0, 0.15),
        0 3px 10px -3px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
        '--hover-shadow': `
        0 20px 40px -10px rgba(100, 116, 139, 0.2),
        0 10px 20px -5px rgba(100, 116, 139, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
        '--focus-ring': 'rgba(100, 116, 139, 0.8)',
        '--inner-glow': 'rgba(100, 116, 139, 0.08)',
      };
    }, [extractedColor, isMoving, isSelected, isBlurred]);

    // 배경 스타일 메모이제이션
    const bgStyle = useMemo(
      () => ({
        backgroundColor: card.avgColor || '#18181b',
      }),
      [card.avgColor],
    );

    // 그라디언트 스타일들 메모이제이션 (성능 최적화)
    const gradientStyles = useMemo(
      () => ({
        primary: extractedColor
          ? `linear-gradient(180deg, transparent 0%, transparent 45%, rgba(${extractedColor.primary.rgb}, 0.02) 55%, rgba(${extractedColor.primary.rgb}, 0.04) 65%, rgba(${extractedColor.primary.rgb}, 0.08) 75%, rgba(${extractedColor.primary.rgb}, 0.15) 85%, rgba(${extractedColor.primary.rgb}, 0.25) 95%, rgba(${extractedColor.primary.rgb}, 0.35) 100%)`
          : 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(100, 116, 139, 0.02) 55%, rgba(100, 116, 139, 0.04) 65%, rgba(100, 116, 139, 0.08) 75%, rgba(100, 116, 139, 0.15) 85%, rgba(100, 116, 139, 0.25) 95%, rgba(100, 116, 139, 0.35) 100%)',

        blur: extractedColor
          ? `linear-gradient(to top, rgba(${extractedColor.primary.rgb}, 0.08) 0%, rgba(${extractedColor.muted.rgb}, 0.04) 50%, transparent 100%)`
          : 'linear-gradient(to top, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.04) 50%, transparent 100%)',

        innerGlow: extractedColor
          ? `radial-gradient(circle at 50% 50%, rgba(${extractedColor.primary.rgb}, 0.3) 0%, rgba(${extractedColor.primary.rgb}, 0.1) 50%, transparent 70%)`
          : null,

        borderGlow: extractedColor
          ? `linear-gradient(45deg, transparent 30%, rgba(${extractedColor.vibrant.rgb}, 0.4) 50%, transparent 70%)`
          : null,
      }),
      [extractedColor],
    );

    // 호버 이벤트 핸들러들 메모이제이션
    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (extractedColor) {
          e.currentTarget.style.borderColor = `rgba(${extractedColor.vibrant.rgb}, 0.9)`;
        }
      },
      [extractedColor],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (extractedColor) {
          e.currentTarget.style.borderColor = `rgba(${extractedColor.vibrant.rgb}, 0.6)`;
        }
      },
      [extractedColor],
    );

    // 카드 클릭 핸들러
    const handleCardClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('🎯 [SimpleCard] Card clicked, card:', card);
        console.log('🎯 [SimpleCard] isMoving:', isMoving);
        console.log('🎯 [SimpleCard] onCardClick function:', onCardClick);
        console.log('🎯 [SimpleCard] onCardClick type:', typeof onCardClick);
        console.log('🎯 [SimpleCard] onCardClick toString:', onCardClick?.toString());

        if (onCardClick && !isMoving) {
          console.log('🎯 [SimpleCard] Calling onCardClick with card:', card);
          try {
            onCardClick(card);
            console.log('🎯 [SimpleCard] onCardClick executed successfully');
          } catch (error) {
            console.error('🎯 [SimpleCard] Error executing onCardClick:', error);
          }
        } else {
          console.log('🎯 [SimpleCard] onCardClick not called - reason:', {
            hasOnCardClick: !!onCardClick,
            isMoving,
          });
        }

        // 디버깅: 직접 handleCardClick 함수를 찾아서 호출해보기
        console.log('🎯 [SimpleCard] Trying to find handleCardClick in parent scope...');
        // @ts-ignore - 디버깅 목적
        if ((window as any).debugHandleCardClick) {
          console.log('🎯 [SimpleCard] Found debug function, calling it...');
          (window as any).debugHandleCardClick(card);
        }
      },
      [onCardClick, card, isMoving],
    );

    return (
      <div
        data-card-id={uniqueId}
        data-original-card-id={card.id}
        data-grid-index={gridIndex}
        className={`relative bg-zinc-900 rounded-xl overflow-hidden mx-auto cursor-pointer transition-shadow duration-300 ease-out ${
          isSelected
            ? 'ring-4 ring-blue-400/50 shadow-[0_0_50px_rgba(59,130,246,0.5)]'
            : 'hover:shadow-[var(--hover-shadow,0_20px_40px_-10px_rgba(0,0,0,0.2))] hover:scale-[1.03]'
        }`}
        style={{
          ...cardStyle,
          transform: `translate3d(0, 0, 0) ${cardStyle.transform}`, // GPU 가속 힙트
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* 블러 오버레이 - 선택되지 않은 카드에만 적용 */}
        <BlurOverlay isBlurred={isBlurred} />

        {/* 배경색 */}
        <div className="absolute inset-0" style={bgStyle} />

        {/* 메인 이미지 */}
        <img
          ref={imgRef}
          src={card.thumbnailUrl}
          alt={card.metadata?.title || `Card ${card.id}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onLoad={handleColorExtracted}
          onError={(e) => {
            console.error('🔍 [SimpleCard] Image load error:', {
              cardId: card.id,
              thumbnailUrl: card.thumbnailUrl,
              error: e,
            });
          }}
        />

        {/* 동적 그라디언트 오버레이 */}
        <div className="absolute inset-0">
          {/* Primary gradient */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{ background: gradientStyles.primary }}
          />

          {/* 미세한 백드롭 블러 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 backdrop-blur-[1px] transition-all duration-1000"
            style={{
              background: gradientStyles.blur,
              maskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
            }}
          />
        </div>

        {/* 메타데이터 오버레이 - 향상된 타이포그래피 */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-base truncate leading-tight">
              {card.metadata?.title || `Card ${card.id}`}
            </h3>
            {card.metadata?.author && (
              <p className="text-zinc-300 text-sm truncate font-medium">
                by {card.metadata.author.name}
              </p>
            )}
          </div>
        </div>

        {/* 내부 글로우 효과 (색상 추출 후) */}
        {extractedColor && gradientStyles.innerGlow && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-500"
            style={{
              background: gradientStyles.innerGlow,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          />
        )}

        {/* 테두리 글로우 효과 */}
        {extractedColor && gradientStyles.borderGlow && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
            style={{
              background: gradientStyles.borderGlow,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          />
        )}

        {/* 색상 추출 로딩 상태 */}
        {isExtracting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="text-white text-xs opacity-70">색상 분석 중...</div>
          </div>
        )}
      </div>
    );
  },
  // 메모 최적화 - 선택/블러 상태 변화 시에만 리렌더링
  (prevProps, nextProps) => {
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.isMoving === nextProps.isMoving &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isBlurred === nextProps.isBlurred &&
      prevProps.uniqueId === nextProps.uniqueId &&
      prevProps.gridIndex === nextProps.gridIndex
    );
  },
);

SimpleCard.displayName = 'SimpleCard';

// 블러 오버레이 컴포넌트 - 성능 최적화를 위해 별도 분리
const BlurOverlay = memo(({ isBlurred }: { isBlurred: boolean }) => {
  if (!isBlurred) return null;

  return (
    <div
      className="absolute inset-0 z-20 backdrop-blur-sm bg-black/20 rounded-xl transition-all duration-300 ease-out"
      style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    />
  );
});

BlurOverlay.displayName = 'BlurOverlay';

export function SimpleThiingsGrid({
  className = '',
  channelId = DEFAULT_CHANNEL_ID,
}: {
  className?: string;
  channelId?: string;
}) {
  // 채널 콘텐츠 데이터 로드 - 실제 API 사용
  const { cards, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChannelContents({
      channelId,
      limit: 20,
      enabled: true,
    });

  // Debug logging
  React.useEffect(() => {
    console.log('[SimpleThiingsGrid] Component mounted/updated');
    console.log('[SimpleThiingsGrid] Hook state changed:', {
      channelId,
      isLoading,
      isError,
      error: error?.message,
      cardsLength: cards.length,
      hasNextPage,
      isFetchingNextPage,
    });

    // Also log the actual cards data structure
    if (cards.length > 0) {
      console.log('[SimpleThiingsGrid] First card:', cards[0]);
    }
  }, [channelId, isLoading, isError, error, cards.length, hasNextPage, isFetchingNextPage]);

  // 콘텐츠 모달 스토어
  const openContentModal = useContentModalStore((state) => state.openModal);
  const isContentModalOpen = useContentModalStore((state) => state.isOpen);

  // 콘텐츠 사이드바 스토어
  const openContentSidebar = useContentSidebarStore((state) => state.openSidebar);
  const isSidebarOpen = useContentSidebarStore((state) => state.isOpen);
  const selectedCardId = useContentSidebarStore((state) => state.selectedCardId);

  // Hydration 오류 방지를 위한 상태 관리
  const [gridSize, setGridSize] = useState(400); // 기본값으로 시작 (높이 기준)

  // 선택된 카드 중앙 정렬을 위한 ref
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // 4:5 비율 카드의 높이를 고려한 그리드 크기 설정
  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setGridSize(350); // 모바일: 280px 너비 × 1.25 = 350px 높이
      } else if (width < 1024) {
        setGridSize(400); // 태블릿: 320px 너비 × 1.25 = 400px 높이
      } else {
        setGridSize(450); // 데스크탑: 360px 너비 × 1.25 = 450px 높이
      }
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);

    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // 선택된 카드 중앙 정렬 효과 - 최적화된 타겟팅
  useEffect(() => {
    if (isSidebarOpen && selectedCardId && gridContainerRef.current) {
      // 선택된 카드 ID와 일치하는 모든 요소 찾기
      const selectedCardElements = gridContainerRef.current.querySelectorAll(
        `[data-original-card-id="${selectedCardId}"]`,
      ) as NodeListOf<HTMLElement>;

      if (selectedCardElements.length > 0) {
        // 뷰포트 중앙에 가장 가까운 카드 찾기
        const viewportCenterY = window.innerHeight / 2;
        const viewportCenterX = window.innerWidth / 2;

        let closestElement = selectedCardElements[0];
        let minDistance = Number.MAX_VALUE;

        selectedCardElements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const elementCenterY = rect.top + rect.height / 2;
          const elementCenterX = rect.left + rect.width / 2;

          // 뷰포트 중앙까지의 거리 계산
          const distance = Math.sqrt(
            Math.pow(elementCenterX - viewportCenterX, 2) +
              Math.pow(elementCenterY - viewportCenterY, 2),
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestElement = element;
          }
        });

        // 가장 가까운 카드를 뷰포트 중앙으로 스크롤
        closestElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }, [isSidebarOpen, selectedCardId]);

  // 카드 클릭 핸들러 - ContentModal 열기만 (URL 변경 없음)
  const handleCardClick = useCallback(
    (card: any) => {
      console.log('🎯 [SimpleThiingsGrid] ====== handleCardClick EXECUTED ======');
      console.log('🎯 [SimpleThiingsGrid] Card clicked:', card);
      console.log('🎯 [SimpleThiingsGrid] Current channelId:', channelId);
      console.log('🎯 [SimpleThiingsGrid] openContentModal function:', openContentModal);
      console.log('🎯 [SimpleThiingsGrid] openContentModal type:', typeof openContentModal);

      // 카드가 속한 채널 ID와 콘텐츠 ID 추출
      const targetChannelId = channelId;
      const contentId = card.id;

      console.log('🎯 [SimpleThiingsGrid] Target channel ID:', targetChannelId);
      console.log('🎯 [SimpleThiingsGrid] Content ID:', contentId);

      if (targetChannelId && contentId) {
        console.log('🎯 [SimpleThiingsGrid] Opening ContentModal for content:', contentId);

        try {
          // ContentModal을 위해 콘텐츠 데이터 준비
          const contentData = {
            id: contentId,
            type: 'image' as const, // ContentItem 타입에 맞게 수정
            title:
              card.metadata?.title || card.link_preview_metadata?.title || `Content ${contentId}`,
            description:
              card.metadata?.description || card.link_preview_metadata?.description || '',
            thumbnailUrl: card.thumbnailUrl || '',
            imageUrl: card.thumbnailUrl || '',
            // 링크 URL 추가 - 카드의 원본 링크 사용
            linkUrl: card.url || '',
            // 추가 필드들
            author: card.metadata?.author?.name || 'Unknown Author',
            date: card.metadata?.created_at || new Date().toISOString(),
            likes: card.metadata?.likes || card.likes || 0,
            views: card.metadata?.views || 0,
            // AI 생성 데이터 - ai_gen_metadata에서 가져오기
            aiSummary:
              card.ai_gen_metadata?.summary ||
              card.metadata?.aiSummary ||
              `This is an AI-generated summary for ${
                card.metadata?.title || card.link_preview_metadata?.title || 'this content'
              }. It provides a brief overview of the main points and key insights.`,
            aiQaList: card.ai_gen_metadata?.qa_list ||
              card.metadata?.aiQaList || [
                {
                  question: 'What is this content about?',
                  answer:
                    card.metadata?.title ||
                    card.link_preview_metadata?.title ||
                    'This content appears to be an image or visual material.',
                },
                {
                  question: 'Who created this content?',
                  answer: card.metadata?.author?.name || 'The author information is not available.',
                },
              ],
            // 링크 프리뷰 데이터 - link_preview_metadata에서 가져오기
            linkPreview: {
              title:
                card.link_preview_metadata?.title || card.metadata?.title || `Content ${contentId}`,
              description:
                card.link_preview_metadata?.description ||
                card.metadata?.description ||
                'No description available',
              url: card.url || '', // 실제 링크 URL
              imageUrl: card.link_preview_metadata?.img_url || card.thumbnailUrl || '',
              downloadedImageUrl: card.thumbnailUrl || '',
              siteName: card.link_preview_metadata?.site_name || 'Content Platform',
            },
          };

          // TODO: 사이드바 구현 후 활성화
          // openContentModal(contentData);
          console.log(
            '🎯 [SimpleThiingsGrid] ContentModal temporarily disabled, preparing for sidebar implementation',
          );
          console.log('🎯 [SimpleThiingsGrid] Content data prepared:', contentData);

          // 사이드바 열기
          openContentSidebar(contentData);
          console.log('🎯 [SimpleThiingsGrid] ContentSidebar opened successfully');
          console.log('🎯 [SimpleThiingsGrid] Sidebar content data:', contentData);

          // URL 변경 제거 - 모달만 열기
          console.log('🎯 [SimpleThiingsGrid] Sidebar opened without URL change');
        } catch (error) {
          console.error('🎯 [SimpleThiingsGrid] Error opening modal:', error);
        }
      } else {
        console.warn('🎯 [SimpleThiingsGrid] Missing channel ID or content ID');
      }
    },
    [channelId, openContentModal, openContentSidebar], // router 의존성 제거
  );

  // 디버깅을 위해 handleCardClick을 전역으로 노출
  React.useEffect(() => {
    // @ts-ignore - 디버깅 목적
    (window as any).debugHandleCardClick = handleCardClick;
    console.log('🎯 [SimpleThiingsGrid] handleCardClick exposed to window.debugHandleCardClick');

    return () => {
      // @ts-ignore - 디버깅 목적
      delete (window as any).debugHandleCardClick;
    };
  }, [handleCardClick]);

  // 최적화된 renderItem - useCallback 적용
  const renderItem = useCallback(
    ({ gridIndex, isMoving }: ItemConfig) => {
      console.log('🎯 [renderItem] Rendering item:', { gridIndex, isMoving });
      console.log('🎯 [renderItem] handleCardClick function:', handleCardClick);
      console.log('🎯 [renderItem] handleCardClick type:', typeof handleCardClick);
      console.log(
        '🎯 [renderItem] handleCardClick === function:',
        typeof handleCardClick === 'function',
      );
      console.log('🎯 [renderItem] handleCardClick toString:', handleCardClick?.toString());

      // 카드 클릭 핸들러를 인라인으로 정의하여 함수 참조 문제 해결
      const cardClickHandler = (card: any) => {
        console.log('🎯 [renderItem] Inline cardClickHandler called with:', card);
        handleCardClick(card);
      };

      // 카드가 없는 경우 테스트용 카드 생성
      // if (cards.length === 0) {
      //   const testCard = {
      //     id: `test-${gridIndex}`,
      //     thumbnailUrl:
      //       'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMyMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMThiYTliIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOHB4Ij5UZXN0IENhcmQ8L3RleHQ+Cjxzdmc+',
      //     metadata: {
      //       title: `테스트 카드 #${gridIndex}`,
      //       author: { name: 'Test Author' },
      //       description: '카드 클릭 테스트용 카드입니다.',
      //     },
      //     type: 'card' as const,
      //     loadPriority: 'medium' as const,
      //     avgColor: '#18ba9b',
      //     preloadHint: false,
      //   };
      //   console.log('🎯 [renderItem] Using test card:', testCard);
      //   return <SimpleCard card={testCard} isMoving={isMoving} onCardClick={cardClickHandler} />;
      // }

      // gridIndex를 이용해 카드 순환 사용
      const card = cards[gridIndex % cards.length];
      console.log('🎯 [renderItem] Using real card:', card);

      // card가 null인 경우 처리
      if (!card) {
        return null;
      }

      // 고유 식별자 생성 - 카드ID와 그리드인덱스 조합으로 중복 방지
      const uniqueCardId = `${card.id}-grid-${gridIndex}`;

      // 카드 선택/블러 상태 계산 - 카드 ID만으로 비교 (그리드 인덱스 무관)
      const isSelected = isSidebarOpen && selectedCardId === card.id;
      const isBlurred = isSidebarOpen && selectedCardId !== card.id;

      return (
        <SimpleCard
          card={card}
          isMoving={isMoving}
          onCardClick={cardClickHandler}
          isSelected={isSelected}
          isBlurred={isBlurred}
          uniqueId={uniqueCardId}
          gridIndex={gridIndex}
        />
      );
    },
    [cards, handleCardClick, isSidebarOpen, selectedCardId], // 사이드바 상태 의존성 추가
  );

  // 로딩 상태 렌더링
  const loadingContent = useMemo(
    () => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>카드 로딩 중...</p>
        </div>
      </div>
    ),
    [],
  );

  // 에러 상태 렌더링
  const errorContent = useMemo(
    () => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-center">
          <h2 className="text-xl font-semibold mb-2">로딩 실패</h2>
          <p className="text-sm opacity-80">{error?.message}</p>
        </div>
      </div>
    ),
    [error?.message],
  );

  // 무한 스크롤 센티넬 참조
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 IntersectionObserver 설정
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '100px', // 100px 전에 미리 로드
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 메인 그리드 렌더링
  const mainContent = useMemo(
    () => (
      <div ref={gridContainerRef} className={`w-full min-h-screen bg-black relative ${className}`}>
        <ThiingsGrid
          gridSize={gridSize}
          renderItem={renderItem}
          className="w-full h-full"
          cellWidthRatio={0.8} // 직사각형 셀: 가로 = 세로 × 0.8
        />

        {/* 무한 스크롤 센티넬 */}
        <div ref={sentinelRef} className="h-10 w-full" />

        {/* 로딩 인디케이터 */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}

        {/* 디버그 정보 - production에서는 제거 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50">
            <div className="font-bold mb-2">🎯 Channel API Grid</div>
            <div>Channel: {channelId}</div>
            <div>Cards: {cards.length}</div>
            <div>Grid Size: {gridSize}px</div>
            <div>Cell Width: {Math.round(gridSize * 0.8)}px</div>
            <div>Cell Height: {gridSize}px</div>
            <div>Has More: {hasNextPage ? 'Yes' : 'No'}</div>
            <div>Loading: {isFetchingNextPage ? 'Yes' : 'No'}</div>
            <div>Color Extraction: Active</div>
            <div>API Source: Channel Contents</div>
          </div>
        )}
      </div>
    ),
    [className, gridSize, renderItem, cards.length, channelId, hasNextPage, isFetchingNextPage],
  );

  // 조건부 렌더링을 제거하고 항상 동일한 구조 반환
  console.log('[SimpleThiingsGrid] Render decision:', {
    isLoading: isLoading && cards.length === 0,
    isError,
    cardsLength: cards.length,
    willShowLoading: isLoading && cards.length === 0,
    willShowError: isError,
    willShowMain: !isError && !(isLoading && cards.length === 0),
  });

  // 초기 로딩만 로딩 스크린 표시, 그 외에는 카드 표시
  if (isLoading && cards.length === 0) {
    return loadingContent;
  }

  if (isError) {
    return errorContent;
  }

  return mainContent;
}
