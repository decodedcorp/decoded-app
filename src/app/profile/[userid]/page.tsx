'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useUserProfile } from '@/domains/profile/hooks/useProfile';
import { ProfileHeader } from '@/domains/profile/components/ProfileHeader';
import { ProfileSidebar } from '@/domains/profile/components/ProfileSidebar';
import { ProfileTabs } from '@/domains/profile/components/ProfileTabs';
import { ProfileEditModal } from '@/domains/profile/components/ProfileEditModal';
import { InlineSpinner } from '@/shared/components/loading/InlineSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { t } = useTranslation('profile');
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Get userid from URL parameter
  const targetUserId = params.userid as string;
  const isMyProfile = currentUser?.doc_id === targetUserId;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const activeTab = searchParams.get('tab') || 'channels';

  // Get profile data via API (always call hooks at the top level)
  const { data: profileData, isLoading, error } = useUserProfile(targetUserId || '');

  // Memoized components to prevent unnecessary re-renders (always call hooks at the top level)
  const profileHeader = useMemo(
    () => (
      <ProfileHeader
        userId={targetUserId!}
        profileData={profileData}
        isMyProfile={isMyProfile}
        onEditClick={() => setIsEditModalOpen(true)}
      />
    ),
    [targetUserId, profileData, isMyProfile],
  );

  const profileSidebar = useMemo(
    () => (
      <ProfileSidebar userId={targetUserId!} profileData={profileData} isMyProfile={isMyProfile} />
    ),
    [targetUserId, profileData, isMyProfile],
  );

  const profileTabs = useMemo(
    () => <ProfileTabs activeTab={activeTab} userId={targetUserId!} isMyProfile={isMyProfile} />,
    [activeTab, targetUserId, isMyProfile],
  );

  // 인증 초기화가 완료될 때까지 로딩 표시
  if (!isInitialized) {
    return (
      <div className="w-full px-3 py-4 sm:px-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <InlineSpinner size="lg" className="mx-auto mb-4" ariaLabel={t('loading.initializing')} />
            <p className="text-gray-600">{t('loading.initializing')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show not found if no userid provided
  if (!targetUserId) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        role="main"
        aria-label={t('page.notFound')}
      >
        <div className="text-center" role="alert" aria-live="assertive">
          <h1 className="text-2xl font-bold text-white mb-4">{t('page.notFound')}</h1>
          <p className="text-zinc-400 mb-6">{t('page.notFoundDescription')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
            aria-label={t('page.goToHome')}
          >
            {t('page.goToHome')}
          </button>
        </div>
      </div>
    );
  }

  // Redirect if trying to access profile without auth and it's your own profile
  if (!isAuthenticated && isMyProfile) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        role="main"
        aria-label={t('page.signInRequired')}
      >
        <div className="text-center" role="alert" aria-live="assertive">
          <h1 className="text-2xl font-bold text-white mb-4">{t('page.signInRequired')}</h1>
          <p className="text-zinc-400 mb-6">{t('page.signInRequiredDescription')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
            aria-label={t('page.goToHome')}
          >
            {t('page.goToHome')}
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div
          className="container mx-auto px-4 py-8 max-w-7xl"
          role="main"
          aria-label={t('loading.title')}
        >
          <div className="animate-pulse" aria-live="polite" aria-label={t('loading.description')}>
            <div className="flex gap-8">
              <div className="flex-1">
                <div className="h-32 bg-zinc-800 rounded-xl mb-8" />
                <div className="h-12 bg-zinc-800 rounded mb-4" />
                <div className="h-96 bg-zinc-800 rounded" />
              </div>
              <div className="w-80">
                <div className="h-64 bg-zinc-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        role="main"
        aria-label={t('error.title')}
      >
        <div className="text-center" role="alert" aria-live="assertive">
          <h1 className="text-2xl font-bold text-white mb-4">{t('page.profileNotFound')}</h1>
          <p className="text-zinc-400 mb-6">{t('page.profileNotFoundDescription')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
            aria-label={t('page.goToHome')}
          >
            {t('page.goToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        className="w-full px-3 py-4 sm:px-4 sm:py-8"
        style={{
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
        }}
        role="main"
        aria-label={t('page.title')}
      >
        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden space-y-4 sm:space-y-6">
          {profileHeader}
          {profileSidebar}
          <div className="border-t border-zinc-800" />
          {profileTabs}
        </div>

        {/* Desktop: Side by side */}
        <div className="hidden lg:flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {profileHeader}
            <div className="border-t border-zinc-800 my-6" />
            {profileTabs}
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">{profileSidebar}</div>
        </div>
      </div>

      {/* Edit Modal - Only show for own profile */}
      {isMyProfile && isEditModalOpen && (
        <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}
