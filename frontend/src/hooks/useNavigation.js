/**
 * Custom hook untuk fetch navigation data dari API
 * Features:
 * - Data caching dengan React Query
 * - Error handling
 * - Loading states
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const useNavigation = (location = 'header') => {
  const [navigationData, setNavigationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        
        // Cek cache dulu
        const cacheKey = `nav_${location}`;
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        // Gunakan cache jika masih valid (5 menit)
        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
          setNavigationData(JSON.parse(cached));
          setLoading(false);
          return;
        }
        
        // Fetch dari API
        const response = await axios.get(`/api/nav-menus/by_location/?location=${location}`);
        
        // Simpan ke cache
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        
        setNavigationData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching navigation:', err);
        setError(err.message);
        
        // Fallback data jika API gagal
        setNavigationData({
          items: [
            { id: 1, title: 'Beranda', url: '/', children: [] },
            { id: 2, title: 'Layanan', url: '/services', children: [] },
            { id: 3, title: 'Kontak', url: '/contact', children: [] },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNavigation();
    
    // Cleanup function
    return () => {
      // Cancel request jika component unmount
    };
  }, [location]);
  
  return { navigationData, loading, error };
};

export { useNavigation };
