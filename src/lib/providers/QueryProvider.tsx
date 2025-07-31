'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const isDevelopment = process.env.NODE_ENV === 'development';

// Create QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 유지 시간 최적화
      staleTime: 2 * 60 * 1000, // 2분 (기존 5분에서 단축)
      gcTime: 5 * 60 * 1000, // 5분 (기존 10분에서 단축)

      // 재시도 정책 최적화
      retry: (failureCount, error) => {
        // 401 에러는 재시도하지 않음
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        // 네트워크 에러는 2회만 재시도
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

      // 불필요한 리페치 방지
      refetchOnWindowFocus: false,
      refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
      refetchOnReconnect: false, // 재연결 시 자동 리페치 비활성화

      // 백그라운드 업데이트 최적화
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1, // 뮤테이션은 1회만 재시도
      retryDelay: 1000,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider component
 * Enables React Query usage throughout the app with optimized caching.
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
