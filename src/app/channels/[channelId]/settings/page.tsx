'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { canManageChannelManagers } from '@/lib/utils/channelPermissions';

import { ChannelSettingsLayout } from './components/ChannelSettingsLayout';

export default function ChannelSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const channelId = params.channelId as string;
  
  const { data: channel, isLoading, error } = useChannel(channelId);
  const { user } = useUser();

  // 권한 체크 - 채널 소유자만 접근 가능
  const canManage = canManageChannelManagers(user, channel);

  // 권한이 없으면 채널 페이지로 리다이렉트
  React.useEffect(() => {
    if (!isLoading && !canManage) {
      router.push(`/channels/${channelId}`);
    }
  }, [isLoading, canManage, router, channelId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading channel settings...</div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">Failed to load channel settings</div>
      </div>
    );
  }

  if (!canManage) {
    return null; // 리다이렉트 처리 중
  }

  return (
    <div className="min-h-screen bg-black">
      <ChannelSettingsLayout channel={channel} />
    </div>
  );
}