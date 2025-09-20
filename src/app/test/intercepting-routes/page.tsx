'use client';

import React from 'react';
import { ContentsCardLink } from '@/components/ContentsCardLink';

// 테스트용 더미 데이터
const dummyContent = {
  id: 'test-content-1',
  thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=500&fit=crop',
  avgColor: '#4A90E2',
  metadata: {
    title: 'Test Content: Intercepting Routes 테스트',
    author: {
      name: 'Test Author'
    }
  },
  type: 'article'
};

/**
 * Intercepting Routes 테스트 페이지
 */
export default function InterceptingRoutesTestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Intercepting Routes 테스트</h1>

        <div className="mb-8">
          <h2 className="text-xl mb-4">테스트 방법:</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-300">
            <li>아래 카드를 클릭하면 모달이 열려야 함 (URL: /channels/test/contents/test-content-1)</li>
            <li>ESC 키나 오버레이 클릭으로 모달 닫기</li>
            <li>브라우저 뒤로가기/앞으로가기 테스트</li>
            <li>새 탭에서 직접 링크 열기: <a href="/channels/test/contents/test-content-1" target="_blank" className="text-blue-400 underline">직접 링크</a></li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentsCardLink
            channelId="test"
            card={dummyContent}
            uniqueId="test-1"
            gridIndex={0}
            className="w-full"
          />
          <ContentsCardLink
            channelId="test"
            card={{
              ...dummyContent,
              id: 'test-content-2',
              metadata: {
                ...dummyContent.metadata,
                title: 'Test Content 2: 다른 콘텐츠'
              }
            }}
            uniqueId="test-2"
            gridIndex={1}
            className="w-full"
          />
          <ContentsCardLink
            channelId="test"
            card={{
              ...dummyContent,
              id: 'test-content-3',
              metadata: {
                ...dummyContent.metadata,
                title: 'Test Content 3: 세 번째 콘텐츠'
              }
            }}
            uniqueId="test-3"
            gridIndex={2}
            className="w-full"
          />
        </div>

        <div className="mt-8 p-4 bg-zinc-900 rounded-lg">
          <h3 className="font-semibold mb-2">확인 사항:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300">
            <li>카드 클릭 시 모달이 뜨는지</li>
            <li>URL이 올바르게 변경되는지</li>
            <li>모달이 닫힐 때 원래 페이지로 돌아가는지</li>
            <li>새 탭에서 직접 링크 접속 시 풀페이지로 뜨는지</li>
            <li>브라우저 뒤로/앞으로 가기가 정상 작동하는지</li>
            <li>모달 열려 있을 때 ESC 키가 작동하는지</li>
          </ul>
        </div>
      </div>
    </div>
  );
}