'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { canManageChannelManagers } from '@/lib/utils/channelPermissions';
import { ChannelSettingsLayout } from './components/ChannelSettingsLayout';
import { InlineSpinner } from '@/shared/components/loading/InlineSpinner';
import { useCommonTranslation } from '@/lib/i18n/hooks';

export default function ChannelSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const channelId = params.channelId as string;
  const { user } = useUser();
  const t = useCommonTranslation();

  const { data: channel, isLoading, error } = useChannel(channelId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <InlineSpinner size="lg" />
          <p className="mt-4 text-zinc-400">{t.channelSettings.loadingSettings()}</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !channel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">{t.channelSettings.channelNotFound()}</h1>
          <p className="text-zinc-400 mb-6">{t.channelSettings.channelNotFoundDescription()}</p>
          <button
            onClick={() => router.push('/channels')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            {t.channelSettings.backToChannels()}
          </button>
        </div>
      </div>
    );
  }

  // 권한 확인
  if (!canManageChannelManagers(user, channel)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">{t.channelSettings.accessDenied()}</h1>
          <p className="text-zinc-400 mb-6">{t.channelSettings.accessDeniedDescription()}</p>
          <button
            onClick={() => router.push(`/channels/${channelId}`)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            {t.channelSettings.backToChannel()}
          </button>
        </div>
      </div>
    );
  }

  return <ChannelSettingsLayout channel={channel} />;
}
