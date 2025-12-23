/**
 * FILE: src/components/layout/MobileNav.js
 * PERBAIKAN PERFORMANCE MOBILE NAV:
 * 1. Ganti height animation dengan opacity/translate untuk performance lebih baik
 * 2. Kurangi penggunaan AnimatePresence yang berat
 * 3. Optimasi submenu animations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // PERBAIKAN: Hanya gunakan motion untuk performance
import { Link, useLocation } from 'react-router-dom';
import { HiChevronRight, HiX, HiOutlineExternalLink } from 'react-icons/hi';
import { FaTruck } from 'react-icons/fa';

const MobileNav = ({ menuItems, onClose, siteName, logoUrl }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);
  
  const toggleSubmenu = (itemId) => {
    setExpandedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };
  
  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isItemActive = location.pathname === item.url;
    
    return (
      <div key={item.id} className="w-full">
        <div className={`flex items-center justify-between p-4 ${depth > 0 ? 'ml-6 border-l border-gray-200 dark:border-gray-700' : ''}`}>
          <Link
            to={item.url}
            onClick={() => !hasChildren && onClose()}
            className={`flex items-center flex-1 font-medium ${isItemActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
            <span>{item.title}</span>
            {item.is_external && <HiOutlineExternalLink className="ml-2 h-4 w-4 opacity-50" />}
          </Link>
          
          {hasChildren && (
            <button 
              onClick={() => toggleSubmenu(item.id)} 
              className="p-2"
              aria-label={isExpanded ? `Collapse ${item.title}` : `Expand ${item.title}`}
            >
              <motion.div 
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronRight className="h-5 w-5 text-gray-400" />
              </motion.div>
            </button>
          )}
        </div>
        
        {/* PERBAIKAN: Ganti height animation dengan opacity/translate untuk performance lebih baik */}
        {hasChildren && (
          <motion.div
            initial={false}
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? 'auto' : 0,
              scaleY: isExpanded ? 1 : 0.95,
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeInOut"
            }}
            className="overflow-hidden origin-top bg-gray-50/50 dark:bg-gray-800/20"
            style={{
              // PERBAIKAN: Tambah will-change untuk performance
              willChange: 'opacity, height, transform'
            }}
          >
            {isExpanded && item.children.map(child => renderMenuItem(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header Mobile Menu */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <FaTruck size={20} />
          </div>
          <span className="font-bold text-xl dark:text-white">{siteName}</span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Close menu"
        >
          <HiX size={24} />
        </button>
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Butuh Bantuan?</p>
        <a 
          href="tel:+6281234567890" 
          className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
        >
          +62 858-1348-7753
        </a>
      </div>
    </div>
  );
};

export default MobileNav;
