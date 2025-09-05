'use client';

import React, { useState } from 'react';
import { Button } from '@decoded/ui';

import { useChannelModalStore } from '@/store/channelModalStore';

export function TestChannelModal() {
  const [channelId, setChannelId] = useState('');
  const openModalById = useChannelModalStore((state) => state.openModalById);

  const handleOpenModal = () => {
    if (channelId.trim()) {
      openModalById(channelId.trim());
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">채널 모달 테스트</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="채널 ID 입력"
          className="px-2 py-1 text-sm border rounded"
        />
        <Button
          onClick={handleOpenModal}
          variant="primary"
          size="sm"
        >
          모달 열기
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1">예: test-channel-1, demo-channel-2</p>
    </div>
  );
}
