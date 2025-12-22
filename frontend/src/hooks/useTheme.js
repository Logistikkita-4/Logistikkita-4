import { useState, useEffect } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  
  const applyTheme = (targetTheme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    let colorMode = targetTheme;
    if (targetTheme === 'system') {
      colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.classList.add(colorMode);
    localStorage.setItem('theme', targetTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };
};

export { useTheme };
