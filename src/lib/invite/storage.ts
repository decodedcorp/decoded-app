/**
 * Invite code localStorage utilities
 * Handles storage operations with SSR safety
 */

const INVITE_CODE_KEY = 'decoded_invite_code';

/**
 * Get stored invite code from localStorage
 * @returns The stored invite code or null if not found/error
 */
export const getInviteCode = (): string | null => {
  try {
    if (typeof window === 'undefined') return null; // SSR safety
    const code = localStorage.getItem(INVITE_CODE_KEY);
    return code && code.trim().length > 0 ? code.trim() : null;
  } catch {
    // Handle private browsing, disabled storage, etc.
    return null;
  }
};

/**
 * Store invite code in localStorage
 * @param code - The invite code to store
 */
export const setInviteCode = (code: string): void => {
  try {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.setItem(INVITE_CODE_KEY, code.trim());
  } catch {
    // Silently fail in environments without localStorage
    console.warn('Failed to store invite code');
  }
};

/**
 * Clear stored invite code from localStorage
 */
export const clearInviteCode = (): void => {
  try {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.removeItem(INVITE_CODE_KEY);
  } catch {
    // Silently fail
  }
};

/**
 * Check if user has a valid stored invite code
 * @returns true if valid code exists, false otherwise
 */
export const hasValidInviteCode = (): boolean => {
  const code = getInviteCode();
  return code !== null;
};