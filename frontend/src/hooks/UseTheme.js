/**
 * Custom Theme Hook - VERSI KOMPATIBEL DENGAN THEMECONTEXT
 * 
 * PERBAIKAN: Hook ini sekarang menggunakan ThemeContext untuk konsistensi
 * Agar theme berubah real-time tanpa perlu refresh halaman
 * 
 * Fitur:
 * 1. Menggunakan ThemeContext sebagai source of truth
 * 2. Backward compatible dengan komponen yang masih import useTheme
 * 3. Real-time theme updates tanpa refresh
 * 4. System theme detection
 * 5. LocalStorage persistence
 */

import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const useTheme = () => {
  // Try to get context first (jika ada ThemeProvider di parent)
  const themeContext = useContext(ThemeContext);
  
  // Jika ThemeContext tersedia, gunakan itu
  if (themeContext) {
    console.log('📱 useTheme: Using ThemeContext');
    return {
      theme: themeContext.theme,
      isDark: themeContext.isDark,
      toggleTheme: themeContext.toggleTheme,
      setTheme: themeContext.setTheme
    };
  }
  
  // Fallback: Legacy implementation (jika ThemeContext tidak tersedia)
  console.warn('⚠️ useTheme: ThemeContext not found, using legacy implementation');
  
  const getInitialTheme = () => {
    // Cek localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme');
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    
    // Cek system preference
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'light'; // Default fallback
  };
  
  const [theme, setThemeState] = useState(getInitialTheme);
  const [isDark, setIsDark] = useState(false);
  
  // Apply theme ke HTML
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
    
    // Update isDark state
    setIsDark(effectiveTheme === 'dark');
    
    console.log(`🎨 Theme changed to: ${newTheme} (effective: ${effectiveTheme})`);
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
    
    console.log(`🔄 Toggling theme: ${theme} → ${nextTheme}`);
    setThemeState(nextTheme);
  };
  
  // Set theme langsung
  const setTheme = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      console.log(`🎯 Setting theme directly to: ${newTheme}`);
      setThemeState(newTheme);
    }
  };
  
  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  };
};

export { useTheme };
