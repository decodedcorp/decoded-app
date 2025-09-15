import { useEffect } from 'react';
import { scrollLockManager } from '@/lib/ui/scrollLock';

/**
 * React hook for managing body scroll lock
 * Uses the improved scroll lock manager for better iOS Safari compatibility
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      scrollLockManager.lock();
    } else {
      scrollLockManager.unlock();
    }

    // Cleanup on unmount
    return () => {
      if (isLocked) {
        scrollLockManager.unlock();
      }
    };
  }, [isLocked]);
}