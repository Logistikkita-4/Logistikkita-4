/**
 * Custom Theme Hook - PERBAIKAN KONTRAST WARNA
 * PERBAIKAN:
 * 1. Pastikan theme apply dengan benar
 * 2. Tambah CSS variables untuk kontras yang lebih baik
 * 3. Fix system theme detection
 */

import { useState, useEffect } from 'react';

const useTheme = () => {
  // PERBAIKAN: Initialize dengan system preference sebagai default
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Default ke system preference
    return 'system';
  };
  
  const [theme, setTheme] = useState(getInitialTheme);
  
  const applyTheme = (targetTheme) => {
    const root = window.document.documentElement;
    
    // Hapus class theme sebelumnya
    root.classList.remove('light', 'dark');
    
    let effectiveTheme = targetTheme;
    if (targetTheme === 'system') {
      // PERBAIKAN: System theme detection yang lebih akurat
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    // Apply theme class
    root.classList.add(effectiveTheme);
    localStorage.setItem('theme', targetTheme);
    
    // PERBAIKAN: Apply better contrast colors untuk dark mode
    applyContrastColors(effectiveTheme);
  };
  
  // PERBAIKAN: Function untuk apply contrast colors
  const applyContrastColors = (effectiveTheme) => {
    const root = window.document.documentElement;
    
    if (effectiveTheme === 'dark') {
      // Warna dengan kontras yang lebih baik untuk dark mode
      root.style.setProperty('--color-text', '#f8fafc'); // slate-50
      root.style.setProperty('--color-text-secondary', '#cbd5e1'); // slate-300
      root.style.setProperty('--color-background', '#0f172a'); // slate-900
      root.style.setProperty('--color-surface', '#1e293b'); // slate-800
    } else {
      // Warna untuk light mode
      root.style.setProperty('--color-text', '#1f2937'); // gray-800
      root.style.setProperty('--color-text-secondary', '#6b7280'); // gray-500
      root.style.setProperty('--color-background', '#ffffff'); // white
      root.style.setProperty('--color-surface', '#f9fafb'); // gray-50
    }
  };
  
  useEffect(() => {
    applyTheme(theme);
    
    // PERBAIKAN: Listen untuk system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  
  // PERBAIKAN: isDark calculation yang lebih akurat
  const isDark = () => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: isDark()
  };
};

export { useTheme };
