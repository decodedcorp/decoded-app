"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ActivityTabs } from "./ActivityTabs";
import { StyleTab } from "./StyleTab";
import { pretendardSemiBold } from "@/lib/constants/fonts";

interface ProfileTabsProps {
  userDocId: string;
}

export function ProfileTabs({ userDocId }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "style">("activity");

  return (
    <div className="mt-10">
      {/* 탭 헤더 */}
      <div className="container mx-auto border-b border-white/10 mb-6">
        <button
          className={`px-4 py-2 text-sm ${
            pretendardSemiBold.className
          } relative ${
            activeTab === "activity"
              ? "text-gray-400"
              : "text-gray-600 hover:text-gray-400"
          } transition-colors duration-200`}
          onClick={() => setActiveTab("activity")}
        >
          활동 내역
          {activeTab === "activity" && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400"
            />
          )}
        </button>
        {/* <button
          className={`px-4 py-2 text-sm ${
            pretendardSemiBold.className
          } relative ${
            activeTab === "style"
              ? "text-gray-400"
              : "text-gray-600 hover:text-gray-400"
          } transition-colors duration-200`}
          onClick={() => setActiveTab("style")}
        >
          스타일
          {activeTab === "style" && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400"
            />
          )}
        </button> */}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="mt-4">
        <ActivityTabs userDocId={userDocId} />
      </div>
    </div>
  );
}
