import { useAuthStore } from '../../../store/authStore';
import { getAccessToken } from '../utils/tokenManager';
import { TokenDecoder } from '../utils/tokenDecoder';

/**
 * 사용자 doc_id를 안전하게 접근하는 훅
 *
 * 우선순위:
 * 1. Zustand store의 user.doc_id
 * 2. sessionStorage의 user.doc_id
 * 3. JWT 토큰에서 추출한 user_doc_id
 */
export const useDocId = (): string | undefined => {
  const user = useAuthStore((state) => state.user);

  // 1. Zustand store에서 먼저 확인
  if (user?.doc_id) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[useDocId] Found doc_id from Zustand store:', user.doc_id);
    }
    return user.doc_id;
  }

  // 2. sessionStorage에서 확인 (클라이언트 사이드에서만)
  if (typeof window !== 'undefined') {
    try {
      const userFromSession = sessionStorage.getItem('user');
      if (userFromSession) {
        const parsedUser = JSON.parse(userFromSession);
        if (parsedUser?.doc_id) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useDocId] Found doc_id from sessionStorage:', parsedUser.doc_id);
          }
          return parsedUser.doc_id;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[useDocId] Failed to parse user from sessionStorage:', error);
      }
    }
  }

  // 3. JWT 토큰에서 추출 시도
  try {
    const token = getAccessToken();
    if (token) {
      const decoded = TokenDecoder.decode(token);
      if (decoded?.sub) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useDocId] Found doc_id from JWT token:', decoded.sub);
        }
        return decoded.sub;
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[useDocId] Failed to extract doc_id from token:', error);
    }
  }

  // 개발 모드에서만 로그 출력 (에러가 아닌 정보성 메시지)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[useDocId] No doc_id found from any source - this is normal during initialization',
    );
  }
  return undefined;
};

/**
 * doc_id가 있는지 확인하는 훅
 */
export const useHasDocId = (): boolean => {
  const docId = useDocId();
  return !!docId;
};

/**
 * doc_id가 없을 때 에러를 발생시키는 훅 (필수인 경우)
 */
export const useRequiredDocId = (): string => {
  const docId = useDocId();
  if (!docId) {
    throw new Error('User doc_id is required but not available');
  }
  return docId;
};
