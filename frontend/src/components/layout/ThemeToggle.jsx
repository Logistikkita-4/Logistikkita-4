/**
 * Theme Toggle Component - PERBAIKAN: Real-time updates dengan Context API
 * PERBAIKAN:
 * 1. Gunakan useTheme() hook untuk akses theme state global
 * 2. Tidak perlu props dari parent (Navbar)
 * 3. Akan re-render otomatis ketika theme berubah
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiSun, HiMoon, HiDesktopComputer } from 'react-icons/hi';
import { useTheme } from '../../hooks/useTheme'; // PERBAIKAN: Import useTheme hook

const ThemeToggle = () => {
  // PERBAIKAN: Gunakan useTheme() untuk akses theme state global
  const { theme, toggleTheme } = useTheme();
  
  // Debug log untuk memastikan theme berubah
  React.useEffect(() => {
    console.log('ThemeToggle: theme updated to', theme);
  }, [theme]);
  
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
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} - Click to toggle`}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon (light mode) */}
        <motion.div
          key={`sun-${theme}`} // PERBAIKAN: Tambah key untuk force re-render
          initial={false}
          animate={{
            scale: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : 90,
            opacity: theme === 'light' ? 1 : 0
          }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="absolute inset-0"
        >
          <HiSun className="h-5 w-5 text-yellow-500" />
        </motion.div>
        
        {/* Moon icon (dark mode) */}
        <motion.div
          key={`moon-${theme}`} // PERBAIKAN: Tambah key untuk force re-render
          initial={false}
          animate={{
            scale: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : -90,
            opacity: theme === 'dark' ? 1 : 0
          }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="absolute inset-0"
        >
          <HiMoon className="h-5 w-5 text-blue-400" />
        </motion.div>
        
        {/* System icon */}
        <motion.div
          key={`system-${theme}`} // PERBAIKAN: Tambah key untuk force re-render
          initial={false}
          animate={{
            scale: theme === 'system' ? 1 : 0,
            opacity: theme === 'system' ? 1 : 0
          }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
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
      
      {/* PERBAIKAN: Visual indicator untuk debugging (hapus di production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -top-1 -right-1 h-2 w-2">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              backgroundColor: theme === 'dark' ? '#10B981' : '#F59E0B'
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="h-full w-full rounded-full"
          />
        </div>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
