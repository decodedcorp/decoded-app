'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useChannelModalStore,
  selectIsModalOpen,
  selectSelectedChannel,
} from '@/store/channelModalStore';
import { ChannelModalHeader } from './ChannelModalHeader';
import { ChannelModalStats } from './ChannelModalStats';
import { ChannelModalContributors } from './ChannelModalContributors';
import { ChannelModalContent } from './ChannelModalContent';
import { ChannelModalRelated } from './ChannelModalRelated';
import { ChannelModalFooter } from './ChannelModalFooter';
import { ChannelModalSidebar } from './ChannelModalSidebar';
import { SidebarFilters } from '../sidebar/ChannelSidebar';

export function ChannelModal() {
  const isOpen = useChannelModalStore(selectIsModalOpen);
  const channel = useChannelModalStore(selectSelectedChannel);
  const closeModal = useChannelModalStore((state) => state.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 사이드바 상태 관리
  const [currentFilters, setCurrentFilters] = useState<SidebarFilters>({
    dataTypes: [],
    categories: [],
    tags: [],
  });

  const handleFilterChange = (filters: SidebarFilters) => {
    setCurrentFilters(filters);
    console.log('Filters changed:', filters);
    // TODO: Implement filter logic for content
  };

  // ESC 키와 외부 클릭으로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, closeModal]);

  // 스크롤바 너비 계산 (레이아웃 시프트 방지)
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
  }, [isOpen]);

  if (!isOpen || !channel) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={closeModal}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[95vw] max-w-[1600px] h-[90vh] overflow-hidden animate-bounce-in shadow-2xl flex">
          {/* Sidebar */}
          <div
            className={`
            ${isSidebarOpen ? 'w-80' : 'w-0'} 
            transition-all duration-300 ease-in-out
            lg:block
            ${isSidebarOpen ? 'block animate-slide-in-left' : 'hidden'}
          `}
          >
            <ChannelModalSidebar
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 relative animate-slide-in-right">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute top-4 left-4 z-10 lg:hidden p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <ChannelModalHeader channel={channel} onClose={closeModal} />

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <ChannelModalStats channel={channel} />
              <ChannelModalContributors />
              <ChannelModalContent />
              <ChannelModalRelated />
            </div>

            <ChannelModalFooter />
          </div>
        </div>
      </div>
    </>
  );
}
