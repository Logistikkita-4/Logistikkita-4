// frontend/src/pages/MaintenancePage.jsx
import React from 'react';
import { HiWrenchScrewdriver } from 'react-icons/hi2';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <HiWrenchScrewdriver className="h-24 w-24 text-blue-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Halaman dalam Pengembangan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Fitur ini sedang kami persiapkan untuk pengalaman terbaik Anda. 
            Akan segera hadir!
          </p>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default MaintenancePage;
