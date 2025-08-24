import { create } from 'zustand';
import { PinResponse } from '@/api/generated/models/PinResponse';
import { UnifiedPinnedItem } from '@/api/generated/models/UnifiedPinnedItem';

interface ChannelPinsState {
  // Pin 상태
  pinnedItems: Map<string, UnifiedPinnedItem[]>; // channelId -> pinned items
  pinnedContentIds: Map<string, Set<string>>; // channelId -> Set of pinned content IDs
  isReordering: boolean;
  
  // Actions
  setPinnedItems: (channelId: string, items: UnifiedPinnedItem[]) => void;
  addPinnedItem: (channelId: string, item: UnifiedPinnedItem) => void;
  removePinnedItem: (channelId: string, contentId: string) => void;
  updatePinOrder: (channelId: string, items: UnifiedPinnedItem[]) => void;
  setIsReordering: (isReordering: boolean) => void;
  clearChannelPins: (channelId: string) => void;
  clearAllPins: () => void;
  
  // Helpers
  isPinned: (channelId: string, contentId: string) => boolean;
  getPinnedItems: (channelId: string) => UnifiedPinnedItem[];
  getPinCount: (channelId: string) => number;
}

export const useChannelPinsStore = create<ChannelPinsState>((set, get) => ({
  // Initial state
  pinnedItems: new Map(),
  pinnedContentIds: new Map(),
  isReordering: false,
  
  // Set all pinned items for a channel
  setPinnedItems: (channelId: string, items: UnifiedPinnedItem[]) => {
    set((state) => {
      const newPinnedItems = new Map(state.pinnedItems);
      const newPinnedContentIds = new Map(state.pinnedContentIds);
      
      // Update pinned items
      newPinnedItems.set(channelId, items);
      
      // Update pinned content IDs set for quick lookup
      const contentIds = new Set(
        items
          .filter(item => item.type === 'content')
          .map(item => item.id)
      );
      newPinnedContentIds.set(channelId, contentIds);
      
      console.log('[channelPinsStore] Set pinned items:', { 
        channelId, 
        itemCount: items.length,
        contentIds: Array.from(contentIds)
      });
      
      return {
        pinnedItems: newPinnedItems,
        pinnedContentIds: newPinnedContentIds,
      };
    });
  },
  
  // Add a single pinned item
  addPinnedItem: (channelId: string, item: UnifiedPinnedItem) => {
    set((state) => {
      const newPinnedItems = new Map(state.pinnedItems);
      const newPinnedContentIds = new Map(state.pinnedContentIds);
      
      // Get existing items or create new array
      const existingItems = newPinnedItems.get(channelId) || [];
      
      // Add new item and sort by pin_order
      const updatedItems = [...existingItems, item].sort(
        (a, b) => a.pin_order - b.pin_order
      );
      newPinnedItems.set(channelId, updatedItems);
      
      // Update content IDs set if it's a content pin
      if (item.type === 'content') {
        const contentIds = newPinnedContentIds.get(channelId) || new Set();
        contentIds.add(item.id);
        newPinnedContentIds.set(channelId, contentIds);
      }
      
      console.log('[channelPinsStore] Added pinned item:', { 
        channelId, 
        itemId: item.id,
        pinType: item.type 
      });
      
      return {
        pinnedItems: newPinnedItems,
        pinnedContentIds: newPinnedContentIds,
      };
    });
  },
  
  // Remove a pinned item
  removePinnedItem: (channelId: string, contentId: string) => {
    set((state) => {
      const newPinnedItems = new Map(state.pinnedItems);
      const newPinnedContentIds = new Map(state.pinnedContentIds);
      
      // Remove from pinned items array
      const existingItems = newPinnedItems.get(channelId) || [];
      const updatedItems = existingItems.filter(
        item => item.id !== contentId
      );
      
      if (updatedItems.length === 0) {
        newPinnedItems.delete(channelId);
      } else {
        newPinnedItems.set(channelId, updatedItems);
      }
      
      // Remove from content IDs set
      const contentIds = newPinnedContentIds.get(channelId);
      if (contentIds) {
        contentIds.delete(contentId);
        if (contentIds.size === 0) {
          newPinnedContentIds.delete(channelId);
        } else {
          newPinnedContentIds.set(channelId, contentIds);
        }
      }
      
      console.log('[channelPinsStore] Removed pinned item:', { 
        channelId, 
        contentId 
      });
      
      return {
        pinnedItems: newPinnedItems,
        pinnedContentIds: newPinnedContentIds,
      };
    });
  },
  
  // Update pin order
  updatePinOrder: (channelId: string, items: UnifiedPinnedItem[]) => {
    set((state) => {
      const newPinnedItems = new Map(state.pinnedItems);
      
      // Sort items by pin_order
      const sortedItems = [...items].sort((a, b) => a.pin_order - b.pin_order);
      newPinnedItems.set(channelId, sortedItems);
      
      console.log('[channelPinsStore] Updated pin order:', { 
        channelId, 
        newOrder: sortedItems.map(item => ({
          id: item.id,
          order: item.pin_order
        }))
      });
      
      return {
        pinnedItems: newPinnedItems,
      };
    });
  },
  
  // Set reordering state
  setIsReordering: (isReordering: boolean) => {
    set({ isReordering });
    console.log('[channelPinsStore] Reordering state:', isReordering);
  },
  
  // Clear pins for a specific channel
  clearChannelPins: (channelId: string) => {
    set((state) => {
      const newPinnedItems = new Map(state.pinnedItems);
      const newPinnedContentIds = new Map(state.pinnedContentIds);
      
      newPinnedItems.delete(channelId);
      newPinnedContentIds.delete(channelId);
      
      console.log('[channelPinsStore] Cleared pins for channel:', channelId);
      
      return {
        pinnedItems: newPinnedItems,
        pinnedContentIds: newPinnedContentIds,
      };
    });
  },
  
  // Clear all pins
  clearAllPins: () => {
    set({
      pinnedItems: new Map(),
      pinnedContentIds: new Map(),
      isReordering: false,
    });
    console.log('[channelPinsStore] Cleared all pins');
  },
  
  // Helper: Check if content is pinned
  isPinned: (channelId: string, contentId: string) => {
    const contentIds = get().pinnedContentIds.get(channelId);
    return contentIds?.has(contentId) || false;
  },
  
  // Helper: Get pinned items for a channel
  getPinnedItems: (channelId: string) => {
    return get().pinnedItems.get(channelId) || [];
  },
  
  // Helper: Get pin count for a channel
  getPinCount: (channelId: string) => {
    const items = get().pinnedItems.get(channelId);
    return items?.length || 0;
  },
}));

// Selectors for better performance
export const selectPinnedItems = (channelId: string) => 
  (state: ChannelPinsState) => state.getPinnedItems(channelId);

export const selectIsPinned = (channelId: string, contentId: string) => 
  (state: ChannelPinsState) => state.isPinned(channelId, contentId);

export const selectPinCount = (channelId: string) => 
  (state: ChannelPinsState) => state.getPinCount(channelId);

export const selectIsReordering = (state: ChannelPinsState) => state.isReordering;