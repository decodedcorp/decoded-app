import { create } from 'zustand';
import { ContentItem } from '@/lib/types/content';

interface ContentSidebarState {
  isOpen: boolean;
  selectedContent: ContentItem | null;
  selectedCardId: string | null;
  openSidebar: (content: ContentItem) => void;
  closeSidebar: () => void;
}

export const useContentSidebarStore = create<ContentSidebarState>((set) => ({
  isOpen: false,
  selectedContent: null,
  selectedCardId: null,
  openSidebar: (content: ContentItem) => {
    console.log('🎯 [contentSidebarStore] openSidebar called with:', content);
    console.log('🎯 [contentSidebarStore] Previous state:', {
      isOpen: false,
      selectedContent: null,
      selectedCardId: null,
    });
    set({
      isOpen: true,
      selectedContent: content,
      selectedCardId: String(content.id),
    });
    console.log('🎯 [contentSidebarStore] Sidebar opened successfully');
  },
  closeSidebar: () => {
    console.log('🎯 [contentSidebarStore] closeSidebar called');
    console.log('🎯 [contentSidebarStore] Previous state:', {
      isOpen: true,
      selectedContent: 'exists',
      selectedCardId: 'exists',
    });
    set({
      isOpen: false,
      selectedContent: null,
      selectedCardId: null,
    });
    console.log('🎯 [contentSidebarStore] Sidebar closed successfully');
  },
}));

// Selectors
export const selectIsSidebarOpen = (state: ContentSidebarState) => state.isOpen;
export const selectSelectedContent = (state: ContentSidebarState) => state.selectedContent;
export const selectSelectedCardId = (state: ContentSidebarState) => state.selectedCardId;
