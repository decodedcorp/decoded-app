import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { ContentBody } from '@/domains/content/ContentBody';

// 테스트용 더미 콘텐츠 데이터 (풀페이지와 동일)
const dummyContent = {
  id: 'test-content-1',
  type: 'text' as const,
  title: 'Test Content: Intercepting Routes 테스트',
  description: '이것은 Intercepting Routes 기능을 테스트하기 위한 더미 콘텐츠입니다.',
  aiSummary: 'Intercepting Routes 테스트용 콘텐츠',
  thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=630&fit=crop',
  author: 'Test Author',
  date: '2024-01-15T10:30:00Z',
  likes: 42,
  views: 100,
  sourceUrl: 'https://example.com/test-content',
  domain: 'example.com',
  aiMetadata: {
    tags: ['test', 'intercepting-routes', 'nextjs'],
    description: 'Intercepting Routes 테스트용 콘텐츠',
    mood: 'informative',
    style: 'technical',
    objects: ['code', 'routing'],
    colors: ['blue', 'white']
  },
  metadata: {
    game: 'Test Game',
    topics: 'intercepting-routes,nextjs',
    platforms: 'web',
    contentType: 'article',
    releaseYear: '2024'
  }
};

/**
 * 테스트 콘텐츠 모달 (Intercepting Route)
 */
export default function TestContentModal() {
  return (
    <Modal
      onCloseHref="/test/intercepting-routes"
      ariaLabel={`${dummyContent.title} 콘텐츠 모달`}
      className="h-[90vh]"
    >
      {/* 모달 알림 */}
      <div className="absolute top-12 left-4 right-4 bg-green-600 text-white p-2 text-center text-sm rounded z-20">
        🎯 이것은 <strong>모달 모드</strong>입니다 (Intercepting Routes)
      </div>

      <ContentBody
        content={dummyContent}
        variant="modal"
        channelId="test"
      />
    </Modal>
  );
}