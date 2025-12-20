/**
 * Mobile Navigation Component (Hamburger Menu)
 * Features:
 * - Slide-in panel dari kiri
 * - Accordion style untuk nested menus
 * - Smooth animations
 * - Touch-friendly design
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiChevronRight,
  HiX,
  HiHome,
  HiTruck,
  HiPhotograph,
  HiInformationCircle,
  HiPhone,
  HiNewspaper,
  HiOutlineExternalLink
} from 'react-icons/hi';

const MobileNav = ({ menuItems, onClose, siteName, logoUrl }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);
  
  // Toggle submenu expansion
  const toggleSubmenu = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  // Check if item is active
  const isActive = (url) => {
    if (url === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(url);
  };
  
  // Icon component mapper
  const getIcon = (iconName) => {
    const iconMap = {
      Home: HiHome,
      Truck: HiTruck,
      Photograph: HiPhotograph,
      InformationCircle: HiInformationCircle,
      Phone: HiPhone,
      Newspaper: HiNewspaper,
    };
    
    return iconMap[iconName] || HiChevronRight;
  };
  
  // Recursive component untuk nested menus
  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const IconComponent = getIcon(item.icon);
    const isItemActive = isActive(item.url);
    
    return (
      <div key={item.id}>
        {/* Main menu item */}
        <motion.div
          initial={false}
          animate={{ backgroundColor: isItemActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
          className={`
            flex items-center justify-between p-4 rounded-lg
            ${depth > 0 ? 'ml-4' : ''}
            ${isItemActive ? 'border-l-4 border-blue-500' : ''}
            transition-colors duration-200
          `}
        >
          <Link
            to={item.url}
            onClick={() => !hasChildren && onClose()}
            className="flex items-center flex-1"
          >
            {/* Icon */}
            <IconComponent className={`h-5 w-5 mr-3 ${
              isItemActive ? 'text-blue-500' : 'text-gray-500'
            }`} />
            
            {/* Text */}
            <span className={`
              font-medium
              ${isItemActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
            `}>
              {item.title}
            </span>
            
            {/* External link indicator */}
            {item.is_external && (
              <HiOutlineExternalLink className="ml-2 h-4 w-4 text-gray-400" />
            )}
          </Link>
          
          {/* Expand/collapse button untuk submenus */}
          {hasChildren && (
            <motion.button
              onClick={() => toggleSubmenu(item.id)}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <HiChevronRight className="h-5 w-5 text-gray-400" />
            </motion.button>
          )}
        </motion.div>
        
        {/* Submenu items dengan animation */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <HiTruck className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {siteName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expedition & Logistics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>
      
      {/* Mobile Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Butuh bantuan?
            </p>
            <a 
              href="tel:+6281234567890" 
              className="text-lg font-semibold text-blue-600 dark:text-blue-400"
            >
              +62 812-3456-7890
            </a>
          </div>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Facebook
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Instagram
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
