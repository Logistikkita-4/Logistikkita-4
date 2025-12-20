// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MaintenancePage from './pages/MaintenancePage';

// Import styles
import './styles/globals.css';
import './styles/glass.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/simulasi-harga" element={<MaintenancePage />} />
          {/* Tambahkan routes lainnya sesuai kebutuhan */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
