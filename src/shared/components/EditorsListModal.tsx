'use client';

import React, { useEffect } from 'react';

import type { UserProfileResponse } from '@/api/generated/models/UserProfileResponse';
import type { ChannelUserProfile } from '@/api/generated/models/ChannelUserProfile';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { useTranslation } from 'react-i18next';

interface EditorsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  editors: UserProfileResponse[] | ChannelUserProfile[];
  channelName?: string;
  ownerId?: string;
}

export function EditorsListModal({
  isOpen,
  onClose,
  editors,
  channelName,
  ownerId,
}: EditorsListModalProps) {
  const { t } = useTranslation('common');

  // Use improved scroll lock
  useScrollLock(isOpen);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Sort editors: owner first, then others
  const sortedEditors = [...editors].sort((a, b) => {
    const aIsOwner = ownerId === a.id;
    const bIsOwner = ownerId === b.id;

    if (aIsOwner && !bIsOwner) return -1;
    if (!aIsOwner && bIsOwner) return 1;
    return 0;
  });

  const getDisplayName = (editor: UserProfileResponse | ChannelUserProfile): string => {
    if (editor.aka) return editor.aka;
    if ('email' in editor && editor.email) return editor.email.split('@')[0];
    return t('unknown');
  };

  const getInitials = (editor: UserProfileResponse | ChannelUserProfile): string => {
    const name = getDisplayName(editor);
    return name.substring(0, 2).toUpperCase();
  };

  const formatFollowers = (count?: number): string => {
    if (!count) return `0 ${t('followers')}`;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M ${t('followers')}`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K ${t('followers')}`;
    return `${count} ${t('followers')}`;
  };

  const isOwner = (editor: UserProfileResponse | ChannelUserProfile): boolean => {
    return ownerId === editor.id;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-zinc-900 rounded-2xl w-full max-w-xl max-h-[80vh] overflow-hidden pointer-events-auto border border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-700">
            <h2 className="text-2xl font-bold text-white">{t('ui.editors')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              aria-label={t('actions.close')}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Editors List */}
          <div
            className="overflow-auto max-h-[calc(80vh-80px)]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {sortedEditors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">{t('noEditorsYet')}</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-700">
                {sortedEditors.map((editor) => (
                  <div
                    key={editor.id}
                    className="flex items-center justify-between p-6 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-zinc-600 to-zinc-700">
                          {editor.profile_image_url ? (
                            <img
                              src={editor.profile_image_url}
                              alt={getDisplayName(editor)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 font-medium">
                              {getInitials(editor)}
                            </div>
                          )}
                        </div>
                        {/* Owner crown or verified badge */}
                        {isOwner(editor) ? (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                              <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm2.7-2h8.6l.9-4.4-2.4 2L12 9l-2.8 2.6-2.4-2L7.7 14z" />
                            </svg>
                          </div>
                        ) : (
                          'is_verified' in editor &&
                          editor.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )
                        )}
                      </div>

                      {/* Editor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{getDisplayName(editor)}</h3>
                          {isOwner(editor) && (
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                              {t('owner')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">
                          {formatFollowers(
                            'total_followers' in editor ? editor.total_followers : 0,
                          )}
                        </p>
                        {/* Bio/Description if available */}
                        {'email' in editor && editor.email && (
                          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{editor.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Follow Button */}
                    <button
                      className="px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-full hover:bg-zinc-600 transition-colors font-medium text-sm text-white"
                      onClick={() => {
                        // TODO: Implement follow functionality
                        console.log('Follow editor:', editor.id);
                      }}
                    >
                      {t('actions.follow')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditorsListModal;
