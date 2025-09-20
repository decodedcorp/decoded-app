'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { ChannelPageContent } from './components/ChannelPageContent';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;

  return <ChannelPageContent channelId={channelId} />;
}
