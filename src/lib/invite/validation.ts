/**
 * Invite code validation logic
 * Handles client-side invite code verification
 */

// Single valid invite code
const VALID_CODE = 'DECODEDBETA250924-30';

/**
 * Validate invite code against the single valid code
 * @param code - The user input invite code
 * @returns true if code is valid, false otherwise
 */
export const validateInviteCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;

  const normalizedCode = code.trim().toUpperCase();
  return normalizedCode === VALID_CODE.toUpperCase();
};

/**
 * Get validation error message for invalid codes
 * @param code - The attempted code
 * @returns Error message or null if valid
 */
export const getValidationError = (code: string, t: (key: string) => string): string | null => {
  if (!code || code.trim().length === 0) {
    return t('inviteCode.errors.required');
  }

  if (!validateInviteCode(code)) {
    return t('inviteCode.errors.invalid');
  }

  return null;
};

/**
 * Get the valid invite code (for admin/debug purposes)
 * @returns The single valid invite code
 */
export const getValidCode = (): string => {
  return VALID_CODE;
};

/**
 * Get all valid invite codes (for admin purposes)
 * @returns Array containing all valid invite codes
 */
export const getAllValidCodes = (): string[] => {
  return [VALID_CODE];
};

/**
 * Get total number of valid invite codes
 * @returns Always returns 1 for single code
 */
export const getValidCodesCount = (): number => {
  return 1;
};
