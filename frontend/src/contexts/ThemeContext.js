/**
 * Theme Context untuk manage theme state di seluruh aplikasi
 * PERBAIKAN: Theme akan update tanpa perlu refresh
 */

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Custom hook untuk menggunakan theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get initial theme dari localStorage atau system preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme');
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    
    // Check system preference
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'light'; // Default fallback
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [isDark, setIsDark] = useState(false);

  // Apply theme ke HTML dan update state
  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    let effectiveTheme = newTheme;
    
    // Jika theme = 'system', gunakan system preference
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    // Apply theme class
    root.classList.add(effectiveTheme);
    
    // Update localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update isDark state - PERBAIKAN: Ini yang memicu re-render
    setIsDark(effectiveTheme === 'dark');
    
    // Dispatch custom event untuk notify components lain
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme, isDark: effectiveTheme === 'dark' }
    }));
    
    console.log(`Theme changed to: ${newTheme} (effective: ${effectiveTheme})`);
  };

  // Initialize theme saat component mount
  useEffect(() => {
    applyTheme(theme);
    
    // Listen untuk system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    console.log(`Toggling theme: ${theme} → ${nextTheme}`);
    setTheme(nextTheme);
  };

  // Set theme langsung
  const setThemeDirect = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      console.log(`Setting theme directly to: ${newTheme}`);
      setTheme(newTheme);
    }
  };

  // Context value - PERBAIKAN: Pastikan ini object yang sama reference-nya
  const value = {
    theme,
    isDark,
    toggleTheme,
    setTheme: setThemeDirect
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export context untuk digunakan di class components (jika perlu)
export { ThemeContext };
