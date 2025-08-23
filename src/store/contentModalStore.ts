import { create } from 'zustand';

import { ContentItem } from '@/lib/types/content';

// Re-export for backward compatibility
export type { ContentItem };

interface ContentModalState {
  isOpen: boolean;
  selectedContent: ContentItem | null;
  openModal: (content: ContentItem) => void;
  closeModal: () => void;
  closeModalOnEscape: () => void;
  closeModalOnOverlay: () => void;
}

export const useContentModalStore = create<ContentModalState>((set) => ({
  isOpen: false,
  selectedContent: null,
  openModal: (content: ContentItem) => {
    console.log('🎯 [contentModalStore] openModal called with:', content.title);
    set({ isOpen: true, selectedContent: content });
  },
  closeModal: () => {
    console.log('🎯 [contentModalStore] closeModal called (programmatic)');
    set({ isOpen: false, selectedContent: null });
  },
  closeModalOnEscape: () => {
    console.log('🎯 [contentModalStore] closeModalOnEscape called');
    set({ isOpen: false, selectedContent: null });
  },
  closeModalOnOverlay: () => {
    console.log('🎯 [contentModalStore] closeModalOnOverlay called');
    set({ isOpen: false, selectedContent: null });
  },
}));

// Selectors
export const selectIsContentModalOpen = (state: ContentModalState) => state.isOpen;
export const selectSelectedContent = (state: ContentModalState) => state.selectedContent;
