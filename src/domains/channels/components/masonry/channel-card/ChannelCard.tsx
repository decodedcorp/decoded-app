'use client';

import React, { useState, useCallback } from 'react';
import { Item } from '../types';
import ChannelImageSection from './ChannelImageSection';
import ChannelHeaderSection from './ChannelHeaderSection';
import ChannelMetricsSection from './ChannelMetricsSection';
import SubscribeButtonSection from './SubscribeButtonSection';

interface ChannelCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
  onKeyDown: (e: React.KeyboardEvent, item: Item) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  scaleOnHover?: boolean;
  colorShiftOnHover?: boolean;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  item,
  onItemClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  scaleOnHover = false,
  colorShiftOnHover = false,
}) => {
  const [extractedColor, setExtractedColor] = useState<{
    primary: { rgb: string; hex: string; hsl: string };
    vibrant: { rgb: string; hex: string; hsl: string };
    muted: { rgb: string; hex: string; hsl: string };
  } | null>(null);

  // 동적 메트릭 생성 (실제 데이터로 교체 예정)
  const subscribers = 312 + parseInt(item.id.replace(/\D/g, '') || '0') * 10;
  const contents = 48 + parseInt(item.id.replace(/\D/g, '') || '0') * 5;
  const isVerified = parseInt(item.id.replace(/\D/g, '') || '0') % 3 === 0; // 3의 배수만 인증됨

  const handleSubscribe = useCallback(
    (isSubscribed: boolean) => {
      console.log(`Channel ${item.id} subscription changed to: ${isSubscribed}`);
      // TODO: 실제 구독 로직 구현
    },
    [item.id],
  );

  // Memoize the color extraction callback to prevent infinite loops
  const handleColorExtracted = useCallback(
    (colorData: {
      primary: { rgb: string; hex: string; hsl: string };
      vibrant: { rgb: string; hex: string; hsl: string };
      muted: { rgb: string; hex: string; hsl: string };
    }) => {
      console.log('🎨 ChannelCard received color data:', colorData);
      setExtractedColor(colorData);
    },
    [],
  );

  // Enhanced dynamic styles based on extracted colors with stronger visual impact
  const cardStyle = extractedColor
    ? {
        // 강화된 테두리: Vibrant 색상으로 더 선명하게
        borderColor: `rgba(${extractedColor.vibrant.rgb}, 0.6)`,
        borderWidth: '2px',
        borderStyle: 'solid',

        // 다층 드롭 섀도우: Primary + Vibrant 조합으로 깊이감 극대화
        boxShadow: `
          0 8px 32px -8px rgba(${extractedColor.primary.rgb}, 0.4),
          0 4px 16px -4px rgba(${extractedColor.vibrant.rgb}, 0.3),
          0 2px 8px -2px rgba(${extractedColor.vibrant.rgb}, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,

        // 호버 시 극대화된 섀도우 효과
        '--hover-shadow': `
          0 20px 40px -10px rgba(${extractedColor.primary.rgb}, 0.5),
          0 10px 20px -5px rgba(${extractedColor.vibrant.rgb}, 0.4),
          0 4px 12px -2px rgba(${extractedColor.vibrant.rgb}, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,

        // 포커스 링: 더 선명한 Vibrant 색상
        '--focus-ring': `rgba(${extractedColor.vibrant.rgb}, 0.8)`,

        // 내부 글로우: Primary 색상으로 미묘한 빛 효과
        '--inner-glow': `rgba(${extractedColor.primary.rgb}, 0.08)`,
      }
    : {
        // 기본 스타일 (색상 추출 전) - 더 세련되게
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
          0 6px 20px -6px rgba(0, 0, 0, 0.15),
          0 3px 10px -3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      };

  return (
    <div
      data-key={item.id} // GSAP 애니메이션을 위해 필수
      role="link"
      tabIndex={0}
      className={`channel-card absolute box-content cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        scaleOnHover ? 'transition-all duration-300 ease-out hover:scale-105' : ''
      }`}
      style={{
        willChange: 'transform, width, height, opacity',
        transform: 'translate3d(0, 0, 0)', // GPU 가속 힌트
      }}
      onClick={() => onItemClick(item)}
      onKeyDown={(e) => onKeyDown(e, item)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="card-container w-full h-full relative rounded-2xl overflow-hidden bg-white color-transition transition-all duration-500 ease-out hover:shadow-[var(--hover-shadow,0_20px_40px_-10px_rgba(0,0,0,0.2))] hover:scale-[1.03]"
        style={cardStyle}
        onFocus={(e) => {
          // 포커스 시 테두리와 섀도우 극대화
          if (extractedColor) {
            e.currentTarget.style.borderColor = `rgba(${extractedColor.vibrant.rgb}, 0.9)`;
            e.currentTarget.style.boxShadow = `
              0 0 0 4px rgba(${extractedColor.vibrant.rgb}, 0.3),
              0 8px 32px -8px rgba(${extractedColor.primary.rgb}, 0.4),
              0 4px 16px -4px rgba(${extractedColor.vibrant.rgb}, 0.3),
              0 2px 8px -2px rgba(${extractedColor.vibrant.rgb}, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;
          }
        }}
        onBlur={(e) => {
          // 포커스 해제 시 원래 스타일로 복원
          if (extractedColor) {
            e.currentTarget.style.borderColor = `rgba(${extractedColor.vibrant.rgb}, 0.6)`;
            e.currentTarget.style.boxShadow = cardStyle.boxShadow;
          }
        }}
      >
        {/* Image Section */}
        <ChannelImageSection
          imageUrl={item.img}
          channelName={item.title || `Channel ${item.id}`}
          colorShiftOnHover={colorShiftOnHover}
          onColorExtracted={handleColorExtracted}
        />

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Header Section */}
          <ChannelHeaderSection
            channelName={item.title || `Channel ${item.id}`}
            category={item.category}
            isVerified={isVerified}
            extractedColor={extractedColor}
          />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            {/* Metrics Section */}
            <ChannelMetricsSection subscribers={subscribers} contents={contents} />

            {/* Subscribe Button Section */}
            <SubscribeButtonSection onSubscribe={handleSubscribe} extractedColor={extractedColor} />
          </div>
        </div>

        {/* Enhanced inner glow effect when colors are loaded */}
        {extractedColor && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(${extractedColor.primary.rgb}, 0.08) 0%, transparent 70%)`,
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

        {/* Subtle border glow effect */}
        {extractedColor && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
            style={{
              background: `linear-gradient(45deg, transparent 30%, rgba(${extractedColor.vibrant.rgb}, 0.1) 50%, transparent 70%)`,
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
      </div>
    </div>
  );
};

export default ChannelCard;
