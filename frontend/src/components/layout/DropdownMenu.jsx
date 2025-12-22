/**
 * Dropdown Menu Component - PERBAIKAN Z-INDEX
 * PERBAIKAN: Z-index ditingkatkan dari 50 ke 60 agar di atas navbar
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiChevronRight, HiOutlineExternalLink } from 'react-icons/hi';

const DropdownMenu = ({ isOpen, items, primaryColor, onClose }) => {
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      // PERBAIKAN: Z-index ditingkatkan dari 50 ke 60
      className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 z-[60]"
    >
      {/* Arrow indicator */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>
      
      {/* Dropdown content */}
      <div className="rounded-xl shadow-2xl overflow-hidden glass">
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.url}
                className="group flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                onClick={onClose}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
                  <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.title}
                  </span>
                </div>
                {item.is_external ? (
                  <HiOutlineExternalLink className="h-3 w-3 opacity-60" />
                ) : (
                  <HiChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50">
          <Link to="/maintenance" className="text-sm font-medium flex items-center justify-center text-blue-600 hover:underline" onClick={onClose}>
            Lihat semua layanan <HiChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DropdownMenu;
