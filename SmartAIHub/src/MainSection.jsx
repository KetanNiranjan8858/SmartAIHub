// src/components/MainSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function MainSection() {
  return (
    <main className="main-section">
      
      {/* 🚀 Hero Section (unchanged) */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Your Unified Platform for Practical Machine Learning</h2>
          <p>
            **SmartAIHub** brings together essential AI tools for **security**, **insight**, 
            and **recommendations**, all in one intuitive interface.
          </p>
          <a href="#features" className="cta-button">Explore Features</a>
        </div>
      </section>

      {/* 🧩 Features Section: The Three Pillars */}
      <section id="features" className="features-section">
        <h3>Core AI Capabilities</h3>
        <div className="feature-cards">
          
          {/* Card 1: Spam Detection (unchanged) */}
          <Link to="/spam-detection" className="card-link">
            <div className="card feature-card-spam">
              <h4>🛡️ Email & Message Spam Detection</h4>
              <p>Leverage Natural Language Processing (NLP) to accurately identify and filter unwanted spam, enhancing your digital security and productivity.</p>
              <button className="card-button">Analyze Text</button>
            </div>
          </Link>

          {/* Card 2: WhatsApp Chat Analysis (unchanged) */}
          <Link to="/whatsapp-analysis" className="card-link">
            <div className="card feature-card-whatsapp">
              <h4>💬 WhatsApp Chat Analysis</h4>
              <p>Gain valuable insights into your communication patterns, message frequency, and top contacts with interactive data visualizations and metrics.</p>
              <button className="card-button">Analyze Chat</button>
            </div>
          </Link>
          
          {/* Card 3: MOVIE RECOMMENDATION SYSTEM (NEW FEATURE) */}
          <Link to="/movie-recommendation" className="card-link">
            <div className="card feature-card-movie">
              <h4>🎬 Movie Recommendation System</h4>
              <p>Receive personalized movie suggestions based on titles, genres, and ratings. Discover new films tailored to your preferences.</p>
              <button className="card-button">Get Recommendations</button>
            </div>
          </Link>

        </div>
      </section>
      
      {/* 💡 Info Section (unchanged) */}
      <section id="about" className="info-section">
        <h3>Why SmartAIHub?</h3>
        <p>We believe in making powerful machine learning accessible. Our platform simplifies complex algorithms into easy-to-use tools that deliver real-world value across various domains.</p>
      </section>
      
    </main>
  );
}

export default MainSection;