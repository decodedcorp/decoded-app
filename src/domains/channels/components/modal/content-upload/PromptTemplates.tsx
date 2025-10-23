'use client';

import React from 'react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

export interface PromptTemplate {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

interface PromptTemplatesProps {
  selectedId?: string;
  onSelect: (template: PromptTemplate) => void;
  disabled?: boolean;
}

export function PromptTemplates({ selectedId, onSelect, disabled }: PromptTemplatesProps) {
  const t = useCommonTranslation();

  const templates: PromptTemplate[] = [
    {
      id: 'summarize',
      label: t.globalContentUpload.contentUpload.promptTemplates.summarize(),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      prompt: t.globalContentUpload.contentUpload.promptTemplates.summarizePrompt(),
    },
    {
      id: 'technical',
      label: t.globalContentUpload.contentUpload.promptTemplates.technical(),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      prompt: t.globalContentUpload.contentUpload.promptTemplates.technicalPrompt(),
    },
    {
      id: 'business',
      label: t.globalContentUpload.contentUpload.promptTemplates.business(),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      prompt: t.globalContentUpload.contentUpload.promptTemplates.businessPrompt(),
    },
    {
      id: 'custom',
      label: t.globalContentUpload.contentUpload.promptTemplates.custom(),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      prompt: '',
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        {t.globalContentUpload.contentUpload.promptTemplates.selectTemplate()}
      </p>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            disabled={disabled}
            className={`
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
              transition-all duration-200
              ${
                selectedId === template.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-zinc-300 hover:text-white border-b-2 border-transparent hover:border-zinc-400'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {template.icon}
            <span>{template.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
