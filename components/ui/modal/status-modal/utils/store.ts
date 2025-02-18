import { create } from 'zustand';
import type { StatusStore, StatusConfig } from './types';

export const useStatusStore = create<StatusStore>((set) => ({
  isOpen: false,
  type: 'success',
  messageKey: undefined,
  title: undefined,
  message: undefined,
  isLoading: false,
  setStatus: (config: StatusConfig) => set({ ...config, isOpen: true }),
  closeStatus: () => set({ isOpen: false }),
  startLoading: () => set({ isOpen: true, type: 'loading' }),
  finishLoading: (config: StatusConfig) => set({ ...config, isOpen: true }),
})); 