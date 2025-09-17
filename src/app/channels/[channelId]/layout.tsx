import React from 'react';

interface ChannelLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

// Parallel Routes 지원 채널 레이아웃
export default function ChannelLayout({ children, modal }: ChannelLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
