/**
 * Utility functions for locale detection and filtering
 */

/**
 * Checks if a string contains Korean characters
 * Range: AC00-D7AF (Hangul Syllables), 1100-11FF (Hangul Jamo), 3130-318F (Hangul Compatibility Jamo)
 */
export function isKoreanText(text: string): boolean {
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/;
  return koreanRegex.test(text);
}

/**
 * Filter tags to keep only those containing Korean characters
 */
export function filterKoreanTags(tags: string[] | null | undefined): string[] {
  if (!tags) return [];
  return tags.filter((tag) => isKoreanText(tag));
}

