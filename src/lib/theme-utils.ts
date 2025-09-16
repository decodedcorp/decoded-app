/**
 * Server-side theme utility functions
 * These functions can be called from server components
 */

export type Theme = 'dark' | 'light';

const THEME_KEY = 'theme';

// Server-side theme detection utility
export const getServerTheme = (cookieValue?: string): Theme => {
  if (!cookieValue) return 'dark';

  return cookieValue === 'light' ? 'light' : 'dark'; // default to dark
};

// Extract theme from cookie header string
export const getThemeFromCookieHeader = (cookieHeader?: string): Theme => {
  if (!cookieHeader) return 'dark';

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const theme = cookies[THEME_KEY] as Theme;
  return theme === 'light' ? 'light' : 'dark'; // default to dark
};