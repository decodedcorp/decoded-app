import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type SnapPosition = 'min' | 'mid' | 'max';
export type CloseReason = 'esc' | 'backdrop' | 'swipe' | 'button' | 'send';

interface CommentsModalState {
  isOpen: boolean;
  contentId: string | null;
  snap: SnapPosition;

  // Actions
  open: (contentId: string, snap?: SnapPosition) => void;
  close: (reason?: CloseReason) => void;
  setSnap: (snap: SnapPosition) => void;
}

export const useCommentsModalStore = create<CommentsModalState>()(
  devtools(
    (set) => ({
      isOpen: false,
      contentId: null,
      snap: 'mid',

      open: (contentId, snap = 'mid') => {
        set({
          isOpen: true,
          contentId,
          snap,
        });
      },

      close: (reason) => {
        set({
          isOpen: false,
          contentId: null,
          snap: 'mid',
        });

        // 로깅을 위한 콘솔 (나중에 분석 이벤트로 교체 가능)
        if (reason) {
          console.log('Comments modal closed:', reason);
        }
      },

      setSnap: (snap) => {
        set({ snap });
      },
    }),
    {
      name: 'comments-modal-store',
    },
  ),
);
