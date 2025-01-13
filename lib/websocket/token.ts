import { networkManager } from '@/lib/network/network';

interface TempTokenResponse {
  status_code: number;
  description: string;
  data: {
    access_token: string;
  };
}

export class TokenManager {
  private static readonly TEMP_TOKEN_KEY = 'temp_token';
  private static readonly TOKEN_EXPIRY_KEY = 'temp_token_expiry';

  static async getTempToken(): Promise<string> {
    try {
      // 저장된 토큰과 만료 시간 확인
      const storedToken = localStorage.getItem(this.TEMP_TOKEN_KEY);
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      // 유효한 토큰이 있다면 재사용
      if (storedToken && expiryTime && Number(expiryTime) > Date.now()) {
        return storedToken;
      }

      // 새로운 임시 토큰 요청
      console.log('[TokenManager] Requesting new temporary token');
      const response = await fetch('https://dev.decoded.style/temp-token', {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch temporary token');
      }

      const data: TempTokenResponse = await response.json();
      const tempToken = data.data.access_token;

      // JWT 토큰에서 만료 시간 추출
      const expirationTime = this.getTokenExpiration(tempToken);
      
      // 토큰과 만료 시간 저장
      localStorage.setItem(this.TEMP_TOKEN_KEY, tempToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expirationTime.toString());

      return tempToken;

    } catch (error) {
      console.error('[TokenManager] Failed to get temporary token:', error);
      throw new Error('Failed to get temporary token');
    }
  }

  private static getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      // 토큰 파싱 실패시 10분 후로 설정
      return Date.now() + 10 * 60 * 1000;
    }
  }

  static clearToken(): void {
    localStorage.removeItem(this.TEMP_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  static isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
