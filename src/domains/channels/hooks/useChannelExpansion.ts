import { useState, useCallback } from 'react';

/**
 * Custom hook for managing channel expansion states
 * Handles mutual exclusion between hero and grid expansion
 */
export function useChannelExpansion() {
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);
  const [isGridExpanded, setIsGridExpanded] = useState(false);

  const handleHeroExpandChange = useCallback((isExpanded: boolean) => {
    setIsHeroExpanded(isExpanded);
    // Reset grid expansion when hero expands
    if (isExpanded) {
      setIsGridExpanded(false);
    }
  }, []);

  const handleGridExpandChange = useCallback((isExpanded: boolean) => {
    setIsGridExpanded(isExpanded);
    // Reset hero expansion when grid expands
    if (isExpanded) {
      setIsHeroExpanded(false);
    }
  }, []);

  return {
    isHeroExpanded,
    isGridExpanded,
    handleHeroExpandChange,
    handleGridExpandChange,
  };
}
