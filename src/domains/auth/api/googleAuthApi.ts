import { hash } from '@/lib/utils/hash';
import { BackendLoginResponse } from '../types/auth';
import { UsersService } from '../../../api/generated/services/UsersService';

export interface GoogleTokenData {
  access_token: string;
  id_token: string;
}

export interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name?: string;
  iat: number;
  exp: number;
}

export interface BackendLoginRequest {
  jwt_token: string;
  sui_address?: string; // 스모크 테스트를 위해 선택적으로 변경
  email: string;
  marketing: boolean;
}


export class GoogleAuthApi {
  private static readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

  /**
   * Google OAuth 인증 코드를 액세스 토큰으로 교환
   */
  static async exchangeCodeForToken(code: string): Promise<GoogleTokenData> {
    // 환경에 따른 redirect_uri 설정
    const getRedirectUri = () => {
      // 명시적으로 설정된 경우 우선 사용
      if (process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) {
        return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
      }

      // 브라우저 환경에서는 현재 origin 사용
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback`;
      }

      // 서버 환경에서 환경별 기본값 설정
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/auth/callback`;
      }

      // 프로덕션 환경 기본값
      if (process.env.NODE_ENV === 'production') {
        return 'https://decoded.style/auth/callback';
      }

      // 개발 환경 기본값
      return 'http://localhost:3000/auth/callback';
    };

    const redirectUri = getRedirectUri();

    console.log('[GoogleAuthApi] Using redirect URI:', redirectUri);
    console.log('[GoogleAuthApi] Environment details:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      EXPLICIT_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    });

    const tokenRequestBody = new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenRequestHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const tokenResponse = await fetch(this.GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: tokenRequestHeaders,
      body: tokenRequestBody,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange error:', errorData);
      throw new Error('Failed to exchange authorization code');
    }

    return await tokenResponse.json();
  }

  /**
   * JWT 토큰을 검증하고 페이로드를 디코딩
   */
  static decodeAndValidateToken(idToken: string): GoogleTokenPayload {
    const tokenParts = idToken.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

    if (!payload.email) {
      throw new Error('No email in token');
    }

    return payload;
  }

  /**
   * SUI zkLogin을 사용하여 올바른 Sui 주소 생성
   * @param jwt - Google ID Token (JWT)
   * @param userSalt - 사용자별 고유 salt (백엔드에서 제공)
   */
  static async generateSuiAddressFromZkLogin(jwt: string, userSalt: string): Promise<string> {
    try {
      const { jwtToAddress } = await import('@mysten/zklogin');
      return jwtToAddress(jwt, userSalt);
    } catch (error) {
      console.error('[SUI zkLogin] Failed to generate address:', error);
      throw new Error('Failed to generate SUI address using zkLogin');
    }
  }

  /**
   * 임시 Sui 주소 생성 (백엔드 호환성 위해 유지)
   * @deprecated 백엔드에서 user_salt 제공 후 generateSuiAddressFromZkLogin 사용 예정
   */
  static generateSuiAddress(sub: string): string {
    return `0x${hash(sub).substring(0, 40)}`;
  }

  /**
   * Google ID 토큰을 해시하여 고유 식별자 생성
   */
  static generateHashedToken(sub: string, iss: string, aud: string): string {
    const hashInput = `${sub}${iss}${aud}`;
    return hash(hashInput);
  }

  /**
   * 백엔드 로그인 API 호출 (프록시 사용)
   */
  static async callBackendLogin(requestBody: BackendLoginRequest): Promise<BackendLoginResponse> {
    // 1. API_BASE_URL 가드 + 절대 URL 사용
    const API_BASE_URL = process.env.API_BASE_URL;
    if (!API_BASE_URL) {
      throw new Error('[Config] API_BASE_URL missing (prod)');
    }
    console.log('[LOGIN] apiBaseUrl=', API_BASE_URL?.slice(0, 12));
    const loginUrl = new URL('/auth/login', API_BASE_URL).toString();

    // 2. 서버-서버 호출 헤더 정리 (CORS 헤더 제거)
    const backendRequestHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    console.log('[GoogleAuthApi] Backend API details:', {
      apiBaseUrl: API_BASE_URL,
      loginUrl,
      NODE_ENV: process.env.NODE_ENV,
    });

    // 3. 백엔드 API 호출
    const backendResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: backendRequestHeaders,
      body: JSON.stringify(requestBody),
    });

    // 4. 응답 에러 핸들링 명확화
    if (!backendResponse.ok) {
      let errorInfo: any = null;
      try {
        errorInfo = await backendResponse.json();
      } catch {
        // JSON 파싱 실패 시 텍스트로 시도
        const errorText = await backendResponse.text();
        errorInfo = { error: errorText };
      }

      console.error('[GoogleAuthApi] Backend login failed:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        errorInfo,
        requestBodyValidation: {
          hasJwtToken: !!requestBody.jwt_token,
          jwtTokenLength: requestBody.jwt_token?.length,
          hasSuiAddress: !!requestBody.sui_address,
          suiAddressLength: requestBody.sui_address?.length,
          suiAddressFormat: requestBody.sui_address?.startsWith('0x'),
          hasEmail: !!requestBody.email,
          marketing: requestBody.marketing,
        },
      });

      throw new Error(`[LOGIN] ${backendResponse.status} ${JSON.stringify(errorInfo)}`);
    }

    return await backendResponse.json();
  }

  /**
   * 백엔드 응답에서 사용자 객체 생성 또는 보완
   */
  static createOrEnhanceUser(backendData: BackendLoginResponse, payload: GoogleTokenPayload): any {
    const { name, given_name, family_name, email } = payload;
    const extractedName = name || given_name || family_name || email.split('@')[0];

    // 새로운 백엔드 응답 구조에 맞게 user 객체 생성
    // 백엔드에서 제공하는 aka를 우선 사용, 없으면 Google 정보로 fallback
    return {
      doc_id: backendData.user_doc_id,
      email: email,
      nickname: backendData.aka || extractedName, // ✨ 백엔드 aka 우선 사용
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * 백엔드 로그인 API 호출 (sui_address 업데이트는 클라이언트에서 처리)
   */
  static async callBackendLoginWithSuiAddressUpdate(
    requestBody: BackendLoginRequest,
  ): Promise<BackendLoginResponse> {
    // 백엔드 로그인 API 호출만 수행
    // sui_address 업데이트는 클라이언트에서 React Query를 통해 처리
    return await this.callBackendLogin(requestBody);
  }
}
