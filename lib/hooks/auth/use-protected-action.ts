import { useCallback } from 'react';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

export function useProtectedAction() {
  const checkAuth = useCallback(() => {
    const userId = sessionStorage.getItem('USER_DOC_ID');
    if (!userId) {
      useStatusStore.setState({
        isOpen: true,
        type: 'warning',
        messageKey: 'login'
      });
      return false;
    }
    return userId;
  }, []);

  const withAuth = useCallback(<T>(action: (userId: string) => Promise<T>) => {
    return async () => {
      const userId = checkAuth();
      if (!userId) return;
      return action(userId);
    };
  }, [checkAuth]);

  return { checkAuth, withAuth };
}