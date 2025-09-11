'use client';

import React, { useState } from 'react';

import { Button } from '@decoded/ui';
import { useChannelModalStore } from '@/store/channelModalStore';

import { useChannelTranslation } from '../../../lib/i18n/hooks';

export function TestChannelModal() {
  const [channelId, setChannelId] = useState('');
  const { placeholders, test } = useChannelTranslation();
  const openModalById = useChannelModalStore((state) => state.openModalById);

  const handleOpenModal = () => {
    if (channelId.trim()) {
      openModalById(channelId.trim());
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">{test.modalTitle()}</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder={placeholders.channelId()}
          className="px-2 py-1 text-sm border rounded"
        />
        <Button
          onClick={handleOpenModal}
          variant="primary"
          size="sm"
        >
          {test.openModal()}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1">{test.example()}</p>
    </div>
  );
}
