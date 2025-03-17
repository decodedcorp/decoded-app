import { create } from 'zustand';

interface LoginModalStore {
  isOpen: boolean;
  lastAction: number; // 마지막 액션 시간 추적
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useLoginModalStore = create<LoginModalStore>((set, get) => ({
  isOpen: false,
  lastAction: 0,
  
  openLoginModal: () => {
    const state = get();
    const now = Date.now();
    
    // 이미 열려있거나 최근에 상태가 변경된 경우 무시
    if (state.isOpen || (now - state.lastAction < 500)) {
      console.log('[LoginModalStore] 이미 열려있거나 최근에 상태 변경됨, 열기 요청 무시');
      return;
    }
    
    console.log('[LoginModalStore] 모달 열기');
    set({ isOpen: true, lastAction: now });
  },
  
  closeLoginModal: () => {
    const state = get();
    const now = Date.now();
    
    // 이미 닫혀있거나 최근에 상태가 변경된 경우 무시
    if (!state.isOpen || (now - state.lastAction < 500)) {
      console.log('[LoginModalStore] 이미 닫혀있거나 최근에 상태 변경됨, 닫기 요청 무시');
      return;
    }
    
    console.log('[LoginModalStore] 모달 닫기');
    set({ isOpen: false, lastAction: now });
  },
}));
