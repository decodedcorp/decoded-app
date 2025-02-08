'use client';

import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { InfoSection } from '../marker-step/components/context-info-section';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/style';
import { getImageContextOptions } from '@/app/request/api/context';
import { useLocaleContext } from '@/lib/contexts/locale-context';

export interface ContextAnswer {
  location: string;
  source?: string;
}

export interface ContextStepSidebarProps {
  onAnswerChange: (answer: ContextAnswer | null) => void;
  onSubmit: () => Promise<void>;
}

export function ContextStepSidebar({
  onAnswerChange,
  onSubmit,
}: ContextStepSidebarProps) {
  const { t } = useLocaleContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ContextAnswer>>({});
  const [locationOptions, setLocationOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // context 옵션 매핑
  const contextLabelMap: Record<string, string> = {
    airport: t.request.steps.context.questions.location.options.airport,
    concert: t.request.steps.context.questions.location.options.concert,
    event: t.request.steps.context.questions.location.options.event,
    casual: t.request.steps.context.questions.location.options.casual,
    studio: t.request.steps.context.questions.location.options.studio,
  };

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const options = await getImageContextOptions();
        const formattedOptions = options.map((option) => ({
          value: option,
          label: contextLabelMap[option] || option,
        }));
        setLocationOptions(formattedOptions);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch context options:', error);
        setError(t.common.errors.contextOptionFetchFailed);
        // 기본 옵션 설정
        setLocationOptions(
          Object.entries(contextLabelMap).map(([value, label]) => ({
            value,
            label,
          }))
        );
      }
    }

    fetchOptions();
  }, []);

  const questions = [
    {
      id: 'location',
      text: t.request.steps.context.questions.location.title,
      options: locationOptions,
    },
    {
      id: 'source',
      text: t.request.steps.context.questions.source.title,
      options: [
        {
          value: 'sns',
          label: t.request.steps.context.questions.source.options.sns,
        },
        {
          value: 'personal',
          label: t.request.steps.context.questions.source.options.personal,
        },
        {
          value: 'news',
          label: t.request.steps.context.questions.source.options.news,
        },
      ],
    },
  ];

  const handleAnswerChange = (
    questionId: keyof ContextAnswer,
    value: string
  ) => {
    const newAnswers = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(newAnswers);

    if (questionId === 'location') {
      // location 선택 시 자동으로 다음 단계로 (지연시간 200ms로 감소)
      onAnswerChange({
        location: value,
        source: newAnswers.source || undefined,
      });
      setTimeout(() => setCurrentStep(1), 200);
    } else if (newAnswers.location) {
      onAnswerChange({
        location: newAnswers.location,
        source: newAnswers.source || undefined,
      });
    } else {
      onAnswerChange(null);
    }
  };

  // 다음 단계로 이동하는 함수
  const handleNextStep = () => {
    // location이 없으면 다음 단계로 이동 불가
    if (!answers.location) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  // 이전 단계로 이동하는 함수
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // context 포맷 helper 함수
  function formatContext(answers: Partial<ContextAnswer>): ContextAnswer {
    return {
      location: answers.location,
      source: answers.source,
    } as ContextAnswer;
  }

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id as keyof ContextAnswer];

  return (
    <div className="w-ful mx-autoflex flex-col">
      <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800 mb-4 flex-shrink-0">
        <InfoSection required={currentQuestion.id === 'location'} />
      </div>

      <div className="flex-1 bg-[#1A1A1A] rounded-lg flex flex-col h-[423px] overflow-hidden">
        <motion.div
          key={currentStep}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="flex-1 px-4"
        >
          <motion.div
            className="py-4"
          >
            <h3 className="text-base font-medium mb-4 pb-3 border-b border-gray-800 sticky top-0 bg-[#1A1A1A] z-10">
              {currentQuestion.text}
            </h3>

            <div className="py-2 max-h-[280px] overflow-x-hidden overflow-y-auto">
              {currentQuestion.id === 'source' ? (
                <div className="py-2 max-h-[350px] overflow-y-auto">
                  <RadioGroup
                    value={currentAnswer || ''}
                    onValueChange={(value) =>
                      handleAnswerChange(
                        currentQuestion.id as keyof ContextAnswer,
                        value
                      )
                    }
                    className="space-y-2.5"
                  >
                    {currentQuestion.options.map((option) => (
                      <div key={option.value}>
                        <motion.div
                          className={`flex flex-col space-y-2 p-3 rounded-lg transition-all
                            ${
                              currentAnswer === option.value
                                ? 'bg-gray-800/90'
                                : 'hover:bg-gray-800/50'
                            }`}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value={option.value}
                              id={`${currentQuestion.id}-${option.value}`}
                              className="w-4 h-4"
                            />
                            <Label
                              htmlFor={`${currentQuestion.id}-${option.value}`}
                              className="flex-1 cursor-pointer text-sm leading-relaxed"
                            >
                              {option.label}
                            </Label>
                          </div>
                          {currentAnswer === option.value && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 pl-7"
                            >
                              <Input
                                placeholder={t.request.steps.context.questions.source.placeholder}
                                className="bg-gray-900/50 border-gray-700"
                                onChange={(e) => {
                                  // 추가 입력 처리
                                  handleAnswerChange(
                                    'source',
                                    e.target.value
                                  );
                                }}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <RadioGroup
                  value={
                    answers[currentQuestion.id as keyof ContextAnswer] || ''
                  }
                  onValueChange={(value) =>
                    handleAnswerChange(
                      currentQuestion.id as keyof ContextAnswer,
                      value
                    )
                  }
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.value}>
                      <motion.div
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                          ${
                            answers[
                              currentQuestion.id as keyof ContextAnswer
                            ] === option.value
                              ? 'bg-gray-800/90'
                              : 'hover:bg-gray-800/50'
                          }`}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${currentQuestion.id}-${option.value}`}
                          className="w-4 h-4"
                        />
                        <Label
                          htmlFor={`${currentQuestion.id}-${option.value}`}
                          className="flex-1 cursor-pointer text-sm leading-relaxed"
                        >
                          {option.label}
                        </Label>
                      </motion.div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          </motion.div>
        </motion.div>

        <div className="flex-shrink-0 py-3 px-4 border-t border-gray-800 rounded-b-lg sticky bottom-0 bg-[#1A1A1A]">
          <div className="flex items-center justify-between text-sm">
            <div className="flex-1">
              {currentStep > 0 && (
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  className="text-gray-400 hover:text-white flex items-center gap-2 px-2 py-1"
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>{t.common.actions.prev}</span>
                </motion.button>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              {currentStep === 0 && (
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!answers.location}
                  className="text-gray-400 hover:text-white flex items-center gap-2 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{t.common.actions.next}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
