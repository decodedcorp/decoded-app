'use client';

import { useEffect, useState } from 'react';
import { networkManager } from '@/lib/network/network';
import { jwtDecode } from 'jwt-decode';
import { jwtToAddress } from '@mysten/zklogin';
import { usePathname } from 'next/navigation';
import { hash } from '@/lib/utils/string/string';

// Google OAuth JWT 타입
interface GoogleJWT {
  iss: string;          // 'https://accounts.google.com'
  azp: string;          // Google Client ID
  aud: string;          // Google Client ID
  sub: string;          // Google User ID
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  iat: number;          // 발급 시간
  exp: number;          // 만료 시간
  nonce: string;        // ZK Login nonce
}

// TokenScope enum과 동일하게 정의
enum TokenScope {
  ACCESS = 'access',
  TEMPORARY = 'temporary',
  ADMIN = 'admin'
}

// 백엔드 JWT 타입 (from TokenScope)
type TokenRole = 'access' | 'temporary' | 'admin';

// 백엔드 JWT 타입 (from JWTPayload)
interface DecodedJWT {
  exp: number;          // UTC timestamp
  iat: number;          // UTC timestamp
  iss: string;          // "decoded"
  sub: string | null;   // Optional user_id
  role: TokenScope;     // TokenScope
}

const GOOGLE_ISSUER = 'https://accounts.google.com';
const BACKEND_ISSUER = 'decoded';

// Google ID 토큰 검증
function verifyGoogleToken(token: string): boolean {
  try {
    const decoded = jwtDecode<GoogleJWT>(token);
    
    // Google 토큰 기본 검증
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return false;
    if (decoded.iss !== GOOGLE_ISSUER) return false;
    if (!decoded.sub) return false;
    
    return true;
  } catch (err) {
    console.error('Google token verification failed:', err);
    return false;
  }
}

// JWT 토큰 검증 함수
function verifyJWT(token: string, isAdmin: boolean = false, isTemp: boolean = false, userId?: string): boolean {
  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    
    // 1. admin 체크
    if (isAdmin && decoded.role !== TokenScope.ADMIN) {
      return false;
    }

    // 2. temporary 체크
    if (isTemp && decoded.role !== TokenScope.TEMPORARY) {
      return false;
    }

    // 3. 만료 시간 체크
    const now = new Date().getTime() / 1000;
    if (decoded.exp < now) {
      return false;
    }

    // 4. issuer 체크
    if (decoded.iss !== BACKEND_ISSUER) {
      return false;
    }

    // 5. subject 유효성 체크
    const isValidSub = decoded.role === TokenScope.TEMPORARY 
      ? decoded.sub === null
      : decoded.sub !== null;
    
    if (!isValidSub) {
      return false;
    }

    // 6. userId 일치 체크
    if (userId && decoded.sub !== userId) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

// 토큰이 admin인지 체크하는 헬퍼 함수
function checkIsAdmin(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    return decoded.role === TokenScope.ADMIN;
  } catch {
    return false;
  }
}

// 토큰이 temporary인지 체크하는 헬퍼 함수
function checkIsTemp(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    return decoded.role === TokenScope.TEMPORARY;
  } catch {
    return false;
  }
}

// NetworkManager에서 사용할 Authorization 헤더 생성 함수
function getAuthHeader(): Record<string, string> {
  const token = window.sessionStorage.getItem('ACCESS_TOKEN');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 추가
  const pathName = usePathname();

  // 초기 상태 체크를 즉시 수행
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsInitialized(true);
      return;
    }
    
    const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
    const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
    const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
    
    const isUserLoggedIn = userDocId !== null && 
                          suiAccount !== null && 
                          accessToken !== null;
    
    setIsLogin(isUserLoggedIn);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const hashTag = window.location.hash;
    if (!hashTag) return;

    const params = new URLSearchParams(hashTag.substring(1));
    const token = params.get('id_token');
    if (!token) return;

    const login = async (token: string) => {
      setIsLoading(true);  // 로딩 시작
      try {
        const decodedGoogle = jwtDecode<GoogleJWT>(token);
        const hashInput = `${decodedGoogle.sub}${decodedGoogle.iss}${decodedGoogle.aud}`;
        const hashedToken = hash(hashInput);

        // 먼저 세션 스토리지를 초기화
        window.sessionStorage.clear();

        const loginRes = await networkManager.request<{
          status_code: number;
          description: string;
          data: {
            salt: string;
            doc_id: string;
            access_token: string;
          };
        }>(`user/login?token=${hashedToken}`, 'GET');

        if (loginRes.status_code !== 200 || !loginRes.data) {
          throw new Error('Login failed');
        }

        const { salt, doc_id, access_token } = loginRes.data;

        if (!verifyJWT(access_token)) {
          throw new Error('Invalid backend token');
        }

        const sui_acc = jwtToAddress(token, salt);

        // 모든 세션 데이터를 한번에 설정
        const sessionData = {
          'ACCESS_TOKEN': access_token,
          'USER_DOC_ID': doc_id,
          'SUI_ACCOUNT': sui_acc
        };

        Object.entries(sessionData).forEach(([key, value]) => {
          window.sessionStorage.setItem(key, value);
        });

        // 상태 업데이트 전에 API 호출
        await networkManager.request(
          `user/${doc_id}/aka/${sui_acc}`,
          'PATCH',
          null,
          3
        );

        setIsLogin(true);
        
        // URL 정리 및 홈으로 리다이렉트
        window.history.replaceState(null, '', '/');
      } catch (err) {
        console.error('Login process failed:', err);
        window.sessionStorage.clear();
        setIsLogin(false);
      } finally {
        setIsLoading(false);  // 로딩 완료
      }
    };

    login(token);
  }, [pathName, isInitialized]);

  const handleGoogleLogin = async () => {
    if (!isInitialized || typeof window === 'undefined') return;
    
    try {
      const { sk, randomness, exp, url } = await networkManager.openIdConnectUrl();
      window.sessionStorage.setItem('EPK_SECRET', sk);
      window.sessionStorage.setItem('RANDOMNESS', randomness);
      window.sessionStorage.setItem('EXPIRED_AT', exp.toString());
      window.location.replace(url);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleDisconnect = () => {
    if (!isInitialized || typeof window === 'undefined') return;
    
    // 모든 인증 관련 데이터 제거
    window.sessionStorage.removeItem('USER_DOC_ID');
    window.sessionStorage.removeItem('SUI_ACCOUNT');
    window.sessionStorage.removeItem('ACCESS_TOKEN');  // ACCESS_TOKEN 제거 추가
    window.sessionStorage.removeItem('EPK_SECRET');    // ZK Login 관련 데이터 제거
    window.sessionStorage.removeItem('RANDOMNESS');    // ZK Login 관련 데이터 제거
    window.sessionStorage.removeItem('EXPIRED_AT');    // ZK Login 관련 데이터 제거
    
    // 또는 모든 세션 스토리지 초기화
    // window.sessionStorage.clear();
    
    setIsLogin(false);
    
    // 페이지 새로고침 대신 홈으로 리다이렉트
    window.location.href = '/';
  };

  return {
    isLogin,
    isInitialized,
    isLoading,  // 로딩 상태 노출
    handleGoogleLogin,
    handleDisconnect,
  };
}
