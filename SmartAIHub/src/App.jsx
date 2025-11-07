// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import MainSection from './MainSection'; 
import Footer from './Footer';
import SpamDetectionPage from './SpamDetectionPage'; 
import WhatsAppChatAnalysisPage from './WhatsAppChatAnalysisPage'; 
import MovieRecommendationPage from './MovieRecommendationPage';
import HousePricePredictionPage from './HousePricePredictionPage'; // <--- NEW IMPORT
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<MainSection />} />
          
          {/* Feature 1: Spam Detection */}
          <Route path="/spam-detection" element={<SpamDetectionPage />} />
          
          {/* Feature 2: WhatsApp Chat Analysis */}
          <Route path="/whatsapp-analysis" element={<WhatsAppChatAnalysisPage />} /> 
          
          {/* Feature 3: Movie Recommendation System */}
          <Route path="/movie-recommendation" element={<MovieRecommendationPage />} /> 

          {/* Feature 4: House Price Prediction */}
          <Route path="/house-price-prediction" element={<HousePricePredictionPage />} /> {/* <--- NEW ROUTE */}
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;