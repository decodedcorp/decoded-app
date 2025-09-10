import { DecodedToken } from '../types/auth';

/**
 * JWT 토큰 디코딩 유틸리티
 */
export class TokenDecoder {
  /**
   * JWT 토큰을 디코딩하여 페이로드 반환
   */
  static decode<T = DecodedToken>(token: string): T {
    try {
      // JWT 형식 검증 (3개의 점으로 구분된 구조)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: token must have 3 parts separated by dots');
      }

      const base64Url = parts[1];
      if (!base64Url) {
        throw new Error('Invalid JWT format: missing payload part');
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('[TokenDecoder] Failed to decode token:', error);
      throw new Error('Invalid token format');
    }
  }

  /**
   * JWT 토큰에서 user_doc_id 추출
   */
  static extractUserDocId(token: string): string {
    try {
      const decoded = this.decode(token);
      return decoded.sub || '';
    } catch (error) {
      console.error('[TokenDecoder] Failed to extract user_doc_id:', error);
      return '';
    }
  }

  /**
   * JWT 토큰에서 이메일 추출
   */
  static extractEmail(token: string): string {
    try {
      const decoded = this.decode(token);
      return decoded.email || '';
    } catch (error) {
      console.error('[TokenDecoder] Failed to extract email:', error);
      return '';
    }
  }

  /**
   * JWT 토큰에서 역할 추출
   */
  static extractRole(token: string): string {
    try {
      const decoded = this.decode(token);
      return decoded.role || 'user';
    } catch (error) {
      console.error('[TokenDecoder] Failed to extract role:', error);
      return 'user';
    }
  }

  /**
   * 토큰 만료 시간 확인
   */
  static isExpired(token: string): boolean {
    try {
      const decoded = this.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('[TokenDecoder] Failed to check token expiration:', error);
      return true; // 디코딩 실패 시 만료된 것으로 처리
    }
  }

  /**
   * 토큰 만료까지 남은 시간 (초)
   */
  static getTimeUntilExpiry(token: string): number {
    try {
      const decoded = this.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, decoded.exp - currentTime);
    } catch (error) {
      console.error('[TokenDecoder] Failed to get time until expiry:', error);
      return 0;
    }
  }
}
