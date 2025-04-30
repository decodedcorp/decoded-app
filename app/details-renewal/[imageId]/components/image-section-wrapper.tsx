'use client';

import { useState, useEffect } from 'react';
import { ImageSection } from './image-section/image-section';
import { useLike } from '@/app/details-renewal/utils/hooks/use-like';
import { ShareButtons } from '@/components/ui/share-buttons';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageSectionWrapperProps {
  imageData: any;
  selectedItemId?: string;
}

export function ImageSectionWrapper({ imageData, selectedItemId }: ImageSectionWrapperProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [displayLikeCount, setDisplayLikeCount] = useState(imageData?.like || 0);
  
  const { isLiked, likeCount, toggleLike, isLikeLoading } = useLike({
    itemId: imageData?.doc_id || '',
    type: 'image',
    initialLikeCount: imageData?.like || 0,
    initialIsLiked: imageData?.is_liked || false
  });

  // 좋아요 상태가 변경될 때만 displayLikeCount 업데이트
  useEffect(() => {
    if (isLiked) {
      setDisplayLikeCount((prev: number) => prev + 1);
    } else {
      setDisplayLikeCount((prev: number) => prev - 1);
    }
  }, [isLiked]);
  
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedDetailPage');
    if (!hasVisited) {
      setShowGuide(true);
      localStorage.setItem('hasVisitedDetailPage', 'true');
    }
  }, []);

  const handleLikeClick = () => {
    if (isLikeLoading) return;
    toggleLike();
  };

  return (
    <div className="relative w-full h-full">
      {/* ArtistHeader 제거 - 이미 페이지 레벨에서 표시 */}
      
      {/* 기존 이미지 섹션 */}
      <ImageSection 
        imageData={imageData}
        selectedItemId={selectedItemId}
      />
      
      {/* 오버레이 액션 버튼 */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="group relative">
          <button 
            onClick={handleLikeClick}
            disabled={isLikeLoading}
            className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
              isLikeLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/60'
            }`}
          >
            <HeartIcon className={`w-5 h-5 transition-all duration-300 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-white'
            }`} />
          </button>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {displayLikeCount} likes
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all duration-300">
              <ShareIcon className="w-5 h-5 text-white" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-black/90 dark:bg-black border-0 shadow-lg rounded-lg overflow-hidden p-0">
            <ShareButtons 
              title={imageData?.title || '이미지 공유하기'}
              description={imageData?.description || ''}
              buttonVariant="ghost"
            />
          </DialogContent>
        </Dialog>
        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60">
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* 가이드 툴팁 */}
      {showGuide && (
        <div className="absolute bottom-16 right-4 bg-black/80 text-white p-3 rounded-lg text-sm max-w-[200px]">
          여기서 좋아요, 공유하기, 아이템 추가를 할 수 있어요!
          <button 
            className="absolute -top-2 -right-2 rounded-full bg-white text-black w-5 h-5 flex items-center justify-center text-xs"
            onClick={() => setShowGuide(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// 임시 아이콘 컴포넌트 (실제로는 heroicons나 다른 아이콘 라이브러리를 사용하세요)
function HeartIcon(props: any) {
  return <svg {...props} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
}

function ShareIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
}

function PlusIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
} 