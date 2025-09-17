'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@decoded/ui';
import { Modal } from '@/components/ui/Modal';

interface ContentModalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 모달 에러 상태
 */
export default function ContentModalError({ error, reset }: ContentModalErrorProps) {
  const router = useRouter();

  return (
    <Modal ariaLabel="콘텐츠 오류" className="h-[90vh]">
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            콘텐츠를 불러올 수 없습니다
          </h2>
          <p className="text-zinc-400 mb-6">
            {error.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={reset}
              variant="primary"
              size="sm"
            >
              다시 시도
            </Button>
            <Button
              onClick={() => router.back()}
              variant="secondary"
              size="sm"
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}