'use client';

// Channel settings is currently disabled
// import React from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useChannel } from '@/domains/channels/hooks/useChannels';
// import { useUser } from '@/domains/auth/hooks/useAuth';
// import { canManageChannelManagers } from '@/lib/utils/channelPermissions';
// import { ChannelSettingsLayout } from './components/ChannelSettingsLayout';

export default function ChannelSettingsPage() {
  // Channel settings is currently disabled
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Channel Settings</h1>
        <p className="text-zinc-400">Channel settings feature is currently disabled.</p>
      </div>
    </div>
  );
}
