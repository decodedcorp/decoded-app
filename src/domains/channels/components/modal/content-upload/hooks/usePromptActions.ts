import { useState } from 'react';
import { ActionTexts, defaultActionTexts, generateActionKey } from '../utils/contentHelpers';

export const usePromptActions = () => {
  const [actionTexts, setActionTexts] = useState<ActionTexts>(defaultActionTexts);
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);
  const [newPromptAction, setNewPromptAction] = useState({
    emoji: '🤖',
    title: '',
    prompt: '',
  });

  // Add new prompt action
  const handleAddPromptAction = () => {
    if (newPromptAction.title && newPromptAction.prompt) {
      const newKey = generateActionKey(newPromptAction.title);
      setActionTexts((prev) => ({
        ...prev,
        [newKey]: newPromptAction.prompt,
      }));

      // Reset form
      setNewPromptAction({
        emoji: '🤖',
        title: '',
        prompt: '',
      });
      setIsAddPromptModalOpen(false);
    }
  };

  // Close add prompt modal
  const handleCloseAddPromptModal = () => {
    setNewPromptAction({
      emoji: '🤖',
      title: '',
      prompt: '',
    });
    setIsAddPromptModalOpen(false);
  };

  // Open add prompt modal
  const openAddPromptModal = () => {
    setIsAddPromptModalOpen(true);
  };

  return {
    actionTexts,
    setActionTexts,
    isAddPromptModalOpen,
    setIsAddPromptModalOpen,
    newPromptAction,
    setNewPromptAction,
    handleAddPromptAction,
    handleCloseAddPromptModal,
    openAddPromptModal,
  };
};
