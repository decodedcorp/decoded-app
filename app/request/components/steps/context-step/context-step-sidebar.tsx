'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { Input } from '@/components/ui/input';

export interface ContextAnswer {
  location: string;
  source?: string;
}

export interface ContextStepSidebarProps {
  onAnswerChange: (answer: ContextAnswer) => void;
}

export function ContextStepSidebar({
  onAnswerChange,
}: ContextStepSidebarProps) {
  const { t } = useLocaleContext();
  const [step, setStep] = useState<'location' | 'source'>('location');
  const [answers, setAnswers] = useState<ContextAnswer>({ location: '' });
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [sourceInput, setSourceInput] = useState('');

  useEffect(() => {
    setEditingSourceId(null);
    setSourceInput('');
  }, [step]);

  const locationOptions = [
    { value: 'airport', label: t.request.steps.context.questions.location.options.airport },
    { value: 'concert', label: t.request.steps.context.questions.location.options.concert },
    { value: 'event', label: t.request.steps.context.questions.location.options.event },
    { value: 'casual', label: t.request.steps.context.questions.location.options.casual },
    { value: 'studio', label: t.request.steps.context.questions.location.options.studio },
  ];

  const sourceOptions = [
    { value: 'sns', label: t.request.steps.context.questions.source.options.sns },
    { value: 'personal', label: t.request.steps.context.questions.source.options.personal },
    { value: 'news', label: t.request.steps.context.questions.source.options.news },
  ];

  const handleLocationClick = (value: string) => {
    if (value === answers.location) {
      const newAnswers = { ...answers, location: '' };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
    } else {
      const newAnswers = { ...answers, location: value };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
      setStep('source');
    }
  };

  const handleSourceOptionSelect = (value: string) => {
    setEditingSourceId(value);
    setSourceInput('');
  };

  const handleSourceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSourceInput(value);
    const newAnswers = { ...answers, source: value };
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);
  };

  const handleSourceInputBlur = () => {
    if (!sourceInput.trim()) {
      setEditingSourceId(null);
    }
  };

  return (
    <div className="h-full flex items-center justify-center pointer-events-auto">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          className="w-[24rem] bg-[#1A1A1A]/95 backdrop-blur-sm rounded-lg border border-zinc-800/50"
          initial={{ opacity: 0, x: step === 'location' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step === 'location' ? 20 : -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#EAFD66]/10 shrink-0">
                  <MapPin className="w-4 h-4 text-[#EAFD66]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-white">
                    {step === 'location' 
                      ? t.request.steps.context.questions.location.title
                      : t.request.steps.context.questions.source.title
                    }
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {step === 'location'
                      ? t.request.steps.context.guide.required.description
                      : t.request.steps.context.guide.optional.description
                    }
                  </p>
                </div>
              </div>
              {step === 'source' && (
                <button
                  onClick={() => setStep('location')}
                  className="p-1.5 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {step === 'location' ? (
              <div className="space-y-2">
                {locationOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    onClick={() => handleLocationClick(option.value)}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer
                      ${answers.location === option.value ? 'bg-zinc-800/90' : 'hover:bg-zinc-800/50'}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center">
                      {answers.location === option.value && (
                        <div className="w-2 h-2 rounded-full bg-[#EAFD66]" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer text-sm text-zinc-300">
                      {option.label}
                    </Label>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sourceOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer
                      ${editingSourceId === option.value ? 'bg-zinc-800/90' : 'hover:bg-zinc-800/50'}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {editingSourceId === option.value ? (
                      <Input
                        value={sourceInput}
                        onChange={handleSourceInputChange}
                        onBlur={handleSourceInputBlur}
                        placeholder={t.request.steps.context.questions.source.placeholder}
                        className="bg-zinc-800/50 border-zinc-700 text-sm"
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="flex items-center space-x-3 w-full"
                        onClick={() => handleSourceOptionSelect(option.value)}
                      >
                        <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center">
                          {answers.source === option.value && (
                            <div className="w-2 h-2 rounded-full bg-[#EAFD66]" />
                          )}
                        </div>
                        <Label className="flex-1 cursor-pointer text-sm text-zinc-300">
                          {option.label}
                        </Label>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
