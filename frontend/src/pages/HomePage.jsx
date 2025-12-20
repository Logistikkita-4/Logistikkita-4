// frontend/src/pages/HomePage.jsx
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Selamat Datang di <span className="text-blue-600">LOGISTIK KITA</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Solusi pengiriman terpercaya untuk semua kebutuhan bisnis dan pribadi Anda.
        </p>
      </section>
      
      {/* Content akan ditambahkan nanti */}
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Website dalam Pengembangan</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fitur-fitur menarik akan segera hadir. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
