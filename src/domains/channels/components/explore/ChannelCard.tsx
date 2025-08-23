'use client';

import React from 'react';
import { ChannelCard as CommonChannelCard, ChannelCardProps } from '@/components/ChannelCard';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';

// explore 전용 ChannelCard - 공통 컴포넌트를 래핑
export interface ExploreChannelCardProps {
  channel: ChannelResponse;
  size?: 'small' | 'medium' | 'large';
  onCardClick?: (channel: ChannelResponse) => void;
  className?: string;
}

export const ChannelCard: React.FC<ExploreChannelCardProps> = ({
  channel,
  size = 'large',
  onCardClick,
  className = '',
}) => {
  // 공통 컴포넌트에 전달할 props 변환
  const commonProps: ChannelCardProps = {
    channel,
    size,
    onCardClick,
    className,
    // explore 스타일 활성화
    highlightCategory: true,
  };

  return <CommonChannelCard {...commonProps} />;
};

export default ChannelCard;
