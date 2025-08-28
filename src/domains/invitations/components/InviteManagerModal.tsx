'use client';

import React, { useState } from 'react';
import { useCreateInvitation } from '../hooks/useInvitations';
import { useSearchUsers } from '@/domains/search/hooks/useSearch';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';

interface InviteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChannelResponse;
}

export function InviteManagerModal({ isOpen, onClose, channel }: InviteManagerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7);

  const createInvitationMutation = useCreateInvitation();

  // 사용자 검색
  const { data: searchResults, isLoading: isSearching } = useSearchUsers({
    query: searchQuery,
    enabled: searchQuery.length >= 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId || !channel.id) return;

    try {
      await createInvitationMutation.mutateAsync({
        channel_id: channel.id,
        invitee_user_id: selectedUserId,
        message: message.trim() || null,
        expires_in_days: expiresInDays,
      });

      // 성공 시 모달 닫기
      onClose();
      setSearchQuery('');
      setSelectedUserId('');
      setMessage('');
      setExpiresInDays(7);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  const handleUserSelect = (userId: string, username: string) => {
    setSelectedUserId(userId);
    setSearchQuery(username);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedUserId('');
    setMessage('');
    setExpiresInDays(7);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Invite Manager</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Search */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Search User</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type username or email..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Search Results */}
                {searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded max-h-40 overflow-y-auto z-10">
                    {isSearching ? (
                      <div className="p-3 text-zinc-400 text-sm">Searching...</div>
                    ) : (
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => handleUserSelect('68afbabeaf346786ac9d2671', 'Test User')}
                          className="w-full px-3 py-2 text-left hover:bg-zinc-700 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                              TU
                            </div>
                            <div>
                              <div className="text-white text-sm">Test User</div>
                              <div className="text-zinc-400 text-xs font-mono">
                                68afbabeaf346786ac9d2671
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Add a personal note to your invitation..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-zinc-400 mt-1">{message.length}/500 characters</p>
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Expires In</label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!selectedUserId || createInvitationMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                {createInvitationMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
