/**
 * FILE: src/components/layout/MobileNav.js
 * OPTIMASI PERFORMANCE MOBILE NAV V2:
 * 1. Hapus will-change yang berat (performance bottleneck)
 * 2. Simplify animations (kurangi complexity)
 * 3. Optimasi re-renders dengan React.memo
 * 4. Hapus scaleY animation yang berat
 * 5. Better CSS untuk mobile performance
 */

import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { HiChevronRight, HiX, HiOutlineExternalLink } from 'react-icons/hi';
import { FaTruck } from 'react-icons/fa';

// Komponen MenuItem yang di-memo untuk prevent re-renders tidak perlu
const MenuItem = memo(({ 
  item, 
  depth = 0, 
  isExpanded, 
  isItemActive, 
  onToggleSubmenu, 
  onClose 
}) => {
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="w-full">
      <div className={`flex items-center justify-between p-4 ${depth > 0 ? 'ml-4 border-l border-gray-200 dark:border-gray-700' : ''}`}>
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
            onClick={() => onToggleSubmenu(item.id)} 
            className="p-2"
            aria-label={isExpanded ? `Collapse ${item.title}` : `Expand ${item.title}`}
          >
            <motion.div 
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <HiChevronRight className="h-5 w-5 text-gray-400" />
            </motion.div>
          </button>
        )}
      </div>
      
      {/* OPTIMASI: Simplify animation - hanya opacity & height */}
      {hasChildren && (
        <motion.div
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? 'auto' : 0,
          }}
          transition={{ 
            duration: 0.15, // Kurangi dari 0.2s
            ease: "easeInOut"
          }}
          className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/10"
        >
          {isExpanded && item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              depth={depth + 1}
              isExpanded={false}
              isItemActive={false}
              onToggleSubmenu={onToggleSubmenu}
              onClose={onClose}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
});

MenuItem.displayName = 'MenuItem';

const MobileNav = ({ menuItems, onClose, siteName, logoUrl }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);
  
  // OPTIMASI: useCallback untuk prevent re-create function setiap render
  const toggleSubmenu = useCallback((itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  }, []);
  
  // OPTIMASI: Check active item dengan cache
  const checkIsItemActive = useCallback((url) => {
    return location.pathname === url;
  }, [location.pathname]);
  
  // OPTIMASI: Pre-render menu items dengan proper props
  const renderMenuItems = useCallback(() => {
    return menuItems.map(item => {
      const isItemActive = checkIsItemActive(item.url);
      const isExpanded = expandedItems.includes(item.id);
      
      return (
        <MenuItem
          key={item.id}
          item={item}
          depth={0}
          isExpanded={isExpanded}
          isItemActive={isItemActive}
          onToggleSubmenu={toggleSubmenu}
          onClose={onClose}
        />
      );
    });
  }, [menuItems, expandedItems, checkIsItemActive, toggleSubmenu, onClose]);
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header Mobile Menu - OPTIMASI: Kurangi padding di mobile */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <FaTruck size={18} className="sm:size-5" />
          </div>
          <span className="font-bold text-lg sm:text-xl dark:text-white truncate">
            {siteName}
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Close menu"
        >
          <HiX size={22} className="sm:size-6" />
        </button>
      </div>
      
      {/* Menu Items - OPTIMASI: Gunakan CSS scroll yang lebih smooth */}
      <div className="flex-1 overflow-y-auto py-1">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {renderMenuItems()}
        </div>
      </div>
      
      {/* Footer - OPTIMASI: Sederhanakan */}
      <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Butuh Bantuan?</p>
        <a 
          href="tel:+6285813487753" 
          className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm sm:text-base"
        >
          +62 858-1348-7753
        </a>
      </div>
    </div>
  );
};

// OPTIMASI: Export dengan React.memo untuk prevent re-renders tidak perlu
export default memo(MobileNav);
