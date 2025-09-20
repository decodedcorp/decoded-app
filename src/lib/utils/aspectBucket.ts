/**
 * Aspect ratio bucket system for consistent image display
 * Based on Instagram's feed optimization patterns
 */

export type AspectBucket =
  | 'PORTRAIT_4_5' // 4:5 (0.8) - Instagram's preferred portrait ratio
  | 'PORTRAIT_3_4' // 3:4 (0.75) - Instagram's new portrait ratio
  | 'SQUARE_1_1' // 1:1 (1.0) - Square format
  | 'LANDSCAPE_16_9'; // 16:9 (1.78) - Landscape format

/**
 * Pick the most appropriate aspect bucket for given dimensions
 * @param w - Original width
 * @param h - Original height
 * @returns AspectBucket that best fits the image
 */
export function pickAspectBucket(w: number, h: number): AspectBucket {
  const ratio = w / h; // >1 landscape, <1 portrait

  if (ratio < 0.9) {
    // Portrait: choose between 3:4 and 4:5
    return ratio <= 0.78 ? 'PORTRAIT_3_4' : 'PORTRAIT_4_5';
  } else if (ratio < 1.15) {
    // Square-ish: use 1:1
    return 'SQUARE_1_1';
  } else {
    // Landscape: use 16:9
    return 'LANDSCAPE_16_9';
  }
}

/**
 * Get CSS aspect-ratio value for a bucket
 */
export function getAspectRatioCSS(bucket: AspectBucket): string {
  const ratios = {
    PORTRAIT_4_5: '4/5',
    PORTRAIT_3_4: '3/4',
    SQUARE_1_1: '1/1',
    LANDSCAPE_16_9: '16/9',
  };

  return ratios[bucket];
}

/**
 * Get Tailwind aspect-ratio class for a bucket
 */
export function getAspectRatioClass(bucket: AspectBucket): string {
  const classes = {
    PORTRAIT_4_5: '[aspect-ratio:4/5]',
    PORTRAIT_3_4: '[aspect-ratio:3/4]',
    SQUARE_1_1: '[aspect-ratio:1/1]',
    LANDSCAPE_16_9: '[aspect-ratio:16/9]',
  };

  return classes[bucket];
}
