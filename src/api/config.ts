import { OpenAPI } from './generated';

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development';

// API configuration
export const configureApi = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.decoded.style';

  OpenAPI.BASE = baseUrl;
  OpenAPI.WITH_CREDENTIALS = false;
  OpenAPI.CREDENTIALS = 'omit';

  // Set token from localStorage if available (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        OpenAPI.TOKEN = token;
      }
    } catch (error) {
      console.warn('Failed to get access token:', error);
    }
  }

  if (isDevelopment) {
    console.log('🔧 API configured:', {
      BASE: OpenAPI.BASE,
      WITH_CREDENTIALS: OpenAPI.WITH_CREDENTIALS,
      CREDENTIALS: OpenAPI.CREDENTIALS,
      TOKEN: OpenAPI.TOKEN ? '***' : 'undefined',
    });
  }
};

// Set API headers
export const setApiHeaders = (headers: Record<string, string>) => {
  OpenAPI.HEADERS = headers;
};

// Set API token
export const setApiToken = (token: string | null) => {
  if (token) {
    OpenAPI.TOKEN = token;
  } else {
    OpenAPI.TOKEN = undefined;
  }
};
