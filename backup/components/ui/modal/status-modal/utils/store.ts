import { create } from 'zustand';
import type { StatusConfig } from './types';

type StatusStore = {
  isOpen: boolean;
  type: StatusConfig['type'];
  messageKey?: StatusConfig['messageKey'];
  title?: string;
  message?: string;
  onLoginRequired?: () => void;
  setStatus: (config: StatusConfig) => void;
  closeStatus: () => void;
};

export const useStatusStore = create<StatusStore>((set) => ({
  isOpen: false,
  type: 'success',
  messageKey: undefined,
  title: undefined,
  message: undefined,
  onLoginRequired: undefined,
  
  setStatus: (config) => set({
    isOpen: true,
    type: config.type,
    messageKey: config.messageKey,
    title: config.title,
    message: config.message,
    onLoginRequired: config.onLoginRequired,
  }),
  
  closeStatus: () => {
    // onLoginRequired 함수를 캡처해서 실행할 수 있도록 함
    const store = useStatusStore.getState();
    const loginCallback = store.onLoginRequired;
    
    set({
      isOpen: false,
      onLoginRequired: undefined,
    });
    
    // 모달이 닫힌 후 콜백 실행 (마이페이지 모달 열기 이벤트는 제거)
    if (store.type === 'warning' && store.messageKey === 'login' && loginCallback) {
      setTimeout(() => {
        console.log('로그인 콜백 실행');
        loginCallback();
      }, 300);
    }
  },
})); 