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

export function LoginButton() {
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
    console.log('LoginButton rendered, isLoginModalOpen:', isLoginModalOpen);
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

  // 첫 렌더링 이후 트랜지션 활성화
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 주기적으로 로그인 상태 체크
  useEffect(() => {
    // 초기 체크
    checkLoginStatus();

    // 1초마다 체크
    const intervalId = setInterval(checkLoginStatus, 1000);

    // 메시지 이벤트 리스너
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.id_token) {
        console.log('Token received, closing modal');
        closeLoginModal();
        
        // 로그인 완료 후 대기 중인 콜백 실행 - 시간 조정 및 로그 추가
        setTimeout(() => {
          console.log('Running auth callback for popup login');
          executeAuthCallback();
          
          // 콜백 실행 후 로그인 상태 확인하여 마이페이지 모달 표시
          setTimeout(() => {
            if (window.sessionStorage.getItem('USER_DOC_ID')) {
              console.log('Popup login successful, reopening mypage modal');
              openLoginModal();
            }
          }, 300);
        }, 500);
      }
    };

    // OPEN_MYPAGE_MODAL 이벤트 리스너 (이전 코드와의 호환성을 위해 유지)
    // StatusStore에서 이 이벤트를 발생시키는 코드가 제거되었으므로,
    // 이 리스너는 현재 사용되지 않지만 혹시 다른 곳에서 이벤트를 발생시키는 경우를 대비해 유지
    const handleOpenMypage = () => {
      openLoginModal();
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('OPEN_MYPAGE_MODAL', handleOpenMypage);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('OPEN_MYPAGE_MODAL', handleOpenMypage);
    };
  }, [checkLoginStatus, closeLoginModal, openLoginModal]);

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
        
        // 메인 창에서 토큰 처리
        setTimeout(() => {
          handleGoogleLogin(tempToken);
          
          // 처리 후 토큰 삭제
          localStorage.removeItem('TEMP_ID_TOKEN');
          localStorage.removeItem('LOGIN_TIMESTAMP');
          
          // 로그인 완료 후 대기 중인 콜백 실행 - 타이밍 조정 및 콘솔 로그 추가
          setTimeout(() => {
            console.log('Running auth callback for mobile login');
            executeAuthCallback();
            
            // 모바일 환경에서는 타이밍 문제로 인해 콜백이 실행되지 않을 수 있으므로
            // 마이페이지 모달을 직접 다시 열어줌
            setTimeout(() => {
              if (window.sessionStorage.getItem('USER_DOC_ID')) {
                console.log('Mobile login successful, reopening mypage modal');
                openLoginModal();
              }
            }, 300);
          }, 800); // 시간 증가
        }, 300); // 시간 증가
      } else {
        // 오래된 토큰 삭제
        localStorage.removeItem('TEMP_ID_TOKEN');
        localStorage.removeItem('LOGIN_TIMESTAMP');
      }
    }
  }, [isInitialized, handleGoogleLogin, closeLoginModal, openLoginModal]);

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

  // 모달 열기 핸들러 - 모바일에서는 좀 더 신경써서 처리
  const handleOpenModal = () => {
    if (isLoading) return;
    
    if (isMobile) {
      console.log('Opening login modal on mobile');
      // 모바일에서는 약간의 지연을 주어 더 안정적으로 열림
      setTimeout(() => {
        openLoginModal();
      }, 50);
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <div ref={modalRef} className="relative flex items-center gap-3">
        <span
          className={cn('text-xs md:text-sm', 'cursor-pointer', {
            'transition-all duration-200': !isFirstRender,
            'text-[#EAFD66]': isLoginModalOpen,
            'text-gray-600 hover:text-[#EAFD66]': !isLoginModalOpen,
            'animate-pulse': isLoading,
            'opacity-70': !isInitialized,
          })}
          onClick={handleOpenModal}
        >
          {buttonText}
        </span>
      </div>
      
      {/* 
        모달을 루트 레벨에서 렌더링하여 포지셔닝 문제 해결
        DOM을 직접 제어하는 것과 유사한 방식으로 구현
        
        isOpen 상태를 직접 모달에 전달하여 모달 표시 상태를 명확히 함
      */}
      {typeof document !== 'undefined' && createPortal(
        <MypageModal 
          isOpen={isLoginModalOpen} 
          onClose={closeLoginModal} 
        />,
        document.body
      )}
    </>
  );
}
