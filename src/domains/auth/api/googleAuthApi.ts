import { hash } from '@/lib/utils/hash';
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
  sui_address?: string; // 선택적으로 변경
  email: string;
  marketing: boolean;
}

export interface BackendLoginResponse {
  access_token: {
    salt: string;
    user_doc_id: string;
    access_token: string;
    has_sui_address: boolean;
  };
  token_type: string;
  refresh_token?: string;
  user?: any;
}

export class GoogleAuthApi {
  private static readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

  /**
   * Google OAuth 인증 코드를 액세스 토큰으로 교환
   */
  static async exchangeCodeForToken(code: string): Promise<GoogleTokenData> {
    // 환경에 따른 redirect_uri 설정
    const redirectUri =
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
      (process.env.NODE_ENV === 'production'
        ? 'https://decoded.style/auth/callback'
        : typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : 'http://localhost:3000/auth/callback');

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
   * Google ID 토큰의 sub 값을 기반으로 Sui 주소 생성
   * 백엔드 요구사항으로 임시 생성에 사용
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
   * 백엔드 로그인 API 호출
   */
  static async callBackendLogin(requestBody: BackendLoginRequest): Promise<BackendLoginResponse> {
    const backendRequestHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: backendRequestHeaders,
      body: JSON.stringify(requestBody),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text();
      console.error('Backend login API error:', errorData);
      throw new Error(`Backend login failed: ${backendResponse.status}`);
    }

    return await backendResponse.json();
  }

  /**
   * 백엔드 응답에서 사용자 객체 생성 또는 보완
   */
  static createOrEnhanceUser(backendData: BackendLoginResponse, payload: GoogleTokenPayload): any {
    const { name, given_name, family_name, email } = payload;
    const extractedName = name || given_name || family_name || email.split('@')[0];

    if (!backendData.user) {
      // 백엔드 응답에 user 객체가 없는 경우 생성
      return {
        doc_id: backendData.access_token?.user_doc_id || null,
        email: email,
        nickname: extractedName,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      // 백엔드 응답에 name이 없는 경우 Google ID 토큰에서 추출한 name 사용
      if (!backendData.user.nickname && !backendData.user.name) {
        backendData.user.nickname = extractedName;
      }
      return backendData.user;
    }
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
