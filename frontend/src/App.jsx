import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MaintenancePage from './pages/MaintenancePage';

// PERBAIKAN DI SINI:
// Di struktur direktori nama filenya 'global.css' (tanpa s), bukan 'globals.css'
import './styles/global.css'; 
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
