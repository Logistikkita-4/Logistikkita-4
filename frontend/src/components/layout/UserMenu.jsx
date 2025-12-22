/**
 * User Menu Component - PERBAIKAN KONTRAST DARK MODE
 * PERBAIKAN:
 * 1. Perbaiki kontras warna untuk text di dark mode
 * 2. Background colors yang lebih baik untuk readability
 * 3. Warna yang konsisten dengan theme
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiUser, 
  HiCog, 
  HiLogout, 
  HiArrowRightOnRectangle,
  HiUserPlus,
  HiChevronDown,
  HiOutlineBell,
  HiOutlineCreditCard,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';

const UserMenu = ({ isOpen, onToggle, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        role: 'Customer',
      });
    }
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    onClose();
    window.location.href = '/';
  };
  
  return (
    <div className="relative" ref={menuRef}>
      {/* User Trigger Button */}
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 p-1.5 rounded-full transition-colors duration-200 ${
          isOpen 
            ? 'bg-gray-100 dark:bg-gray-800' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {isAuthenticated && user ? (
          <>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white dark:border-gray-800">
              <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
            </div>
            <HiChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        ) : (
          <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
            <HiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            // PERBAIKAN: Z-index ditingkatkan
            className="absolute right-0 mt-3 w-72 z-[60] px-2 sm:px-0"
          >
            {/* Menu Container */}
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur-xl">
              
              {isAuthenticated ? (
                <>
                  {/* PERBAIKAN: Info User dengan kontras yang lebih baik */}
                  <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        {/* PERBAIKAN: Text color dengan kontras tinggi */}
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    {/* PERBAIKAN: Warna text yang lebih kontras */}
                    <UserMenuItem 
                      to="/dashboard" 
                      icon={<HiUser className="h-5 w-5" />} 
                      label="Dashboard Saya" 
                      onClose={onClose} 
                    />
                    <UserMenuItem 
                      to="/shipments" 
                      icon={<HiOutlineCreditCard className="h-5 w-5" />} 
                      label="Pengiriman" 
                      onClose={onClose} 
                    />
                    <UserMenuItem 
                      to="/notifications" 
                      icon={<HiOutlineBell className="h-5 w-5" />} 
                      label="Notifikasi" 
                      badge="3" 
                      onClose={onClose} 
                    />
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-5 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <HiLogout className="h-5 w-5 mr-3" /> 
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                /* PERBAIKAN: Guest View dengan kontras yang lebih baik */
                <>
                  <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Selamat Datang</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      Masuk untuk kelola pengiriman Anda dengan mudah.
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <UserMenuItem 
                      to="/login" 
                      icon={<HiArrowRightOnRectangle className="h-5 w-5" />} 
                      label="Masuk" 
                      onClose={onClose} 
                    />
                    <UserMenuItem 
                      to="/register" 
                      icon={<HiUserPlus className="h-5 w-5" />} 
                      label="Daftar Akun Baru" 
                      onClose={onClose} 
                    />
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
                    
                    <UserMenuItem 
                      to="/help" 
                      icon={<HiOutlineQuestionMarkCircle className="h-5 w-5" />} 
                      label="Bantuan" 
                      onClose={onClose} 
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// PERBAIKAN: Helper component dengan warna yang lebih kontras
const UserMenuItem = ({ to, icon, label, badge, onClose }) => (
  <Link
    to={to}
    onClick={onClose}
    className="flex items-center px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
  >
    <span className="mr-3 opacity-80">{icon}</span>
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

export default UserMenu;
