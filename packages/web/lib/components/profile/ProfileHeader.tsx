"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Settings, LogOut } from "lucide-react";
import { useProfileStore, selectUser } from "@/lib/stores/profileStore";
import { useAuthStore } from "@/lib/stores/authStore";

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function ProfileHeader() {
  const user = useProfileStore(selectUser);
  const router = useRouter();
  const { logout, isLoading } = useAuthStore();

  const handleSettingsClick = () => {
    console.log("Navigate to /profile/settings - not yet implemented");
    alert("설정 페이지는 아직 구현되지 않았습니다.");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl p-4 md:p-6 border border-border"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden bg-muted flex-shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.displayName} avatar`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-xl md:text-2xl font-bold">
              {getInitials(user.displayName)}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-foreground truncate">
                {user.displayName}
              </h2>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>

            {/* Settings & Logout Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleSettingsClick}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="프로필 설정"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="로그아웃"
              >
                <LogOut className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
