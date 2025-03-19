'use client';

import { MypageModal } from './modal/MypageModal';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/features/auth/useAuth';
import useModalClose from '@/lib/hooks/common/useModalClose';
import { cn } from '@/lib/utils/style';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { useLoginModalStore } from '@/components/auth/login-modal/store';
import { executeAuthCallback } from '@/lib/hooks/auth/use-protected-action';
import { createPortal } from 'react-dom';
import React from 'react';

export const LoginButton = React.memo(function LoginButton() {
  const { t } = useLocaleContext();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isLogin, isInitialized, isLoading, checkLoginStatus, handleGoogleLogin, handleDisconnect } = useAuth();
  const {
    isOpen: isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  } = useLoginModalStore();

  // Debug logging
  useEffect(() => {
    console.log('[LoginButton] 렌더링됨, 로그인모달상태:', isLoginModalOpen);
    
    // 모달 상태 변경 감지
    return () => {
      if (isLoginModalOpen) {
        console.log('[LoginButton] 언마운트 시점에 모달이 열려있었음');
      }
    };
  }, [isLoginModalOpen]);

  // 모바일 환경 감지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        // 모바일/태블릿/데스크톱 구분을 MypageModal과 일치시킴
        const width = window.innerWidth;
        if (width < 768) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  // Debug logging for mobile detection
  useEffect(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    console.log('Device detection:', {
      isMobile: width < 768,
      isTablet: width >= 768 && width <= 1025,
      isDesktop: width > 1025,
      windowWidth: width
    });
  }, [isMobile]);

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

  // 첫 렌더링 이후 트랜지션 활성화
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // LoginButton.tsx에서 체크 로직 수정
  const SESSION_CHECK_INTERVAL = 30000; // 30초로 늘림 (기존보다 훨씬 긴 간격)

  useEffect(() => {
    // 초기 한 번만 체크
    checkSessionStorage();
    
    // 간격을 길게 설정하여 주기적 체크
    const intervalId = setInterval(() => {
      checkSessionStorage('periodic');
    }, SESSION_CHECK_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);

  // 모바일 로그인 리다이렉트 처리
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;
    
    // localStorage에서 임시 토큰 확인
    const tempToken = localStorage.getItem('TEMP_ID_TOKEN');
    const timestamp = localStorage.getItem('LOGIN_TIMESTAMP');
    
    if (tempToken && timestamp) {
      const timeDiff = Date.now() - Number(timestamp);
      
      // 최근 10초 이내에 저장된 토큰만 처리 (오래된 토큰 방지)
      if (timeDiff < 10000) {
        console.log('Mobile login detected, processing token');
        
        // 먼저 모달 닫기 (순서 변경)
        closeLoginModal();
        
        // 메인 창에서 토큰 처리 - async/await 패턴으로 변경
        const processToken = async () => {
          try {
            // 토큰 처리 직접 수행
            await handleGoogleLogin(tempToken);
            console.log('Mobile login successful');
            
            // 처리 후 토큰 삭제
            localStorage.removeItem('TEMP_ID_TOKEN');
            localStorage.removeItem('LOGIN_TIMESTAMP');
            
            // 로그인 성공 후 콜백 실행
            setTimeout(() => {
              console.log('Running auth callback for mobile login');
              executeAuthCallback();
            }, 300);
          } catch (error) {
            console.error('Mobile login processing failed:', error);
            localStorage.removeItem('TEMP_ID_TOKEN');
            localStorage.removeItem('LOGIN_TIMESTAMP');
          }
        };
        
        // 약간의 지연 후 실행
        setTimeout(() => {
          processToken();
        }, 200);
      } else {
        // 오래된 토큰 삭제
        localStorage.removeItem('TEMP_ID_TOKEN');
        localStorage.removeItem('LOGIN_TIMESTAMP');
      }
    }
  }, [isInitialized, handleGoogleLogin, closeLoginModal]);

  // 로그아웃 핸들러 수정 - 중복 호출 문제 수정
  const handleUserDisconnect = () => {
    // useAuth에서 가져온 handleDisconnect 함수 호출
    handleDisconnect();
    closeLoginModal(); // 모달 닫기 추가
  };

  // 로딩 상태에 따른 텍스트 표시
  const buttonText = (() => {
    if (!isInitialized) return t.header.nav.login.button.text;
    if (isLoading) return t.header.nav.login.button.loading;
    if (isLogin) return t.header.nav.login.button.myPage;
    return t.header.nav.login.button.text;
  })();

  // 모달 열기 핸들러 - 이벤트 버블링 방지 및 중복 클릭 보호 로직 강화
  const handleOpenModal = (e?: React.MouseEvent) => {
    // 이벤트 객체가 있으면 이벤트 전파 중지
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isLoading) {
      console.log('로그인 진행 중, 클릭 무시');
      return;
    }
    
    // 최근에 모달 상태가 변경된 경우 중복 실행 방지
    const lastModalToggle = sessionStorage.getItem('LAST_MODAL_TOGGLE');
    const now = Date.now();
    
    if (lastModalToggle) {
      const lastToggleTime = parseInt(lastModalToggle, 10);
      // 마지막 토글 후 800ms 이내의 클릭은 무시
      if (now - lastToggleTime < 800) {
        console.log('모달 상태 최근 변경됨, 중복 클릭 무시');
        return;
      }
    }
    
    // 모달 토글 시간 기록
    sessionStorage.setItem('LAST_MODAL_TOGGLE', now.toString());
    
    // If a login attempt is already in progress, don't open the modal
    if (typeof window !== 'undefined' && sessionStorage.getItem('LOGIN_ATTEMPT_TIME')) {
      const attemptTime = parseInt(sessionStorage.getItem('LOGIN_ATTEMPT_TIME') || '0', 10);
      
      // If there was a login attempt in the last 5 seconds, ignore this click
      if (now - attemptTime < 5000) {
        console.log('최근 로그인 시도 감지, 중복 클릭 무시');
        return;
      }
    }
    
    // 이미 로그인한 상태라면 바로 모달 열기
    if (isLogin) {
      console.log('로그인 상태, 마이페이지 모달 열기');
      openLoginModal();
      return;
    }
    
    console.log('로그인 버튼 클릭, 모달 열기');
    
    // 모달 열기 전에 항상 닫기를 먼저 실행해 상태 초기화
    closeLoginModal();
    
    // 약간의 지연 후 모달 열기 (이전 모달이 완전히 닫힌 후)
    setTimeout(() => {
      console.log(`${isMobile ? '모바일' : '데스크톱'}에서 로그인 모달 열기`);
      openLoginModal();
    }, isMobile ? 150 : 100);
  };

  function checkSessionStorage(type?: string) {
    // 개발 환경에서만 로그 기록 (또는 완전히 제거)
    if (process.env.NODE_ENV === 'development' && type === 'periodic') {
      console.log('[LoginButton] Periodic session check:', {
        USER_DOC_ID: !!window.sessionStorage.getItem('USER_DOC_ID'),
        SUI_ACCOUNT: !!window.sessionStorage.getItem('SUI_ACCOUNT'),
        ACCESS_TOKEN: !!window.sessionStorage.getItem('ACCESS_TOKEN'),
        isLogin: !!isLogin
      });
    }
    
    // 실제 검증 로직만 수행...
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={cn(
          "relative flex items-center transition-colors px-2 py-1.5",
          "hover:text-[#EAFD66] text-gray-300 dark:text-gray-400 dark:hover:text-[#EAFD66]",
          {
            "text-[#EAFD66] hover:text-[#EAFD66]/90": isLogin,
          }
        )}
        data-modal-trigger="true"
        data-no-close-on-click="true"
      >
        <span className="text-sm font-medium">{buttonText}</span>
      </button>
      
      {/* 포털 사용하여 모달 렌더링 - body 최상위에 렌더링되도록 함 */}
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
            zIndex: 100010, // 최상위 z-index로 설정
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            // 이벤트 전파를 중단하지 않음 - 마킹만 해주기
            console.log('Login modal container clicked, marking event');
            // data-no-close-on-click 속성으로 마킹되어 있으므로 이벤트 전파를 중단할 필요 없음
          }}
        >
          <MypageModal 
            isOpen={isLoginModalOpen} 
            onClose={closeLoginModal} 
          />
        </div>,
        portalTarget
      )}
    </>
  );
});

