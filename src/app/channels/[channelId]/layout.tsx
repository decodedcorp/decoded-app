'use client';

import React, { useEffect, useState } from 'react';

import { QueryProvider } from '../../../lib/providers/QueryProvider';
import { ToastProvider } from '../../../lib/providers/ToastProvider';
import { AuthInitializer } from '../../../domains/auth/components/AuthInitializer';

import '../../../styles/globals.css';

// 채널 페이지 전용 레이아웃 - 글로벌 헤더 없음
export default function ChannelLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버 사이드에서는 기본 HTML만 렌더링
  if (!isClient) {
    return (
      <html lang="ko">
        <body>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  // 클라이언트에서만 전체 컴포넌트 렌더링
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
