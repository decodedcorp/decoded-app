'use client';

import React, { useState, useEffect } from 'react';
import { SimpleModal } from '@/lib/components/ui/modal/SimpleModal';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { Skill, SkillFormData } from '../../types/skills';
import { useCreateSkill, useUpdateSkill } from '../../hooks/useSkills';
import toast from 'react-hot-toast';

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill | null; // null이면 생성 모드, 있으면 편집 모드
  onSkillSaved?: (skill: Skill) => void; // Skill 저장 후 콜백 (선택적)
}

export function SkillEditModal({ isOpen, onClose, skill, onSkillSaved }: SkillEditModalProps) {
  const t = useProfileTranslation();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();

  const [formData, setFormData] = useState<SkillFormData>({
    title: '',
    prompt: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    prompt: '',
  });

  // 편집 모드일 때 skill 데이터로 폼 초기화
  useEffect(() => {
    if (skill) {
      setFormData({
        title: skill.title,
        prompt: skill.prompt,
      });
    } else {
      setFormData({
        title: '',
        prompt: '',
      });
    }
    // 에러 초기화
    setErrors({ title: '', prompt: '' });
  }, [skill, isOpen]);

  const validateForm = (): boolean => {
    const newErrors = { title: '', prompt: '' };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = t.skills.validation.titleRequired();
      isValid = false;
    } else if (formData.title.trim().length < 2) {
      newErrors.title = t.skills.validation.titleMinLength();
      isValid = false;
    } else if (formData.title.trim().length > 50) {
      newErrors.title = t.skills.validation.titleMaxLength();
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(formData.title.trim())) {
      newErrors.title = t.skills.validation.titleInvalidFormat();
      isValid = false;
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = t.skills.validation.promptRequired();
      isValid = false;
    } else if (formData.prompt.trim().length < 10) {
      newErrors.prompt = t.skills.validation.promptMinLength();
      isValid = false;
    } else if (formData.prompt.trim().length > 2000) {
      newErrors.prompt = t.skills.validation.promptMaxLength();
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedData: SkillFormData = {
      title: formData.title.trim(),
      prompt: formData.prompt.trim(),
    };

    try {
      let savedSkill: Skill;
      if (skill && skill.id !== 'temp-edit') {
        // 편집 모드 (실제 저장된 skill)
        savedSkill = await updateSkill.mutateAsync({
          id: skill.id,
          data: trimmedData,
        });
        toast.success(t.skills.updateSuccess());
      } else {
        // 생성 모드 또는 임시 skill 편집
        savedSkill = await createSkill.mutateAsync(trimmedData);
        toast.success(t.skills.createSuccess());
      }

      // 콜백 호출 (저장된 skill 전달)
      if (onSkillSaved) {
        onSkillSaved(savedSkill);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast.error(t.skills.saveError());
    }
  };

  const handleInputChange = (field: keyof SkillFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isSubmitting = createSkill.isPending || updateSkill.isPending;
  const isEditMode = !!skill;

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      <div className="bg-zinc-900 text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {isEditMode ? t.skills.editTitle() : t.skills.createTitle()}
            </h2>
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

        {/* Form Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="skill-title" className="block text-sm font-medium text-white mb-2">
            {t.skills.titleLabel()}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">/</span>
            <input
              id="skill-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t.skills.titlePlaceholder()}
              className={`
                flex-1 px-4 py-2 bg-zinc-900 border rounded-lg text-white
                placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#EAFD66]
                ${errors.title ? 'border-red-500' : 'border-zinc-700'}
              `}
              disabled={isSubmitting}
            />
          </div>
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          <p className="mt-1 text-xs text-zinc-400">{t.skills.titleHelper()}</p>
        </div>

        {/* Prompt Input */}
        <div>
          <label htmlFor="skill-prompt" className="block text-sm font-medium text-white mb-2">
            {t.skills.promptLabel()}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <textarea
            id="skill-prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            placeholder={t.skills.promptPlaceholder()}
            rows={6}
            className={`
              w-full px-4 py-2 bg-zinc-900 border rounded-lg text-white
              placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#EAFD66]
              resize-y
              ${errors.prompt ? 'border-red-500' : 'border-zinc-700'}
            `}
            disabled={isSubmitting}
          />
          {errors.prompt && <p className="mt-1 text-sm text-red-400">{errors.prompt}</p>}
          <p className="mt-1 text-xs text-zinc-400">
            {formData.prompt.length}/2000 {t.skills.promptHelper()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t.skills.cancel()}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? t.skills.saving() : isEditMode ? t.skills.save() : t.skills.create()}
          </button>
          </div>
        </form>
        </div>
      </div>
    </SimpleModal>
  );
}

