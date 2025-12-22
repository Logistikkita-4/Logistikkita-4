import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMagnifyingGlass as HiSearch, 
  HiXMark as HiX, 
  HiClock as HiOutlineClock, 
  HiFire as HiOutlineFire,
  HiChevronUp as HiOutlineArrowUp,
  HiChevronDown as HiOutlineArrowDown,
  HiCommandLine as HiOutlineCommandLine
} from 'react-icons/hi2';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // KODE ASLI 100%
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }

    setPopularSearches([
      { id: 1, text: 'Tarif pengiriman Jakarta - Surabaya', count: 245 },
      { id: 2, text: 'Lacak resi pengiriman', count: 189 },
      { id: 3, text: 'Cara kirim barang besar', count: 156 },
      { id: 4, text: 'Biaya kirim motor', count: 132 },
      { id: 5, text: 'Pengiriman same day', count: 98 },
    ]);
  }, []);

  // KODE ASLI 100%
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
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
        
        if (suggestionsRef.current && suggestionsRef.current.children[newIndex]) {
          suggestionsRef.current.children[newIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
          });
        }
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

  // KODE ASLI 100%
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
      s.toLowerCase().includes(query.toLowerCase()) || 
      (s.text && s.text.toLowerCase().includes(query.toLowerCase()))
    ),
    ...popularSearches.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    )
  ] : [];

  const hasSuggestions = filteredSuggestions.length > 0;
  const showRecentSearches = recentSearches.length > 0 && !query;
  const showPopularSearches = popularSearches.length > 0 && !query;

  return (
    /* TAMBAHAN PEMBUNGKUS UNTUK FIX LAYOUT BERANTAKAN */
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-20 px-4">
      {/* Overlay hitam transparan */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl"
      >
        <div 
          className="relative rounded-xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Search Input - KODE ASLI 100% */}
          <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
            <HiSearch className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            
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
              spellCheck="false"
            />
            
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
              >
                <HiX className="h-4 w-4 text-gray-400" />
              </button>
            )}
            
            <div className="hidden sm:flex items-center ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <HiOutlineCommandLine className="h-3 w-3 text-gray-500 mr-1" />
              <kbd className="text-xs font-mono text-gray-600 dark:text-gray-300">Ctrl</kbd>
              <span className="mx-1 text-gray-400">+</span>
              <kbd className="text-xs font-mono text-gray-600 dark:text-gray-300">K</kbd>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
            >
              <HiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Suggestions Panel - KODE ASLI 100% */}
          <AnimatePresence>
            {(hasSuggestions || showRecentSearches || showPopularSearches) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div ref={suggestionsRef} className="max-h-96 overflow-y-auto">
                  {hasSuggestions && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Hasil Pencarian
                      </h3>
                      <ul className="space-y-1">
                        {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                          <li key={index}>
                            <button
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                                activeSuggestion === index
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                              }`}
                              onMouseEnter={() => setActiveSuggestion(index)}
                            >
                              <div className="flex items-center">
                                <HiSearch className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="truncate">
                                  {typeof suggestion === 'string' ? suggestion : suggestion.text}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {showRecentSearches && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                          <HiOutlineClock className="h-3 w-3 mr-2" />
                          Pencarian Terakhir
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          Hapus semua
                        </button>
                      </div>
                      <ul className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <li key={index}>
                            <button
                              onClick={() => handleSuggestionClick(search)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                                activeSuggestion === index
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                              }`}
                              onMouseEnter={() => setActiveSuggestion(index)}
                            >
                              <div className="flex items-center">
                                <HiOutlineClock className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="truncate">{search}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRecentSearch(index);
                                }}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <HiX className="h-3 w-3 text-gray-400" />
                              </button>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {showPopularSearches && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-3">
                        <HiOutlineFire className="h-3 w-3 mr-2" />
                        Populer Saat Ini
                      </h3>
                      <ul className="space-y-1">
                        {popularSearches.map((search, index) => (
                          <li key={search.id}>
                            <button
                              onClick={() => handleSuggestionClick(search)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                                activeSuggestion === recentSearches.length + index
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                              }`}
                              onMouseEnter={() => setActiveSuggestion(recentSearches.length + index)}
                            >
                              <div className="flex items-center">
                                <span className="text-xs font-mono text-gray-400 w-4 mr-3">
                                  {index + 1}
                                </span>
                                <span className="truncate">{search.text}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {search.count}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <HiOutlineArrowUp className="h-3 w-3 mr-1" />
                        <HiOutlineArrowDown className="h-3 w-3 mr-1" />
                        <span className="ml-1">Navigasi</span>
                      </div>
                      <div className="flex items-center">
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd>
                        <span className="ml-1">Pilih</span>
                      </div>
                      <div className="flex items-center">
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd>
                        <span className="ml-1">Tutup</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* KODE ASLI 100% */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => handleSearch()}
              disabled={!query.trim()}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                query.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <HiSearch className="h-5 w-5 mr-2" />
              Cari di LOGISTIK KITA
              {query.trim() && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                  "{query}"
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;
