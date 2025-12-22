/**
 * Theme Toggle Component
 * PERBAIKAN: Gunakan ThemeContext bukan useTheme hook untuk konsistensi
 * Agar theme berubah tanpa perlu refresh halaman
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiSun, HiMoon, HiDesktopComputer } from 'react-icons/hi';

// PERBAIKAN: Gunakan useThemeContext dari ThemeContext
import { useThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  // PERBAIKAN: Gunakan useThemeContext, bukan useTheme
  const { theme, toggleTheme, isDark } = useThemeContext();

  // Icon berdasarkan theme
  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <HiMoon className="h-5 w-5" />;
      case 'system':
        return <HiDesktopComputer className="h-5 w-5" />;
      default:
        return <HiSun className="h-5 w-5" />;
    }
  };

  // Tooltip text
  const getTooltip = () => {
    switch (theme) {
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System Theme';
      default:
        return 'Light Mode';
    }
  };

  // PERBAIKAN: Color theme untuk button
  const getButtonClass = () => {
    if (isDark) {
      return 'bg-gray-800 text-yellow-300 hover:bg-gray-700';
    } else {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full transition-all duration-200
        ${getButtonClass()}
      `}
      aria-label={`Toggle theme (Current: ${getTooltip()})`}
      title={getTooltip()}
      style={{ willChange: 'transform' }}
    >
      {getIcon()}
      
      {/* Theme indicator dot */}
      <span className={`
        absolute -top-1 -right-1 h-2 w-2 rounded-full
        ${isDark ? 'bg-yellow-400' : 'bg-blue-500'}
      `} />
    </motion.button>
  );
};

export default ThemeToggle;
