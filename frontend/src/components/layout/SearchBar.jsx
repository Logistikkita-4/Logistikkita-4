/**
 * Search Bar Component - VERSI DISEDERHANAKAN
 * PERBAIKAN:
 * 1. Hapus rekomendasi pencarian cepat (akan terkoneksi database)
 * 2. Perbaiki warna text sesuai tema dark/light
 * 3. Sederhanakan UI untuk integrasi nanti
 * 4. Optimasi performance untuk mobile
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMagnifyingGlass as HiSearch, 
  HiXMark as HiX,
  HiArrowUp,
  HiArrowDown
} from 'react-icons/hi2';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Focus input saat component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Set cursor di akhir text
      inputRef.current.setSelectionRange(query.length, query.length);
    }

    // Keyboard shortcut listener
    const handleKeyDown = (e) => {
      // Ctrl+K atau / untuk focus search
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }

      // Escape untuk close
      if (e.key === 'Escape') {
        onClose();
      }

      // Arrow navigation untuk suggestions
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (suggestions.length === 0) return;

        let newIndex = activeSuggestion;
        if (e.key === 'ArrowDown') {
          newIndex = (activeSuggestion + 1) % suggestions.length;
        } else if (e.key === 'ArrowUp') {
          newIndex = activeSuggestion <= 0 ? suggestions.length - 1 : activeSuggestion - 1;
        }
        
        setActiveSuggestion(newIndex);
        
        // Scroll ke suggestion yang aktif
        if (suggestionsRef.current && suggestionsRef.current.children[newIndex]) {
          suggestionsRef.current.children[newIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
          });
        }
      }

      // Enter untuk select suggestion atau search
      if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        } else {
          handleSearch();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeSuggestion, suggestions, onClose, query]);

  // Simulasi fetch suggestions dari API/database
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Simulasi delay API
    const timer = setTimeout(() => {
      // Ini adalah MOCK DATA - nanti akan diganti dengan API call
      const mockSuggestions = [
        { id: 1, text: `Lacak resi: ${query}`, type: 'tracking' },
        { id: 2, text: `Tarif pengiriman ${query}`, type: 'pricing' },
        { id: 3, text: `Layanan pengiriman ${query}`, type: 'service' },
        { id: 4, text: `Kantor cabang ${query}`, type: 'branch' },
        { id: 5, text: `Syarat pengiriman ${query}`, type: 'terms' },
      ].filter(item => 
        item.text.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle search
  const handleSearch = (searchText = query) => {
    if (!searchText.trim()) {
      inputRef.current?.focus();
      return;
    }

    console.log('🔍 Searching for:', searchText);
    
    // TODO: Integrasi dengan API/database nanti
    // Contoh: fetch(`/api/search?q=${encodeURIComponent(searchText)}`)
    
    // Reset dan close
    setQuery('');
    onClose();
    
    // Redirect atau show results nanti
    // window.location.href = `/search?q=${encodeURIComponent(searchText)}`;
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    // Bisa langsung search atau isi input
    // handleSearch(suggestion.text);
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/40 backdrop-blur-sm">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        style={{ cursor: 'pointer' }}
      />
      
      {/* Search Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut"
        }}
        className="relative w-full max-w-2xl"
        style={{
          maxHeight: 'calc(100vh - 8rem)',
        }}
      >
        {/* Glass Card dengan theme colors */}
        <div 
          className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl"
        >
          {/* Search Input Row */}
          <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <HiSearch className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveSuggestion(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Cari layanan, tarif, atau lacak resi..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-lg py-1"
              autoComplete="off"
              spellCheck="false"
              aria-label="Search input"
            />
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-2">
              {query && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Clear search"
                >
                  <HiX className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close search"
              >
                <HiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          
          {/* Suggestions Panel */}
          <AnimatePresence>
            {(hasSuggestions || loading) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
              >
                <div 
                  ref={suggestionsRef} 
                  className="max-h-64 sm:max-h-80 overflow-y-auto"
                  style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Mencari...
                      </p>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Rekomendasi
                        </p>
                      </div>
                      <ul className="space-y-0.5">
                        {suggestions.map((suggestion, index) => (
                          <li key={suggestion.id}>
                            <button
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                                activeSuggestion === index
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-200'
                              }`}
                              onMouseEnter={() => setActiveSuggestion(index)}
                            >
                              <div className="flex items-center">
                                <HiSearch className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-3" />
                                <span className="truncate">
                                  {suggestion.text}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                                suggestion.type === 'tracking' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                  : suggestion.type === 'pricing'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                              }`}>
                                {suggestion.type}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Search tips */}
                  <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <HiArrowUp className="h-3 w-3 mr-1" />
                        <HiArrowDown className="h-3 w-3 mr-1" />
                        <span>Navigasi</span>
                      </div>
                      <div className="flex items-center">
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Enter</kbd>
                        <span className="ml-1">Pilih</span>
                      </div>
                      <div className="flex items-center">
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Esc</kbd>
                        <span className="ml-1">Tutup</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Search Button */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleSearch()}
              disabled={!query.trim()}
              className={`w-full py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                query.trim()
                  ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <HiSearch className="h-5 w-5 mr-2" />
              <span className="truncate">Cari di LOGISTIK KITA</span>
              {query.trim() && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 dark:bg-black/20 rounded-full text-sm truncate max-w-[100px]">
                  "{query.length > 15 ? query.substring(0, 15) + '...' : query}"
                </span>
              )}
            </button>
            
            {/* Shortcut hint */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tekan <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs mx-1">/</kbd> 
                atau <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs mx-1">Ctrl+K</kbd> 
                untuk membuka pencarian
              </p>
            </div>
          </div>
        </div>
        
        {/* Close hint untuk mobile */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Klik di luar area untuk menutup
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;
