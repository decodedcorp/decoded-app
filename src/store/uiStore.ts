import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        sidebarMobileOpen: false,
        
        toggleSidebar: () => set((state) => ({ 
          sidebarCollapsed: !state.sidebarCollapsed 
        })),
        
        setSidebarCollapsed: (collapsed) => set({ 
          sidebarCollapsed: collapsed 
        }),
        
        setSidebarMobileOpen: (open) => set({ 
          sidebarMobileOpen: open 
        }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ 
          sidebarCollapsed: state.sidebarCollapsed 
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);