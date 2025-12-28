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

interface ExtractOptions {
  splitByComma?: boolean;
}

/**
 * Extract Korean part from a multi-language string
 *
 * @param text The text to parse
 * @param options Configuration options
 * @param options.splitByComma Whether to split by commas (default: true). Set to false for long descriptions.
 */
export function extractKoreanPart(
  text: string,
  options: ExtractOptions = { splitByComma: true }
): string | null {
  if (!text) return null;

  // Build the split regex based on options
  // Always split by slash, pipe, parentheses
  let separators = "\\/|()";

  if (options.splitByComma) {
    separators += ",";
  }

  const regex = new RegExp(`[${separators}]`);

  // Split and trim
  const parts = text.split(regex).map((part) => part.trim());

  // Find the first part that contains Korean
  const koreanPart = parts.find((part) => isKoreanText(part));

  // Return Korean part if found, otherwise return null
  return koreanPart || null;
}

/**
 * Filter tags to keep only those containing Korean characters
 * Also handles multi-language strings by extracting the Korean part
 */
export function filterKoreanTags(tags: string[] | null | undefined): string[] {
  if (!tags) return [];

  return tags
    .map((tag) => {
      // Use extractKoreanPart to handle both separators and pure Korean strings
      // (extractKoreanPart returns the string itself if it's Korean and has no separators,
      // or the Korean part if separators exist)
      return extractKoreanPart(tag);
    })
    .filter((tag): tag is string => tag !== null);
}
