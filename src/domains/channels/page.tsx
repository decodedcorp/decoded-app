'use client';

import React from 'react';
import { ChannelMainContent } from './components/layout/ChannelMainContent';
import { TestChannelItem } from './components/TestChannelItem';

export default function ChannelPage() {
  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      {/* Main Content */}
      <div className="h-full overflow-y-auto">
        <ChannelMainContent className="h-full" />
      </div>
      
      {/* 테스트용 채널 아이템 */}
      <TestChannelItem />
    </div>
  );
}
