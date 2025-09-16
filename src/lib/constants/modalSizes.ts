/**
 * Modal size constants for consistent width and height across all modals
 */

export const MODAL_SIZES = {
  // Wide modal for content upload and channel selection
  WIDE: 'max-w-[95vw] sm:max-w-[90vw] md:max-w-[1200px] lg:max-w-[1200px] xl:max-w-[1200px] max-h-[90vh] sm:max-h-[85vh] md:max-h-[90vh]',

  // Standard modal for general use
  STANDARD:
    'max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh]',

  // Small modal for simple dialogs
  SMALL:
    'max-w-[95vw] sm:max-w-[90vw] md:max-w-[500px] lg:max-w-[500px] xl:max-w-[500px] max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh]',
} as const;

export type ModalSize = keyof typeof MODAL_SIZES;
