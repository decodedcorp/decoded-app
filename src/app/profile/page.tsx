'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}