'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { InlineSpinner } from '@/shared/components/loading/InlineSpinner';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const t = useCommonTranslation();

  useEffect(() => { 
    if (isAuthenticated && currentUser?.doc_id) {
      // Redirect to user's own profile
      router.replace(`/profile/${currentUser.doc_id}`);
    } else if (!isAuthenticated) {
      // Redirect to home if not authenticated
      router.replace('/');
    }
  }, [isAuthenticated, currentUser, router]);

  // Show loading while redirecting - using MainLayout styling
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <InlineSpinner size="lg" className="mb-4" ariaLabel={t.status.redirecting()} />
      <p className="text-sm text-muted-foreground">{t.status.redirecting()}</p>
    </div>
  );
}
