'use client';

import { cn } from '@/lib/utils/style';
import { Activity } from '../types';
import ArrowRight from '@/app/(main)/sections/discover/ui/arrow-right.svg';
import { useState } from 'react';
import Image from 'next/image';
interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { data } = activity;
  const [isLoading, setIsLoading] = useState(false);

  // 조건부 스타일 함수
  const getItemLenStyle = () =>
    cn(data.item_len ? 'text-[#EAFD66]' : 'text-blue-400');

  // 클릭 이벤트 핸들러
  const handleProvideClick = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // TODO: 서버 요청 로직 추가
      console.log('Providing items for:', data.image_doc_id);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 서버 요청 시뮬레이션
    } catch (error) {
      console.error('Failed to provide items:', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div
      className={cn(
        'bg-zinc-800/30 backdrop-blur-sm',
        'border border-zinc-700/30 rounded-xl',
        'p-4 transition-all duration-300',
        'hover:bg-zinc-700/30 hover:border-zinc-600/30'
      )}
    >
      <div className="flex gap-4">
        {/* 요청 이미지 */}
        <div
          className={cn(
            'w-16 h-16 rounded-lg overflow-hidden',
            'border border-zinc-700/50'
          )}
        >
          <Image
            src={data.image_url}
            alt={`Image ${data.image_doc_id}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/fallback-image.png'; // 대체 이미지 경로
            }}
            width={64}
            height={64}
          />
        </div>

        {/* 요청 정보 */}
        <div className="flex-1">
          <div className="flex items-center justify-between h-full">
            {/* 아이템 정보 */}
            <div className="space-y-1">
              <p className="text-sm text-white leading-snug">
                <span className={getItemLenStyle()}>{data.item_len}</span>
                개의 아이템이 요청되었습니다
              </p>
            </div>

            {/* 제공 버튼 */}
            <button
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium',
                'border border-[#EAFD66]/20',
                'bg-[#EAFD66]/10 text-[#EAFD66]',
                isLoading && 'opacity-50 cursor-not-allowed', // 로딩 상태 스타일
                'hover:bg-[#EAFD66]/20 transition-colors',
                'flex items-center gap-1'
              )}
              onClick={handleProvideClick}
              disabled={isLoading}
            >
              <span>{isLoading ? '처리 중...' : '제공하기'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
