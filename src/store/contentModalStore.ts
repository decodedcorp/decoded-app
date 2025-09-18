import { create } from 'zustand';
import { ContentItem } from '@/lib/types/content';
import { toContentHref } from '@/lib/routing';

// Re-export for backward compatibility
export type { ContentItem };

interface ContentModalState {
  isOpen: boolean;
  selectedContent: ContentItem | null;
  previousUrl: string | null;
  openModal: (content: ContentItem, channelId?: string) => void;
  closeModal: () => void;
  closeModalOnEscape: () => void;
  closeModalOnOverlay: () => void;
}

export const useContentModalStore = create<ContentModalState>((set, get) => ({
  isOpen: false,
  selectedContent: null,
  previousUrl: null,
  openModal: (content: ContentItem, channelId?: string) => {
    console.log('🎯 [contentModalStore] openModal called with:', content.title);

    // URL 업데이트 (브라우저 환경에서만)
    if (typeof window !== 'undefined' && channelId) {
      const currentUrl = window.location.href;
      const contentUrl = toContentHref({ channelId, contentId: String(content.id) });
      window.history.pushState({}, '', contentUrl);

      set({
        isOpen: true,
        selectedContent: content,
        previousUrl: currentUrl,
      });
    } else {
      set({ isOpen: true, selectedContent: content });
    }
  },
  closeModal: () => {
    console.log('🎯 [contentModalStore] closeModal called (programmatic)');

    // URL 복원 (브라우저 환경에서만)
    if (typeof window !== 'undefined' && get().previousUrl) {
      window.history.pushState({}, '', get().previousUrl);
    }

    set({ isOpen: false, selectedContent: null, previousUrl: null });
  },
  closeModalOnEscape: () => {
    console.log('🎯 [contentModalStore] closeModalOnEscape called');

    // URL 복원 (브라우저 환경에서만)
    if (typeof window !== 'undefined' && get().previousUrl) {
      window.history.pushState({}, '', get().previousUrl);
    }

    set({ isOpen: false, selectedContent: null, previousUrl: null });
  },
  closeModalOnOverlay: () => {
    console.log('🎯 [contentModalStore] closeModalOnOverlay called');

    // URL 복원 (브라우저 환경에서만)
    if (typeof window !== 'undefined' && get().previousUrl) {
      window.history.pushState({}, '', get().previousUrl);
    }

    set({ isOpen: false, selectedContent: null, previousUrl: null });
  },
}));

// Selectors
export const selectIsContentModalOpen = (state: ContentModalState) => state.isOpen;
export const selectSelectedContent = (state: ContentModalState) => state.selectedContent;
