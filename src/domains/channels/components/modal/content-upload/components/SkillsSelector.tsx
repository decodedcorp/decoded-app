'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSkills } from '@/domains/profile/hooks/useSkills';
import { useAuthStore } from '@/store/authStore';
import { Skill } from '@/domains/profile/types/skills';
import { useProfileTranslation } from '@/lib/i18n/hooks';

interface SkillsSelectorProps {
  onSelectSkill: (skill: Skill) => void;
  isOpen: boolean;
  onClose: () => void;
  dropdownStyle?: React.CSSProperties;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function SkillsSelector({
  onSelectSkill,
  isOpen,
  onClose,
  dropdownStyle,
  containerRef,
}: SkillsSelectorProps) {
  const t = useProfileTranslation();
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.doc_id || '';
  const { data, isLoading } = useSkills(userId);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skills = data?.skills || [];
  const filteredSkills = searchQuery
    ? skills.filter(
        (skill) =>
          skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : skills;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const handleSkillSelect = (skill: Skill) => {
    onSelectSkill(skill);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  // dropdownStyle이 제공되지 않으면 기본 스타일 사용
  const finalStyle: React.CSSProperties = dropdownStyle || {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1120,
  };

  const content = (
    <div
      ref={containerRef || dropdownRef}
      style={finalStyle}
      className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-h-96 overflow-hidden flex flex-col w-96"
    >
      {/* Header */}
      <div className="p-3 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">{t.skills.title()}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.skills.title() + ' 검색...'}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#EAFD66]"
          autoFocus
        />
      </div>

      {/* Skills List */}
      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-zinc-400 text-sm">로딩 중...</div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-4 text-center text-zinc-400 text-sm">
            {searchQuery ? '검색 결과가 없어요' : t.skills.noSkills()}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill)}
                className="w-full text-left p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200 flex flex-col min-h-[120px] cursor-pointer"
              >
                {/* Header */}
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">/</span>
                    <span className="font-medium text-white">{skill.title}</span>
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="flex-1">
                  <p className="text-xs text-zinc-400 line-clamp-3">{skill.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

