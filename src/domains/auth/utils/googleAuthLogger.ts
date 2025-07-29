import { GoogleTokenPayload, BackendLoginRequest } from '../api/googleAuthApi';

export class GoogleAuthLogger {
  /**
   * 개발 환경에서만 로깅
   */
  private static shouldLog(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Google ID 토큰 페이로드 로깅
   */
  static logTokenPayload(payload: GoogleTokenPayload): void {
    if (!this.shouldLog()) return;

    console.log('[Google OAuth] Full token payload:', payload);
    console.log('[Google OAuth] Available fields:', Object.keys(payload));
  }

  /**
   * Sui 주소 생성 과정 로깅
   */
  static logSuiAddressGeneration(sub: string, suiAddress: string): void {
    if (!this.shouldLog()) return;

    console.log('[Google OAuth] Sub value:', sub);
    console.log('[Google OAuth] Generated sui_address:', suiAddress);
  }

  /**
   * 백엔드 요청 로깅
   */
  static logBackendRequest(
    requestBody: BackendLoginRequest,
    hashInput: string,
    hashedToken: string,
  ): void {
    if (!this.shouldLog()) return;

    console.log('[Google OAuth] Backend request body:', requestBody);
    console.log('[Google OAuth] Hash input:', hashInput);
    console.log('[Google OAuth] Hashed token:', hashedToken);
  }

  /**
   * 백엔드 응답 로깅
   */
  static logBackendResponse(response: any): void {
    if (!this.shouldLog()) return;

    console.log('[Google OAuth] Backend response:', response);
  }

  /**
   * 사용자 객체 생성 로깅
   */
  static logUserCreation(user: any): void {
    if (!this.shouldLog()) return;

    console.log('[Google OAuth] Created user object from token:', user);
  }

  /**
   * 닉네임 설정 로깅
   */
  static logNicknameSetting(nickname: string): void {
    if (!this.shouldLog()) return;

    console.log('[Google OAuth] Setting nickname from token:', nickname);
  }
}
