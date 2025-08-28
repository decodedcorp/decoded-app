'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddChannelModal } from '@/domains/create/components/modal/add-channel/AddChannelModal';
import { useAddChannelStore } from '@/domains/create/store/addChannelStore';

export default function CreatePage() {
  const router = useRouter();
  const openModal = useAddChannelStore((state) => state.openModal);
  const isModalOpen = useAddChannelStore((state) => state.isOpen);
  const [hasStartedOpening, setHasStartedOpening] = useState(false);

  // 페이지 진입 시 모달 자동 열기 (중복 방지)
  useEffect(() => {
    console.log('Create page mounted, modal state:', isModalOpen);

    // 모달이 닫혀있을 때만 열기
    if (!isModalOpen) {
      console.log('Opening modal, current state:', isModalOpen);
      setHasStartedOpening(true); // 모달 열기 시작 표시
      openModal();
    } else {
      console.log('Modal is already open, skipping');
      setHasStartedOpening(true); // 이미 열려있으면 열기 완료로 표시
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 모달이 닫힐 때 홈으로 리다이렉트 (모달이 열린 후에만 처리)
  useEffect(() => {
    console.log(
      'useEffect triggered, isModalOpen:',
      isModalOpen,
      'hasStartedOpening:',
      hasStartedOpening,
    );

    // 모달이 닫혔고, 모달 열기가 시작된 후에만 리다이렉트
    if (!isModalOpen && hasStartedOpening) {
      console.log('Modal is closed, redirecting immediately...');

      // 즉시 리다이렉트 시도
      console.log('Attempting redirect...');

      // 방법 1: Next.js router로 부드러운 네비게이션 (새로고침 없음)
      router.replace('/');
      console.log('Method 1: router.replace executed');

      // 방법 2: window.location.href (새로고침 없음)
      setTimeout(() => {
        console.log('Fallback: window.location.href');
        window.location.href = '/';
      }, 100);
    }
  }, [isModalOpen, hasStartedOpening, router]);

  // 모달이 닫혔을 때는 즉시 홈으로 이동 (모달이 열린 후에만 처리)
  useEffect(() => {
    if (!isModalOpen && hasStartedOpening) {
      console.log('Modal closed, redirecting to home');

      // 방법 1: Next.js router로 부드러운 네비게이션 (새로고침 없음)
      router.replace('/');
      console.log('Method 1: router.replace executed');

      // 방법 2: window.location.href (새로고침 없음)
      setTimeout(() => {
        console.log('Fallback: window.location.href');
        window.location.href = '/';
      }, 150);
    }
  }, [isModalOpen, hasStartedOpening, router]);

  // 모달이 닫혔을 때는 아무것도 렌더링하지 않음
  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Create 페이지는 모달만 표시 */}
      <AddChannelModal />
    </div>
  );
}
