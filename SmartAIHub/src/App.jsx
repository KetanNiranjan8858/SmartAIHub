// src/App.jsx (Final Version Check)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import MainSection from './MainSection'; 
import SpamDetectionPage from './SpamDetectionPage'; 
import WhatsAppChatAnalysisPage from './WhatsAppChatAnalysisPage'; // NEW
import HousePricePredictionPage from './HousePricePredictionPage'; // NEW
import Footer from './Footer';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MainSection />} />
          <Route path="/spam-detection" element={<SpamDetectionPage />} />
          <Route path="/whatsapp-analysis" element={<WhatsAppChatAnalysisPage />} /> {/* NEW ROUTE */}
          <Route path="/house-price-prediction" element={<HousePricePredictionPage />} /> {/* NEW ROUTE */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;