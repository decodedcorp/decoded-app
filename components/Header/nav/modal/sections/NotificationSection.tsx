"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils/style";
import { networkManager } from "@/lib/network/network";
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface Notification {
  doc_id: string;
  notification_type: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  status: "read" | "unread";
  created_at: string;
}

interface NotificationSectionProps {
  data: { notifications: Notification[] } | null;
  isLoading: boolean;
}

export function NotificationSection({
  data,
  isLoading,
}: NotificationSectionProps) {
  const { t } = useLocaleContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  console.log(data);
  if (!data) return null;

  const handleNotificationClick = async (notification: Notification) => {
    setExpandedId(
      expandedId === notification.doc_id ? null : notification.doc_id
    );
    if (notification.status === "unread") {
      const userDocId = sessionStorage.getItem("USER_DOC_ID");
      console.log(notification.doc_id);
      try {
        await networkManager.request(
          `user/${userDocId}/notification/${notification.doc_id}/read`,
          "POST"
        );
      } catch (error) {
        console.error("알림 읽기 실패:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data.notifications.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {data.notifications.map((notification) => (
        <div
          key={notification.doc_id}
          className={cn(
            "p-4 rounded-xl cursor-pointer transition-colors",
            notification.status === "unread" ? "bg-[#1A1A1A]" : "bg-black/20",
            "hover:bg-[#1A1A1A]/80"
          )}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#EAFD66]">
                  {
                    t.mypage.notification.messages[
                      notification.notification_type as keyof typeof t.mypage.notification.messages
                    ]
                  }
                </span>
                {notification.status === "unread" && (
                  <div className="w-2 h-2 rounded-full bg-[#EAFD66]" />
                )}
              </div>
              <h3 className="text-sm font-medium text-white">
                {notification.title}
              </h3>
              {expandedId === notification.doc_id && (
                <p className="text-sm text-gray-400 mt-2">
                  {notification.content}
                </p>
              )}
              <div className="text-xs text-gray-500">
                {format(new Date(notification.created_at), "PPP p", {
                  locale: ko,
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
      <div className="text-gray-400 text-sm">알림이 없습니다.</div>
    </div>
  );
}
