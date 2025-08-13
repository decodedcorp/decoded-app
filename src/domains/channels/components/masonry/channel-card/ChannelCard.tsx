'use client';

import React from 'react';
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
  // 동적 메트릭 생성 (실제 데이터로 교체 예정)
  const subscribers = 312 + parseInt(item.id.replace(/\D/g, '') || '0') * 10;
  const contents = 48 + parseInt(item.id.replace(/\D/g, '') || '0') * 5;
  const isVerified = parseInt(item.id.replace(/\D/g, '') || '0') % 3 === 0; // 3의 배수만 인증됨

  const handleSubscribe = (isSubscribed: boolean) => {
    console.log(`Channel ${item.id} subscription changed to: ${isSubscribed}`);
    // TODO: 실제 구독 로직 구현
  };

  return (
    <div
      data-key={item.id} // GSAP 애니메이션을 위해 필수
      role="link"
      tabIndex={0}
      className={`absolute box-content cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        scaleOnHover ? 'transition-transform duration-300 ease-out hover:scale-105' : ''
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
      <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white border border-gray-200/20 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Image Section */}
        <ChannelImageSection
          imageUrl={item.img}
          channelName={item.title || `Channel ${item.id}`}
          colorShiftOnHover={colorShiftOnHover}
        />

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Header Section */}
          <ChannelHeaderSection
            channelName={item.title || `Channel ${item.id}`}
            category={item.category}
            isVerified={isVerified}
          />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            {/* Metrics Section */}
            <ChannelMetricsSection subscribers={subscribers} contents={contents} />

            {/* Subscribe Button Section */}
            <SubscribeButtonSection onSubscribe={handleSubscribe} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
