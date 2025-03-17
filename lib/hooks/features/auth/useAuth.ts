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
      console.error('Invalid token: `exp` field is not a number.');
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const ALLOWED_TIME_DRIFT = 5;

    if (payload.exp + ALLOWED_TIME_DRIFT < now) {
      console.warn(`Token expired. Exp: ${payload.exp}, Now: ${now}`);
      return false;
    }

    if (!payload.sub) {
      console.error('Invalid or missing sub field in token');
      return false;
    }

    return true;
  } catch (err: any) {
    console.error('Google token verification failed:', err.message);
    return false;
  }
}

function verifyJWT(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number; iss: string }>(token);

    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      console.error('Backend token expired');
      return false;
    }

    if (decoded.iss !== BACKEND_ISSUER) {
      console.error('Invalid token issuer');
      return false;
    }

    return true;
  } catch (err: any) {
    console.error('JWT verification failed:', err.message);
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
        console.log('[Login] Verifying Google token...');
        const isGoogleTokenValid = await verifyGoogleToken(token);
        if (!isGoogleTokenValid)
          throw new Error('[Login] Invalid Google token');

        // JWT 디코딩
        const decodedGoogle = jwtDecode<GoogleJWT>(token);
        console.log('[Login] Decoded Google token:', decodedGoogle);

        // 필요한 값 추출
        const { sub, iss, aud, email, given_name } = decodedGoogle;
        if (!sub || !iss || !aud) {
          throw new Error('[Login] Missing required fields in decoded token');
        }

        // 해싱
        const hashInput = `${sub}${iss}${aud}`;
        const hashedToken = hash(hashInput);
        console.log('[Hash Input]', hashInput);
        console.log('[Hashed Token]', hashedToken);

        // 백엔드 요청
        console.log('[Login] Requesting backend login...');
        const loginRes = await networkManager.request<{
          status_code: number;
          data: {
            salt: string;
            doc_id: string;
            access_token: string;
          };
        }>('user/login', 'POST', {
          token: hashedToken,
          email,
          aka: given_name,
          agreement: {
            marketing: false,
            notification: false,
            tracking: false,
          },
        });

        console.log('[Login] Backend response:', loginRes);

        if (!loginRes) {
          throw new Error('No response received from the server');
        }

        if (loginRes.status_code !== 200 || !loginRes.data) {
          throw new Error('[Login] Backend login failed');
        }

        

        // 백엔드 응답 데이터 저장
        const { salt, doc_id, access_token } = loginRes.data;
        const sui_acc = jwtToAddress(token, salt);

        window.sessionStorage.setItem('ACCESS_TOKEN', access_token);
        window.sessionStorage.setItem('USER_DOC_ID', doc_id);
        window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
        window.sessionStorage.setItem('USER_EMAIL', email);

        // 상태 업데이트 전에 약간의 지연을 줌
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('[Login] Login successful, user session updated.');
        setIsLogin(true);
        closeLoginModal();
        
        // 로그인 성공 후 대기 중인 인증 콜백 실행
        executeAuthCallback();
        
        window.history.replaceState(null, '', window.location.pathname);
      } catch (err: any) {
        console.error('[Login] Login failed:', err.message);
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

    // Reset any existing loading timeouts
    if (window._loadingResetTimeout) {
      clearTimeout(window._loadingResetTimeout);
      window._loadingResetTimeout = undefined;
    }
    
    // 최근 로그인 시도 확인 및 중복 방지
    const now = Date.now();
    const lastLoginAttempt = sessionStorage.getItem('LOGIN_ATTEMPT_TIME');
    if (lastLoginAttempt) {
      const attemptTime = parseInt(lastLoginAttempt, 10);
      if (now - attemptTime < 3000) { // 3초 이내 중복 시도 방지
        console.log('[Auth] 최근에 로그인이 시도됨, 중복 요청 무시');
        return;
      }
    }

    try {
      // 직접 제공된 토큰이 있는 경우 (모바일 리다이렉트 처리)
      if (providedToken) {
        console.log('[Login] Processing provided token...');
        setIsLoading(true);
        
        try {
          console.log('[Login] Verifying Google token...');
          const isGoogleTokenValid = await verifyGoogleToken(providedToken);
          if (!isGoogleTokenValid) throw new Error('[Login] Invalid Google token');

          const decodedGoogle = jwtDecode<GoogleJWT>(providedToken);
          const { sub, iss, aud, email, given_name } = decodedGoogle;
          
          if (!sub || !iss || !aud) {
            throw new Error('[Login] Missing required fields in decoded token');
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
          }>('user/login', 'POST', {
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
            throw new Error('[Login] Backend login failed');
          }

          const { salt, doc_id, access_token } = loginRes.data;
          const sui_acc = jwtToAddress(providedToken, salt);

          window.sessionStorage.setItem('ACCESS_TOKEN', access_token);
          window.sessionStorage.setItem('USER_DOC_ID', doc_id);
          window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
          window.sessionStorage.setItem('USER_EMAIL', email);

          setIsLogin(true);
          closeLoginModal();
        } catch (error) {
          console.error('Login process failed:', error);
          window.sessionStorage.clear();
          setIsLogin(false);
        } finally {
          setIsLoading(false);
        }
        
        return;
      } else {
        // No provided token - initiate OAuth flow
        const isDevMode = process.env.NODE_ENV === 'development';
        if (isDevMode) {
          console.log('[Auth] 구글 로그인 프로세스 시작...');
        }
        setIsLoading(true);
        
        // 현재 시간 기록
        sessionStorage.setItem('LOGIN_ATTEMPT_TIME', now.toString());
        
        // Safety timeout to reset loading state if login flow doesn't complete
        window._loadingResetTimeout = setTimeout(() => {
          if (isDevMode) {
            console.log('[Auth] 안전 타임아웃 작동 - 로딩 상태 초기화');
          }
          setIsLoading(false);
          // 시간 초과된 로그인 시도 표시 초기화
          sessionStorage.removeItem('LOGIN_ATTEMPT_TIME');
        }, 30000); // 30초 타임아웃

        try {
          if (isDevMode) {
            console.log('[Auth] 구글 OpenID Connect URL 가져오는 중...');
          }
          const { url: oauthUrl } = await networkManager.openIdConnectUrl();
          
          // 딜레이 시간 단축 - 300ms에서 50ms로 감소
          await new Promise(resolve => setTimeout(resolve, 50));
          
          if (isDevMode) {
            console.log('[Auth] 구글 로그인 URL 획득:', oauthUrl.substring(0, 60) + '...');
            console.log('[Auth] 세션 스토리지에 로그인 관련 정보 저장...');
          }
          
          // 세션 스토리지에 oauthUrl 저장 (필요한 경우 재사용)
          sessionStorage.setItem('OAUTH_URL', oauthUrl);
          
          // 현재 모달 상태 확인 (개발 모드에서만)
          if (isDevMode) {
            const modalToggleTime = sessionStorage.getItem('LAST_MODAL_TOGGLE');
            if (modalToggleTime) {
              const toggleTime = parseInt(modalToggleTime, 10);
              console.log('[Auth] 마지막 모달 토글과의 시간차:', now - toggleTime, 'ms');
            }
          }
          
          // 딜레이 시간 단축 - 200ms에서 50ms로 감소
          if (isDevMode) {
            console.log('[Auth] 팝업 열기 전 최소 대기...');
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          
          if (isDevMode) {
            console.log('[Auth] 구글 로그인 팝업 열기 시도...');
          }
          
          // Create popup with specific dimensions
          const width = 500;
          const height = 600;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          
          // Track popup status
          let popupClosed = false;
          
          // Try to open the popup with specific dimensions and position
          const popup = window.open(
            oauthUrl,
            'googleLoginPopup',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
          );
          
          if (!popup) {
            console.error('[Auth] 팝업 창을 열지 못했습니다. 브라우저에서 차단되었을 수 있습니다.');
            setIsLoading(false);
            // 실패한 로그인 시도 표시 초기화
            sessionStorage.removeItem('LOGIN_ATTEMPT_TIME');
            return;
          }
          
          if (isDevMode) {
            console.log('[Auth] 팝업 창이 성공적으로 열렸습니다.');
          }
          
          // Check if popup was closed
          const popupCheckInterval = setInterval(() => {
            if (popup.closed) {
              clearInterval(popupCheckInterval);
              if (!popupClosed) {
                if (isDevMode) {
                  console.log('[Auth] 사용자가 로그인을 완료하지 않고 팝업을 닫았습니다.');
                }
                setIsLoading(false);
                popupClosed = true;
                
                // 실패한 로그인 시도 표시 초기화
                sessionStorage.removeItem('LOGIN_ATTEMPT_TIME');
                
                // Clear safety timeout
                if (window._loadingResetTimeout) {
                  clearTimeout(window._loadingResetTimeout);
                  window._loadingResetTimeout = undefined;
                }
              }
            }
          }, 500);
          
          // 팝업 창에서 메시지를 받을 리스너
          const messageListener = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
              console.log('[Login] Message from different origin:', event.origin);
              return;
            }

            const { id_token } = event.data;
            if (!id_token) {
              console.log('[Login] No id_token in message data:', event.data);
              return;
            }

            console.log('[Login] Received ID Token from popup');
            window.removeEventListener('message', messageListener);
            
            try {
              console.log('[Login] Verifying Google token...');
              const isGoogleTokenValid = await verifyGoogleToken(id_token);
              console.log('[Login] Google token validation result:', isGoogleTokenValid);
              if (!isGoogleTokenValid) throw new Error('[Login] Invalid Google token');

              const decodedGoogle = jwtDecode<GoogleJWT>(id_token);
              const { sub, iss, aud, email, given_name } = decodedGoogle;
              
              if (!sub || !iss || !aud) {
                throw new Error('[Login] Missing required fields in decoded token');
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
              }>('user/login', 'POST', {
                token: hashedToken,
                email,
                aka: given_name,
                agreement: {
                  marketing: false,
                  notification: false,
                  tracking: false,
                },
              });

              if (!loginRes) {
                throw new Error('[Login] Backend login failed');
              }

              if (loginRes.status_code !== 200 || !loginRes.data) {
                throw new Error('[Login] Backend login failed');
              }

              const { salt, doc_id, access_token } = loginRes.data;
              const sui_acc = jwtToAddress(id_token, salt);

              window.sessionStorage.setItem('ACCESS_TOKEN', access_token);
              window.sessionStorage.setItem('USER_DOC_ID', doc_id);
              window.sessionStorage.setItem('SUI_ACCOUNT', sui_acc);
              window.sessionStorage.setItem('USER_EMAIL', email);

              setIsLogin(true);
              closeLoginModal();
              popup.close();
            } catch (error) {
              console.error('Login process failed:', error);
              window.sessionStorage.clear();
              setIsLogin(false);
            }
          };

          window.addEventListener('message', messageListener);
        } catch (error) {
          console.error('[Login] Error initiating OAuth flow:', error);
          setIsLoading(false);
          
          // Clear safety timeout
          if (window._loadingResetTimeout) {
            clearTimeout(window._loadingResetTimeout);
          }
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error.message);
      setIsLoading(false);
      
      // Clear safety timeout
      if (window._loadingResetTimeout) {
        clearTimeout(window._loadingResetTimeout);
      }
    }
  };
  const handleDisconnect = () => {
    if (!isInitialized || typeof window === 'undefined') return;

    console.log('Logging out...');
    window.sessionStorage.clear();
    setIsLogin(false);
  };

  const checkLoginStatus = () => {
    if (!isInitialized || typeof window === 'undefined') return;

    const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
    const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
    const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');

    setIsLogin(!!(userDocId && suiAccount && accessToken));
  };

  return {
    isLogin,
    isInitialized,
    isLoading,
    handleGoogleLogin,
    handleDisconnect,
    checkLoginStatus,
  };
}
