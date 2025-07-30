import { create } from 'zustand';
import { ContentType } from '@/api/generated';

export interface ContentItem {
  id: string | number;
  type: ContentType | 'image' | 'video' | 'text';
  title: string;
  height?: string;
  width?: string;
  category?: string;
  imageUrl?: string;
  description?: string;
  author?: string;
  date?: string;
  likes?: number;
  views?: number;
}

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
