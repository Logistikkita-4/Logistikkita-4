/**
 * User Menu Component untuk authentication
 * Features:
 * - Dropdown menu untuk user actions
 * - Profile display
 * - Login/Register buttons
 * - Glass effect styling
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiUser, 
  HiCog, 
  HiLogout, 
  HiLogin,
  HiUserAdd,
  HiChevronDown,
  HiOutlineBell,
  HiOutlineCreditCard,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';

const UserMenu = ({ isOpen, onToggle, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  
  // Simulasi user state (nanti integrate dengan auth context)
  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user data dari API
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        role: 'Customer',
      });
    }
  }, []);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    onClose();
    // Redirect ke home page
    window.location.href = '/';
  };
  
  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar/Button */}
      <button
        onClick={onToggle}
        className={`
          flex items-center space-x-2 p-1.5 rounded-full
          ${isOpen 
            ? 'bg-gray-100 dark:bg-gray-800' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          transition-colors duration-200
        `}
        aria-label="User menu"
      >
        {isAuthenticated && user ? (
          <>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
            <HiChevronDown className={`h-4 w-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </>
        ) : (
          <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
            <HiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
        )}
      </button>
      
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 z-50"
          >
            {/* Arrow pointer */}
            <div className="absolute -top-2 right-4">
              <div className="w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>
            </div>
            
            {/* Menu Content */}
            <div 
              className="rounded-xl shadow-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {isAuthenticated ? (
                <>
                  {/* User Info Section */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items untuk logged in user */}
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiUser className="h-5 w-5 mr-3" />
                      Dashboard Saya
                    </Link>
                    
                    <Link
                      to="/shipments"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiOutlineCreditCard className="h-5 w-5 mr-3" />
                      Pengiriman Saya
                    </Link>
                    
                    <Link
                      to="/notifications"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiOutlineBell className="h-5 w-5 mr-3" />
                      Notifikasi
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiCog className="h-5 w-5 mr-3" />
                      Pengaturan Akun
                    </Link>
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <HiLogout className="h-5 w-5 mr-3" />
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                /* Menu Items untuk guest user */
                <>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Selamat Datang
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Masuk atau daftar untuk mengelola pengiriman
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiLogin className="h-5 w-5 mr-3" />
                      Masuk
                    </Link>
                    
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiUserAdd className="h-5 w-5 mr-3" />
                      Daftar Akun Baru
                    </Link>
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                    
                    <Link
                      to="/help"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={onClose}
                    >
                      <HiOutlineQuestionMarkCircle className="h-5 w-5 mr-3" />
                      Bantuan & Dukungan
                    </Link>
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

export default UserMenu;
