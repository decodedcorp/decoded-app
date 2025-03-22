'use client';

import { useEffect, useState } from 'react';
import { networkManager } from '@/lib/network/network';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { jwtToAddress } from '@mysten/zklogin';
import { usePathname } from 'next/navigation';
import { hash } from '@/lib/utils/string/string';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { useLoginModalStore } from '@/components/auth/login-modal/store';
import { executeAuthCallback } from '@/lib/hooks/auth/use-protected-action';

// 조건부 로깅 헬퍼 함수
const isDev = process.env.NODE_ENV === 'development';
const logDebug = (message: string, data?: any) => {
  if (isDev) {
    console.log(message, data);
  }
};

// 오류 로깅 - 항상 출력됨
const logError = (message: string, error?: any) => {
  if (error) {
    console.error(message, error);
  } else {
    console.error(message);
  }
};

// Google OAuth JWT 타입
interface GoogleJWT {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  email: string;
  given_name: string;
}

const GOOGLE_ISSUER = 'https://accounts.google.com';
const BACKEND_ISSUER = 'decoded';

// Google ID 토큰 검증 (서명 포함)
async function verifyGoogleToken(token: string): Promise<boolean> {
  try {
    const JWKS = createRemoteJWKSet(
      new URL('https://www.googleapis.com/oauth2/v3/certs')
    );

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: GOOGLE_ISSUER,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    if (typeof payload.exp !== 'number') {
      logError('Invalid token: `exp` field is not a number.');
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const ALLOWED_TIME_DRIFT = 5;

    if (payload.exp + ALLOWED_TIME_DRIFT < now) {
      logDebug(`Token expired. Exp: ${payload.exp}, Now: ${now}`);
      return false;
    }

    if (!payload.sub) {
      logError('Invalid or missing sub field in token');
      return false;
    }

    return true;
  } catch (err: any) {
    logError('Google token verification failed:', err.message);
    return false;
  }
}

export function verifyJWT(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number; iss: string }>(token);

    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      logError('Backend token expired');
      return false;
    }

    if (decoded.iss !== BACKEND_ISSUER) {
      logError('Invalid token issuer');
      return false;
    }

    return true;
  } catch (err: any) {
    logError('JWT verification failed:', err.message);
    return false;
  }
}

// Add a declaration for the window property at the top of the file
declare global {
  interface Window {
    _loadingResetTimeout?: NodeJS.Timeout;
  }
}

