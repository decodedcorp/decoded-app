'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUserProfile } from '@/domains/profile/hooks/useProfile';
import { ProfileHeader } from '@/domains/profile/components/ProfileHeader';
import { ProfileSidebar } from '@/domains/profile/components/ProfileSidebar';
import { ProfileTabs } from '@/domains/profile/components/ProfileTabs';
import { ProfileEditModal } from '@/domains/profile/components/ProfileEditModal';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Get userid from URL parameter
  const targetUserId = params.userid as string;
  const isMyProfile = currentUser?.doc_id === targetUserId;
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const activeTab = searchParams.get('tab') || 'channels';
  
  // Get profile data via API
  const { data: profileData, isLoading, error } = useUserProfile(targetUserId || '');

  // Show not found if no userid provided
  if (!targetUserId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile not found</h1>
          <p className="text-zinc-400 mb-6">No user ID provided.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Redirect if trying to access profile without auth and it's your own profile
  if (!isAuthenticated && isMyProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sign in required</h1>
          <p className="text-zinc-400 mb-6">You need to sign in to view your profile.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse">
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile not found</h1>
          <p className="text-zinc-400 mb-6">This user profile doesn't exist or is private.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden">
          {/* Profile Header */}
          <ProfileHeader 
            userId={targetUserId!}
            profileData={profileData}
            isMyProfile={isMyProfile}
            onEditClick={() => setIsEditModalOpen(true)}
          />
          
          {/* Sidebar on top for mobile */}
          <div className="mt-6">
            <ProfileSidebar 
              userId={targetUserId!}
              profileData={profileData}
              isMyProfile={isMyProfile}
            />
          </div>
          
          {/* Divider */}
          <div className="border-t border-zinc-800 my-6" />
          
          {/* Profile Tabs */}
          <ProfileTabs 
            activeTab={activeTab} 
            userId={targetUserId!}
            isMyProfile={isMyProfile}
          />
        </div>

        {/* Desktop: Side by side */}
        <div className="hidden lg:flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Profile Header */}
            <ProfileHeader 
              userId={targetUserId!}
              profileData={profileData}
              isMyProfile={isMyProfile}
              onEditClick={() => setIsEditModalOpen(true)}
            />
            
            {/* Divider */}
            <div className="border-t border-zinc-800 my-6" />
            
            {/* Profile Tabs */}
            <ProfileTabs 
              activeTab={activeTab} 
              userId={targetUserId!}
              isMyProfile={isMyProfile}
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <ProfileSidebar 
              userId={targetUserId!}
              profileData={profileData}
              isMyProfile={isMyProfile}
            />
          </div>
        </div>
      </div>
      
      {/* Edit Modal - Only show for own profile */}
      {isMyProfile && isEditModalOpen && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}