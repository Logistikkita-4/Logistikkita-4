/**
 * Search Bar Component dengan animasi dan glass effect
 * Fixed: Icon library imports and performance optimization
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Menggunakan Hi2 untuk Outline icons karena versi Hi biasa tidak memilikinya
import { 
  HiMagnifyingGlass, 
  HiXMark, 
  HiClock, 
  HiFire,
  HiArrowUp,
  HiArrowDown,
  HiCommandLine
} from 'react-icons/hi2';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load recent searches dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }

    // Popular searches
    setPopularSearches([
      { id: 1, text: 'Tarif pengiriman Jakarta - Surabaya', count: 245 },
      { id: 2, text: 'Lacak resi pengiriman', count: 189 },
      { id: 3, text: 'Cara kirim barang besar', count: 156 },
      { id: 4, text: 'Biaya kirim motor', count: 132 },
      { id: 5, text: 'Pengiriman same day', count: 98 },
    ]);
  }, []);

  // Keyboard shortcut & Focus effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const suggestions = [...recentSearches, ...popularSearches];
        if (suggestions.length === 0) return;

        let newIndex = activeSuggestion;
        if (e.key === 'ArrowDown') {
          newIndex = (activeSuggestion + 1) % suggestions.length;
        } else if (e.key === 'ArrowUp') {
          newIndex = activeSuggestion <= 0 ? suggestions.length - 1 : activeSuggestion - 1;
        }
        setActiveSuggestion(newIndex);
      }

      if (e.key === 'Enter' && activeSuggestion >= 0) {
        e.preventDefault();
        const suggestions = [...recentSearches, ...popularSearches];
        if (suggestions[activeSuggestion]) {
          handleSearch(suggestions[activeSuggestion].text || suggestions[activeSuggestion]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeSuggestion, recentSearches, popularSearches, onClose]);

  const handleSearch = (searchText = query) => {
    if (!searchText.trim()) return;
    const updatedRecent = [
      searchText,
      ...recentSearches.filter(s => s !== searchText && s.text !== searchText)
    ].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));
    setQuery('');
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const removeRecentSearch = (index) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const handleSuggestionClick = (suggestion) => {
    const text = typeof suggestion === 'string' ? suggestion : suggestion.text;
    setQuery(text);
    handleSearch(text);
  };

  const filteredSuggestions = query ? [
    ...recentSearches.filter(s => 
      (typeof s === 'string' ? s : s.text).toLowerCase().includes(query.toLowerCase())
    ),
    ...popularSearches.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    )
  ] : [];

  const hasSuggestions = filteredSuggestions.length > 0;
  const showRecentSearches = recentSearches.length > 0 && !query;
  const showPopularSearches = popularSearches.length > 0 && !query;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-2xl px-4 sm:px-0"
    >
      <div 
        className="relative rounded-xl overflow-hidden glass"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Search Input Section */}
        <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <HiMagnifyingGlass className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          
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
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
            autoComplete="off"
          />
          
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <HiXMark className="h-4 w-4 text-gray-400" />
            </button>
          )}
          
          <div className="hidden sm:flex items-center ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <HiCommandLine className="h-3 w-3 text-gray-500 mr-1" />
            <kbd className="text-xs font-mono text-gray-600 dark:text-gray-300">Ctrl+K</kbd>
          </div>
          
          <button onClick={onClose} className="p-2 ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <HiXMark className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Suggestions Area */}
        <AnimatePresence>
          {(hasSuggestions || showRecentSearches || showPopularSearches) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-h-96 overflow-y-auto"
            >
              {/* Search Results */}
              {hasSuggestions && (
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Hasil</h3>
                  <ul className="space-y-1">
                    {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                            activeSuggestion === index ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center">
                            <HiMagnifyingGlass className="h-4 w-4 text-gray-400 mr-3" />
                            <span>{typeof suggestion === 'string' ? suggestion : suggestion.text}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Recent Searches */}
              {showRecentSearches && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                      <HiClock className="h-3 w-3 mr-2" /> Pencarian Terakhir
                    </h3>
                    <button onClick={clearRecentSearches} className="text-xs text-blue-500">Hapus</button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <HiClock className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="flex-1">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              {showPopularSearches && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center mb-3">
                    <HiFire className="h-3 w-3 mr-2" /> Populer
                  </h3>
                  {popularSearches.map((search, index) => (
                    <button
                      key={search.id}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <span className="text-xs font-mono text-gray-400 w-4 mr-3">{index + 1}</span>
                      <span>{search.text}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Navigation Tips */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center text-xs text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <HiArrowUp className="h-3 w-3 mr-1" /><HiArrowDown className="h-3 w-3 mr-1" /> Navigasi
                  </div>
                  <div><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> Pilih</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
              query.trim()
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <HiMagnifyingGlass className="h-5 w-5 mr-2" />
            Cari di LOGISTIK KITA
          </button>
        </div>
      </div>
      
      <div className="fixed inset-0 z-[-1]" onClick={onClose} />
    </motion.div>
  );
};

export default SearchBar;
