'use client';

import React, { useState } from 'react';

import TiltedCard from './TiltedCard';

export default function TiltedCardTest() {
  const [pixelTransitionTrigger, setPixelTransitionTrigger] = useState(false);

  const handlePixelTransition = () => {
    setPixelTransitionTrigger(true);
    // 3초 후에 다시 false로 설정 (다시 테스트할 수 있도록)
    setTimeout(() => {
      setPixelTransitionTrigger(false);
    }, 3000);
  };

  return (
    <div className="p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">TiltedCard 픽셀 전환 테스트</h1>

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

          {/* 픽셀 전환 TiltedCard */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">픽셀 전환 TiltedCard</h2>
            <div className="w-[300px] h-[300px]">
              <TiltedCard
                imageSrc="https://picsum.photos/300/300?random=2"
                secondImageSrc="https://picsum.photos/300/300?random=3"
                altText="First image"
                secondAltText="Second image"
                captionText="픽셀 전환 카드 - 버튼 클릭으로 전환 확인"
                enablePixelTransition={true}
                pixelTransitionTrigger={pixelTransitionTrigger}
                gridSize={12}
                pixelColor="#ffffff"
                animationStepDuration={0.4}
              />
            </div>
            <button
              onClick={handlePixelTransition}
              disabled={pixelTransitionTrigger}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {pixelTransitionTrigger ? '전환 중...' : '픽셀 전환 시작'}
            </button>
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
              • <strong>픽셀 전환 카드:</strong> &quot;픽셀 전환 시작&quot; 버튼을 클릭하여 이미지 전환
              애니메이션을 확인하세요
            </li>
            <li>
              • 픽셀 전환은 랜덤한 순서로 픽셀이 나타났다가 사라지면서 두 번째 이미지로 전환됩니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
