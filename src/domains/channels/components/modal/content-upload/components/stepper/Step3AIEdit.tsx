'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, AnalysisProgress } from '../../types/analysis';
import { SkillsSelector } from '../SkillsSelector';
import { Skill } from '@/domains/profile/types/skills';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

interface Step3AIEditProps {
  analysisResult: AnalysisResult | null;
  analysisProgress: AnalysisProgress | null;
  isAnalyzing: boolean;
  editedResult: {
    summary: string;
    keyPoints: string[];
    keywords: string[];
  };
  onResultChange: (result: { summary: string; keyPoints: string[]; keywords: string[] }) => void;
  onRegenerate?: () => void;
  onSkillSelect?: (skill: Skill) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function Step3AIEdit({
  analysisResult,
  analysisProgress,
  isAnalyzing,
  editedResult,
  onResultChange,
  onRegenerate,
  onSkillSelect,
  onSubmit,
  isLoading = false,
}: Step3AIEditProps) {
  const t = useCommonTranslation();
  const [isSkillsSelectorOpen, setIsSkillsSelectorOpen] = useState(false);
  const skillsSelectorRef = useRef<HTMLDivElement | null>(null);
  const skillsSelectorPanelRef = useRef<HTMLDivElement | null>(null);
  const [skillsSelectorStyle, setSkillsSelectorStyle] = useState<React.CSSProperties>({});

  // Initialize editedResult from analysisResult when it becomes available
  useEffect(() => {
    if (analysisResult && !editedResult.summary) {
      onResultChange({
        summary: analysisResult.summary,
        keyPoints: [...analysisResult.keyPoints],
        keywords: [...analysisResult.keywords],
      });
    }
  }, [analysisResult, editedResult.summary, onResultChange]);

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

  const handleSummaryChange = (value: string) => {
    onResultChange({
      ...editedResult,
      summary: value,
    });
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...editedResult.keyPoints];
    newKeyPoints[index] = value;
    onResultChange({
      ...editedResult,
      keyPoints: newKeyPoints,
    });
  };

  const handleAddKeyPoint = () => {
    onResultChange({
      ...editedResult,
      keyPoints: [...editedResult.keyPoints, ''],
    });
  };

  const handleRemoveKeyPoint = (index: number) => {
    onResultChange({
      ...editedResult,
      keyPoints: editedResult.keyPoints.filter((_, i) => i !== index),
    });
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...editedResult.keywords];
    newKeywords[index] = value;
    onResultChange({
      ...editedResult,
      keywords: newKeywords,
    });
  };

  const handleAddKeyword = () => {
    onResultChange({
      ...editedResult,
      keywords: [...editedResult.keywords, ''],
    });
  };

  const handleRemoveKeyword = (index: number) => {
    onResultChange({
      ...editedResult,
      keywords: editedResult.keywords.filter((_, i) => i !== index),
    });
  };

  const handleSkillSelect = (skill: Skill) => {
    if (onSkillSelect) {
      onSkillSelect(skill);
    }
    setIsSkillsSelectorOpen(false);
    // Trigger regeneration if onRegenerate is provided
    if (onRegenerate) {
      onRegenerate();
    }
  };

  return (
    <div className="space-y-6 py-4 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">AI 생성 데이터 편집</h2>
          <p className="text-sm text-zinc-400">AI가 생성한 분석 결과를 확인하고 편집하세요</p>
        </div>
        <div className="relative" ref={skillsSelectorRef}>
          <button
            type="button"
            onClick={() => setIsSkillsSelectorOpen(!isSkillsSelectorOpen)}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            Skills 변경
          </button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{analysisProgress?.message || '분석 중...'}</p>
              <div className="mt-2 w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress?.percent || 0}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">{analysisProgress?.percent || 0}%</p>
            </div>
          </div>
        </div>
      )}

      {!isAnalyzing && editedResult.summary && (
        <div className="space-y-4">
          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-zinc-300 mb-2">
              요약
            </label>
            <textarea
              id="summary"
              value={editedResult.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder="요약을 입력하세요..."
              rows={4}
            />
          </div>

          {/* Key Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-zinc-300">주요 포인트</label>
              <button
                type="button"
                onClick={handleAddKeyPoint}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                + 추가
              </button>
            </div>
            <div className="space-y-2">
              {editedResult.keyPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleKeyPointChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder={`포인트 ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyPoint(index)}
                    className="text-zinc-400 hover:text-red-400 transition-colors"
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
          </div>

          {/* Keywords */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-zinc-300">키워드</label>
              <button
                type="button"
                onClick={handleAddKeyword}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                + 추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedResult.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-zinc-700 rounded-lg">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                    className="bg-transparent text-sm text-white focus:outline-none min-w-[80px]"
                    placeholder="키워드"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(index)}
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </div>
      )}

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

