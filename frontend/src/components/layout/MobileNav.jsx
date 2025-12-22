import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className={`flex items-center justify-between p-4 ${depth > 0 ? 'ml-6 border-l border-gray-200' : ''}`}>
          <Link
            to={item.url}
            onClick={() => !hasChildren && onClose()}
            className={`flex items-center flex-1 font-medium ${isItemActive ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
            <span>{item.title}</span>
            {item.is_external && <HiOutlineExternalLink className="ml-2 h-4 w-4 opacity-50" />}
          </Link>
          
          {hasChildren && (
            <button onClick={() => toggleSubmenu(item.id)} className="p-2">
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                <HiChevronRight className="h-5 w-5 text-gray-400" />
              </motion.div>
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/50 dark:bg-gray-800/20">
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <FaTruck size={20} />
          </div>
          <span className="font-bold text-xl dark:text-white">{siteName}</span>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500"><HiX size={24} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
      
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 mb-2">Butuh Bantuan?</p>
        <a href="tel:+6281234567890" className="text-blue-600 font-bold">+62 858-1348-7753</a>
      </div>
    </div>
  );
};

export default MobileNav;
