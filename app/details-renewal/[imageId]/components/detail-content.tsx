'use client';

import { useEffect } from 'react';
import { useDummyData } from './item-list-section/dummy-data-provider';
import { MasonryItemsGrid } from './item-list-section/server/masonry-items-grid';

interface DetailContentProps {
  imageId: string;
}

export default function DetailContent({ imageId }: DetailContentProps) {
  const { imageDetails, isLoading, error, relatedItems } = useDummyData();

  // 오류가 있는 경우 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  // 로딩 중이거나 데이터가 없는 경우
  if (isLoading || !imageDetails) {
    return null; // Suspense fallback이 표시됨
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 메인 이미지 섹션 */}
        <div className="lg:w-2/3">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 relative">
            <img
              src={imageDetails.src}
              alt={imageDetails.title}
              className="w-full h-full object-cover"
            />
            {imageDetails.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="w-0 h-0 border-y-10 border-y-transparent border-l-16 border-l-white ml-2"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 이미지 정보 섹션 */}
        <div className="lg:w-1/3 space-y-4">
          <h1 className="text-2xl font-bold">{imageDetails.title}</h1>
          
          {/* 태그 */}
          <div className="flex flex-wrap gap-2">
            {imageDetails.tags.map((tag, index) => (
              <span key={index} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          {/* 설명 */}
          <p className="text-gray-400">
            {imageDetails.description || '이 이미지에 대한 설명이 없습니다.'}
          </p>
          
          {/* 액션 버튼 */}
          <div className="flex gap-4 pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              좋아요
            </button>
            <button className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
              공유하기
            </button>
          </div>
        </div>
      </div>

      {/* 관련 아이템 섹션 */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">관련 아이템</h2>
        <MasonryItemsGrid />
      </div>
    </div>
  );
} 