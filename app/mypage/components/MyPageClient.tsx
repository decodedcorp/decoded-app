"use client";

import { ActivityTabs } from "./ActivityTabs";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";

export function MyPageClient() {
  const { isLogin, isInitialized } = useAuth();

  return (
    <div className="space-y-8">
      {isLogin && isInitialized ? (
        <ActivityTabs />
      ) : (
        <div className="text-center py-8 bg-[#1A1A1A] border border-white/5 rounded-lg">
          <p className="text-white/60">
            로그인 후 활동 내역을 확인할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
} 