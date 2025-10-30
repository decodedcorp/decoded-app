import React from 'react';

export type PromptTemplate = {
  id: string;
  name: string;
  prompt: string;
  description?: string;
};

interface PromptTemplatesProps {
  selectedId: string;
  onSelect: (template: PromptTemplate) => void;
  disabled?: boolean;
}

const templates: PromptTemplate[] = [
  {
    id: 'custom',
    name: 'Custom',
    prompt: '',
    description: 'Write your own prompt',
  },
  {
    id: 'summarize',
    name: 'Summarize',
    prompt: 'Summarize the key points of this content in 3-5 bullet points.',
    description: 'Extract main ideas and key points',
  },
  {
    id: 'analyze',
    name: 'Analyze',
    prompt:
      'Analyze this content and provide insights on its main themes, arguments, and implications.',
    description: 'Deep analysis and critical thinking',
  },
  {
    id: 'explain',
    name: 'Explain',
    prompt:
      'Explain this content in simple terms, breaking down complex concepts for better understanding.',
    description: 'Simplify and clarify concepts',
  },
  {
    id: 'translate',
    name: 'Translate',
    prompt: 'Translate this content to Korean while maintaining the original meaning and tone.',
    description: 'Translate to Korean',
  },
  {
    id: 'generate',
    name: 'Generate',
    prompt:
      'Generate creative content inspired by this, such as a story, poem, or alternative perspective.',
    description: 'Creative content generation',
  },
];

export function PromptTemplates({ selectedId, onSelect, disabled }: PromptTemplatesProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            disabled={disabled}
            className={`p-3 text-left rounded-lg border transition-colors ${
              selectedId === template.id
                ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                : 'border-zinc-600 bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-sm font-medium">{template.name}</div>
            {template.description && (
              <div className="text-xs text-zinc-400 mt-1">{template.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
