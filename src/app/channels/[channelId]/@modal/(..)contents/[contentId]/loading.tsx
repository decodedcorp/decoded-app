import React from 'react';
import { Modal } from '@/components/ui/Modal';

/**
 * 모달 로딩 상태
 */
export default function ContentModalLoading() {
  return (
    <Modal ariaLabel="콘텐츠 로딩 중" className="h-[90vh]">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    </Modal>
  );
}