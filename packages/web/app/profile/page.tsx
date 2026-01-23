"use client";

import { motion } from "motion/react";
import { Header } from "@/lib/components";
import {
  ProfileHeader,
  StatsCards,
  BadgeGrid,
  RankingList,
  BadgeModal,
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
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 md:pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 py-6">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Stats Cards */}
          <StatsCards />

          {/* Badge Section */}
          <BadgeGrid />

          {/* Ranking Section */}
          <RankingList />

          {/* View All Activity Button */}
          <ViewAllActivityButton />
        </div>
      </main>

      {/* Badge Modal (Portal) */}
      <BadgeModal />
    </div>
  );
}
