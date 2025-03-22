'use client';

import { MypageModal } from './modal/MypageModal';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/hooks/features/auth/useAuth';
import useModalClose from '@/lib/hooks/common/useModalClose';
import { cn } from '@/lib/utils/style';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { useLoginModalStore } from '@/components/auth/login-modal/store';
import { executeAuthCallback } from '@/lib/hooks/auth/use-protected-action';
import { createPortal } from 'react-dom';
import React from 'react';

// Helper for conditional logging - 필수 로그만 출력
const isDev = process.env.NODE_ENV === 'development';
const logDebug = (message: string, data?: any) => {
  if (isDev) {
    // 에러나 중요 상태 변경 시에만 로그 출력
    if (
      message.includes('Error') || 
      message.includes('failed') || 
      (message.includes('login') && message.includes('state'))
    ) {
      console.log(message, data);
    }
  }
};

export const LoginButton = React.memo(function LoginButton() {
  const { t } = useLocaleContext();
  const [isMobile, setIsMobile] = useState(false);
  const { isLogin, isInitialized, isLoading: authLoading, checkLoginStatus, handleGoogleLogin, handleDisconnect } = useAuth();
  const {
    isOpen: isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  } = useLoginModalStore();
  
  // 내부 강제 리렌더링을 위한 상태
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  
  // 로컬 로딩 상태 추가 (authLoading과 별개로 관리)
  const [localLoading, setLocalLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 로딩 상태 통합 (auth의 로딩 상태와 로컬 로딩 상태 중 하나라도 true면 로딩 중)
  const isLoading = authLoading || localLoading;

  // 강제 리렌더링 함수 - 꼭 필요한 경우에만 사용
  const forceUpdate = useCallback(() => {
    // 디바운스를 위한 지연 추가 (연속 호출 방지)
    const delayedUpdate = () => {
      setForceUpdateCounter(prev => prev + 1);
    };
    
    setTimeout(delayedUpdate, 100);
  }, []);

  // 로딩 상태 관리 함수 - 로그인 과정 중 로딩 상태 보장
  const startLoading = useCallback(() => {
    // 이미 로딩 중이면 무시
    if (localLoading) return;
    
    // 로딩 상태 활성화
    setLocalLoading(true);
    logDebug('[LoginButton] Local loading started');
    
    // 안전 타임아웃 설정 (15초 후 자동 해제)
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      setLocalLoading(false);
      logDebug('[LoginButton] Loading timeout - auto reset');
      loadingTimeoutRef.current = null;
    }, 15000);
  }, [localLoading]);
  
  // 로딩 상태 종료 함수
  const stopLoading = useCallback(() => {
    if (!localLoading) return;
    
    // 약간의 지연 후 로딩 상태 해제 (깜빡임 방지)
    setTimeout(() => {
      setLocalLoading(false);
      logDebug('[LoginButton] Local loading stopped');
      
      // 타임아웃 클리어
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }, 300);
  }, [localLoading]);

  // 클린업 함수 - 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // 로컬 로그인 상태 - useAuth의 상태와 별개로 유지하여 더 빠른 UI 업데이트
  const [localLoginState, setLocalLoginState] = useState<boolean | null>(null);
  
  // 마지막 상태 업데이트 시간 추적 (상태 변경 디바운스에 사용)
  const lastStateUpdateRef = useRef<number>(Date.now());
  // 마지막으로 감지된 세션 상태 (불필요한 업데이트 방지)
  const lastDetectedSessionStateRef = useRef<boolean | null>(null);
  
  // 로그인 상태 모니터링을 위한 효과
  useEffect(() => {
    if (!isInitialized) return;
    
    // 초기 상태 설정 (한 번만)
    if (localLoginState === null) {
      const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
      const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
      const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
      
      const initialState = !!(userDocId && suiAccount && accessToken);
      setLocalLoginState(initialState);
      lastDetectedSessionStateRef.current = initialState;
      
      logDebug('[LoginButton] Initial login state set:', { initialState });
    }
    
    // 안정적인 로그인 상태 업데이트 함수 - 디바운스 로직 포함
    const updateLoginState = (newState: boolean) => {
      const now = Date.now();
      
      // 동일한 상태로의 업데이트 무시
      if (newState === localLoginState) {
        return;
      }
      
      // 상태가 변경된 경우만 로깅
      if (newState !== lastDetectedSessionStateRef.current) {
        logDebug('[LoginButton] Session state changed:', {
          from: lastDetectedSessionStateRef.current,
          to: newState
        });
        lastDetectedSessionStateRef.current = newState;
      }
      
      // 상태 변경 최소 간격 (500ms) - 빠른 변경 방지
      const minUpdateInterval = 500;
      if (now - lastStateUpdateRef.current < minUpdateInterval) {
        // 너무 빠른 연속 업데이트 무시
        return;
      }
      
      // 상태 업데이트 및 시간 기록
      lastStateUpdateRef.current = now;
      setLocalLoginState(newState);
      
      // 로그인 상태가 변경되었으면 로딩 상태 해제
      if (newState && localLoading) {
        stopLoading();
      }
      
      // useAuth 상태와 동기화 (필요한 경우에만)
      if (checkLoginStatus && newState !== isLogin) {
        checkLoginStatus();
      }
    };
    
    // 로그인 상태 감지 함수
    const detectLoginState = () => {
      const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
      const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
      const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
      
      const currentLoginState = !!(userDocId && suiAccount && accessToken);
      
      // 상태가 명확하게 변경된 경우에만 업데이트
      if (currentLoginState !== lastDetectedSessionStateRef.current) {
        updateLoginState(currentLoginState);
      }
    };
    
    // 초기 감지 수행
    detectLoginState();
    
    // 로그인 상태 감지를 위한 폴링 (더 긴 간격으로 설정)
    const pollingInterval = setInterval(detectLoginState, 2000);
    
    // 이벤트 기반 감지 추가 - 디바운스가 적용된 핸들러 사용
    const handleLoginStateChanged = () => {
      // 이벤트 발생 시 즉시 감지
      setTimeout(detectLoginState, 100);
    };
    
    window.addEventListener('login:success', handleLoginStateChanged);
    window.addEventListener('logout:success', handleLoginStateChanged);
    window.addEventListener('auth:state-changed', handleLoginStateChanged);
    window.addEventListener('storage', handleLoginStateChanged);
    
    return () => {
      clearInterval(pollingInterval);
      window.removeEventListener('login:success', handleLoginStateChanged);
      window.removeEventListener('logout:success', handleLoginStateChanged);
      window.removeEventListener('auth:state-changed', handleLoginStateChanged);
      window.removeEventListener('storage', handleLoginStateChanged);
    };
  }, [isInitialized, isLogin, localLoginState, checkLoginStatus, localLoading, stopLoading]);

  // 모바일 환경 감지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        // 모바일/태블릿/데스크톱 구분을 MypageModal과 일치시킴
        const width = window.innerWidth;
        setIsMobile(width < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  const { modalRef } = useModalClose({
    onClose: closeLoginModal,
    isOpen: isLoginModalOpen,
  });

  // MypageModal 포털 타겟 참조
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  
  // PortalTarget 설정
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // 기존 포털 타겟이 있으면 사용, 없으면 생성
      let target = document.getElementById('mypage-modal-portal');
      if (!target) {
        target = document.createElement('div');
        target.id = 'mypage-modal-portal';
        target.setAttribute('data-modal-container', 'true');
        target.setAttribute('data-no-close-on-click', 'true');
        document.body.appendChild(target);
      }
      setPortalTarget(target);
    }
  }, []);

  // 로그인 성공 후 콜백 함수 - 로그인 상태를 즉시 업데이트
  const handleLoginSuccess = useCallback(() => {
    // 세션 정보 확인
    const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
    const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
    const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
    
    const isNowLoggedIn = !!(userDocId && suiAccount && accessToken);
    
    // 세션이 존재하면 로그인 상태 업데이트
    if (isNowLoggedIn) {
      // 로컬 상태 업데이트
      setLocalLoginState(true);
      lastDetectedSessionStateRef.current = true;
      lastStateUpdateRef.current = Date.now();
      
      // 디버그 로그
      logDebug('[LoginButton] Login success callback executed', {
        sessionData: {
          hasUserDocId: !!userDocId,
          hasAccount: !!suiAccount,
          hasToken: !!accessToken,
          previousState: localLoginState
        }
      });
      
      // 전역 상태도 업데이트
      if (checkLoginStatus) {
        checkLoginStatus();
      }
    }
    
    // 모달 닫기
    closeLoginModal();
    
    // 상태 변경 이벤트 발생
    window.dispatchEvent(new CustomEvent('login:success'));
  }, [checkLoginStatus, closeLoginModal, localLoginState, setLocalLoginState]);

  // 로딩 이벤트 처리
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 로딩 시작/종료 이벤트 핸들러
    const handleLoadingStart = () => {
      startLoading();
    };
    
    const handleLoadingStop = () => {
      stopLoading();
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('login:loading:start', handleLoadingStart);
    window.addEventListener('login:loading:stop', handleLoadingStop);
    
    // 로그인 성공 시 로딩 종료
    window.addEventListener('login:success', handleLoadingStop);
    
    return () => {
      window.removeEventListener('login:loading:start', handleLoadingStart);
      window.removeEventListener('login:loading:stop', handleLoadingStop);
      window.removeEventListener('login:success', handleLoadingStop);
    };
  }, [startLoading, stopLoading]);
  
  // 모바일 로그인 처리 - 필요한 경우에만 상태 변경
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;
    
    const tempToken = localStorage.getItem('TEMP_ID_TOKEN');
    const timestamp = localStorage.getItem('LOGIN_TIMESTAMP');
    
    if (tempToken && timestamp) {
      const timeDiff = Date.now() - Number(timestamp);
      
      // 10초 이내의 토큰만 처리
      if (timeDiff < 10000) {
        // 모달 닫기
        closeLoginModal();
        
        const processToken = async () => {
          try {
            // 로그인 처리 시작 전에 로깅
            logDebug('[LoginButton] Processing mobile login token', {
              tokenLength: tempToken.length,
              timeSinceCreated: timeDiff
            });
            
            // 토큰 처리
            await handleGoogleLogin(tempToken);
            
            // 토큰 정리
            localStorage.removeItem('TEMP_ID_TOKEN');
            localStorage.removeItem('LOGIN_TIMESTAMP');
            
            // 세션 데이터 확인
            const userDocId = window.sessionStorage.getItem('USER_DOC_ID');
            const suiAccount = window.sessionStorage.getItem('SUI_ACCOUNT');
            const accessToken = window.sessionStorage.getItem('ACCESS_TOKEN');
            
            // 세션 상태 기반으로 로컬 상태 업데이트
            if (userDocId && suiAccount && accessToken) {
              // 상태 업데이트 
              setLocalLoginState(true);
              lastDetectedSessionStateRef.current = true;
              lastStateUpdateRef.current = Date.now();
              
              // 디버그 로깅
              logDebug('[LoginButton] Mobile login succeeded', {
                userDocId: userDocId.substring(0, 5) + '...',
                suiAccount: suiAccount.substring(0, 5) + '...',
                tokenLength: accessToken.length
              });
            }
            
            // 로그인 성공 이벤트 발생
            window.dispatchEvent(new CustomEvent('login:success'));
            
            // 모달 닫기 (한번 더 확실하게)
            closeLoginModal();
          } catch (error) {
            console.error('[LoginButton] Mobile login processing failed:', error);
            localStorage.removeItem('TEMP_ID_TOKEN');
            localStorage.removeItem('LOGIN_TIMESTAMP');
          }
        };
        
        // 지연 호출 (UI 업데이트 충돌 방지)
        setTimeout(processToken, 200);
      } else {
        // 오래된 토큰 삭제
        localStorage.removeItem('TEMP_ID_TOKEN');
        localStorage.removeItem('LOGIN_TIMESTAMP');
      }
    }
  }, [isInitialized, handleGoogleLogin, closeLoginModal, setLocalLoginState]);

  // 로그아웃 핸들러 개선
  const handleUserDisconnect = useCallback(() => {
    // 모달 닫기
    closeLoginModal();
    
    // 로그아웃 시작 로깅
    logDebug('[LoginButton] Starting logout process');
    
    // 세션 정보 미리 확인하고 저장 (디버깅용)
    const sessionBefore = {
      userDocId: window.sessionStorage.getItem('USER_DOC_ID'),
      hasToken: !!window.sessionStorage.getItem('ACCESS_TOKEN'),
      hasSuiAccount: !!window.sessionStorage.getItem('SUI_ACCOUNT')
    };
    
    // 안정적인 로그아웃을 위한 상태 업데이트
    const performLogout = async () => {
      try {
        // 세션 스토리지 수동 정리 (먼저 수행)
        window.sessionStorage.removeItem('USER_DOC_ID');
        window.sessionStorage.removeItem('SUI_ACCOUNT');
        window.sessionStorage.removeItem('ACCESS_TOKEN');
        window.sessionStorage.removeItem('USER_EMAIL');
        window.sessionStorage.removeItem('USER_NICKNAME');
        
        // 즉시 로컬 상태 업데이트 (UI 반응성 향상)
        setLocalLoginState(false);
        lastDetectedSessionStateRef.current = false;
        lastStateUpdateRef.current = Date.now();
        
        // useAuth의 로그아웃 함수 호출 (세션 삭제 후)
        await handleDisconnect();
        
        // 디버그 로깅
        logDebug('[LoginButton] Logout completed successfully', {
          sessionBefore,
          sessionAfter: {
            userDocId: window.sessionStorage.getItem('USER_DOC_ID'),
            hasToken: !!window.sessionStorage.getItem('ACCESS_TOKEN'),
            hasSuiAccount: !!window.sessionStorage.getItem('SUI_ACCOUNT')
          }
        });
        
        // 로그아웃 성공 이벤트 발생 (한번만 발생)
        window.dispatchEvent(new CustomEvent('logout:success'));
      } catch (error) {
        console.error('[LoginButton] Logout error:', error);
        
        // 오류가 있어도 상태는 업데이트
        setLocalLoginState(false);
        
        // 오류 시에도 상태 업데이트를 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('logout:success'));
      }
    };
    
    // 로그아웃 즉시 실행
    performLogout();
  }, [closeLoginModal, handleDisconnect, setLocalLoginState]);

  // 로그인 상태에 따른 텍스트 표시
  const buttonText = (() => {
    if (!isInitialized) return t.header.nav.login.button.text;
    if (isLoading) return t.header.nav.login.button.loading;
    
    // 로컬 로그인 상태를 우선적으로 사용 (더 빠른 UI 업데이트)
    if (localLoginState !== null) {
      return localLoginState ? t.header.nav.login.button.myPage : t.header.nav.login.button.text;
    }
    
    // 폴백으로 useAuth의 상태 사용
    return isLogin ? t.header.nav.login.button.myPage : t.header.nav.login.button.text;
  })();

  // 모달 열기 핸들러
  const handleOpenModal = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // 로딩 중이거나 모달이 이미 열려있으면 무시
    if (isLoading || isLoginModalOpen) {
      return;
    }
    
    // 모달 바로 열기
    openLoginModal();
  }, [isLoading, isLoginModalOpen, openLoginModal]);
  
  // 컴포넌트가 마운트될 때 초기 세션 확인 - 단 한번만 실행
  useEffect(() => {
    if (isInitialized && checkLoginStatus) {
      checkLoginStatus();
    }
  }, [isInitialized, checkLoginStatus]);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={cn(
          "relative flex items-center transition-colors px-2 py-1.5",
          "hover:text-[#EAFD66] text-gray-300 dark:text-gray-400 dark:hover:text-[#EAFD66]",
          {
            "text-[#EAFD66] hover:text-[#EAFD66]/90 active:text-[#EAFD66]/80": localLoginState ?? isLogin,
          }
        )}
        data-modal-trigger="true"
        data-no-close-on-click="true"
        data-login-state={(localLoginState ?? isLogin) ? "logged-in" : "logged-out"}
      >
        <span className="text-sm font-medium">{buttonText}</span>
      </button>
      
      {/* 포털을 통한 모달 렌더링 */}
      {portalTarget && isLoginModalOpen && createPortal(
        <div 
          ref={modalRef as React.RefObject<HTMLDivElement>}
          className="login-modal-container" 
          data-modal-container="true"
          data-no-close-on-click="true"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100010,
            pointerEvents: 'auto'
          }}
        >
          <MypageModal 
            isOpen={isLoginModalOpen} 
            onClose={closeLoginModal}
            onLogout={handleUserDisconnect}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>,
        portalTarget
      )}
    </>
  );
});

