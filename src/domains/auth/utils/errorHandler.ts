/**
 * Utility for handling authentication-related errors
 */

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Convert API errors to user-friendly messages
 */
export const handleAuthError = (error: unknown): AuthError => {
  if (error instanceof Error) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Please check your network connection.',
        details: error.message,
      };
    }

    // Parse API error messages
    const message = error.message;

    // Common error patterns
    if (message.includes('401') || message.includes('Unauthorized')) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password.',
        details: message,
      };
    }

    if (message.includes('403') || message.includes('Forbidden')) {
      return {
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource.',
        details: message,
      };
    }

    if (message.includes('404') || message.includes('Not Found')) {
      return {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
        details: message,
      };
    }

    if (message.includes('429') || message.includes('Too Many Requests')) {
      return {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.',
        details: message,
      };
    }

    if (message.includes('500') || message.includes('Internal Server Error')) {
      return {
        code: 'SERVER_ERROR',
        message: 'Server error. Please try again later.',
        details: message,
      };
    }

    // Other errors
    return {
      code: 'UNKNOWN_ERROR',
      message: message || 'An unexpected error occurred.',
      details: error.stack,
    };
  }

  if (typeof error === 'string') {
    // String errors
    return {
      code: 'STRING_ERROR',
      message: error,
    };
  }

  // Other types of errors
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred.',
    details: String(error),
  };
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const authError = handleAuthError(error);
  return authError.message;
};

/**
 * Log authentication errors for debugging
 */
export const logAuthError = (error: unknown, context?: string): void => {
  const authError = handleAuthError(error);
  console.error(`Auth Error${context ? ` (${context})` : ''}:`, {
    code: authError.code,
    message: authError.message,
    details: authError.details,
    originalError: error,
  });
};
