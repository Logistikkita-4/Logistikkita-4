/**
 * Main Navigation Bar Component - PERBAIKAN LENGKAP
 * PERBAIKAN YANG DILAKUKAN:
 * 1. HAPUS CART ICON (sesuai permintaan)
 * 2. NOTIFIKASI HANYA SAAT USER LOGIN
 * 3. TAMBAH AUTH STATE MANAGEMENT
 * 4. THEMETOGGLE TANPA PROPS (menggunakan Context)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation } from '../../hooks/useNavigation';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

// Icons dari react-icons
import { 
  HiMenu, 
  HiX, 
  HiSearch, 
  HiBell
} from 'react-icons/hi';
import { FaTruck } from 'react-icons/fa';

const Navbar = () => {
  // State management
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // PERBAIKAN: Tambah state authentication sederhana
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Custom hooks untuk data fetching
  // PERBAIKAN: Tidak perlu destructure theme dan toggleTheme di sini
  // karena ThemeToggle sekarang menggunakan Context langsung
  const navData = useNavigation('header') || {}; 
  const { navigationData, loading: navLoading } = navData;
  
  const configData = useSiteConfig() || {};
  const { siteSettings, loading: settingsLoading } = configData;
  
  // PERBAIKAN: Cek authentication status saat component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    
    // Listen untuk auth state changes dari UserMenu
    const handleAuthChange = () => {
      const newToken = localStorage.getItem('auth_token');
      setIsAuthenticated(!!newToken);
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);
  
  // Effect untuk handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Effect untuk close mobile menu saat resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Effect untuk prevent body scroll saat mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  // Navigation data dari API atau fallback default
  const menuItems = navigationData?.items || [
    {
      id: 1,
      title: 'Beranda',
      url: '/',
      icon: 'Home',
      children: []
    },
    {
      id: 2,
      title: 'Layanan & Armada',
      url: '#',
      icon: 'Truck',
      children: [
        { id: 21, title: 'Kapasitas Armada', url: '/maintenance' },
        { id: 22, title: 'Jangkauan Pengiriman', url: '/maintenance' },
        { id: 23, title: 'Prosedur Keamanan', url: '/maintenance' },
        { id: 24, title: 'Simulasi Harga Estimasi', url: '/simulasi-harga' },
        { id: 25, title: 'Jenis Layanan', url: '/maintenance' },
      ]
    },
    {
        id: 3,
        title: 'Tentang Kami',
        url: '/about',
        icon: 'Info',
        children: []
    },
    {
        id: 4,
        title: 'Kontak',
        url: '/contact',
        icon: 'Phone',
        children: []
    }
  ];
  
  // Site branding dari API
  const siteName = siteSettings?.site_name?.value || 'LOGISTIK KITA';
  const logoUrl = siteSettings?.site_logo?.value || '';
  const primaryColor = siteSettings?.primary_color?.value || '#3B82F6';
  
  // Loading state
  if (navLoading || settingsLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="animate-pulse h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="animate-pulse h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
            : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md'
        }`}
        style={{
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
              
              {/* Logo */}
              <div className="flex items-center space-x-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FaTruck className="h-5 w-5 text-white" />
                  </div>
                )}
                
                {/* Brand Name */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="hidden sm:block"
                >
                  <a
                    href="/"
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
                  >
                    {siteName}
                  </a>
                </motion.div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <DesktopNav 
                menuItems={menuItems} 
                primaryColor={primaryColor}
              />
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <HiSearch className="h-5 w-5" />
              </motion.button>
              
              {/* PERBAIKAN: NOTIFIKASI HANYA SAAT USER LOGIN */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Notifications"
                >
                  <HiBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </motion.button>
              )}
              
              {/* PERBAIKAN: CART ICON DIHAPUS SESUAI PERMINTAAN */}
              {/* Cart icon telah dihapus */}
              
              {/* PERBAIKAN: ThemeToggle TANPA PROPS (menggunakan Context) */}
              <ThemeToggle />
              
              {/* User Menu */}
              <div className="relative">
                <UserMenu 
                  isOpen={isUserMenuOpen}
                  onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onClose={() => setIsUserMenuOpen(false)}
                />
              </div>
              
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* SearchBar Overlay */}
      {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      
      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 max-w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl z-40 lg:hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(200%)',
                WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <MobileNav 
                menuItems={menuItems}
                onClose={() => setIsMobileMenuOpen(false)}
                siteName={siteName}
                logoUrl={logoUrl}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer untuk fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;
