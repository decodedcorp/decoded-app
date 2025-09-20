import React from 'react';
import Link from 'next/link';
import { Button } from '@decoded/ui';

/**
 * 테스트 채널 메인 페이지
 */
export default function TestChannelPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Channel</h1>

        <div className="mb-8">
          <p className="text-zinc-300 mb-4">
            이것은 Intercepting Routes 테스트를 위한 더미 채널 페이지입니다.
          </p>
        </div>

        <div className="grid gap-4">
          <Link href="/test/intercepting-routes">
            <Button variant="primary" className="w-full">
              Intercepting Routes 테스트 페이지로 이동
            </Button>
          </Link>

          <Link href="/channels/test/contents/test-content-1">
            <Button variant="secondary" className="w-full">
              테스트 콘텐츠 직접 링크 (풀페이지)
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-zinc-900 rounded-lg">
          <h3 className="font-semibold mb-2">테스트 시나리오:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
            <li>위의 "Intercepting Routes 테스트 페이지"로 이동</li>
            <li>카드를 클릭해서 모달이 뜨는지 확인</li>
            <li>위의 "테스트 콘텐츠 직접 링크"로 풀페이지가 뜨는지 확인</li>
            <li>브라우저 뒤로가기/앞으로가기 테스트</li>
          </ol>
        </div>
      </div>
    </div>
  );
}