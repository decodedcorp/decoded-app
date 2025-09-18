'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@decoded/ui';

/**
 * 콘텐츠 404 페이지
 */
export default function ContentNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-zinc-500 text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold mb-4">콘텐츠를 찾을 수 없습니다</h1>
        <p className="text-zinc-400 mb-8">
          요청하신 콘텐츠가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">홈으로 이동</Button>
          </Link>
          <Button onClick={() => window.history.back()} variant="secondary">
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  );
}
