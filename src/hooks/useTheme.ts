'use client';

/**
 * Theme Management Hook
 * Handles dark/light theme switching with SSR support
 */

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../lib/theme-utils';

const THEME_KEY = 'theme';
const THEME_ATTRIBUTE = 'data-theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>('dark'); // default to dark
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage/cookie
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check localStorage first
        const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;

        // Fallback to system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

        const initialTheme = savedTheme || systemTheme;

        setThemeState(initialTheme);
        document.documentElement.setAttribute(THEME_ATTRIBUTE, initialTheme);

        // Set cookie for SSR
        document.cookie = `${THEME_KEY}=${initialTheme}; path=/; max-age=31536000; SameSite=Lax`;

        setIsLoading(false);
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      setThemeState(newTheme);

      // Update DOM immediately (no re-render needed)
      document.documentElement.setAttribute(THEME_ATTRIBUTE, newTheme);

      // Persist to localStorage
      localStorage.setItem(THEME_KEY, newTheme);

      // Update cookie for SSR
      document.cookie = `${THEME_KEY}=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (error) {
      console.warn('Failed to update theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

