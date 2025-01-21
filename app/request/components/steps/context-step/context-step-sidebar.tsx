'use client';

import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { InfoSection } from '../marker-step/components/context-info-section';
import { motion } from 'framer-motion';

interface ContextAnswer {
  location: string;
  locationOther?: string;
  source: string;
  sourceOther?: string;
  person: string;
  personOther?: string;
  activity: string;
  activityOther?: string;
  style: string;
  styleOther?: string;
}

interface ContextStepSidebarProps {
  onAnswerChange: (answers: ContextAnswer) => void;
  onSubmit: (answers: ContextAnswer) => void;
}

const questions = [
  {
    id: 'location',
    text: 'Q. 이 사진은 어디에서 촬영되었나요?',
    options: [
      { value: 'airport', label: '공항' },
      { value: 'event', label: '행사장' },
      { value: 'home', label: '집' },
      { value: 'studio', label: '스튜디오' },
      { value: 'nature', label: '자연' },
      { value: 'other', label: '기타' },
    ],
  },
  {
    id: 'source',
    text: 'Q. 이 사진의 업로드 경로는 무엇인가요?',
    options: [
      { value: 'sns', label: 'SNS에서 가져옴 (예: 인스타그램, 트위터)' },
      { value: 'personal', label: '개인적으로 촬영한 사진' },
      { value: 'news', label: '뉴스나 블로그에서 가져옴' },
      { value: 'other', label: '기타' },
    ],
  },
  {
    id: 'person',
    text: 'Q. 이 사진에 등장하는 주요 인물은 누구인가요?',
    options: [
      { value: 'celebrity', label: '연예인' },
      { value: 'influencer', label: '인플루언서' },
      { value: 'ordinary', label: '일반인' },
      { value: 'other', label: '기타' },
    ],
  },
  {
    id: 'activity',
    text: 'Q. 사진 속 인물의 활동은 무엇인가요?',
    options: [
      { value: 'travel', label: '여행' },
      { value: 'daily', label: '일상 생활' },
      { value: 'event', label: '공식 행사 참석' },
      { value: 'shooting', label: '촬영 중' },
      { value: 'other', label: '기타' },
    ],
  },
  {
    id: 'style',
    text: 'Q. 사진 속 인물의 스타일을 설명해주세요.',
    options: [
      { value: 'casual', label: '캐주얼' },
      { value: 'formal', label: '포멀/정장' },
      { value: 'sporty', label: '스포티' },
      { value: 'trendy', label: '패셔너블/트렌디' },
      { value: 'other', label: '기타' },
    ],
  },
];

export function ContextStepSidebar() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ContextAnswer>>({});

  const handleAnswerChange = (questionId: keyof ContextAnswer, value: string, otherValue?: string) => {
    setAnswers(prev => {
      if (prev[questionId] === value && !otherValue) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        delete newAnswers[`${questionId}Other` as keyof ContextAnswer];
        return newAnswers;
      }
      return {
        ...prev,
        [questionId]: value,
        ...(otherValue && { [`${questionId}Other`]: otherValue })
      };
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id as keyof ContextAnswer];
  const currentOtherAnswer = answers[`${currentQuestion.id}Other` as keyof ContextAnswer];

  return (
    <div className="w-ful mx-autoflex flex-col">
      <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800 mb-4 flex-shrink-0">
        <InfoSection />
      </div>

      <div className="flex-1 bg-[#1A1A1A] rounded-lg flex flex-col h-[425px]">
        <motion.div
          className="flex-1 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
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
            
            <div className="py-2 max-h-[350px] overflow-y-auto">
              <RadioGroup
                value={answers[currentQuestion.id as keyof ContextAnswer] || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id as keyof ContextAnswer, value)}
                className="space-y-2.5"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value}>
                    <motion.div
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                        ${answers[currentQuestion.id as keyof ContextAnswer] === option.value 
                          ? 'bg-gray-800/90' 
                          : 'hover:bg-gray-800/50'}`}
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
                              value={currentOtherAnswer || ''}
                              onChange={(e) => handleAnswerChange(currentQuestion.id as keyof ContextAnswer, 'other', e.target.value)}
                              className="bg-transparent border-0 p-0 h-[18px] min-h-[18px] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-sm leading-relaxed w-full"
                              autoFocus
                            />
                          ) : '기타'
                        ) : option.label}
                      </Label>
                    </motion.div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex-shrink-0 py-3 px-4 border-t border-gray-800 sticky bottom-0 bg-[#1A1A1A]">
          <div className="flex items-center justify-between text-sm">
            <motion.button
              type="button"
              onClick={handlePrevious}
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
              onClick={currentStep === questions.length - 1 ? undefined : handleNext}
              className="text-gray-400 hover:text-white flex items-center gap-2 px-2 py-1"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{currentStep === questions.length - 1 ? '완료' : '다음'}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
