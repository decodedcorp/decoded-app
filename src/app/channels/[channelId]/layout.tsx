import React from 'react';

import { QueryProvider } from '../../../lib/providers/QueryProvider';
import { ToastProvider } from '../../../lib/providers/ToastProvider';
import { AuthInitializer } from '../../../domains/auth/components/AuthInitializer';

import '../../../styles/globals.css';

// 채널 페이지 전용 레이아웃 - 글로벌 헤더 없음
export default function ChannelLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ToastProvider>
            <AuthInitializer />
            {/* 글로벌 헤더 제거 - 채널 페이지는 fullscreen */}
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}