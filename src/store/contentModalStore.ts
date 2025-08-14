import { create } from 'zustand';

import { ContentItem } from '@/lib/types/content';

// Re-export for backward compatibility
export type { ContentItem };

interface ContentModalState {
  isOpen: boolean;
  selectedContent: ContentItem | null;
  openModal: (content: ContentItem) => void;
  closeModal: () => void;
}

export const useContentModalStore = create<ContentModalState>((set) => ({
  isOpen: false,
  selectedContent: null,
  openModal: (content: ContentItem) => {
    set({ isOpen: true, selectedContent: content });
  },
  closeModal: () => {
    set({ isOpen: false, selectedContent: null });
  },
}));

// Selectors
export const selectIsContentModalOpen = (state: ContentModalState) => state.isOpen;
export const selectSelectedContent = (state: ContentModalState) => state.selectedContent;
