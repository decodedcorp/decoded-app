'use client';

import { useState } from 'react';
import { LinkForm } from '@/components/modals/link-form';

interface LinkButtonProps {
  imageId: string;
}

export function LinkButton({ imageId }: LinkButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // URL 제출 시 처리 함수 (실제 저장 로직은 별도 API로 구현 필요)
  const handleSubmit = (data: { url: string }) => {
    console.log('Link submitted:', data, 'for image:', imageId);
    // TODO: 필요시 링크 저장을 위한 API 호출 추가
  };

  return (
    <div className="w-full">
      {/* 링크 추가 버튼 */}
      <div className="sticky top-6 float-right -mt-16 mr-2 z-20">
        <button 
          onClick={handleOpenModal}
          className="w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 border border-primary/50 hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
          aria-label="링크 추가"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M12 4V20M20 12H4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      
      {/* 링크 모달 폼 */}
      <LinkForm 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        imageId={imageId}
      />
    </div>
  );
}
