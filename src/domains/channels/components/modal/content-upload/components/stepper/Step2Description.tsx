'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SkillsSelector } from '../SkillsSelector';
import { Skill } from '@/domains/profile/types/skills';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

interface Step2DescriptionProps {
  description: string;
  prompts: string[];
  onDescriptionChange: (description: string) => void;
  onPromptsChange: (prompts: string[]) => void;
  onSkillSelect?: (skill: Skill) => void;
}

export function Step2Description({
  description,
  prompts,
  onDescriptionChange,
  onPromptsChange,
  onSkillSelect,
}: Step2DescriptionProps) {
  const t = useCommonTranslation();
  const [isSkillsSelectorOpen, setIsSkillsSelectorOpen] = useState(false);
  const skillsSelectorRef = useRef<HTMLDivElement | null>(null);
  const skillsSelectorPanelRef = useRef<HTMLDivElement | null>(null);
  const [skillsSelectorStyle, setSkillsSelectorStyle] = useState<React.CSSProperties>({});
  const [currentPrompt, setCurrentPrompt] = useState('');

  // Calculate SkillsSelector position when opening
  useEffect(() => {
    if (isSkillsSelectorOpen && skillsSelectorRef.current) {
      const rect = skillsSelectorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 384;
      const dropdownHeight = 384;

      const style: React.CSSProperties = {
        position: 'fixed',
        width: dropdownWidth,
        zIndex: 1120,
      };

      if (rect.left + dropdownWidth > viewportWidth - 20) {
        style.right = viewportWidth - rect.right;
        style.left = 'auto';
      } else {
        style.left = rect.left;
      }

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        style.bottom = viewportHeight - rect.top + 4;
        style.top = 'auto';
      } else {
        style.top = rect.bottom + 4;
        style.bottom = 'auto';
      }

      setSkillsSelectorStyle(style);
    }
  }, [isSkillsSelectorOpen]);

  const handleAddPrompt = () => {
    if (currentPrompt.trim()) {
      onPromptsChange([...prompts, currentPrompt.trim()]);
      setCurrentPrompt('');
    }
  };

  const handleRemovePrompt = (index: number) => {
    onPromptsChange(prompts.filter((_, i) => i !== index));
  };

  const handleSkillSelect = (skill: Skill) => {
    if (onSkillSelect) {
      onSkillSelect(skill);
    }
    // Also add skill prompt to prompts list
    if (skill.prompt && !prompts.includes(skill.prompt)) {
      onPromptsChange([...prompts, skill.prompt]);
    }
    setIsSkillsSelectorOpen(false);
  };

  return (
    <div className="space-y-6 py-4 px-4">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">설명 및 프롬프트</h2>
        <p className="text-sm text-zinc-400">콘텐츠에 대한 설명과 AI 분석을 위한 프롬프트를 추가하세요 (선택사항)</p>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
            설명 (선택사항)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
            placeholder="링크에 대한 설명을 입력하세요..."
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-zinc-500 mt-1">{description.length}/500</p>
        </div>

        {/* Prompts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-zinc-300">
              AI 프롬프트 (선택사항)
            </label>
            <div className="relative" ref={skillsSelectorRef}>
              <button
                type="button"
                onClick={() => setIsSkillsSelectorOpen(!isSkillsSelectorOpen)}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                Skills에서 선택
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="flex gap-2 mb-2">
            <input
              id="prompt"
              type="text"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPrompt();
                }
              }}
              className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="AI에게 요청할 내용을 입력하세요..."
            />
            <button
              type="button"
              onClick={handleAddPrompt}
              disabled={!currentPrompt.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>

          {/* Prompts List */}
          {prompts.length > 0 && (
            <div className="space-y-2">
              {prompts.map((prompt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-zinc-700 rounded-lg"
                >
                  <span className="text-sm text-zinc-200 flex-1">{prompt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrompt(index)}
                    className="ml-2 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills Selector */}
      <SkillsSelector
        isOpen={isSkillsSelectorOpen}
        onClose={() => setIsSkillsSelectorOpen(false)}
        onSelectSkill={handleSkillSelect}
        dropdownStyle={skillsSelectorStyle}
        containerRef={skillsSelectorPanelRef}
      />
    </div>
  );
}

