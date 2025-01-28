import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const router = useRouter();

  const checkAuth = (callback: () => void) => {
    const userDocId = sessionStorage.getItem('USER_DOC_ID');

    if (!userDocId) {
      alert('로그인이 필요합니다');
      return;
    }

    callback();
  };

  return { checkAuth };
}
