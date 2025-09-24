/**
 * Invite code validation logic
 * Handles client-side invite code verification
 */

// Generated invite codes - 30 unique codes
const GENERATED_CODES = [
  'DECODED2024',
  'BETA_ACCESS',
  'EARLY_BIRD',
  'WELCOME_2024',
  'JOIN_DECODED',
  'ACCESS_GRANTED',
  'INVITE_ALPHA',
  'BETA_TESTER',
  'FOUNDER_PASS',
  'VIP_ACCESS',
  'DECODED_VIP',
  'ALPHA_USER',
  'BETA_USER',
  'EARLY_ACCESS',
  'FOUNDER_2024',
  'DECODED_BETA',
  'ACCESS_CODE',
  'INVITE_CODE',
  'WELCOME_PASS',
  'JOIN_NOW',
  'DECODED_ALPHA',
  'BETA_PASS',
  'VIP_2024',
  'FOUNDER_VIP',
  'ALPHA_PASS',
  'EARLY_VIP',
  'DECODED_FOUNDER',
  'BETA_FOUNDER',
  'ALPHA_FOUNDER',
  'VIP_FOUNDER',
];

// Environment variable fallback (single code)
const FALLBACK_CODE = process.env.NEXT_PUBLIC_INVITE_CODE || 'DECODED2024';

// Get valid codes from environment or use generated codes
const getValidCodes = (): string[] => {
  const envCodes = process.env.NEXT_PUBLIC_INVITE_CODES;
  if (envCodes) {
    try {
      return JSON.parse(envCodes);
    } catch {
      console.warn('Invalid NEXT_PUBLIC_INVITE_CODES format, using generated codes');
    }
  }
  return GENERATED_CODES;
};

const VALID_CODES = getValidCodes();

/**
 * Validate invite code against configured valid codes
 * @param code - The user input invite code
 * @returns true if code is valid, false otherwise
 */
export const validateInviteCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;

  const normalizedCode = code.trim().toUpperCase();

  // Check against multiple valid codes
  return VALID_CODES.some((validCode) => normalizedCode === validCode.toUpperCase());
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

/**
 * Get all valid invite codes (for admin/debug purposes)
 * @returns Array of all valid invite codes
 */
export const getAllValidCodes = (): string[] => {
  return [...VALID_CODES];
};

/**
 * Get total number of valid invite codes
 * @returns Number of valid codes
 */
export const getValidCodesCount = (): number => {
  return VALID_CODES.length;
};
