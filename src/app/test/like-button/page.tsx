'use client';

import React from 'react';

import { ChannelCard } from '@/components/ChannelCard/ChannelCard';
import { ContentsCard } from '@/components/ContentsCard/ContentsCard';

const testChannelData = {
  id: 'test-channel-1',
  name: 'Test Channel',
  description: 'This is a test channel for demonstrating the like functionality',
  profileImageUrl: 'https://picsum.photos/400/400?random=1',
  isVerified: true,
  followerCount: 1234,
  contentCount: 56,
  category: 'Technology',
};

const testContentData = {
  id: 'test-content-1',
  thumbnailUrl: 'https://picsum.photos/400/500?random=2',
  contentId: 'test-content-1', // 콘텐츠 좋아요를 위한 ID
  avgColor: '#3b82f6',
  metadata: {
    title: 'Test Content Card',
    author: {
      name: 'Test Author',
    },
  },
  type: 'image',
};

export default function LikeButtonTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          좋아요 기능 테스트 페이지
        </h1>
        
        <div className="space-y-12">
          {/* ChannelCard 테스트 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              ChannelCard 좋아요 기능
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 좋아요 버튼 없음 */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">기본 (좋아요 버튼 없음)</h3>
                <ChannelCard
                  channel={testChannelData}
                  size="medium"
                  showLikeButton={false}
                />
              </div>
              
              {/* 좋아요 버튼 있음 - 작은 크기 */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">작은 크기 + 좋아요</h3>
                <ChannelCard
                  channel={testChannelData}
                  size="small"
                  showLikeButton={true}
                />
              </div>
              
              {/* 좋아요 버튼 있음 - 큰 크기 */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">큰 크기 + 좋아요</h3>
                <ChannelCard
                  channel={testChannelData}
                  size="large"
                  showLikeButton={true}
                />
              </div>
            </div>
          </section>

          {/* ContentsCard 테스트 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              ContentsCard 좋아요 기능
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 기본 (좋아요 버튼 표시) */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">기본 (좋아요 버튼)</h3>
                <ContentsCard
                  card={testContentData}
                  uniqueId="test-1"
                  gridIndex={0}
                />
              </div>
              
              {/* 좋아요 버튼 숨김 */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">좋아요 버튼 숨김</h3>
                <ContentsCard
                  card={testContentData}
                  uniqueId="test-2"
                  gridIndex={1}
                  showLikeButton={false}
                />
              </div>
              
              {/* 다른 콘텐츠 */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">다른 콘텐츠</h3>
                <ContentsCard
                  card={{
                    ...testContentData,
                    id: 'test-content-2',
                    contentId: 'test-content-2',
                    thumbnailUrl: 'https://picsum.photos/400/500?random=3',
                  }}
                  uniqueId="test-3"
                  gridIndex={2}
                />
              </div>
              
              {/* 콘텐츠 ID 없음 */}
              <div>
                <h3 className="text-lg text-gray-300 mb-3">콘텐츠 ID 없음</h3>
                <ContentsCard
                  card={{
                    ...testContentData,
                    id: 'test-content-3',
                    contentId: undefined,
                    thumbnailUrl: 'https://picsum.photos/400/500?random=4',
                  }}
                  uniqueId="test-4"
                  gridIndex={3}
                />
              </div>
            </div>
          </section>

          {/* 독립 HeartButton 테스트 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              독립 HeartButton 컴포넌트
            </h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-gray-300 text-sm">Small</span>
                  <div className="relative">
                    <img 
                      src="https://picsum.photos/200/150?random=5"
                      alt="test"
                      className="rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        className="group relative flex items-center justify-center min-w-[2rem] h-8 px-2 gap-1 bg-black/70 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-200 hover:bg-black/80 hover:scale-110 hover:border-white/40"
                      >
                        <svg
                          className="w-4 h-4 transition-all duration-200 text-white/80 fill-none group-hover:text-red-400"
                          fill="currentColor"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="text-white font-medium text-xs">42</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-12 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">테스트 가이드</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• 하트 버튼을 클릭하여 좋아요/좋아요 취소 테스트</li>
              <li>• 로딩 상태 확인 (API 요청 중 스피너 표시)</li>
              <li>• 좋아요 수 변화 확인 (낙관적 업데이트)</li>
              <li>• 다양한 카드 크기에서의 레이아웃 테스트</li>
              <li>• 콘텐츠 ID가 없는 경우 좋아요 버튼이 표시되지 않는지 확인</li>
              <li>• 채널 카드는 채널 좋아요, 콘텐츠 카드는 콘텐츠 좋아요 사용</li>
              <li>• 모든 콘텐츠 카드에 기본적으로 작은 좋아요 버튼 표시</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}