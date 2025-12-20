/**
 * Custom hook untuk fetch site settings dari API
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const useSiteConfig = () => {
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        setLoading(true);
        
        // Cache key
        const cacheKey = 'site_settings';
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        // Gunakan cache jika masih valid (10 menit)
        if (cacheTime && Date.now() - parseInt(cacheTime) < 600000) {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            setSiteSettings(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }
        
        // Fetch dari API
        const response = await axios.get('/api/site-settings/');
        
        // Transform data untuk mudah digunakan
        const transformedData = {};
        Object.keys(response.data).forEach(key => {
          transformedData[key] = {
            value: response.data[key].value,
            type: response.data[key].type,
            category: response.data[key].category
          };
        });
        
        // Simpan ke cache
        localStorage.setItem(cacheKey, JSON.stringify(transformedData));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        
        setSiteSettings(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching site config:', err);
        setError(err.message);
        
        // Fallback settings
        setSiteSettings({
          site_name: { value: 'LOGISTIK KITA', type: 'string' },
          primary_color: { value: '#3B82F6', type: 'color' },
          secondary_color: { value: '#10B981', type: 'color' },
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSiteConfig();
  }, []);
  
  // Function untuk update CSS variables berdasarkan settings
  useEffect(() => {
    if (!loading && siteSettings) {
      const root = document.documentElement;
      
      // Set CSS variables
      if (siteSettings.primary_color) {
        root.style.setProperty('--color-primary', siteSettings.primary_color.value);
      }
      if (siteSettings.secondary_color) {
        root.style.setProperty('--color-secondary', siteSettings.secondary_color.value);
      }
      if (siteSettings.navbar_bg) {
        root.style.setProperty('--navbar-bg', siteSettings.navbar_bg.value);
      }
      
      // Set font family jika ada
      if (siteSettings.font_family) {
        document.body.style.fontFamily = siteSettings.font_family.value;
      }
    }
  }, [siteSettings, loading]);
  
  return { siteSettings, loading, error };
};

export { useSiteConfig };
