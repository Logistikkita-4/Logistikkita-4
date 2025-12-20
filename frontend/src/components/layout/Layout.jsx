/**
 * Main Layout Component yang wrap seluruh aplikasi
 * Features:
 * - Navbar di atas
 * - Main content area
 * - Footer di bawah
 * - Theme provider
 * - Config provider
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../hooks/useTheme';
import { useSiteConfig } from '../../hooks/useSiteConfig';

const Layout = ({ children }) => {
  const { theme, isDark } = useTheme();
  const { siteSettings } = useSiteConfig();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-40"
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      {/* Theme indicator untuk debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-6 left-6 px-3 py-1 bg-gray-800 text-white text-xs rounded-full z-40 opacity-50">
          Theme: {theme}
        </div>
      )}
    </div>
  );
};

export default Layout;
