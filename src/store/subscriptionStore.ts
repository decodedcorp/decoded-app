/**
 * Subscription Store
 * Manages channel subscription state and cache invalidation
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SubscriptionState {
  // State
  subscribedChannels: Set<string>; // Set of subscribed channel IDs
  isLoading: boolean;
  error: string | null;

  // Actions
  subscribe: (channelId: string) => void;
  unsubscribe: (channelId: string) => void;
  setSubscribedChannels: (channelIds: string[]) => void;
  isSubscribed: (channelId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      subscribedChannels: new Set(),
      isLoading: false,
      error: null,

      // Actions
      subscribe: (channelId: string) => {
        set((state) => ({
          subscribedChannels: new Set([...state.subscribedChannels, channelId]),
          error: null,
        }));
      },

      unsubscribe: (channelId: string) => {
        set((state) => {
          const newSet = new Set(state.subscribedChannels);
          newSet.delete(channelId);
          return {
            subscribedChannels: newSet,
            error: null,
          };
        });
      },

      setSubscribedChannels: (channelIds: string[]) => {
        set({
          subscribedChannels: new Set(channelIds),
          error: null,
        });
      },

      isSubscribed: (channelId: string) => {
        return get().subscribedChannels.has(channelId);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'subscription-store',
    },
  ),
);
