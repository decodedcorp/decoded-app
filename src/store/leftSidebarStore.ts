import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeftSidebarState {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useLeftSidebarStore = create<LeftSidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      toggleCollapse: () => {
        const current = get().isCollapsed;
        set({ isCollapsed: !current });
      },
      setCollapsed: (collapsed: boolean) => {
        set({ isCollapsed: collapsed });
      },
    }),
    {
      name: 'left-sidebar-state',
    }
  )
);

// Selectors
export const selectIsCollapsed = (state: LeftSidebarState) => state.isCollapsed;