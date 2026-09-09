import { useState, useEffect } from 'react';
import { ThemeMode } from '../types';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('dwell_theme') as ThemeMode;
      return saved || 'void';
    } catch {
      return 'void';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dwell_theme', theme);
    } catch {}

    const root = document.documentElement;
    root.classList.remove('theme-void', 'theme-midnight', 'theme-cyberpunk', 'theme-paper', 'dark');

    if (theme === 'paper') {
      root.classList.add('theme-paper');
    } else {
      root.classList.add('dark', `theme-${theme}`);
    }
  }, [theme]);

  return { theme, setTheme };
}
