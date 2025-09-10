import { hash } from '@/lib/utils/hash';

import { UsersService } from '../../../api/generated/services/UsersService';
import type { LoginRequest } from '../../../api/generated/models/LoginRequest';

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

// Use the generated LoginRequest type instead
// export interface BackendLoginRequest {
//   jwt_token: string;
//   sui_address?: string; // 스모크 테스트를 위해 선택적으로 변경
//   email: string;
//   marketing: boolean;
// }

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
   * 백엔드 로그인 API 호출 (프록시 사용)
   */
  static async callBackendLogin(requestBody: LoginRequest): Promise<BackendLoginResponse> {
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
   * "Failed to retrieve user after creation attempt" 에러에 대한 재시도 로직 포함
   */
  static async callBackendLoginWithSuiAddressUpdate(
    requestBody: LoginRequest,
  ): Promise<BackendLoginResponse> {
    let lastError: Error;
    
    // 최대 3번 시도 (첫 시도 + 2번 재시도)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[GoogleAuthApi] Login attempt ${attempt}/3`);
        return await this.callBackendLogin(requestBody);
      } catch (error) {
        lastError = error as Error;
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // "Failed to retrieve user after creation attempt" 에러인 경우에만 재시도
        if (errorMessage.includes('Failed to retrieve user after creation attempt')) {
          console.log(`[GoogleAuthApi] Retryable error on attempt ${attempt}/3:`, errorMessage);
          
          if (attempt < 3) {
            // 재시도 전 대기 (1초 -> 2초)
            const delayMs = attempt * 1000;
            console.log(`[GoogleAuthApi] Waiting ${delayMs}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
        }
        
        // 재시도할 수 없는 에러이거나 최대 시도 횟수 도달
        console.error(`[GoogleAuthApi] Non-retryable error or max attempts reached:`, errorMessage);
        throw error;
      }
    }
    
    // 이 코드에 도달하지 않아야 하지만 TypeScript를 위해 추가
    throw lastError!;
  }
}
