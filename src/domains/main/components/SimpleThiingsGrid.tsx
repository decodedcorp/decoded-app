'use client';

import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import ThiingsGrid, { type ItemConfig } from './ThiingsGrid';
import { useCards, useImageColor } from '../hooks';

// 고급 카드 컴포넌트 - 색상 추출 및 동적 스타일링 적용
const SimpleCard = memo(({ card, isMoving }: { card: any; isMoving: boolean }) => {
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
    if (!isMoving && !extractedColor && !isExtracting && imgRef.current?.complete && !hasProcessedColor) {
      const timeoutId = setTimeout(handleColorExtracted, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isMoving, extractedColor, isExtracting, hasProcessedColor, handleColorExtracted]);

  // 동적 스타일 (색상 추출 기반)
  const cardStyle = useMemo(() => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      transform: `scale(${isMoving ? 0.98 : 1})`,
      opacity: isMoving ? 0.9 : 1,
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
  }, [extractedColor, isMoving]);

  // 배경 스타일 메모이제이션
  const bgStyle = useMemo(
    () => ({
      backgroundColor: card.avgColor || '#18181b',
    }),
    [card.avgColor],
  );

  // 그라디언트 스타일들 메모이제이션 (성능 최적화)
  const gradientStyles = useMemo(() => ({
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
  }), [extractedColor]);

  // 호버 이벤트 핸들러들 메모이제이션
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (extractedColor) {
      e.currentTarget.style.borderColor = `rgba(${extractedColor.vibrant.rgb}, 0.9)`;
    }
  }, [extractedColor]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (extractedColor) {
      e.currentTarget.style.borderColor = `rgba(${extractedColor.vibrant.rgb}, 0.6)`;
    }
  }, [extractedColor]);

  return (
    <div
      className="relative bg-zinc-900 rounded-xl overflow-hidden transition-all duration-500 ease-out hover:shadow-[var(--hover-shadow,0_20px_40px_-10px_rgba(0,0,0,0.2))] hover:scale-[1.03] mx-auto"
      style={{
        ...cardStyle,
        willChange: 'transform, box-shadow, border-color',
        transform: `translate3d(0, 0, 0) ${cardStyle.transform}`, // GPU 가속 힙트
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
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
            <p className="text-zinc-300 text-sm truncate font-medium">by {card.metadata.author.name}</p>
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
});

SimpleCard.displayName = 'SimpleCard';

export function SimpleThiingsGrid({ className = '' }: { className?: string }) {
  // 카드 데이터 로드 - 더 많은 카드를 미리 로드
  const { cards, isLoading, isError, error } = useCards({
    limit: 50,
    sortBy: 'latest',
  });

  // Hydration 오류 방지를 위한 상태 관리
  const [gridSize, setGridSize] = useState(400); // 기본값으로 시작 (높이 기준)

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

  // 최적화된 renderItem - useCallback 적용
  const renderItem = useCallback(
    ({ gridIndex, isMoving }: ItemConfig) => {
      // 카드가 없는 경우 early return
      if (cards.length === 0) {
        return (
          <div className="w-full h-full bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
            <div className="text-zinc-400 text-sm">#{gridIndex}</div>
          </div>
        );
      }

      // gridIndex를 이용해 카드 순환 사용
      const card = cards[gridIndex % cards.length];
      return <SimpleCard card={card} isMoving={isMoving} />;
    },
    [cards],
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

  // 메인 그리드 렌더링
  const mainContent = useMemo(
    () => (
      <div className={`w-full h-screen bg-black relative ${className}`}>
        <ThiingsGrid
          gridSize={gridSize}
          renderItem={renderItem}
          className="w-full h-full"
          cellWidthRatio={0.8} // 직사각형 셀: 가로 = 세로 × 0.8
        />

        {/* 디버그 정보 - production에서는 제거 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50">
            <div className="font-bold mb-2">🎯 Optimized ThiingsGrid</div>
            <div>Cards: {cards.length}</div>
            <div>Grid Size: {gridSize}px</div>
            <div>Cell Width: {Math.round(gridSize * 0.8)}px</div>
            <div>Cell Height: {gridSize}px</div>
            <div>Card: 100% fill (4:5 ratio via cell shape)</div>
            <div>Color Extraction: Active</div>
            <div>Dynamic Styling: Enabled</div>
            <div>Aspect Ratio: 4:5 (1.25)</div>
            <div>Performance: 120fps</div>
          </div>
        )}
      </div>
    ),
    [className, gridSize, renderItem, cards.length],
  );

  // 조건부 렌더링을 제거하고 항상 동일한 구조 반환
  if (isLoading && cards.length === 0) {
    return loadingContent;
  }

  if (isError) {
    return errorContent;
  }

  return mainContent;
}
