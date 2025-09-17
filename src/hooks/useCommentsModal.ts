import { useCommentsModalStore } from '@/store/commentsModalStore';
import { useMobileOptimization } from '@/lib/hooks/useMobileOptimization';

export function useCommentsModal() {
  const { isOpen, contentId, snap, open, close, setSnap } = useCommentsModalStore();
  const { isMobile } = useMobileOptimization();

  return {
    isOpen,
    contentId,
    snap,
    isMobile,
    open,
    close,
    setSnap,
  };
}
