'use client';

import React from 'react';

import TiltedCard from './TiltedCard';

export default function TiltedCardTest() {

  return (
    <div className="p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">TiltedCard 테스트</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 기본 TiltedCard */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">기본 TiltedCard</h2>
            <div className="w-[300px] h-[300px]">
              <TiltedCard
                imageSrc="https://picsum.photos/300/300?random=1"
                altText="Test image 1"
                captionText="기본 카드 - 마우스 호버로 3D 효과 확인"
              />
            </div>
          </div>

          {/* 오버레이 TiltedCard */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">오버레이 TiltedCard</h2>
            <div className="w-[300px] h-[300px]">
              <TiltedCard
                imageSrc="https://picsum.photos/300/300?random=2"
                altText="Test image 2"
                captionText="오버레이 카드 - 호버 시 오버레이 표시"
                displayOverlayContent={true}
                overlayContent={
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-lg mb-2">오버레이 콘텐츠</h3>
                    <p className="text-sm">이것은 오버레이 예시입니다.</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="mt-12 p-6 bg-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">사용법</h3>
          <ul className="space-y-2 text-zinc-300">
            <li>
              • <strong>기본 카드:</strong> 마우스를 올려서 3D 틸트 효과를 확인하세요
            </li>
            <li>
              • <strong>오버레이 카드:</strong> 마우스를 올려서 오버레이 콘텐츠를 확인하세요
            </li>
            <li>
              • 카드는 마우스 움직임에 따라 자연스럽게 기울어지며 3D 효과를 제공합니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