export function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();
  const closeLoginModal = useLoginModalStore((state) => state.closeLoginModal);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsInitialized(true);
      return;
    }

    // 앱 시작 시 임시 로그인 데이터 정리
    sessionStorage.removeItem('LOGIN_ATTEMPT_TIME');
    sessionStorage.removeItem('LAST_MODAL_TOGGLE');
    sessionStorage.removeItem('LOGIN_BUTTON_CLICK_TIME');
    
    // 오래된 타임아웃 핸들러가 있다면 제거
    if (window._loadingResetTimeout) {
      clearTimeout(window._loadingResetTimeout);
      window._loadingResetTimeout = undefined;
    }

    const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
    const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
    const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const userNickname = window.sessionStorage.getItem('USER_NICKNAME');

    logDebug('[Auth] Initial session check:', {
      hasUserDocId: !!userDocId,
      hasSuiAccount: !!suiAccount,
      hasAccessToken: !!accessToken,
      hasUserNickname: !!userNickname
    });

    setIsLogin(!!(userDocId && suiAccount && accessToken));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const hashTag = window.location.hash;
    if (!hashTag) return;

    const params = new URLSearchParams(hashTag.replace(/^#/, ''));
    const token = params.get('id_token');
    if (!token) return;

    const login = async (token: string) => {
      setIsLoading(true);
      try {
        logDebug('[Auth] Verifying Google token...');
        const isGoogleTokenValid = await verifyGoogleToken(token);
        if (!isGoogleTokenValid)
          throw new Error('[Auth] Invalid Google token');

        // JWT 디코딩
        const decodedGoogle = jwtDecode<GoogleJWT>(token);
        logDebug('[Auth] Decoded Google token:', decodedGoogle);

        // 필요한 값 추출
        const { sub, iss, aud, email, given_name } = decodedGoogle;
        if (!sub || !iss || !aud) {
          throw new Error('[Auth] Missing required fields in decoded token');
        }

        // 해싱
        const hashInput = `${sub}${iss}${aud}`;
        const hashedToken = hash(hashInput);
        logDebug('[Hash Input]', hashInput);
        logDebug('[Hashed Token]', hashedToken);

        // 백엔드 요청
        logDebug('[Auth] Requesting backend login...');
        const loginRes = await networkManager.request<{
          status_code: number;
          data: {
            salt: string;
            doc_id: string;
            access_token: string;
          };
        }>('/user/login', 'POST', {
          token: hashedToken,
          email,
          aka: given_name,
          agreement: {
            marketing: false,
            notification: false,
            tracking: false,
          },
        });

        logDebug('[Auth] Backend response:', loginRes);

        if (!loginRes) {
          throw new Error('No response received from the server');
        }

        if (loginRes.status_code !== 200 || !loginRes.data) {
          throw new Error('[Auth] Backend login failed');
        }

        

        // 백엔드 응답 데이터 저장
        const { salt, doc_id, access_token } = loginRes.data;
        const sui_acc = jwtToAddress(token, salt);

        logDebug('[Auth] Saving user session data...', {
          doc_id,
          sui_account: sui_acc.substring(0, 10) + '...',
          has_access_token: !!access_token
        });

        window.sessionStorage.setItem('ACCESS_TOKEN', access_token);
        window.sessionStorage.setItem('USER_DOC_ID', doc_id);
        window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
        window.sessionStorage.setItem('USER_EMAIL', email);
        window.sessionStorage.setItem('USER_NICKNAME', given_name);

        logDebug('[Auth] Checking if data was saved:', {
          doc_id_saved: !!window.sessionStorage.getItem('USER_DOC_ID'),
          sui_account_saved: !!window.sessionStorage.getItem('SUI_ACCOUNT'),
          access_token_saved: !!window.sessionStorage.getItem('ACCESS_TOKEN'),
          nickname_saved: !!window.sessionStorage.getItem('USER_NICKNAME')
        });

        // 상태 업데이트 전에 약간의 지연을 줌
        await new Promise(resolve => setTimeout(resolve, 100));
        
        logDebug('[Auth] Login successful, user session updated.');
        setIsLogin(true);
        closeLoginModal();
        
        // 로그인 성공 후 대기 중인 인증 콜백 실행
        executeAuthCallback();
        
        window.history.replaceState(null, '', window.location.pathname);
      } catch (err: any) {
        logError('[Auth] Login failed:', err.message);
        window.sessionStorage.clear();
        setIsLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    login(token);
  }, [pathName, isInitialized, closeLoginModal]);

  const handleGoogleLogin = async (providedToken?: string) => {
    if (!isInitialized || typeof window === 'undefined') return;

    // 기존 타임아웃 초기화
    if (window._loadingResetTimeout) {
      clearTimeout(window._loadingResetTimeout);
      window._loadingResetTimeout = undefined;
    }
    
    try {
      // 직접 제공된 토큰이 있는 경우 (모바일 리다이렉트 처리)
      if (providedToken) {
        logDebug('[Auth] Processing provided token...');
        setIsLoading(true);
        
        try {
          logDebug('[Auth] Verifying Google token...');
          const isGoogleTokenValid = await verifyGoogleToken(providedToken);
          if (!isGoogleTokenValid) throw new Error('[Auth] Invalid Google token');

          const decodedGoogle = jwtDecode<GoogleJWT>(providedToken);
          const { sub, iss, aud, email, given_name } = decodedGoogle;
          
          if (!sub || !iss || !aud) {
            throw new Error('[Auth] Missing required fields in decoded token');
          }

          const hashInput = `${sub}${iss}${aud}`;
          const hashedToken = hash(hashInput);
          
          const loginRes = await networkManager.request<{
            status_code: number;
            data: {
              salt: string;
              doc_id: string;
              access_token: string;
            };
          }>('/user/login', 'POST', {
            token: hashedToken,
            email,
            aka: given_name,
            agreement: {
              marketing: false,
              notification: false,
              tracking: false,
            },
          });

          if (!loginRes || loginRes.status_code !== 200 || !loginRes.data) {
            throw new Error('[Auth] Backend login failed');
          }

          const { salt, doc_id, access_token } = loginRes.data;
          const sui_acc = jwtToAddress(providedToken, salt);

          logDebug('[Auth] Saving user session data...');
          window.sessionStorage.setItem('ACCESS_TOKEN', access_token);
          window.sessionStorage.setItem('USER_DOC_ID', doc_id);
          window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
          window.sessionStorage.setItem('USER_EMAIL', email);
          window.sessionStorage.setItem('USER_NICKNAME', given_name);

          setIsLogin(true);
          closeLoginModal();
        } catch (error) {
          logError('Login process failed:', error);
          window.sessionStorage.clear();
          setIsLogin(false);
        } finally {
          setIsLoading(false);
        }
        
        return;
      } else {
        // 새로운 로그인 시도
        logDebug('[Auth] Starting Google login process...');
        setIsLoading(true);
        
        try {
          // OAuth URL 가져오기 - 오류 발생시 바로 캐치
          const { url: oauthUrl } = await networkManager.openIdConnectUrl();
          
          // 최적화된 팝업 설정
          const width = 500;
          const height = 600;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          
          // 팝업 열기 (지연 없이 바로 열기)
          const popup = window.open(
            oauthUrl,
            'googleLoginPopup',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
          );
          
          if (!popup) {
            // 팝업이 차단된 경우
            logError('[Auth] 팝업을 열 수 없습니다. 브라우저 설정을 확인하세요.');
            setIsLoading(false);
            return;
          }
          
          logDebug('[Auth] Popup opened successfully');
          
          // 팝업 닫힘 감지
          const popupCheckInterval = setInterval(() => {
            if (popup.closed) {
              clearInterval(popupCheckInterval);
              setIsLoading(false);
              
              // 안전을 위한 타임아웃 제거
              if (window._loadingResetTimeout) {
                clearTimeout(window._loadingResetTimeout);
                window._loadingResetTimeout = undefined;
              }
            }
          }, 500);
          
          // 메시지 이벤트 리스너
          const messageListener = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            const { id_token } = event.data;
            if (!id_token) return;

            logDebug('[Auth] Received token from popup');
            window.removeEventListener('message', messageListener);
            
            try {
              // 토큰 검증
              const isGoogleTokenValid = await verifyGoogleToken(id_token);
              if (!isGoogleTokenValid) throw new Error('[Auth] Invalid Google token');

              const decodedGoogle = jwtDecode<GoogleJWT>(id_token);
              const { sub, iss, aud, email, given_name } = decodedGoogle;
              
              if (!sub || !iss || !aud) {
                throw new Error('[Auth] Missing required fields in decoded token');
              }

              const hashInput = `${sub}${iss}${aud}`;
              const hashedToken = hash(hashInput);
              
              const loginRes = await networkManager.request<{
                status_code: number;
                data: {
                  salt: string;
                  doc_id: string;
                  access_token: string;
                };
              }>('/user/login', 'POST', {
                token: hashedToken,
                email,
                aka: given_name,
                agreement: {
                  marketing: false,
                  notification: false,
                  tracking: false,
                },
              });

              if (!loginRes || loginRes.status_code !== 200 || !loginRes.data) {
                throw new Error('[Auth] Backend login failed');
              }

              const { salt, doc_id, access_token } = loginRes.data;
              const sui_acc = jwtToAddress(id_token, salt);

              logDebug('[Auth] Saving user session data...');
              window.sessionStorage.setItem('ACCESS_TOKEN', access_token);
              window.sessionStorage.setItem('USER_DOC_ID', doc_id);
              window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
              window.sessionStorage.setItem('USER_EMAIL', email);
              window.sessionStorage.setItem('USER_NICKNAME', given_name);

              // 로그인 상태 업데이트
              setIsLogin(true);
              closeLoginModal();
              
              // 로그인 성공 이벤트 발생 (하나만 발생시켜서 중복 처리 방지)
              window.dispatchEvent(new CustomEvent('login:success'));
              
              // 팝업 닫기
              popup.close();
            } catch (error) {
              logError('Login process failed:', error);
              window.sessionStorage.clear();
              setIsLogin(false);
            }
          };
          
          // 메시지 이벤트 리스너 등록
          window.addEventListener('message', messageListener);
          
          // 안전을 위한 타임아웃 - 30초 후 자동 해제
          window._loadingResetTimeout = setTimeout(() => {
            setIsLoading(false);
            logDebug('[Auth] Safety timeout activated - loading state reset');
          }, 30000);
        } catch (error) {
          logError('[Auth] Error initiating OAuth flow:', error);
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      logError('Google login error:', error.message);
      setIsLoading(false);
    }
  };
  const handleDisconnect = () => {
    if (!isInitialized || typeof window === 'undefined') return;

    logDebug('Logging out...');
    // 로그아웃 전 세션 정보 로깅
    const sessionInfo = {
      USER_DOC_ID: window.sessionStorage.getItem('USER_DOC_ID'),
      SUI_ACCOUNT: window.sessionStorage.getItem('SUI_ACCOUNT')?.substring(0, 10) + '...',
      USER_EMAIL: window.sessionStorage.getItem('USER_EMAIL'),
      USER_NICKNAME: window.sessionStorage.getItem('USER_NICKNAME')
    };
    logDebug('Clearing session data:', sessionInfo);
    
    window.sessionStorage.clear();
    setIsLogin(false);
  };

  const checkLoginStatus = () => {
    if (!isInitialized || typeof window === 'undefined') return;

    // 마지막 검증 시간 확인
    const lastCheck = localStorage.getItem('LAST_TOKEN_CHECK');
    const now = Date.now();
    
    // 5분(300000ms)에 한 번만 토큰 검증 실행
    const shouldCheck = !lastCheck || (now - parseInt(lastCheck, 10)) > 300000;
    
    if (shouldCheck) {
      localStorage.setItem('LAST_TOKEN_CHECK', now.toString());
      
      const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
      const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
      const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
      
      let isTokenValid = false;
      if (accessToken) {
        isTokenValid = verifyJWT(accessToken);
        
        if (!isTokenValid) {
          logDebug('[Auth] Token validation failed - logging out');
          window.sessionStorage.clear();
          setIsLogin(false);
          return;
        }
      }
      
      setIsLogin(!!(userDocId && suiAccount && accessToken && isTokenValid));
    }
  };

  // 로그인 후 또는 페이지 로드 시 토큰 상태 확인을 위한 함수
  const checkTokenStatus = () => {
    const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
    const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
    const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
    
    logDebug('Token status check:', {
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken ? accessToken.length : 0,
      hasUserDocId: !!userDocId,
      hasSuiAccount: !!suiAccount,
      isLoginState: !!(accessToken && userDocId && suiAccount)
    });
    
    if (accessToken) {
      // 토큰 구조 확인 (JWT는 일반적으로 header.payload.signature 형식)
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        logDebug('Access token does not appear to be a valid JWT format');
      }
      
      // 토큰 만료 확인 시도
      try {
        const payload = JSON.parse(atob(parts[1]));
        const expTime = payload.exp;
        const nowTime = Math.floor(Date.now() / 1000);
        logDebug('Token expiration:', {
          expTime,
          nowTime,
          isExpired: expTime < nowTime,
          timeRemaining: expTime - nowTime
        });
      } catch (e) {
        logError('Failed to parse token payload:', e);
      }
    }
  };

  useEffect(() => {
    const handleTokenExpired = () => {
      logDebug('[Auth] Token expired event received');
      setIsLogin(false);
    };
    
    window.addEventListener('auth:token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, []);

  return {
    isLogin,
    isInitialized,
    isLoading,
    handleGoogleLogin,
    handleDisconnect,
    checkLoginStatus,
    checkTokenStatus,
  };
}
