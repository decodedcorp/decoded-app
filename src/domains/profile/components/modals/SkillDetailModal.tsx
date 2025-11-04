'use client';

import React from 'react';
import { SimpleModal } from '@/lib/components/ui/modal/SimpleModal';
import { useTranslation } from 'react-i18next';
import { Skill } from '../../types/skills';
import { formatDistanceToNow } from 'date-fns';

interface SkillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
  onUseSkill?: (skill: Skill) => void;
}

export function SkillDetailModal({ isOpen, onClose, skill, onUseSkill }: SkillDetailModalProps) {
  const { t } = useTranslation('skills');

  if (!skill) return null;

  const handleUseSkill = () => {
    if (onUseSkill) {
      onUseSkill(skill);
    }
    onClose();
  };

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} className="z-[3000]">
      <div className="bg-zinc-900 text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-2xl">/</span>
              <h2 className="text-2xl font-bold text-white">{skill.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {/* Skill Info */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span>
                {t('skillCard.by')} {skill.userId.slice(0, 8)}...
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              {t('skillCard.prompt') || 'Prompt'}
            </h3>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <p className="text-white whitespace-pre-wrap leading-relaxed">{skill.prompt}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {t('skillCard.close') || '닫기'}
          </button>
          {onUseSkill && (
            <button
              onClick={handleUseSkill}
              className="px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors cursor-pointer"
            >
              {t('skillCard.useSkill')}
            </button>
          )}
        </div>
      </div>
    </SimpleModal>
  );
}

