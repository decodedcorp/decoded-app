'use client';

import { usePathname } from 'next/navigation';
import { useInviteGate } from '@/hooks/useInviteGate';

interface InviteGateProps {
  children: React.ReactNode;
}

// Routes that don't require invite code protection
const PUBLIC_ROUTES = ['/invite-code'];

/**
 * Client component that protects routes behind invite code gate
 * Only renders children if user has valid invite code or is on public route
 */
export function InviteGate({ children }: InviteGateProps) {
  const pathname = usePathname();
  const { isValid, isChecking } = useInviteGate();

  // Allow public routes without gate check
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show nothing while checking (prevents flash)
  if (isChecking) {
    return null;
  }

  // Show children only if valid (useInviteGate handles redirect for invalid)
  if (isValid) {
    return <>{children}</>;
  }

  // Fallback - should not reach here as useInviteGate redirects
  return null;
}