import { useState, useCallback } from 'react';
import { getMockLinkPreviewAsync, type LinkPreview } from '@/lib/services/mockLinkPreview';
import { ContentTab, getNextInputType, validateUrl } from '../utils/contentHelpers';

export const useContentTabs = () => {
  const [contentTabs, setContentTabs] = useState<ContentTab[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [inputType, setInputType] = useState<'url' | 'prompt'>('url');
  const [isInputTypeManuallySet, setIsInputTypeManuallySet] = useState(false);

  // Add content to tabs when Enter is pressed
  const handleAddContentToTabs = useCallback(async (content: string, type: 'url' | 'prompt') => {
    console.log('=== handleAddContentToTabs called ===');
    console.log('Content:', content);
    console.log('Type:', type);

    if (!content.trim()) {
      console.log('Empty content, returning');
      return;
    }

    // For URL type, validate format first
    if (type === 'url') {
      if (!validateUrl(content)) {
        throw new Error('유효한 URL을 입력해주세요.');
      }
    }

    // Handle preview fetching
    let preview: LinkPreview | undefined;
    if (type === 'url') {
      console.log('Fetching preview for URL');
      try {
        preview = await getMockLinkPreviewAsync(content.trim());
        console.log('Preview fetched:', preview);
      } catch (error) {
        console.error('Failed to fetch preview:', error);
        throw new Error('링크 미리보기를 가져오지 못했습니다.');
      }
    }

    // Single setContentTabs call to handle both replacement and addition
    setContentTabs((prev) => {
      console.log('Current contentTabs in setState:', prev);

      // For URL: keep single latest; For prompt: allow multiple
      const existingTab = type === 'url' ? prev.find((tab) => tab.type === type) : undefined;
      if (type === 'prompt') {
        const trimmed = content.trim();
        // Prevent immediate duplicates or stray single-char echoes
        const lastPrompt = [...prev].reverse().find((tab) => tab.type === 'prompt');
        if (lastPrompt) {
          if (lastPrompt.content === trimmed) {
            console.log('Duplicate prompt detected, skipping');
            return prev;
          }
          if (trimmed.length === 1 && lastPrompt.content.endsWith(trimmed)) {
            console.log('Single-character echo detected, skipping');
            return prev;
          }
        }

        console.log('Adding additional prompt tab');
        const newPromptTab = {
          id: Date.now().toString(),
          type,
          content: trimmed,
          preview: undefined,
        };
        const updated = [...prev, newPromptTab];
        console.log('Updated tabs after adding prompt:', updated);
        return updated;
      }

      console.log('Existing tab found:', existingTab);

      if (existingTab) {
        console.log('Replacing existing tab');
        // Replace existing tab of the same type
        const updated = prev.map((tab) =>
          tab.type === type
            ? {
                ...tab,
                content: content.trim(),
                preview: type === 'url' ? preview : undefined, // Use the fetched preview
              }
            : tab,
        );
        console.log('Updated tabs after replacement:', updated);
        return updated;
      }

      // Create new tab
      console.log('Creating new tab');
      const newTab = {
        id: Date.now().toString(),
        type,
        content: content.trim(),
        preview,
      };
      console.log('New tab created:', newTab);

      const updated = [...prev, newTab];
      console.log('Added new tab, updated tabs:', updated);
      return updated;
    });

    setCurrentInput('');
    // If URL was added, switch input mode to prompt for next input
    if (type === 'url') {
      setInputType('prompt');
    }
    // Don't reset manual flag - let user keep their preferred input type
  }, []);

  // Remove content tab
  const handleRemoveContentTab = (tabId: string) => {
    setContentTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== tabId);
      return filtered;
    });
  };

  // Get next input type based on existing tabs
  const getSuggestedInputType = () => {
    return getNextInputType(contentTabs);
  };

  return {
    contentTabs,
    setContentTabs,
    currentInput,
    setCurrentInput,
    inputType,
    setInputType,
    isInputTypeManuallySet,
    setIsInputTypeManuallySet,
    handleAddContentToTabs,
    handleRemoveContentTab,
    getSuggestedInputType,
  };
};
