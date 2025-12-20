/**
 * Theme Toggle Component (Dark/Light Mode)
 * Features:
 * - Smooth transition antara themes
 * - Icon animation
 * - System theme detection
 * - Persistent theme preference
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiSun, HiMoon, HiDesktopComputer } from 'react-icons/hi';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full
        bg-gray-100 dark:bg-gray-800
        text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon (light mode) */}
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : 90,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <HiSun className="h-5 w-5 text-yellow-500" />
        </motion.div>
        
        {/* Moon icon (dark mode) */}
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : -90,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <HiMoon className="h-5 w-5 text-blue-400" />
        </motion.div>
        
        {/* System icon */}
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'system' ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <HiDesktopComputer className="h-5 w-5 text-gray-500" />
        </motion.div>
      </div>
      
      {/* Ripple effect */}
      <motion.span
        className="absolute inset-0 rounded-full bg-current opacity-0"
        initial={false}
        animate={{ opacity: 0 }}
        whileTap={{ opacity: 0.1 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
