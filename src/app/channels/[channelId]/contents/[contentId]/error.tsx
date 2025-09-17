'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@decoded/ui';

interface ContentPageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 콘텐츠 페이지 에러 상태
 */
export default function ContentPageError({ error, reset }: ContentPageErrorProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-red-500 text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold mb-4">
          콘텐츠를 불러올 수 없습니다
        </h1>
        <p className="text-zinc-400 mb-8">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            variant="primary"
          >
            다시 시도
          </Button>
          <Button
            onClick={() => router.back()}
            variant="secondary"
          >
            이전 페이지로
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-xs text-zinc-600 mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}