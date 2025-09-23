'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hasValidInviteCode } from '@/lib/invite/storage';

type InviteGateStatus = 'checking' | 'valid' | 'invalid';

/**
 * Hook to manage invite code gate protection
 * Redirects to invite code page if no valid code is stored
 */
export const useInviteGate = () => {
  const [status, setStatus] = useState<InviteGateStatus>('checking');
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Prevent multiple redirects
    if (hasRedirectedRef.current) return;

    const checkInviteCode = () => {
      if (hasValidInviteCode()) {
        setStatus('valid');
      } else {
        setStatus('invalid');
        hasRedirectedRef.current = true;

        // Redirect to invite code page with return URL
        const nextUrl = encodeURIComponent(pathname);
        router.replace(`/invite-code?next=${nextUrl}`);
      }
    };

    // Small delay to prevent hydration issues
    const timeoutId = setTimeout(checkInviteCode, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, router]);

  return {
    status,
    isValid: status === 'valid',
    isChecking: status === 'checking',
  };
};