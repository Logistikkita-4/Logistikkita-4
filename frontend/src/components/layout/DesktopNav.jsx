/**
 * Desktop Navigation Component
 * Features:
 * - Horizontal menu dengan dropdown
 * - Hover effects dengan animasi
 * - Active state indicator
 * - Nested menu support
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import { 
  HiChevronDown, 
  HiChevronRight,
  HiOutlineExternalLink
} from 'react-icons/hi';

// Icon mapping untuk menu items
const iconMap = {
  Home: '🏠',
  Truck: '🚚',
  Photograph: '📷',
  InformationCircle: 'ℹ️',
  Phone: '📞',
  Newspaper: '📰',
  Cube: '📦',
  Map: '🗺️',
  ShieldCheck: '🛡️',
  Calculator: '🧮',
  ClipboardList: '📋',
  Camera: '📸',
  Star: '⭐',
  ChatAlt2: '💬',
  Eye: '👁️',
  DocumentText: '📄',
  Exclamation: '⚠️',
  Search: '🔍',
  Clipboard: '📋',
  Mail: '📧',
  LocationMarker: '📍',
  Fire: '🔥',
  LightBulb: '💡',
};

const DesktopNav = ({ menuItems, primaryColor }) => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Check if menu item is active
  const isActive = (url) => {
    if (url === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(url);
  };
  
  // Check if menu item has active child
  const hasActiveChild = (children) => {
    if (!children) return false;
    return children.some(child => isActive(child.url));
  };
  
  return (
    <ul className="flex items-center space-x-1">
      {menuItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isItemActive = isActive(item.url) || hasActiveChild(item.children);
        const isDropdownOpen = activeDropdown === item.id;
        
        return (
          <li 
            key={item.id} 
            className="relative"
            onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {/* Main Menu Item */}
            <div className="relative">
              <Link
                to={item.url}
                className={`
                  group flex items-center px-4 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${isItemActive
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${hasChildren ? 'pr-8' : ''}
                `}
                style={{
                  backgroundColor: isItemActive ? primaryColor : 'transparent',
                }}
              >
                {/* Icon */}
                {item.icon && (
                  <span className="mr-2 text-lg">
                    {iconMap[item.icon] || '📌'}
                  </span>
                )}
                
                {/* Text */}
                <span className="relative">
                  {item.title}
                  
                  {/* Active underline animation */}
                  {!isItemActive && (
                    <span 
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </span>
                
                {/* Badge */}
                {item.badge_text && (
                  <span 
                    className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: item.badge_color || '#EF4444',
                      color: 'white'
                    }}
                  >
                    {item.badge_text}
                  </span>
                )}
                
                {/* External link indicator */}
                {item.is_external && (
                  <HiOutlineExternalLink className="ml-1 h-3 w-3 opacity-60" />
                )}
                
                {/* Dropdown chevron */}
                {hasChildren && (
                  <motion.span
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-2"
                  >
                    <HiChevronDown className="h-4 w-4" />
                  </motion.span>
                )}
              </Link>
              
              {/* Active indicator dot */}
              {isItemActive && !hasChildren && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-current"
                  style={{ color: primaryColor }}
                />
              )}
            </div>
            
            {/* Dropdown Menu */}
            {hasChildren && (
              <DropdownMenu
                isOpen={isDropdownOpen}
                items={item.children}
                primaryColor={primaryColor}
                onClose={() => setActiveDropdown(null)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DesktopNav;
