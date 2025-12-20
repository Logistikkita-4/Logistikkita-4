/**
 * Footer Component dengan glass effect
 * Features:
 * - Dynamic menu dari API
 * - Contact information
 * - Social media links
 * - Newsletter subscription
 * - Glass effect styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../hooks/useNavigation';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiClock,
  HiGlobe,
  HiShieldCheck,
  HiNewspaper
} from 'react-icons/hi';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';

const Footer = () => {
  const { navigationData } = useNavigation('footer');
  const { siteSettings } = useSiteConfig();
  
  const footerMenu = navigationData?.items || [
    {
      title: 'Layanan',
      children: [
        { title: 'Pengiriman Reguler', url: '/services/regular' },
        { title: 'Pengiriman Express', url: '/services/express' },
        { title: 'Pengiriman Same Day', url: '/services/same-day' },
        { title: 'Pengiriman Internasional', url: '/services/international' },
      ]
    },
    {
      title: 'Perusahaan',
      children: [
        { title: 'Tentang Kami', url: '/about' },
        { title: 'Karir', url: '/careers' },
        { title: 'Blog', url: '/blog' },
        { title: 'Hubungi Kami', url: '/contact' },
      ]
    },
    {
      title: 'Dukungan',
      children: [
        { title: 'Bantuan', url: '/help' },
        { title: 'FAQ', url: '/faq' },
        { title: 'Lacak Paket', url: '/track' },
        { title: 'Syarat & Ketentuan', url: '/terms' },
      ]
    }
  ];
  
  const contactInfo = {
    email: siteSettings?.contact_email?.value || 'info@logistikkita.com',
    phone: siteSettings?.contact_phone?.value || '+62 812-3456-7890',
    address: siteSettings?.contact_address?.value || 'Jakarta, Indonesia',
    hours: 'Senin - Minggu: 24 Jam'
  };
  
  const socialLinks = [
    { icon: FaFacebook, url: siteSettings?.facebook_url?.value || '#', label: 'Facebook' },
    { icon: FaInstagram, url: siteSettings?.instagram_url?.value || '#', label: 'Instagram' },
    { icon: FaTwitter, url: siteSettings?.twitter_url?.value || '#', label: 'Twitter' },
    { icon: FaLinkedin, url: '#', label: 'LinkedIn' },
    { icon: FaYoutube, url: '#', label: 'YouTube' },
    { icon: FaTiktok, url: '#', label: 'TikTok' },
  ];
  
  return (
    <footer 
      className="relative mt-auto"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
      }}
    >
      {/* Glass effect overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand Column */}
            <div className="xl:col-span-2">
              <div className="mb-6">
                <a href="/" className="inline-block">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <HiShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        LOGISTIK KITA
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expedition & Logistics Solutions
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Partner terpercaya untuk semua kebutuhan pengiriman Anda di seluruh Indonesia. 
                Layanan cepat, aman, dan terjangkau.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <HiPhone className="h-5 w-5 mr-3 text-blue-500" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-blue-600 transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <HiMail className="h-5 w-5 mr-3 text-blue-500" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-600 transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <HiLocationMarker className="h-5 w-5 mr-3 text-blue-500" />
                  <span>{contactInfo.address}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <HiClock className="h-5 w-5 mr-3 text-blue-500" />
                  <span>{contactInfo.hours}</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Ikuti Kami
                </h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer Menus */}
            {footerMenu.map((column, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.children.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href={item.url}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"
                      >
                        <span className="w-0 h-0.5 bg-blue-500 group-hover:w-3 mr-2 transition-all duration-300"></span>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Newsletter Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Dapatkan promo dan tips logistik langsung di email Anda.
              </p>
              
              <form className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Berlangganan
                </button>
              </form>
              
              {/* Trust Badges */}
              <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10">
                <div className="flex items-center space-x-3">
                  <HiShieldCheck className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      100% Aman & Terpercaya
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Data Anda terlindungi dengan enkripsi SSL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} LOGISTIK KITA. Hak Cipta Dilindungi.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="/privacy" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Kebijakan Privasi
                </a>
                <a 
                  href="/terms" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Syarat & Ketentuan
                </a>
                <a 
                  href="/sitemap" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Peta Situs
                </a>
                <a 
                  href="/cookies" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Kebijakan Cookies
                </a>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <HiGlobe className="h-4 w-4" />
                  <span>Bahasa Indonesia</span>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                  Metode Pembayaran yang Diterima:
                </p>
                <div className="flex space-x-4">
                  <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">BCA</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MDR</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">VISA</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MC</span>
                  </div>
                  <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <HiNewspaper className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
