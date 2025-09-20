'use client';

import React, { useState } from 'react';

import { Button } from '@decoded/ui';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/lib/components/ui/modal';
import { useSearchUsers } from '@/domains/search/hooks/useSearch';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useCommonTranslation, useInvitationTranslation } from '@/lib/i18n/hooks';

import { useCreateInvitation } from '../hooks/useInvitations';

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
  const t = useCommonTranslation();
  const ti = useInvitationTranslation();

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

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      variant="center"
      size="md"
      dismissible={true}
      ariaLabel={ti.title()}
    >
      <ModalOverlay className="modal-overlay--heavy">
        <ModalContent className="bg-zinc-900 border border-zinc-700">
          <ModalHeader>
            <h2 className="text-xl font-semibold text-white">{ti.title()}</h2>
            <ModalClose />
          </ModalHeader>

          <ModalBody>
            <form id="invite-form" onSubmit={handleSubmit} className="space-y-4">
              {/* User Search */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {ti.userSearch.label()}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={ti.userSearch.placeholder()}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* Search Results */}
                  {searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded max-h-40 overflow-y-auto z-10">
                      {isSearching ? (
                        <div className="p-3 text-zinc-400 text-sm">{t.search.searching()}</div>
                      ) : (
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUserSelect('68afbabeaf346786ac9d2671', 'Test User')
                            }
                            className="w-full px-3 py-2 text-left hover:bg-zinc-700 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
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
                  {ti.personalMessage.label()}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={ti.personalMessage.placeholder()}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-zinc-400 mt-1">{message.length}/500 characters</p>
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {ti.expiresIn()}
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </form>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
            >
              {t.actions.reset()}
            </button>
            <Button
              type="submit"
              form="invite-form"
              disabled={!selectedUserId || createInvitationMutation.isPending}
              variant="primary"
            >
              {createInvitationMutation.isPending ? ti.state.sending() : ti.actions.send()}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
