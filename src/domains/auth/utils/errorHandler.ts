import { ApiError } from '../../../api/generated';

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Handle authentication errors consistently
 */
export const handleAuthError = (error: unknown): AuthError => {
  // Handle generated API errors
  if (error instanceof ApiError) {
    return {
      message: error.message || 'Authentication failed',
      status: error.status,
    };
  }

  // Handle fetch errors
  if (error instanceof Error) {
    return {
      message: error.message || 'Authentication failed',
    };
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred during authentication',
  };
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): error is AuthError => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

/**
 * Get user-friendly error message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (isAuthError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Log authentication errors for debugging
 */
export const logAuthError = (error: unknown, context?: string): void => {
  const authError = handleAuthError(error);
  console.error(`Auth Error${context ? ` (${context})` : ''}:`, {
    code: authError.code,
    message: authError.message,
    details: authError.status, // Assuming status is the 'details' for logging
    originalError: error,
  });
};
