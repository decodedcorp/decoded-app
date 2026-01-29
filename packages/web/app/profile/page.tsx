"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { Header } from "@/lib/components";
import {
  ProfileHeader,
  StatsCards,
  BadgeGrid,
  RankingList,
  BadgeModal,
  ProfileEditModal,
  ProfileDesktopLayout,
} from "@/lib/components/profile";

function ViewAllActivityButton() {
  const handleClick = () => {
    console.log("Navigate to /profile/activity - not yet implemented");
    alert("활동 내역 페이지는 아직 구현되지 않았습니다.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <button
        onClick={handleClick}
        className="w-full md:w-auto px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-sm font-medium text-foreground"
      >
        View All Activity
      </button>
    </motion.div>
  );
}

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Mobile Header - back button + title + settings */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-2 hover:bg-accent rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-semibold text-lg">Profile</h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="p-2 -mr-2 hover:bg-accent rounded-lg"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Layout - stacked */}
      <div className="md:hidden px-4 py-4 space-y-4">
        <ProfileHeader onEditClick={() => setIsEditModalOpen(true)} />
        <StatsCards />
        <BadgeGrid />
        <RankingList />
        <ViewAllActivityButton />
      </div>

      {/* Desktop Layout - 2 column */}
      <div className="hidden md:block pt-16">
        <ProfileDesktopLayout
          profileSection={
            <>
              <ProfileHeader onEditClick={() => setIsEditModalOpen(true)} />
              {/* Stats are now inside ProfileHeader via ProfileHeaderCard */}
            </>
          }
          activitySection={
            <>
              <BadgeGrid />
              <RankingList />
              <ViewAllActivityButton />
            </>
          }
        />
      </div>

      {/* Modals */}
      <BadgeModal />
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
