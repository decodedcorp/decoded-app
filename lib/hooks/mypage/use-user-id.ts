'use client';

import { useState, useEffect } from 'react';

/**
 * 세션스토리지에서 사용자 ID를 가져오는 훅
 * @returns 사용자 ID 또는 null
 */
export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDocId = sessionStorage.getItem('USER_DOC_ID');
      setUserId(userDocId);
    }
  }, []);

  return userId;
} 