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

export const extractAuthCodeFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};

/**
 * Google OAuth 에러 메시지를 사용자 친화적으로 변환
 */
export const getGoogleOAuthErrorMessage = (error: string): string => {
  const errorMessages: Record<string, string> = {
    access_denied: '로그인이 취소되었습니다.',
    invalid_request: '잘못된 요청입니다.',
    unauthorized_client: '인증되지 않은 클라이언트입니다.',
    unsupported_response_type: '지원되지 않는 응답 타입입니다.',
    invalid_scope: '잘못된 권한 범위입니다.',
    server_error: '서버 오류가 발생했습니다.',
    temporarily_unavailable: '일시적으로 서비스를 사용할 수 없습니다.',
  };

  return errorMessages[error] || '로그인 중 오류가 발생했습니다.';
};
