'use client';

import React, { useState } from 'react';
import { useSkillsBrowse } from '@/domains/profile/hooks/useSkills';
import { useTranslation } from 'react-i18next';
import { Skill } from '@/domains/profile/types/skills';
import { formatDistanceToNow } from 'date-fns';
import { SkillDetailModal } from '@/domains/profile/components/modals/SkillDetailModal';

export default function SkillsPage() {
  const { t } = useTranslation('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useSkillsBrowse(searchQuery);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const skills = data?.skills || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  const handleUseSkill = (skill: Skill) => {
    // TODO: ContentUploadForm으로 이동하면서 skill 선택
    console.log('Use skill:', skill);
    // 이 부분은 나중에 ContentUploadForm 연동 시 구현
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('page.title')}</h1>
          <p className="text-zinc-400">Failed to load skills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        className="w-full px-3 py-4 sm:px-4 sm:py-8"
        style={{
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('page.title')}</h1>
          <p className="text-zinc-400">{t('page.description')}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('search.placeholder')}
              className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#EAFD66]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Skills Grid */}
        {isLoading ? (
          <SkillsGridSkeleton count={9} />
        ) : skills.length === 0 ? (
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
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? t('search.noResults') : t('empty.title')}
            </h3>
            <p className="text-zinc-400">
              {searchQuery ? t('search.noResultsDescription') : t('empty.description')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-zinc-400">
              {t('skillCard.by')} {skills.length} {t('search.placeholder')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} onClick={() => handleSkillClick(skill)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        skill={selectedSkill}
        onUseSkill={handleUseSkill}
      />
    </div>
  );
}

// Skill Card Component
function SkillCard({ skill, onClick }: { skill: Skill; onClick: () => void }) {
  const { t } = useTranslation('skills');

  const handleUseSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: ContentUploadForm으로 이동하면서 skill 선택
    console.log('Use skill:', skill);
    // 이 부분은 나중에 ContentUploadForm 연동 시 구현
  };

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200 cursor-pointer flex flex-col min-h-[200px]"
    >
      {/* Skill Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-zinc-400">/</span>
          <h3 className="font-medium text-white text-lg">{skill.title}</h3>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {t('skillCard.by')} {skill.userId.slice(0, 8)}...
          </span>
          <span>{formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Prompt Preview - flex-grow로 남은 공간 차지 */}
      <div className="mb-4 flex-1">
        <p className="text-sm text-zinc-300 line-clamp-3">{skill.prompt}</p>
      </div>

      {/* Action Button - 항상 하단에 고정 */}
      <button
        onClick={handleUseSkill}
        className="w-full px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors text-sm cursor-pointer mt-auto"
      >
        {t('skillCard.useSkill')}
      </button>
    </div>
  );
}

// Skeleton Component
function SkillsGridSkeleton({ count = 9 }: { count?: number }) {
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
          <div className="h-8 bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  );
}

