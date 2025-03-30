"use client";

import { ProfileSection } from "./ProfileSection";
import { ActivityTabs } from "./ActivityTabs";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";

export function MyPageClient() {
  const { isLogin, isInitialized } = useAuth();

  return (
    <div className="space-y-8">
      <ProfileSection />
      
      {isLogin && isInitialized && (
        <>
          <h2 className="text-xl font-medium mt-8 mb-4">활동 내역</h2>
          <ActivityTabs />
        </>
      )}
    </div>
  );
} 