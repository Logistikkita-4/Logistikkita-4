/**
 * Custom hook untuk theme management
 * Features:
 * - Dark/Light/System theme detection
 * - LocalStorage persistence
 * - CSS class management
 */

import { useState, useEffect } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('system');
  
  // Initialize theme dari localStorage atau system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);
  
  // Apply theme ke document
  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Determine actual theme (jika system, detect preference)
    let actualTheme = newTheme;
    if (newTheme === 'system') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    
    // Apply theme class
    root.classList.add(actualTheme);
    
    // Update localStorage
    localStorage.setItem('theme', newTheme);
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };
  
  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setTheme(newTheme);
      applyTheme(newTheme);
    }
  };
  
  // Listen untuk system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };
};

export { useTheme };
