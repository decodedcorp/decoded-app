/**
 * Invite code validation logic
 * Handles client-side invite code verification
 */

// TODO: Configure this with your actual invite codes
// Option 1: Environment variable
const VALID_CODE = process.env.NEXT_PUBLIC_INVITE_CODE || 'DECODED2024';

// Option 2: Multiple codes (uncomment if needed)
// const VALID_CODES = ['DECODED2024', 'BETA_ACCESS', 'EARLY_BIRD'];

/**
 * Validate invite code against configured valid codes
 * @param code - The user input invite code
 * @returns true if code is valid, false otherwise
 */
export const validateInviteCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;

  const normalizedCode = code.trim().toUpperCase();

  // Simple single code validation
  return normalizedCode === VALID_CODE.toUpperCase();

  // Multiple codes validation (uncomment if using VALID_CODES array)
  // return VALID_CODES.some(validCode => normalizedCode === validCode.toUpperCase());
};

/**
 * Get validation error message for invalid codes
 * @param code - The attempted code
 * @returns Error message or null if valid
 */
export const getValidationError = (code: string): string | null => {
  if (!code || code.trim().length === 0) {
    return '초대코드를 입력해주세요';
  }

  if (!validateInviteCode(code)) {
    return '유효하지 않은 초대코드입니다';
  }

  return null;
};