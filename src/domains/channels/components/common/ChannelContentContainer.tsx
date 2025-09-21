'use client';

import React from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { ChannelData } from '@/store/channelModalStore';
import { ChannelExploreFilters, ChannelContentFilters } from '../../types/unifiedFilters';

// 공통 로딩 상태 컴포넌트
export const ChannelContentLoading = ({ title = 'Loading...' }: { title?: string }) => (
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
          <div key={i} className="h-4 w-16 bg-zinc-800 rounded mx-auto animate-pulse" />
        ))}
      </div>
    </div>

    {/* Content 스켈레톤 */}
    <div>
      <div className="h-8 w-32 bg-zinc-700 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 bg-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// 공통 에러 상태 컴포넌트
export const ChannelContentError = ({
  title = 'Failed to load content',
  subtitle = 'Please try again later',
}: {
  title?: string;
  subtitle?: string;
}) => (
  <div className="text-center p-8">
    <div className="text-red-500 text-lg font-medium mb-2">{title}</div>
    <div className="text-zinc-400 text-sm">{subtitle}</div>
  </div>
);

// 공통 빈 상태 컴포넌트
export const ChannelContentEmpty = ({
  title = 'No content found',
  subtitle = 'Try adjusting your filters or check back later',
}: {
  title?: string;
  subtitle?: string;
}) => (
  <div className="text-center p-8">
    <div className="text-zinc-300 text-lg font-medium mb-2">{title}</div>
    <div className="text-zinc-500 text-sm">{subtitle}</div>
  </div>
);

// 공통 컨테이너 Props
export interface ChannelContentContainerProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  hasData?: boolean;
  loadingTitle?: string;
  errorTitle?: string;
  errorSubtitle?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
}

// 공통 컨테이너 컴포넌트
export function ChannelContentContainer({
  children,
  className = '',
  isLoading = false,
  error = null,
  hasData = false,
  loadingTitle = 'Loading...',
  errorTitle = 'Failed to load content',
  errorSubtitle = 'Please try again later',
  emptyTitle = 'No content found',
  emptySubtitle = 'Try adjusting your filters or check back later',
}: ChannelContentContainerProps) {
  if (isLoading) {
    return (
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${className}`}>
        <ChannelContentLoading title={loadingTitle} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${className}`}>
        <ChannelContentError title={errorTitle} subtitle={errorSubtitle} />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${className}`}>
        <ChannelContentEmpty title={emptyTitle} subtitle={emptySubtitle} />
      </div>
    );
  }

  return (
    <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}

// 채널 데이터 타입 가드
export function isChannelResponse(channel: any): channel is ChannelResponse {
  return channel && typeof channel === 'object' && 'owner_id' in channel;
}

export function isChannelData(channel: any): channel is ChannelData {
  return channel && typeof channel === 'object' && 'id' in channel && 'name' in channel;
}

// 채널 데이터 정규화 함수
export function normalizeChannelData(channel: ChannelResponse | ChannelData): ChannelData {
  if (isChannelResponse(channel)) {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description || null,
      owner_id: channel.owner_id || '',
      managers: channel.managers || [],
      manager_ids: channel.manager_ids || [],
      thumbnail_url: channel.thumbnail_url || null,
      subscriber_count: channel.subscriber_count || 0,
      content_count: channel.content_count || 0,
      created_at: channel.created_at || undefined,
      updated_at: channel.updated_at || null,
      is_subscribed: channel.is_subscribed || false,
      is_owner: channel.is_owner || false,
      is_manager: channel.is_manager || false,
    };
  }

  return channel;
}
