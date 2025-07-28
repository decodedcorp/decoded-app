import { AUTH_CONSTANTS } from '../constants/authConstants';

export interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  accessType: string;
}

export const getGoogleOAuthConfig = (): GoogleOAuthConfig => {
  return {
    clientId: AUTH_CONSTANTS.GOOGLE_OAUTH.CLIENT_ID,
    redirectUri: AUTH_CONSTANTS.GOOGLE_OAUTH.REDIRECT_URI,
    scope: AUTH_CONSTANTS.GOOGLE_OAUTH.SCOPE,
    responseType: 'code',
    accessType: 'offline',
  };
};

export const buildGoogleOAuthUrl = (): string => {
  const config = getGoogleOAuthConfig();
  
  if (!config.clientId) {
    throw new Error('Google OAuth Client ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: config.responseType,
    access_type: config.accessType,
    prompt: 'consent',
  });

  return `${AUTH_CONSTANTS.GOOGLE_OAUTH.AUTH_URL}?${params.toString()}`;
};

export const initiateGoogleOAuth = (): void => {
  try {
    const authUrl = buildGoogleOAuthUrl();
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate Google OAuth:', error);
    throw error;
  }
};

export const handleGoogleOAuthCallback = async (code: string): Promise<any> => {
  try {
    // TODO: Send authorization code to backend
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to handle Google OAuth callback:', error);
    throw error;
  }
};

export const extractAuthCodeFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}; 