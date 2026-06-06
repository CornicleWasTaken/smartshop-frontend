import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_MODE_KEY = 'ishop-theme-mode';

/**
 * Custom hook to manage theme mode (light/dark) with localStorage persistence
 * and system preference detection
 */
export const useThemeMode = () => {
  // Initialize theme mode from localStorage or system preference
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null;
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }

    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      const savedMode = localStorage.getItem(THEME_MODE_KEY);
      if (!savedMode) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Persist mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, mode);
  }, [mode]);

  // Toggle between light and dark modes
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Set specific mode
  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return {
    mode,
    toggleMode,
    setThemeMode,
  };
};
