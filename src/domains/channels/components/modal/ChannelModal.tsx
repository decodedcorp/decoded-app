'use client';

import React, { useEffect, useRef } from 'react';
import {
  useChannelModalStore,
  selectIsModalOpen,
  selectSelectedChannel,
} from '@/store/channelModalStore';

export function ChannelModal() {
  const isOpen = useChannelModalStore(selectIsModalOpen);
  const channel = useChannelModalStore(selectSelectedChannel);
  const closeModal = useChannelModalStore((state) => state.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={closeModal} />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
            <div className="flex items-center space-x-4">
              {channel.img && (
                <img
                  src={channel.img}
                  alt={`${channel.name} avatar`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-zinc-600"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">{channel.name}</h2>
                <p className="text-zinc-400">{channel.description}</p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
              aria-label="Close modal"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Channel Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{channel.followers}</div>
                <div className="text-zinc-400 text-sm">Followers</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">247</div>
                <div className="text-zinc-400 text-sm">Posts</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-zinc-400 text-sm">Following</div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
                {channel.category}
              </span>
            </div>

            {/* Channel Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-zinc-300 leading-relaxed">
                {channel.description} This channel explores the intersection of art, design, and
                technology, bringing together creative minds from around the world. Join our
                community to discover innovative ideas and connect with fellow creators.
              </p>
            </div>

            {/* Recent Content Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors cursor-pointer"
                  >
                    <div className="w-full h-32 bg-zinc-700 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-zinc-500">Content {item}</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Amazing Content Title {item}</h4>
                    <p className="text-zinc-400 text-sm">Published 2 days ago</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Channels */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Related Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Design Masters', 'Art Collective', 'Creative Hub'].map((name, idx) => (
                  <div
                    key={name}
                    className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                      <span className="text-zinc-500 text-sm">{name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{name}</div>
                      <div className="text-zinc-400 text-sm">{(idx + 1) * 5.2}K followers</div>
                    </div>
                    <button className="text-xs bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-full transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-zinc-700/50 bg-zinc-900/50">
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors">
                Follow Channel
              </button>
              <button className="px-6 py-2 border border-zinc-600 text-white font-semibold rounded-full hover:bg-zinc-800 transition-colors">
                Share Channel
              </button>
            </div>

            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
