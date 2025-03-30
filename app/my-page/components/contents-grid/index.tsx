'use client';

import { useMyPageLikesImage } from '@/lib/hooks/mypage';
import { useEffect, useState } from 'react';
import ContentsItem from './contents-item';

// 이미지 타입 정의
interface LikedImage {
  image_doc_id: string;
  image_url: string;
}

const heightOptions = ['h-48', 'h-64', 'h-72', 'h-56'];

export default function PinsGrid() {
  const { data, isLoading, error } = useMyPageLikesImage({ limit: 20 });
  const [randomHeights, setRandomHeights] = useState<Record<string, string>>({});

  // 이미지 높이를 무작위로 설정
  useEffect(() => {
    if (data?.data?.likes) {
      const heights: Record<string, string> = {};
      data.data.likes.forEach((image: LikedImage) => {
        const randomIndex = Math.floor(Math.random() * heightOptions.length);
        heights[image.image_doc_id] = heightOptions[randomIndex];
      });
      setRandomHeights(heights);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((skeleton) => (
          <div key={skeleton} className="bg-zinc-800/50 h-60 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">에러가 발생했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  const likes = data?.data?.likes || [];

  if (likes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-zinc-400">좋아요한 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {likes.map((image: LikedImage) => (
        <ContentsItem 
          key={image.image_doc_id} 
          imageDocId={image.image_doc_id} 
          imageUrl={image.image_url}
          height={parseInt(randomHeights[image.image_doc_id] || '60')} 
        />
      ))}
    </div>
  );
} 