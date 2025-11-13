import { LinkPreview } from '@/lib/services/mockLinkPreview';

export type ContentTab = {
  id: string;
  type: 'url' | 'prompt';
  content: string;
  preview?: LinkPreview;
};

export type ActionConfig = {
  icon: string;
  displayName: string;
};

export type ActionTexts = {
  [key: string]: string;
};

export type ActionConfigs = {
  [key: string]: ActionConfig;
};

// Determine next input type based on existing tabs
export const getNextInputType = (tabs: ContentTab[]): 'url' | 'prompt' => {
  const hasUrl = tabs.some((tab) => tab.type === 'url');
  const hasPrompt = tabs.some((tab) => tab.type === 'prompt');

  // Only move to next type if current type is completed
  if (!hasUrl) return 'url';
  if (hasUrl && !hasPrompt) return 'prompt';
  return 'prompt'; // All exist, stay at prompt
};

// Validate URL format
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`);
    return true;
  } catch {
    return false;
  }
};

// Generate key from title for action texts
export const generateActionKey = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

// Default action texts
export const defaultActionTexts: ActionTexts = {
  analyze: 'Analyze this content and provide insights',
  explain: 'Explain this content in detail',
  summarize: 'Summarize this content concisely',
};

// Action button icons and display names
export const actionConfigs: ActionConfigs = {
  analyze: { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', displayName: 'Analyze' },
  explain: {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    displayName: 'Explain',
  },
  summarize: {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z M9 5l7 7-7 7',
    displayName: 'Summarize',
  },
};
