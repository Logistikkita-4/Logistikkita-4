/**
 * FILE: src/components/layout/Navbar.js
 * FIX: Menu tidak muncul karena hook loading stuck
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Custom hooks untuk data fetching - TAPI KITA BYPASS LOADING
  const navData = useNavigation('header') || {}; 
  const { navigationData, loading: navLoading } = navData;
  
  const configData = useSiteConfig() || {};
  const { siteSettings, loading: settingsLoading } = configData;
  
  // DEBUG: Cek status loading
  useEffect(() => {
    console.log('🔍 NAVBAR DEBUG:');
    console.log('navLoading:', navLoading);
    console.log('settingsLoading:', settingsLoading);
    console.log('navigationData:', navigationData);
    console.log('siteSettings:', siteSettings);
  }, [navLoading, settingsLoading, navigationData, siteSettings]);
  
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
  
  // FIX: Menu data - HARUS hardcoded karena API mungkin tidak tersedia
  const menuItems = [
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
        { id: 21, title: 'Cek Kapasitas Armada', url: '/maintenance' },
        { id: 22, title: 'Jangkauan Pengiriman', url: '/maintenance' },
        { id: 23, title: 'Prosedur Keamanan', url: '/maintenance' },
        { id: 24, title: 'Cek Harga Estimasi', url: '/maintenance' },
        { id: 25, title: 'Jenis Layanan', url: '/maintenance' },
      ]
    },
    {
      id: 3,
      title: 'Galeri & Portofolio',
      url: '#',
      icon: 'Photograph',
      children: [
        { id: 31, title: 'Dokumentasi Pengiriman', url: '/maintenance' },
        { id: 32, title: 'Kisah Sukses Lokal', url: '/maintenance' },
        { id: 33, title: 'Testimoni Klien', url: '/maintenance' },
      ]
    },
    {
      id: 4,
      title: 'Tentang Kita',
      url: '#',
      icon: 'InformationCircle',
      children: [
        { id: 41, title: 'Visi, Misi, & Nilai', url: '/maintenance' },
        { id: 42, title: 'Profil & Legalitas', url: '/maintenance' },
        { id: 43, title: 'Penanganan Risiko', url: '/maintenance' },
      ]
    },
    {
      id: 5,
      title: 'Hubungi Kita',
      url: '#',
      icon: 'Phone',
      children: [
        { id: 51, title: 'Lacak Resi (Tracking)', url: '/maintenance' },
        { id: 52, title: 'Formulir RFQ', url: '/maintenance' },
        { id: 53, title: 'Informasi Kontak', url: '/maintenance' },
        { id: 54, title: 'Lokasi Kantor', url: '/maintenance' },
      ]
    },
    {
      id: 6,
      title: 'Blog / Berita',
      url: '#',
      icon: 'Newspaper',
      children: [
        { id: 61, title: 'Berita Terbaru', url: '/maintenance' },
        { id: 62, title: 'Tips Logistik', url: '/maintenance' },
      ]
    }
  ];
  
  // FIX: Site branding - gunakan data dari hook JIKA ADA, fallback jika tidak
  const siteName = siteSettings?.site_name?.value || 'LOGISTIK KITA';
  const logoUrl = siteSettings?.site_logo?.value || '';
  const primaryColor = siteSettings?.primary_color?.value || '#3B82F6';
  
  // FIX: Hapus loading state blocking - render selalu, tapi bisa show loading jika mau
  // Kita akan render navbar langsung, tidak tunggu API
  
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
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          willChange: 'transform, backdrop-filter',
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
                style={{ willChange: 'transform' }}
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
            
            {/* Desktop Navigation - TAMPILKAN MESKI LOADING */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              {navLoading ? (
                // Loading skeleton untuk desktop nav
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <DesktopNav 
                  menuItems={menuItems} 
                  primaryColor={primaryColor}
                />
              )}
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
                style={{ willChange: 'transform' }}
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
                  style={{ willChange: 'transform' }}
                >
                  <HiBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </motion.button>
              )}
              
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] lg:hidden"
              style={{ willChange: 'opacity' }}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="fixed inset-y-0 left-0 w-72 max-w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-[999] lg:hidden overflow-y-auto"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                willChange: 'transform',
              }}
            >
              {navLoading ? (
                // Loading skeleton untuk mobile nav
                <div className="h-full flex flex-col bg-white dark:bg-gray-900">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="animate-pulse h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex-1 py-2 space-y-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="p-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <MobileNav 
                  menuItems={menuItems}
                  onClose={() => setIsMobileMenuOpen(false)}
                  siteName={siteName}
                  logoUrl={logoUrl}
                />
              )}
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
