'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ChannelPageContent } from './components/ChannelPageContent';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;

  return (
    <div className="min-h-screen bg-black">
      <ChannelPageContent channelId={channelId} />
    </div>
  );
}