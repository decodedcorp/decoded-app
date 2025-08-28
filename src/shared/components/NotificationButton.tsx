'use client';

import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications, useMarkAllNotificationsRead } from '@/domains/notifications/hooks/useNotifications';
import { useInvitations } from '@/domains/invitations/hooks/useInvitations';
import { useAuthStore } from '@/store/authStore';
import { InvitationNotificationItem } from './InvitationNotificationItem';
import { SentInvitationNotificationItem } from './SentInvitationNotificationItem';

interface NotificationButtonProps {
  unreadCount?: number;
}

export function NotificationButton({ unreadCount }: NotificationButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // API 데이터 가져오기
  const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError } = useNotifications({ 
    limit: 10 
  });
  const { data: invitationsData, isLoading: invitationsLoading } = useInvitations({
    includeExpired: false
  });
  
  const markAllReadMutation = useMarkAllNotificationsRead();

  // 알림 데이터 처리 (API 실패 시 빈 배열 사용)
  const notifications = notificationsData?.notifications || [];
  const hasNotificationsError = !!notificationsError;
  const allInvitations = invitationsData?.invitations?.filter(inv => !inv.is_expired) || [];
  
  // 현재 사용자 ID 가져오기 (NotificationButton에서는 useUser 접근 불가하므로 auth store에서)
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id || currentUser?.doc_id || (currentUser as any)?.user_id;

  // 초대를 sent/received로 구분
  const sentInvitations = allInvitations.filter(inv => {
    const inviterId = inv.inviter?.id || inv.inviter?.doc_id || (inv.inviter as any)?.user_id;
    return inviterId === currentUserId;
  });
  
  const receivedInvitations = allInvitations.filter(inv => {
    const inviteeId = inv.invitee?.id || inv.invitee?.doc_id || (inv.invitee as any)?.user_id;
    return inviteeId === currentUserId;
  });

  // 실제 unread count 계산 (prop으로 받은 것보다 API 데이터 우선)
  const actualUnreadCount = unreadCount ?? (
    notifications.filter(n => !n.is_read).length + sentInvitations.length + receivedInvitations.length
  );

  // 배지 색상 결정 (received > sent > regular 우선순위)
  const badgeColor = receivedInvitations.length > 0 ? 'bg-orange-500' : 
                     sentInvitations.length > 0 ? 'bg-zinc-500' : 'bg-red-500';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 rounded-lg hover:bg-zinc-800 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread count badge */}
        {actualUnreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-medium ${badgeColor}`}>
            {actualUnreadCount > 99 ? '99+' : actualUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">Notifications</h3>
            <button
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="text-xs text-[#EAFD66] hover:text-[#d9ec55] transition-colors disabled:opacity-50"
            >
              {markAllReadMutation.isPending ? 'Marking...' : 'Mark all as read'}
            </button>
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {(notificationsLoading || invitationsLoading) ? (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">
                <div className="animate-pulse">Loading notifications...</div>
              </div>
            ) : (
              <>
                {/* 받은 초대 알림들 (최고 우선순위) */}
                {receivedInvitations.map((invitation) => (
                  <InvitationNotificationItem 
                    key={`received-${invitation.id}`} 
                    invitation={invitation} 
                  />
                ))}
                
                {/* 보낸 초대 알림들 (높은 우선순위) */}
                {sentInvitations.map((invitation) => (
                  <SentInvitationNotificationItem 
                    key={`sent-${invitation.id}`} 
                    invitation={invitation} 
                  />
                ))}
                
                {/* 구분선 (초대와 일반 알림 사이) */}
                {(receivedInvitations.length > 0 || sentInvitations.length > 0) && notifications.length > 0 && (
                  <div className="border-b border-zinc-800" />
                )}

                {/* 일반 알림들 */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-zinc-800 transition-colors cursor-pointer border-b border-zinc-800 last:border-b-0 ${
                        !notification.is_read ? 'bg-zinc-800/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon based on type */}
                        <div className="mt-1">
                          {notification.notification_type === 'comment' && (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          )}
                          {notification.notification_type === 'like' && (
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          )}
                          {notification.notification_type === 'follow' && (
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300">{notification.content}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-[#EAFD66] rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (receivedInvitations.length === 0 && sentInvitations.length === 0) ? (
                  <div className="px-4 py-8 text-center text-sm text-zinc-500">
                    No notifications
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-800">
            <button className="w-full text-center text-sm text-[#EAFD66] hover:text-[#d9ec55] transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}