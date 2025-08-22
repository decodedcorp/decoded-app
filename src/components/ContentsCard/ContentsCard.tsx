'use client';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImageColor } from '@/domains/main/hooks/useImageColor';

// ContentsCard Props 인터페이스
export interface ContentsCardProps {
  card: {
    id: string;
    thumbnailUrl: string;
    avgColor?: string;
    metadata?: {
      title?: string;
      author?: {
        name: string;
      };
    };
    type?: string;
  };
  isMoving?: boolean;
  onCardClick?: (card: any) => void;
  isSelected?: boolean;
  isBlurred?: boolean;
  uniqueId: string;
  gridIndex: number;
  className?: string;
}

// 블러 오버레이 컴포넌트
const BlurOverlay = ({ isBlurred }: { isBlurred: boolean }) => {
  if (!isBlurred) return null;

  return <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10" />;
};

// 고급 카드 컴포넌트 - 색상 추출 및 동적 스타일링 적용
export const ContentsCard = memo(
  ({
    card,
    isMoving = false,
    onCardClick,
    isSelected = false,
    isBlurred = false,
    uniqueId,
    gridIndex,
    className = '',
  }: ContentsCardProps) => {
    // 안전장치: card prop이 undefined인지 확인
    if (!card) {
      console.error('🔍 [ContentsCard] Card prop is undefined:', { card, uniqueId, gridIndex });
      return (
        <div className="w-full aspect-[4/5] bg-red-500 flex items-center justify-center text-white text-xs">
          Error: Card data is missing
        </div>
      );
    }

    // 디버깅: 카드 데이터 로깅
    console.log('🔍 [ContentsCard] Rendering card:', {
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
        // 4:5 비율로 고정 - 높이는 자동 계산
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

        console.log('🎯 [ContentsCard] Card clicked, card:', card);
        console.log('🎯 [ContentsCard] isMoving:', isMoving);
        console.log('🎯 [ContentsCard] onCardClick function:', onCardClick);
        console.log('🎯 [ContentsCard] onCardClick type:', typeof onCardClick);
        console.log('🎯 [ContentsCard] onCardClick toString:', onCardClick?.toString());

        if (onCardClick && !isMoving) {
          console.log('🎯 [ContentsCard] Calling onCardClick with card:', card);
          try {
            onCardClick(card);
            console.log('🎯 [ContentsCard] onCardClick executed successfully');
          } catch (error) {
            console.error('🎯 [ContentsCard] Error executing onCardClick:', error);
          }
        } else {
          console.log('🎯 [ContentsCard] onCardClick not called - reason:', {
            hasOnCardClick: !!onCardClick,
            isMoving,
          });
        }

        // 디버깅: 직접 handleCardClick 함수를 찾아서 호출해보기
        console.log('🎯 [ContentsCard] Trying to find handleCardClick in parent scope...');
        // @ts-ignore - 디버깅 목적
        if ((window as any).debugHandleCardClick) {
          console.log('🎯 [ContentsCard] Found debug function, calling it...');
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
        className={`relative bg-zinc-900 rounded-xl overflow-hidden mx-auto cursor-pointer transition-shadow duration-300 ease-out aspect-[4/5] ${className} ${
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
            console.error('🔍 [ContentsCard] Image load error:', {
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

ContentsCard.displayName = 'ContentsCard';
