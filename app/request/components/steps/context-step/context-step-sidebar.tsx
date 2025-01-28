'use client';

import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { InfoSection } from '../marker-step/components/context-info-section';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/style';
import { getImageContextOptions } from '@/app/request/api/context';

export interface ContextAnswer {
  location?: string;
  locationOther?: string;
  source?: string;
  sourceOther?: string;
  styleOther?: string;
}

export interface ContextStepSidebarProps {
  onAnswerChange: (answer: ContextAnswer | null) => void;
  onSubmit: () => Promise<void>;
}

// context 옵션 매핑
const contextLabelMap: Record<string, string> = {
  airport: '공항',
  concert: '콘서트장',
  event: '행사장',
  casual: '캐주얼',
  studio: '스튜디오',
  other: '기타',
};

export function ContextStepSidebar({
  onAnswerChange,
  onSubmit,
}: ContextStepSidebarProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ContextAnswer>>({});
  const [locationOptions, setLocationOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

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
        setError('옵션을 불러오는데 실패했습니다');
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
      text: 'Q. 이 사진은 어디에서 촬영되었나요?',
      options: locationOptions,
    },
    {
      id: 'source',
      text: 'Q. 이 사진의 출처는 무엇인가요?',
      options: [
        { value: 'sns', label: 'SNS에서 가져옴 (예: 인스타그램, 트위터)' },
        { value: 'personal', label: '개인적으로 촬영한 사진' },
        { value: 'news', label: '뉴스나 블로그에서 가져옴' },
        { value: 'other', label: '기타' },
      ],
    },
  ];

  const handleAnswerChange = (
    questionId: keyof ContextAnswer,
    value: string,
    otherValue?: string
  ) => {
    const newAnswers = {
      ...answers,
      [questionId]: value,
      [`${questionId}Other`]: otherValue || '',
    };

    setAnswers(newAnswers);

    // source의 경우 입력값이 있을 때만 다음으로 진행
    if (questionId === 'source') {
      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }

    // 항상 context를 전달 (선택사항이므로 undefined 값도 허용)
    onAnswerChange(formatContext(newAnswers));
  };

  // 'other' 입력 완료 후 다음으로 이동하는 함수
  const handleOtherInputComplete = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // context 포맷 helper 함수
  function formatContext(answers: Partial<ContextAnswer>): ContextAnswer {
    return {
      location: answers.locationOther || answers.location,
      source: answers.sourceOther || answers.source,
    } as ContextAnswer;
  }

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id as keyof ContextAnswer];
  const currentOtherAnswer =
    answers[`${currentQuestion.id}Other` as keyof ContextAnswer];

  return (
    <div className="w-ful mx-autoflex flex-col">
      <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800 mb-4 flex-shrink-0">
        <InfoSection />
      </div>

      <div className="flex-1 bg-[#1A1A1A] rounded-lg flex flex-col h-[423px]">
        <motion.div
          className="flex-1 px-4"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
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
                            <Input
                              placeholder="직접 입력해주세요"
                              value={currentOtherAnswer ?? ''}
                              onChange={(e) =>
                                handleAnswerChange(
                                  currentQuestion.id as keyof ContextAnswer,
                                  option.value,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === 'Enter' &&
                                  e.currentTarget.value
                                ) {
                                  handleOtherInputComplete();
                                }
                              }}
                              className="bg-transparent border-0 p-0 h-[18px] min-h-[18px] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-sm leading-relaxed w-full"
                              autoFocus
                            />
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
                          {option.value === 'other' ? (
                            currentAnswer === 'other' ? (
                              <Input
                                placeholder="직접 입력해주세요"
                                value={currentOtherAnswer ?? ''}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    currentQuestion.id as keyof ContextAnswer,
                                    'other',
                                    e.target.value
                                  )
                                }
                                className="bg-transparent border-0 p-0 h-[18px] min-h-[18px] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-sm leading-relaxed w-full"
                                autoFocus
                              />
                            ) : (
                              '기타'
                            )
                          ) : (
                            option.label
                          )}
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
            <motion.button
              type="button"
              onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-2 py-1"
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
              <span>이전</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={
                currentStep === questions.length - 1
                  ? undefined
                  : () => setCurrentStep(currentStep + 1)
              }
              className="text-gray-400 hover:text-white flex items-center gap-2 px-2 py-1"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {currentStep === questions.length - 1 ? '' : '넘기기'}
              </span>
              <svg
                className={cn(
                  questions.length - 1 === currentStep
                    ? 'hidden'
                    : 'text-gray-400',
                  'w-4 h-4'
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
