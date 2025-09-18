import React from 'react';

interface ChannelLayoutProps {
  children: React.ReactNode;
}

// 채널 레이아웃
export default function ChannelLayout({ children }: ChannelLayoutProps) {
  return <>{children}</>;
}
