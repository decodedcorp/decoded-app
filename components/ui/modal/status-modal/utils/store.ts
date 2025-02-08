import { create } from 'zustand';
import type { StatusStore, StatusConfig } from './types';

export const useStatusStore = create<StatusStore>((set) => ({
  isOpen: false,
  type: 'success',
  messageKey: undefined,
  title: undefined,
  message: undefined,
  setStatus: (config: StatusConfig) => set({ ...config, isOpen: true }),
  closeStatus: () => set({ isOpen: false }),
})); 