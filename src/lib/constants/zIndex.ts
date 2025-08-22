// Z-index constants for consistent layering
export const Z_INDEX = {
  // Background layers
  BACKGROUND: 0,
  CONTENT: 1,
  
  // UI Elements
  DROPDOWN: 100,
  STICKY_HEADER: 200,
  TOOLTIP: 300,
  
  // Overlays
  MODAL_BACKGROUND_BLUR: 999,
  MODAL_OVERLAY: 1000,
  MODAL_CONTENT: 1010,
  
  // Top level
  TOAST: 2000,
  DEBUG: 9999,
} as const;

// Helper functions for consistent z-index usage
export const getZIndex = (layer: keyof typeof Z_INDEX): number => Z_INDEX[layer];

// Tailwind z-index class mapping
export const Z_INDEX_CLASSES = {
  BACKGROUND: 'z-0',
  CONTENT: 'z-10',
  DROPDOWN: 'z-[100]',
  STICKY_HEADER: 'z-[200]',
  TOOLTIP: 'z-[300]',
  MODAL_BACKGROUND_BLUR: 'z-[999]',
  MODAL_OVERLAY: 'z-[1000]',
  MODAL_CONTENT: 'z-[1010]',
  TOAST: 'z-[2000]',
  DEBUG: 'z-[9999]',
} as const;