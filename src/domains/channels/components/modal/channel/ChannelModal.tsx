'use client';

import React, { useState } from 'react';
import {
  useChannelModalStore,
  selectIsModalOpen,
  selectSelectedChannel,
} from '@/store/channelModalStore';
import { BaseModal } from '../base/BaseModal';
import { ChannelModalContainer } from '../base/ChannelModalContainer';
import { ChannelModalHeader } from './ChannelModalHeader';
import { ChannelModalStats } from './ChannelModalStats';
import { ChannelModalContributors } from './ChannelModalContributors';
import { ChannelModalContent } from './ChannelModalContent';
import { ChannelModalRelated } from './ChannelModalRelated';
import { ChannelModalFooter } from './ChannelModalFooter';
import { ChannelModalSidebar } from './ChannelModalSidebar';
import { SidebarFilters } from '../../../sidebar/ChannelSidebar';

export function ChannelModal() {
  const isOpen = useChannelModalStore(selectIsModalOpen);
  const channel = useChannelModalStore(selectSelectedChannel);
  const closeModal = useChannelModalStore((state) => state.closeModal);
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

  if (!channel) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
    >
      <ChannelModalContainer
        sidebar={
          <ChannelModalSidebar
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />
        }
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <ChannelModalHeader channel={channel} onClose={closeModal} />

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <ChannelModalStats channel={channel} />
          <ChannelModalContributors />
          <ChannelModalContent />
          <ChannelModalRelated />
        </div>

        <ChannelModalFooter />
      </ChannelModalContainer>
    </BaseModal>
  );
}
