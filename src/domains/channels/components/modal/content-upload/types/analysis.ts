export type AnalysisStage = 'parsing' | 'reading-prompts' | 'generating-insights' | 'finalizing';

export type AnalysisProgress = {
  stage: AnalysisStage;
  message: string;
  percent: number; // 0-100
  phase?: 'queueing' | 'fetching' | 'generating' | 'summarizing' | 'done';
};

export type AnalysisResult = {
  summary: string;
  keyPoints: string[];
  keywords: string[];
  estimatedReadingTime: string;
};
