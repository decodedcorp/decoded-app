'use client';

import React, { useState } from 'react';
import { useSkills, useDeleteSkill } from '../../hooks/useSkills';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { useTranslation } from 'react-i18next';
import { Skill } from '../../types/skills';
import { SkillEditModal } from '../modals/SkillEditModal';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export function SkillsTab() {
  const t = useProfileTranslation();
  const { t: rawT } = useTranslation('profile');
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.doc_id || '';

  const { data, isLoading, error } = useSkills(userId);
  const deleteSkill = useDeleteSkill();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const skills = data?.skills || [];

  const handleCreateClick = () => {
    setEditingSkill(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (skill: Skill) => {
    if (!confirm(t.skills.deleteConfirmMessage().replace('{title}', skill.title))) {
      return;
    }

    try {
      await deleteSkill.mutateAsync(skill.id);
      toast.success(t.skills.deleteSuccess());
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error(t.skills.deleteError());
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingSkill(null);
  };

  if (isLoading) {
    return <SkillsTabSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.skills.failedToLoad()}</h3>
        <p className="text-zinc-400">{t.skills.failedToLoadDescription()}</p>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.skills.noSkills()}</h3>
        <p className="text-zinc-400 mb-6">{t.skills.noSkillsDescription()}</p>
        <button
          onClick={handleCreateClick}
          className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors cursor-pointer"
        >
          {t.skills.createNew()}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {rawT('skills.count', { count: skills.length })}
        </h2>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.skills.createNew()}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200 flex flex-col min-h-[200px]"
          >
            {/* Skill Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-zinc-400">/</span>
                <h3 className="font-medium text-white text-lg">{skill.title}</h3>
              </div>
              <p className="text-xs text-zinc-400">
                {formatDistanceToNow(new Date(skill.updatedAt), { addSuffix: true })}
              </p>
            </div>

            {/* Prompt Preview - flex-grow로 남은 공간 차지 */}
            <div className="mb-4 flex-1">
              <p className="text-sm text-zinc-300 line-clamp-3">{skill.prompt}</p>
            </div>

            {/* Action Buttons - 항상 하단에 고정 */}
            <div className="flex gap-2 pt-4 border-t border-zinc-800 mt-auto">
              <button
                onClick={() => handleEditClick(skill)}
                className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors text-sm cursor-pointer"
              >
                {t.skills.edit()}
              </button>
              <button
                onClick={() => handleDeleteClick(skill)}
                className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg font-medium transition-colors text-sm cursor-pointer"
              >
                {t.skills.delete()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <SkillEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        skill={editingSkill}
      />
    </div>
  );
}

// Skeleton Component
function SkillsTabSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
          <div className="mb-4">
            <div className="h-5 bg-zinc-800 rounded w-1/2 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-1/3" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-zinc-800 rounded" />
            <div className="h-3 bg-zinc-800 rounded w-4/5" />
            <div className="h-3 bg-zinc-800 rounded w-3/5" />
          </div>
          <div className="flex gap-2 pt-4 border-t border-zinc-800">
            <div className="flex-1 h-8 bg-zinc-800 rounded" />
            <div className="w-16 h-8 bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

