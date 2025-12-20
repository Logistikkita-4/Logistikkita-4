/**
 * Dropdown Menu Component untuk nested navigation
 * Features:
 * - Smooth slide-down animation
 * - Glass effect dengan backdrop blur
 * - Arrow pointer
 * - Keyboard navigation support
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiChevronRight, HiOutlineExternalLink } from 'react-icons/hi';

const DropdownMenu = ({ isOpen, items, primaryColor, onClose }) => {
  const dropdownRef = useRef(null);
  
  // Handle click outside untuk close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 z-50"
    >
      {/* Arrow pointer */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>
      </div>
      
      {/* Dropdown content */}
      <div 
        className="rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.url}
                className={`
                  group flex items-center justify-between px-4 py-3
                  text-sm text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800/50
                  transition-all duration-200
                  ${item.is_external ? 'pr-3' : ''}
                `}
                onClick={onClose}
              >
                <div className="flex items-center">
                  {/* Optional icon */}
                  {item.icon && (
                    <span className="mr-3 text-lg">
                      {item.icon === 'Cube' && '📦'}
                      {item.icon === 'Map' && '🗺️'}
                      {item.icon === 'ShieldCheck' && '🛡️'}
                      {item.icon === 'Calculator' && '🧮'}
                      {item.icon === 'ClipboardList' && '📋'}
                    </span>
                  )}
                  
                  <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                
                <div className="flex items-center">
                  {/* Badge */}
                  {item.badge_text && (
                    <span 
                      className="mr-2 px-2 py-0.5 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: item.badge_color || '#EF4444',
                        color: 'white'
                      }}
                    >
                      {item.badge_text}
                    </span>
                  )}
                  
                  {/* External link icon */}
                  {item.is_external ? (
                    <HiOutlineExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  ) : (
                    <HiChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Optional dropdown footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
          <Link
            to="/semua-layanan"
            className="text-sm font-medium flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            onClick={onClose}
          >
            Lihat semua layanan
            <HiChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DropdownMenu;
